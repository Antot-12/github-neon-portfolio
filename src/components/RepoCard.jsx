import React from 'react'
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Stack,
    Chip,
    Box,
    Divider,
    Link,
    IconButton,
    Tooltip
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import CommitIcon from '@mui/icons-material/Commit'
import CodeIcon from '@mui/icons-material/Code'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import StarIcon from '@mui/icons-material/Star'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import BugReportIcon from '@mui/icons-material/BugReport'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useGithub } from '../GithubContext'

function RepoCard({ repo, isActive = false }) {
    const { username } = useGithub()
    const navigate = useNavigate()

    const updatedDateRaw = repo.pushed_at || repo.updated_at
    const updated = updatedDateRaw ? new Date(updatedDateRaw).toLocaleDateString() : 'Unknown'
    const created = repo.created_at ? new Date(repo.created_at).toLocaleDateString() : 'Unknown'
    const tags = Array.isArray(repo.topics) ? repo.topics.slice(0, 3) : []
    const watchers = typeof repo.watchers_count === 'number' ? repo.watchers_count : 0
    const issues = typeof repo.open_issues_count === 'number' ? repo.open_issues_count : 0
    const owner = repo.full_name ? repo.full_name.split('/')[0] : username
    const fullName = repo.full_name || `${owner}/${repo.name}`
    const previewImage = `https://opengraph.githubassets.com/1/${fullName}`

    const handleImageError = event => {
        event.currentTarget.onerror = null
        event.currentTarget.src = 'public/no_image.jpg'
    }

    const formatNumber = value => {
        const n = Number(value) || 0
        if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}m`
        if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
        return String(n)
    }

    const activityChip = () => {
        if (!updatedDateRaw) return null
        const diffDays = Math.floor(
            (Date.now() - new Date(updatedDateRaw).getTime()) / (1000 * 60 * 60 * 24)
        )

        if (diffDays <= 3) {
            return {
                label: 'New',
                sx: {
                    bgcolor: 'rgba(8,47,73,0.95)',
                    borderColor: 'primary.main',
                    color: 'primary.main'
                }
            }
        }
        if (diffDays <= 14) {
            return {
                label: 'Active',
                sx: {
                    bgcolor: 'rgba(15,23,42,0.95)',
                    borderColor: 'primary.main',
                    color: 'primary.main'
                }
            }
        }
        if (diffDays <= 60) {
            return {
                label: 'Recently updated',
                sx: {
                    bgcolor: 'rgba(15,23,42,0.9)',
                    borderColor: 'rgba(148,163,184,0.9)',
                    color: '#e5e7eb'
                }
            }
        }
        return {
            label: 'Legacy',
            sx: {
                bgcolor: 'rgba(15,23,42,0.9)',
                borderColor: 'rgba(55,65,81,1)',
                color: '#9ca3af'
            }
        }
    }

    const activity = activityChip()

    let projectType = ''
    if (Array.isArray(repo.topics)) {
        if (repo.topics.includes('production')) projectType = 'Production'
        else if (repo.topics.includes('experiment')) projectType = 'Experiment'
        else if (repo.topics.includes('learning')) projectType = 'Learning'
    }

    const sizeKb = typeof repo.size === 'number' ? repo.size : null
    const approxLoc = sizeKb != null ? Math.max(50, Math.round(sizeKb * 20)) : null

    const handleTagClick = (event, tag) => {
        event.preventDefault()
        event.stopPropagation()
        navigate(`/?tag=${encodeURIComponent(tag)}`)
        window.scrollTo({ top: 0 })
    }

    const handleCardClick = () => {
        navigate(`/repo/${repo.name}`)
    }

    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition:
                    'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease, border-color 160ms ease',
                ...(isActive && {
                    boxShadow: '0 14px 32px rgba(0,0,0,0.95)',
                    border: '1px solid rgba(34,211,238,0.9)'
                }),
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 26px rgba(0,0,0,0.9)',
                    bgcolor: '#0f172a'
                }
            }}
        >
            <CardActionArea
                component="div"
                onClick={handleCardClick}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    height: '100%'
                }}
            >
                <Box sx={{ position: 'relative', width: '100%' }}>
                    <CardMedia
                        component="img"
                        src={previewImage}
                        alt={repo.name}
                        loading="lazy"
                        onError={handleImageError}
                        sx={{
                            height: 140,
                            objectFit: 'cover',
                            borderBottom: '1px solid rgba(31,41,55,1)'
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}
                    >
                        {activity && (
                            <Chip
                                label={activity.label}
                                size="small"
                                variant="outlined"
                                sx={{
                                    borderRadius: 999,
                                    fontSize: 10,
                                    py: 0,
                                    px: 0.8,
                                    ...activity.sx
                                }}
                            />
                        )}
                        {projectType && (
                            <Chip
                                label={projectType}
                                size="small"
                                variant="outlined"
                                sx={{
                                    borderRadius: 999,
                                    fontSize: 10,
                                    py: 0,
                                    px: 0.8,
                                    bgcolor: 'rgba(15,23,42,0.95)',
                                    borderColor: 'rgba(148,163,184,0.9)',
                                    color: '#e5e7eb'
                                }}
                            />
                        )}
                        <Tooltip title="Open on GitHub">
                            <IconButton
                                size="small"
                                component="a"
                                href={repo.html_url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={e => e.stopPropagation()}
                                sx={{
                                    bgcolor: 'rgba(15,23,42,0.9)',
                                    borderRadius: '50%',
                                    '&:hover': {
                                        bgcolor: 'rgba(15,23,42,1)'
                                    }
                                }}
                            >
                                <GitHubIcon sx={{ fontSize: 16, color: '#e5e7eb' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <CardContent
                    sx={{
                        flexGrow: 1,
                        p: 2.2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 500,
                            fontSize: '1rem',
                            mb: 0.4,
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {repo.name}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            mb: 0.8,
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {fullName}
                    </Typography>

                    {repo.description && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                mb: 1,
                                minHeight: '3em',
                                maxWidth: '100%',
                                overflow: 'hidden'
                            }}
                        >
                            {repo.description}
                        </Typography>
                    )}

                    {approxLoc && (
                        <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', mb: 1.1 }}
                        >
                            ~{formatNumber(approxLoc)} lines of code
                        </Typography>
                    )}

                    {repo.homepage && (
                        <Stack
                            direction="row"
                            spacing={0.7}
                            alignItems="center"
                            justifyContent="center"
                            sx={{ mb: 1.2 }}
                        >
                            <OpenInNewIcon sx={{ fontSize: 15, color: 'primary.main' }} />
                            <Link
                                href={repo.homepage}
                                target="_blank"
                                rel="noreferrer"
                                underline="hover"
                                sx={{
                                    fontSize: 12,
                                    color: 'primary.main'
                                }}
                                onClick={e => e.stopPropagation()}
                            >
                                Live preview
                            </Link>
                        </Stack>
                    )}

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mb: 1.1, flexWrap: 'wrap' }}
                    >
                        {repo.language && (
                            <Chip
                                icon={<CodeIcon sx={{ fontSize: 15 }} />}
                                label={repo.language}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{
                                    borderRadius: 999,
                                    borderColor: 'primary.main',
                                    bgcolor: 'rgba(34,211,238,0.08)'
                                }}
                            />
                        )}
                        <Chip
                            icon={<CommitIcon sx={{ fontSize: 15 }} />}
                            label={`${formatNumber(repo.commitsCount || 0)} commits`}
                            size="small"
                            sx={{
                                borderRadius: 999,
                                fontSize: 11
                            }}
                        />
                    </Stack>

                    <Divider sx={{ width: '100%', my: 1 }} />

                    <Stack
                        direction="row"
                        spacing={1.6}
                        justifyContent="center"
                        alignItems="center"
                        sx={{ mb: 1.2, fontSize: 12, color: 'text.secondary', flexWrap: 'wrap' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StarIcon sx={{ fontSize: 16 }} />
                            <span>{formatNumber(repo.stargazers_count || 0)}</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CallSplitIcon sx={{ fontSize: 15 }} />
                            <span>{formatNumber(repo.forks_count || 0)}</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <VisibilityIcon sx={{ fontSize: 16 }} />
                            <span>{formatNumber(watchers)}</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <BugReportIcon sx={{ fontSize: 16 }} />
                            <span>{formatNumber(issues)}</span>
                        </Box>
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mb: 0.6, fontSize: 11, color: 'text.secondary' }}
                    >
                        <AccessTimeIcon sx={{ fontSize: 14 }} />
                        <span>Updated {updated}</span>
                    </Stack>
                    <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', mb: tags.length > 0 ? 1.2 : 0.4 }}
                    >
                        Created {created}
                    </Typography>

                    {tags.length > 0 && (
                        <>
                            <Divider sx={{ width: '100%', my: 1 }} />
                            <Stack
                                direction="row"
                                spacing={0.7}
                                sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
                            >
                                {tags.map(tag => (
                                    <Tooltip key={tag} title="Filter by this tag">
                                        <Chip
                                            label={tag}
                                            size="small"
                                            onClick={e => handleTagClick(e, tag)}
                                            sx={{
                                                borderRadius: 999,
                                                fontSize: 10,
                                                textTransform: 'lowercase',
                                                borderColor: 'primary.main',
                                                bgcolor: 'rgba(34,211,238,0.08)',
                                                color: 'primary.main',
                                                cursor: 'pointer'
                                            }}
                                            variant="outlined"
                                        />
                                    </Tooltip>
                                ))}
                            </Stack>
                        </>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default RepoCard
