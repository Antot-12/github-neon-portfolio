import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Box,
    Typography,
    Chip,
    Stack,
    Link,
    Grid,
    IconButton,
    Paper,
    Divider,
    Button
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CommitIcon from '@mui/icons-material/Commit'
import StarIcon from '@mui/icons-material/Star'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import CodeIcon from '@mui/icons-material/Code'
import VisibilityIcon from '@mui/icons-material/Visibility'
import BugReportIcon from '@mui/icons-material/BugReport'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { motion } from 'framer-motion'
import { useGithub } from '../GithubContext'
import LoadingOverlay from '../components/LoadingOverlay'
import ErrorOverlay from '../components/ErrorOverlay'
import CodeBlock from '../components/CodeBlock'
import MermaidDiagram from '../components/MermaidDiagram'
import SimilarProjects from '../components/SimilarProjects'
import CodeStatistics from '../components/CodeStatistics'

function decodeBase64Utf8(base64) {
    try {
        const binary = typeof atob === 'function' ? atob(base64) : ''
        const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
        if (typeof TextDecoder !== 'undefined') {
            const decoder = new TextDecoder('utf-8')
            return decoder.decode(bytes)
        }
        return decodeURIComponent(escape(binary))
    } catch {
        return ''
    }
}

function slugifyHeading(text) {
    if (!text) return ''
    return text
        .toString()
        .toLowerCase()
        .replace(/[`~!@#$%^&*()+=<>?,./:;"'|[\]\\{}]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}

const headingRenderer = level => ({ children, ...props }) => {
    const childArray = React.Children.toArray(children)
    const text = childArray
        .map(child => {
            if (typeof child === 'string' || typeof child === 'number') {
                return child.toString()
            }
            if (child && typeof child === 'object' && 'props' in child) {
                const inner = child.props?.children
                if (typeof inner === 'string' || typeof inner === 'number') {
                    return inner.toString()
                }
                return ''
            }
            return ''
        })
        .join(' ')
    const id = slugifyHeading(text || `heading-${level}`)
    return React.createElement(`h${level}`, { id, ...props }, children)
}

function RepoDetailPage() {
    const { name } = useParams()
    const navigate = useNavigate()
    const { username, token, repos } = useGithub()

    const [repo, setRepo] = useState(() => {
        return repos.find(r => r.name === name) || null
    })
    const [readme, setReadme] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [readProgress, setReadProgress] = useState(0)
    const [copiedClone, setCopiedClone] = useState(false)
    const [toc, setToc] = useState([])
    const [readStats, setReadStats] = useState({ words: 0, minutes: 0 })
    const readmeRef = useRef(null)
    const scrollTickingRef = useRef(false)

    useEffect(() => {
        async function load() {
            if (!name) {
                setError('Repository name is missing in URL.')
                setLoading(false)
                return
            }

            setLoading(true)
            setError('')

            const headers = {
                Accept: 'application/vnd.github+json'
            }

            if (token) {
                headers.Authorization = `Bearer ${token}`
            }

            try {
                let currentRepo = repos.find(r => r.name === name) || repo

                if (!currentRepo) {
                    if (!username) {
                        throw new Error('GitHub username is not configured. Check VITE_GITHUB_USERNAME in .env.')
                    }

                    const repoResponse = await fetch(`https://api.github.com/repos/${username}/${name}`, {
                        headers
                    })

                    if (repoResponse.status === 404) {
                        throw new Error('Repository not found on GitHub (404).')
                    }

                    if (!repoResponse.ok) {
                        let message = `Failed to load repository from GitHub (status ${repoResponse.status}).`
                        try {
                            const data = await repoResponse.json()
                            if (data && data.message) {
                                message = `GitHub error ${repoResponse.status}: ${data.message}`
                            }
                        } catch {}
                        throw new Error(message)
                    }

                    const data = await repoResponse.json()
                    currentRepo = {
                        id: data.id,
                        name: data.name,
                        full_name: data.full_name,
                        description: data.description,
                        html_url: data.html_url,
                        language: data.language,
                        topics: data.topics || [],
                        stargazers_count: data.stargazers_count,
                        forks_count: data.forks_count,
                        open_issues_count: data.open_issues_count,
                        created_at: data.created_at,
                        updated_at: data.updated_at,
                        pushed_at: data.pushed_at,
                        watchers_count: data.watchers_count,
                        homepage: data.homepage || '',
                        commitsCount: 0,
                        ownerLogin: data.owner?.login || username,
                        size: data.size
                    }
                }

                const owner =
                    currentRepo.ownerLogin ||
                    (currentRepo.full_name ? currentRepo.full_name.split('/')[0] : '') ||
                    username

                if (!owner) {
                    throw new Error('Repository owner is not defined.')
                }

                const readmeResponse = await fetch(
                    `https://api.github.com/repos/${owner}/${name}/readme`,
                    { headers }
                )

                if (readmeResponse.status === 404) {
                    setReadme('# README not found\nThis repository does not have a README yet.')
                } else if (readmeResponse.ok) {
                    const readmeJson = await readmeResponse.json()
                    const content = readmeJson.content || ''
                    const decoded = decodeBase64Utf8(content)
                    setReadme(decoded || '# README could not be decoded.')
                } else {
                    let message = `Failed to load README (status ${readmeResponse.status}).`
                    try {
                        const data = await readmeResponse.json()
                        if (data && data.message) {
                            message = `Failed to load README: ${data.message}`
                        }
                    } catch {}
                    throw new Error(message)
                }

                setRepo({
                    ...currentRepo,
                    ownerLogin: owner
                })
            } catch (e) {
                setError(e.message || 'Failed to load repository details.')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [name, username, token, repos])

    useEffect(() => {
        if (!readme) {
            setToc([])
            setReadStats({ words: 0, minutes: 0 })
            return
        }

        const lines = readme.split('\n')
        const items = []

        lines.forEach(line => {
            const match = line.match(/^(#{1,3})\s+(.+)/)
            if (match) {
                const level = match[1].length
                const text = match[2].trim()
                const id = slugifyHeading(text)
                items.push({ level, text, id })
            }
        })

        setToc(items)

        const withoutCodeBlocks = readme.replace(/```[\s\S]*?```/g, ' ')
        const words = withoutCodeBlocks.split(/\s+/).filter(Boolean).length
        const minutes = words ? Math.max(1, Math.round(words / 200)) : 0
        setReadStats({ words, minutes })
    }, [readme])

    useEffect(() => {
        const updateProgress = () => {
            const el = readmeRef.current
            if (!el) {
                setReadProgress(0)
                return
            }
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight
            const rect = el.getBoundingClientRect()
            const elTop = rect.top + window.scrollY
            const elHeight = el.offsetHeight || rect.height
            const scrollY = window.scrollY || window.pageYOffset
            const start = elTop - 80
            const end = elTop + elHeight - viewportHeight
            if (end <= start) {
                setReadProgress(0)
                return
            }
            const progress = ((scrollY - start) / (end - start)) * 100
            const clamped = Math.max(0, Math.min(100, progress))
            setReadProgress(clamped)
        }

        const handleScroll = () => {
            if (scrollTickingRef.current) return
            scrollTickingRef.current = true
            window.requestAnimationFrame(() => {
                updateProgress()
                scrollTickingRef.current = false
            })
        }

        updateProgress()
        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('resize', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleScroll)
        }
    }, [readme])

    if (loading) {
        return <LoadingOverlay text="Opening project..." />
    }

    if (error) {
        return <ErrorOverlay text={error} />
    }

    if (!repo) {
        return <ErrorOverlay text="Repository not found." />
    }

    const updatedDate = repo.pushed_at || repo.updated_at
    const updated = updatedDate ? new Date(updatedDate).toLocaleString() : 'Unknown'
    const created = repo.created_at ? new Date(repo.created_at).toLocaleDateString() : 'Unknown'
    const owner = repo.ownerLogin || (repo.full_name ? repo.full_name.split('/')[0] : '') || username
    const watchers = typeof repo.watchers_count === 'number' ? repo.watchers_count : 0
    const issues = typeof repo.open_issues_count === 'number' ? repo.open_issues_count : 0
    const cloneUrl = `https://github.com/${owner}/${repo.name}.git`
    const sizeKb = typeof repo.size === 'number' ? repo.size : null
    const approxLoc = sizeKb != null ? Math.max(50, Math.round(sizeKb * 20)) : null

    const handleCopyClone = () => {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
                .writeText(cloneUrl)
                .then(() => {
                    setCopiedClone(true)
                    setTimeout(() => setCopiedClone(false), 1500)
                })
                .catch(() => {})
        }
    }

    const handleBack = () => {
        navigate('/', { replace: false })
    }

    const urlTransform = (url, key) => {
        if (!url) return url
        if (key !== 'src') return url
        if (/^https?:\/\//i.test(url) || url.startsWith('data:')) {
            return url
        }
        const base = `https://raw.githubusercontent.com/${owner}/${name}/HEAD/`
        return base + url.replace(/^\.?\//, '')
    }

    const scrollToSection = id => {
        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const formatNumber = value => {
        const n = Number(value) || 0
        if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}m`
        if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
        return String(n)
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    zIndex: 1300,
                    bgcolor: 'transparent'
                }}
                role="progressbar"
                aria-valuenow={Math.round(readProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <Box
                    sx={{
                        width: `${readProgress}%`,
                        height: '100%',
                        bgcolor: 'primary.main',
                        transition: 'width 120ms linear'
                    }}
                />
            </Box>

            <Box
                sx={{
                    mb: 3.8,
                    mt: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2
                }}
            >
                <Stack direction="row" spacing={1.8} alignItems="center">
                    <IconButton
                        onClick={handleBack}
                        sx={{
                            borderRadius: 999,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: '#111827'
                        }}
                    >
                        <ArrowBackIcon sx={{ color: '#e5e7eb' }} />
                    </IconButton>
                    <Box>
                        <Typography variant="h4" className="neon-text" sx={{ mb: 0.5 }}>
                            {repo.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.2 }}>
                            Owner {owner}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Created on {created} • Last updated {updated}
                        </Typography>
                    </Box>
                </Stack>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                    <Link
                        component="button"
                        onClick={() => scrollToSection('readme')}
                        underline="none"
                        sx={{
                            fontSize: 13,
                            px: 1.6,
                            py: 0.6,
                            borderRadius: 999,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: '#111827',
                            color: 'text.secondary',
                            cursor: 'pointer',
                            '&:hover': {
                                borderColor: 'primary.main',
                                color: 'primary.main'
                            }
                        }}
                    >
                        README
                    </Link>
                    <Link
                        component="button"
                        onClick={() => scrollToSection('overview')}
                        underline="none"
                        sx={{
                            fontSize: 13,
                            px: 1.6,
                            py: 0.6,
                            borderRadius: 999,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: '#111827',
                            color: 'text.secondary',
                            cursor: 'pointer',
                            '&:hover': {
                                borderColor: 'primary.main',
                                color: 'primary.main'
                            }
                        }}
                    >
                        Overview
                    </Link>
                    {repo.homepage && (
                        <Link
                            href={repo.homepage}
                            target="_blank"
                            rel="noreferrer"
                            underline="none"
                            sx={{
                                fontSize: 13,
                                px: 1.8,
                                py: 0.7,
                                borderRadius: 999,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: '#111827',
                                color: 'primary.main',
                                '&:hover': {
                                    borderColor: 'primary.main'
                                }
                            }}
                        >
                            Live site
                        </Link>
                    )}
                    <Link
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        underline="none"
                        sx={{
                            fontSize: 14,
                            px: 2.2,
                            py: 0.8,
                            borderRadius: 999,
                            border: '1px solid',
                            borderColor: 'divider',
                            alignItems: 'center',
                            display: 'inline-flex',
                            gap: 1,
                            bgcolor: '#111827',
                            '&:hover': {
                                borderColor: 'primary.main'
                            }
                        }}
                    >
                        View on GitHub
                    </Link>
                </Stack>
            </Box>

            <Grid container spacing={3.4}>
                <Grid item xs={12} md={8}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <Paper elevation={0} sx={{ p: { xs: 2.4, md: 3 } }} id="readme">
                            <Box
                                sx={{
                                    mb: 1.4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    flexWrap: 'wrap'
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                    README
                                </Typography>
                                {readStats.minutes > 0 && (
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        ~{readStats.minutes} min read • {readStats.words} words
                                    </Typography>
                                )}
                            </Box>

                            <Divider sx={{ mb: 2 }} />
                            <Box className="markdown-body" ref={readmeRef}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    urlTransform={urlTransform}
                                    components={{
                                        h1: headingRenderer(1),
                                        h2: headingRenderer(2),
                                        h3: headingRenderer(3),
                                        code: CodeBlock,
                                        pre: ({ children }) => <>{children}</>,
                                        div: ({ node, className, children, ...props }) => {
                                            if (className === 'mermaid') {
                                                return <MermaidDiagram chart={String(children)} />
                                            }
                                            return <div className={className} {...props}>{children}</div>
                                        }
                                    }}
                                >
                                    {readme}
                                </ReactMarkdown>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={4}>
                    <motion.div
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <Stack spacing={3}>
                            <Paper
                                elevation={0}
                                sx={{ p: 2.4, position: { md: 'sticky' }, top: { md: 96 } }}
                                id="overview"
                            >
                            <Stack spacing={2.2}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 0.6, color: 'text.secondary' }}>
                                        Project overview
                                    </Typography>
                                    {repo.description && (
                                        <Typography variant="body2" sx={{ mb: 0.8 }}>
                                            {repo.description}
                                        </Typography>
                                    )}
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Language, metrics, repository details and quick links in one place.
                                    </Typography>
                                    {approxLoc && (
                                        <Typography
                                            variant="caption"
                                            sx={{ color: 'text.secondary', mt: 0.6, display: 'block' }}
                                        >
                                            ~{formatNumber(approxLoc)} lines of code
                                        </Typography>
                                    )}
                                    {repo.homepage && (
                                        <Box sx={{ mt: 1.6 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                component="a"
                                                href={repo.homepage}
                                                target="_blank"
                                                rel="noreferrer"
                                                sx={{
                                                    textTransform: 'none',
                                                    borderRadius: 999,
                                                    px: 2.4,
                                                    py: 0.5,
                                                    fontSize: 13
                                                }}
                                            >
                                                Open live site
                                            </Button>
                                        </Box>
                                    )}
                                </Box>

                                {toc.length > 0 && (
                                    <>
                                        <Divider />
                                        <Box
                                            sx={{
                                                borderRadius: 2,
                                                border: '1px solid rgba(31,41,55,0.95)',
                                                bgcolor: '#020617',
                                                p: 1.4
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{ textTransform: 'uppercase', color: 'text.secondary' }}
                                            >
                                                Table of contents
                                            </Typography>
                                            <Stack spacing={0.3} sx={{ mt: 0.8 }}>
                                                {toc.map(item => (
                                                    <Button
                                                        key={`${item.id}-${item.text}-${item.level}`}
                                                        onClick={() => scrollToSection(item.id)}
                                                        size="small"
                                                        sx={{
                                                            justifyContent: 'flex-start',
                                                            textTransform: 'none',
                                                            fontSize: 12,
                                                            px: 0,
                                                            minWidth: 0,
                                                            color: 'text.secondary',
                                                            pl: item.level === 1 ? 0 : item.level === 2 ? 2 : 3.5,
                                                            '&:hover': {
                                                                color: 'primary.main',
                                                                backgroundColor: 'transparent'
                                                            }
                                                        }}
                                                    >
                                                        {item.text}
                                                    </Button>
                                                ))}
                                            </Stack>
                                        </Box>
                                    </>
                                )}

                                <Divider />

                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{ textTransform: 'uppercase', color: 'text.secondary' }}
                                    >
                                        Key stats
                                    </Typography>

                                    <Stack spacing={1.4} sx={{ mt: 1.3 }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 80 }}>
                                                Language
                                            </Typography>
                                            {repo.language ? (
                                                <Chip
                                                    icon={<CodeIcon sx={{ fontSize: 18 }} />}
                                                    label={repo.language}
                                                    size="small"
                                                    sx={{
                                                        borderRadius: 999,
                                                        borderColor: 'primary.main',
                                                        bgcolor: 'rgba(34,211,238,0.12)',
                                                        color: 'primary.main'
                                                    }}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            ) : (
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Not specified
                                                </Typography>
                                            )}
                                        </Stack>

                                        <Divider sx={{ my: 0.6 }} />

                                        <Stack spacing={0.8}>
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <Stack direction="row" spacing={0.8} alignItems="center">
                                                    <CommitIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                    <Typography variant="body2">Commits</Typography>
                                                </Stack>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {repo.commitsCount || 0}
                                                </Typography>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <Stack direction="row" spacing={0.8} alignItems="center">
                                                    <StarIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                    <Typography variant="body2">Stars</Typography>
                                                </Stack>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {repo.stargazers_count || 0}
                                                </Typography>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <Stack direction="row" spacing={0.8} alignItems="center">
                                                    <CallSplitIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                    <Typography variant="body2">Forks</Typography>
                                                </Stack>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {repo.forks_count || 0}
                                                </Typography>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <Stack direction="row" spacing={0.8} alignItems="center">
                                                    <VisibilityIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                    <Typography variant="body2">Watchers</Typography>
                                                </Stack>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {watchers}
                                                </Typography>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <Stack direction="row" spacing={0.8} alignItems="center">
                                                    <BugReportIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                    <Typography variant="body2">Open issues</Typography>
                                                </Stack>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {issues}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{ textTransform: 'uppercase', color: 'text.secondary' }}
                                    >
                                        Repository info
                                    </Typography>
                                    <Box sx={{ mt: 1.2 }}>
                                        <Stack spacing={0.7}>
                                            <Typography variant="body2">
                                                Owner{' '}
                                                <Box component="span" sx={{ color: 'primary.main' }}>
                                                    {owner}
                                                </Box>
                                            </Typography>
                                            <Typography variant="body2">
                                                Created{' '}
                                                <Box component="span" sx={{ color: 'text.secondary' }}>
                                                    {created}
                                                </Box>
                                            </Typography>
                                            <Typography variant="body2">
                                                Last updated{' '}
                                                <Box component="span" sx={{ color: 'text.secondary' }}>
                                                    {updated}
                                                </Box>
                                            </Typography>
                                            {repo.homepage && (
                                                <Typography variant="body2">
                                                    Live link{' '}
                                                    <Link
                                                        href={repo.homepage}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        underline="hover"
                                                        sx={{ color: 'primary.main' }}
                                                    >
                                                        {repo.homepage.replace(/^https?:\/\//, '')}
                                                    </Link>
                                                </Typography>
                                            )}
                                            <Typography variant="body2">
                                                Clone{' '}
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        ml: 0.5,
                                                        fontFamily:
                                                            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                                                        fontSize: 12,
                                                        color: 'text.secondary'
                                                    }}
                                                >
                                                    {cloneUrl}
                                                </Box>
                                            </Typography>
                                            <Box sx={{ mt: 0.8 }}>
                                                <Chip
                                                    label={copiedClone ? 'Copied' : 'Copy clone URL'}
                                                    size="small"
                                                    onClick={handleCopyClone}
                                                    sx={{
                                                        borderRadius: 999,
                                                        cursor: 'pointer'
                                                    }}
                                                    color={copiedClone ? 'primary' : 'default'}
                                                    variant={copiedClone ? 'outlined' : 'filled'}
                                                />
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{ textTransform: 'uppercase', color: 'text.secondary' }}
                                    >
                                        Quick links
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={0.8}
                                        flexWrap="wrap"
                                        sx={{ mt: 1.2 }}
                                    >
                                        <Chip
                                            component="a"
                                            href={`${repo.html_url}/issues`}
                                            target="_blank"
                                            rel="noreferrer"
                                            clickable
                                            label="Issues"
                                            size="small"
                                            sx={{
                                                borderRadius: 999,
                                                fontSize: 11,
                                                borderColor: 'primary.main',
                                                bgcolor: 'rgba(34,211,238,0.1)',
                                                color: 'primary.main'
                                            }}
                                            variant="outlined"
                                        />
                                        <Chip
                                            component="a"
                                            href={`${repo.html_url}/pulls`}
                                            target="_blank"
                                            rel="noreferrer"
                                            clickable
                                            label="Pull requests"
                                            size="small"
                                            sx={{
                                                borderRadius: 999,
                                                fontSize: 11,
                                                borderColor: 'primary.main',
                                                bgcolor: 'rgba(34,211,238,0.1)',
                                                color: 'primary.main'
                                            }}
                                            variant="outlined"
                                        />
                                        <Chip
                                            component="a"
                                            href={`${repo.html_url}/actions`}
                                            target="_blank"
                                            rel="noreferrer"
                                            clickable
                                            label="Actions"
                                            size="small"
                                            sx={{
                                                borderRadius: 999,
                                                fontSize: 11,
                                                borderColor: 'primary.main',
                                                bgcolor: 'rgba(34,211,238,0.1)',
                                                color: 'primary.main'
                                            }}
                                            variant="outlined"
                                        />
                                        <Chip
                                            component="a"
                                            href={`${repo.html_url}/projects`}
                                            target="_blank"
                                            rel="noreferrer"
                                            clickable
                                            label="Projects"
                                            size="small"
                                            sx={{
                                                borderRadius: 999,
                                                fontSize: 11,
                                                borderColor: 'primary.main',
                                                bgcolor: 'rgba(34,211,238,0.1)',
                                                color: 'primary.main'
                                            }}
                                            variant="outlined"
                                        />
                                    </Stack>
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Code Statistics */}
                        <CodeStatistics repo={repo} />
                    </Stack>
                </motion.div>
            </Grid>
        </Grid>

        {/* Similar Projects Section */}
        <SimilarProjects currentRepo={repo} allRepos={repos} />
    </Box>
    )
}

export default RepoDetailPage
