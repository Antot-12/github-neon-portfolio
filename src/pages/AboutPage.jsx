import React, { useMemo } from 'react'
import {
    Box,
    Typography,
    Stack,
    Chip,
    Paper,
    Link,
    Grid,
    Avatar,
    Divider,
    Button,
    Container
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import YouTubeIcon from '@mui/icons-material/YouTube'
import InstagramIcon from '@mui/icons-material/Instagram'
import GitHubIcon from '@mui/icons-material/GitHub'
import BoltIcon from '@mui/icons-material/Bolt'
import SchoolIcon from '@mui/icons-material/School'
import CodeIcon from '@mui/icons-material/Code'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import StarIcon from '@mui/icons-material/Star'
import TimelineIcon from '@mui/icons-material/Timeline'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import ComputerIcon from '@mui/icons-material/Computer'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import WebAssetIcon from '@mui/icons-material/WebAsset'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'
import { useGithub } from '../GithubContext'

function AboutPage() {
    const navigate = useNavigate()
    const { repos } = useGithub()

    const coreStack = [
        'Java',
        'TypeScript',
        'JavaScript',
        'React',
        'React Native',
        'Spring Boot',
        'Next.js'
    ]

    const skillsSecondary = [
        'C',
        'C++',
        'Python',
        'Node.js',
        'Tailwind CSS',
        'HTML5',
        'CSS3',
        'Git',
        'Raspberry Pi',
        'Adobe tools'
    ]

    const pinnedRepos = [
        'Neon-Snake',
        'Password-Generator',
        'Emoji-Translator',
        'Coin-Flip-Simulator'
    ]

    const stats = useMemo(() => {
        if (!repos || repos.length === 0) {
            return {
                totalRepos: 0,
                totalStars: 0,
                primaryLanguage: '',
                recentUpdated: 0,
                latestRepoName: ''
            }
        }

        const totalRepos = repos.length
        let totalStars = 0
        const languages = {}
        let recentUpdated = 0
        let latestRepo = null
        const now = Date.now()
        const days30 = 1000 * 60 * 60 * 24 * 30

        repos.forEach(r => {
            totalStars += r.stargazers_count || 0

            if (r.language) {
                languages[r.language] = (languages[r.language] || 0) + 1
            }

            const updatedRaw = r.pushed_at || r.updated_at || r.created_at
            if (updatedRaw) {
                const updated = new Date(updatedRaw)
                if (!latestRepo || updated > latestRepo.date) {
                    latestRepo = { name: r.name, date: updated }
                }
                if (now - updated.getTime() <= days30) {
                    recentUpdated += 1
                }
            }
        })

        const languageList = Object.entries(languages).sort((a, b) => b[1] - a[1])
        const primaryLanguage = languageList.length > 0 ? languageList[0][0] : ''

        return {
            totalRepos,
            totalStars,
            primaryLanguage,
            recentUpdated,
            latestRepoName: latestRepo ? latestRepo.name : ''
        }
    }, [repos])

    const handleCoreSkillClick = skill => {
        navigate({
            pathname: '/',
            search: `?q=${encodeURIComponent(skill)}`
        })
    }

    const handleViewProjectsClick = () => {
        navigate('/')
    }

    const handleOpenLatestProject = () => {
        if (stats.latestRepoName) {
            navigate(`/repo/${stats.latestRepoName}`)
        } else {
            navigate('/')
        }
    }

    const handleOpenRandomProject = () => {
        if (!repos || repos.length === 0) {
            navigate('/')
            return
        }
        const idx = Math.floor(Math.random() * repos.length)
        const repo = repos[idx]
        navigate(`/repo/${repo.name}`)
    }

    const handlePinnedClick = name => {
        navigate(`/repo/${name}`)
    }

    const containerSx = {
        maxWidth: 1040,
        mx: 'auto',
        px: { xs: 2, md: 3 },
        mt: { xs: 3, md: 5 },
        mb: 6
    }

    const cardBase = {
        borderRadius: 3,
        border: '1px solid rgba(30,64,175,0.4)',
        bgcolor: 'rgba(15,23,42,0.98)',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 10px 24px rgba(15,23,42,0.7)'
    }

    const mainCardSx = {
        ...cardBase,
        p: { xs: 2.4, md: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.8
    }

    const sideCardSx = {
        ...cardBase,
        p: { xs: 2.4, md: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.4
    }

    const pillChipSx = {
        borderRadius: 999,
        fontSize: 11,
        height: 26
    }

    const primaryPillChipSx = {
        ...pillChipSx,
        borderColor: 'primary.main',
        bgcolor: 'rgba(34,211,238,0.08)',
        color: 'primary.main'
    }

    const subtlePillChipSx = {
        ...pillChipSx,
        bgcolor: '#020617',
        borderColor: 'rgba(55,65,81,1)',
        color: 'text.secondary'
    }

    return (
        <Container sx={containerSx}>
            <Grid container spacing={3.2} alignItems="flex-start">
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={mainCardSx}>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={3}
                            alignItems={{ xs: 'flex-start', md: 'center' }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    flexShrink: 0,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 3,
                                    p: 1.3,
                                    background:
                                        'radial-gradient(circle at 30% 0, rgba(56,189,248,0.35), transparent 60%)'
                                }}
                            >
                                <Avatar
                                    src="https://raw.githubusercontent.com/Antot-12/antot-12/main/assets/header.png"
                                    alt="Anton Shyrko"
                                    variant="rounded"
                                    sx={{
                                        width: { xs: 104, md: 120 },
                                        height: { xs: 104, md: 120 },
                                        borderRadius: 3,
                                        border: '1px solid rgba(34,211,238,0.6)',
                                        bgcolor: '#020617'
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                    variant="overline"
                                    sx={{ letterSpacing: 1.6, color: 'text.secondary' }}
                                >
                                    ABOUT
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        mb: 0.6,
                                        mt: 0.3,
                                        fontSize: { xs: 26, md: 30 }
                                    }}
                                    className="neon-text"
                                >
                                    Anton Shyrko
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ color: 'text.secondary', mb: 2, maxWidth: 740 }}
                                >
                                    Junior Java / React / TypeScript developer who enjoys building
                                    polished side-projects, games, tools and automation. I like
                                    projects where I can see progress quickly, tune UX and animations,
                                    and then iterate on the idea.
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    sx={{ mb: 2, rowGap: 1 }}
                                >
                                    <Chip
                                        icon={<CodeIcon sx={{ fontSize: 18 }} />}
                                        label="Full-stack oriented"
                                        size="small"
                                        sx={pillChipSx}
                                    />
                                    <Chip
                                        icon={<SchoolIcon sx={{ fontSize: 18 }} />}
                                        label="Constantly learning"
                                        size="small"
                                        sx={pillChipSx}
                                    />
                                    <Chip
                                        icon={<BoltIcon sx={{ fontSize: 18 }} />}
                                        label="Loves side projects"
                                        size="small"
                                        sx={pillChipSx}
                                    />
                                </Stack>
                                <Grid container spacing={2.6}>
                                    <Grid item xs={12} sm={7}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                textTransform: 'uppercase',
                                                color: 'text.secondary'
                                            }}
                                        >
                                            Core stack
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            spacing={0.8}
                                            sx={{ flexWrap: 'wrap', mt: 1, rowGap: 0.8 }}
                                        >
                                            {coreStack.map(skill => (
                                                <Chip
                                                    key={skill}
                                                    label={skill}
                                                    size="small"
                                                    clickable
                                                    onClick={() => handleCoreSkillClick(skill)}
                                                    variant="outlined"
                                                    sx={primaryPillChipSx}
                                                />
                                            ))}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={5}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                textTransform: 'uppercase',
                                                color: 'text.secondary'
                                            }}
                                        >
                                            Status
                                        </Typography>
                                        <Stack spacing={0.7} sx={{ mt: 1 }}>
                                            <Stack
                                                direction="row"
                                                spacing={0.7}
                                                alignItems="center"
                                            >
                                                <AccessTimeIcon
                                                    sx={{ fontSize: 18, color: 'primary.main' }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    Now: portfolio apps, games, tools
                                                </Typography>
                                            </Stack>
                                            <Stack
                                                direction="row"
                                                spacing={0.7}
                                                alignItems="center"
                                            >
                                                <StarIcon
                                                    sx={{ fontSize: 18, color: 'primary.main' }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    Open to interesting side projects
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Box
                                    sx={{
                                        mt: 2.8,
                                        display: 'flex',
                                        gap: 1.2,
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleViewProjectsClick}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: 999,
                                            px: 3,
                                            py: 0.8,
                                            fontSize: 13
                                        }}
                                    >
                                        View all projects
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleOpenRandomProject}
                                        startIcon={<ShuffleIcon sx={{ fontSize: 18 }} />}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: 999,
                                            px: 2.4,
                                            py: 0.8,
                                            fontSize: 13
                                        }}
                                    >
                                        Random project
                                    </Button>
                                </Box>
                            </Box>
                        </Stack>

                        <Divider />

                        <Box>
                            <Typography variant="subtitle1" sx={{ mb: 1.4 }}>
                                What I like to build
                            </Typography>
                            <Stack spacing={1.6} sx={{ color: 'text.secondary' }}>
                                <Typography variant="body2">
                                    I enjoy creating focused applications: games like Neon Snake,
                                    utility tools, automation helpers and web experiments. I prefer
                                    projects where I can quickly see something working, polish the UX
                                    and animations, and then push the idea further.
                                </Typography>
                                <Typography variant="body2">
                                    On the backend side I work mostly with Java and Spring Boot. On
                                    the frontend I use React, TypeScript, MUI or Tailwind and
                                    sometimes Next.js. I also have experience with C / C++,
                                    algorithms and low-level tasks from university and hobby
                                    projects.
                                </Typography>
                                <Typography variant="body2">
                                    I&apos;m interested in automation, bots, small desktop tools and
                                    game-like interfaces. This portfolio collects my public GitHub
                                    work in one place with filters, stats and a UI that feels more
                                    like a dev dashboard than a plain list.
                                </Typography>
                                <Typography variant="body2">
                                    If you want to understand my style - open a few projects, read
                                    the README, and check how I structure code, handle state and keep
                                    things clean but not over-engineered.
                                </Typography>
                            </Stack>
                        </Box>

                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    textTransform: 'uppercase',
                                    color: 'text.secondary'
                                }}
                            >
                                Now / Next / Later
                            </Typography>
                            <Grid container spacing={2.4} sx={{ mt: 1.2 }}>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                                        Now
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Shipping small games, portfolio features and React / TS tools.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                                        Next
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Deeper Spring Boot backend, more React Native and full-stack
                                        projects with real users.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                                        Later
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Small SaaS-style products, open-source contributions and more
                                        automation around dev workflows.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider />

                        <Box>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1.4 }}
                            >
                                <TimelineIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                                <Typography variant="subtitle1">Personal timeline</Typography>
                            </Stack>
                            <Box
                                sx={{
                                    borderLeft: '1px solid rgba(55,65,81,1)',
                                    pl: 2.1,
                                    mt: 1
                                }}
                            >
                                <Box sx={{ mb: 1.9 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: 'primary.main', letterSpacing: 0.4 }}
                                    >
                                        2022
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        More serious about coding, focusing on C / C++ and university
                                        projects.
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 1.9 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: 'primary.main', letterSpacing: 0.4 }}
                                    >
                                        2023
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Shift to Java, Spring Boot and web basics. First public GitHub
                                        projects.
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 1.9 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: 'primary.main', letterSpacing: 0.4 }}
                                    >
                                        2024
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        React, TypeScript, more frontend work, experiments with Next.js
                                        and automation.
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: 'primary.main', letterSpacing: 0.4 }}
                                    >
                                        2025 →
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Building a cleaner portfolio, polishing projects and moving
                                        towards production-ready full-stack apps.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="subtitle1" sx={{ mb: 1.3 }}>
                                Links & social
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', mb: 1.8, maxWidth: 520 }}
                            >
                                You can find more of my activity, videos and experiments here:
                            </Typography>
                            <Stack direction="row" spacing={1.1} flexWrap="wrap">
                                <Chip
                                    icon={<GitHubIcon sx={{ fontSize: 18 }} />}
                                    label="GitHub"
                                    component={Link}
                                    clickable
                                    href="https://github.com/Antot-12"
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={pillChipSx}
                                />
                                <Chip
                                    icon={<LinkedInIcon sx={{ fontSize: 18 }} />}
                                    label="LinkedIn"
                                    component={Link}
                                    clickable
                                    href="https://www.linkedin.com/in/anton-shyrko/"
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={pillChipSx}
                                />
                                <Chip
                                    icon={<YouTubeIcon sx={{ fontSize: 18 }} />}
                                    label="YouTube"
                                    component={Link}
                                    clickable
                                    href="https://www.youtube.com/c/BOMBAProductionA"
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={pillChipSx}
                                />
                                <Chip
                                    icon={<InstagramIcon sx={{ fontSize: 18 }} />}
                                    label="Instagram"
                                    component={Link}
                                    clickable
                                    href="https://www.instagram.com/antot__12/"
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={pillChipSx}
                                />
                            </Stack>
                        </Box>

                        <Box>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1.1 }}
                            >
                                <KeyboardIcon sx={{ fontSize: 19, color: 'primary.main' }} />
                                <Typography variant="subtitle2">
                                    Keyboard shortcuts (Projects page)
                                </Typography>
                            </Stack>
                            <Stack spacing={0.8}>
                                <Stack direction="row" spacing={1.1} alignItems="center">
                                    <Chip
                                        label="/"
                                        size="small"
                                        variant="outlined"
                                        sx={subtlePillChipSx}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Focus search on the Projects page
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1.1} alignItems="center">
                                    <Chip
                                        label="Esc"
                                        size="small"
                                        variant="outlined"
                                        sx={subtlePillChipSx}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Clear search and close focus
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1.1} alignItems="center">
                                    <Chip
                                        label="← / →"
                                        size="small"
                                        variant="outlined"
                                        sx={subtlePillChipSx}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Switch pagination pages
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1.1} alignItems="center">
                                    <Chip
                                        label="j / k"
                                        size="small"
                                        variant="outlined"
                                        sx={subtlePillChipSx}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Move between project cards
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Box>

                        <Box>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1.2 }}
                            >
                                <EmojiPeopleIcon
                                    sx={{ fontSize: 20, color: 'primary.main' }}
                                />
                                <Typography variant="subtitle2">Collab & contact</Typography>
                            </Stack>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', mb: 1.9, maxWidth: 620 }}
                            >
                                Interested in collaborating, reviewing code or building a small
                                side project together? The fastest way to reach me is via LinkedIn
                                DMs or a GitHub message. I&apos;m happy to talk about dev tools,
                                games, automation and neat frontend ideas.
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                component={Link}
                                href="https://www.linkedin.com/in/anton-shyrko/"
                                target="_blank"
                                rel="noreferrer"
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: 999,
                                    px: 2.4,
                                    py: 0.7,
                                    fontSize: 13
                                }}
                            >
                                Say hi on LinkedIn
                            </Button>
                            <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary', display: 'block', mt: 2.1 }}
                            >
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={sideCardSx}>
                        <Box>
                            <Typography variant="subtitle1" sx={{ mb: 1.4 }}>
                                Languages & tools
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    textTransform: 'uppercase',
                                    color: 'text.secondary'
                                }}
                            >
                                Core stack
                            </Typography>
                            <Stack
                                direction="row"
                                spacing={0.8}
                                sx={{ flexWrap: 'wrap', mt: 1.1, mb: 2, rowGap: 0.8 }}
                            >
                                {coreStack.map(skill => (
                                    <Chip
                                        key={skill}
                                        label={skill}
                                        size="small"
                                        clickable
                                        onClick={() => handleCoreSkillClick(skill)}
                                        variant="outlined"
                                        sx={primaryPillChipSx}
                                    />
                                ))}
                            </Stack>
                            <Typography
                                variant="caption"
                                sx={{
                                    textTransform: 'uppercase',
                                    color: 'text.secondary'
                                }}
                            >
                                Also used
                            </Typography>
                            <Stack
                                direction="row"
                                spacing={0.8}
                                sx={{ flexWrap: 'wrap', mt: 1.1, rowGap: 0.8 }}
                            >
                                {skillsSecondary.map(skill => (
                                    <Chip
                                        key={skill}
                                        label={skill}
                                        size="small"
                                        variant="outlined"
                                        sx={subtlePillChipSx}
                                    />
                                ))}
                            </Stack>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    textTransform: 'uppercase',
                                    color: 'text.secondary'
                                }}
                            >
                                Focus areas
                            </Typography>
                            <Stack spacing={1.2} sx={{ mt: 1.1 }}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="flex-start"
                                >
                                    <ComputerIcon
                                        sx={{ fontSize: 18, color: 'primary.main', mt: 0.2 }}
                                    />
                                    <Box>
                                        <Typography variant="body2">Backend & APIs</Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            Java, Spring Boot, REST, simple authentication and clean
                                            service layers.
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="flex-start"
                                >
                                    <WebAssetIcon
                                        sx={{ fontSize: 18, color: 'primary.main', mt: 0.2 }}
                                    />
                                    <Box>
                                        <Typography variant="body2">Frontend & UI</Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            React, TypeScript, MUI, Tailwind, small but polished
                                            interfaces with good UX.
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="flex-start"
                                >
                                    <PhoneIphoneIcon
                                        sx={{ fontSize: 18, color: 'primary.main', mt: 0.2 }}
                                    />
                                    <Box>
                                        <Typography variant="body2">
                                            Mobile & React Native
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            Compact mobile utilities and prototypes using React Native.
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="flex-start"
                                >
                                    <SmartToyIcon
                                        sx={{ fontSize: 18, color: 'primary.main', mt: 0.2 }}
                                    />
                                    <Box>
                                        <Typography variant="body2">Automation & bots</Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            Telegram bots, small scripts and tools that remove boring
                                            manual steps.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>

                        <Divider />

                        <Box>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1.2 }}
                            >
                                <TimelineIcon
                                    sx={{ fontSize: 20, color: 'primary.main' }}
                                />
                                <Typography variant="subtitle2">
                                    GitHub snapshot
                                </Typography>
                            </Stack>
                            <Stack spacing={1.1} sx={{ mb: 1.7 }}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Public repos
                                    </Typography>
                                    <Typography variant="body2">
                                        {stats.totalRepos}
                                    </Typography>
                                </Stack>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Total stars
                                    </Typography>
                                    <Typography variant="body2">
                                        {stats.totalStars}
                                    </Typography>
                                </Stack>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Primary language
                                    </Typography>
                                    <Typography variant="body2">
                                        {stats.primaryLanguage || '-'}
                                    </Typography>
                                </Stack>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Active last 30 days
                                    </Typography>
                                    <Typography variant="body2">
                                        {stats.recentUpdated} repo
                                        {stats.recentUpdated === 1 ? '' : 's'}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack direction="row" spacing={1.1} sx={{ mb: 1.8 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleOpenLatestProject}
                                    startIcon={<WorkspacesIcon sx={{ fontSize: 18 }} />}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 999,
                                        px: 2,
                                        py: 0.6,
                                        fontSize: 12
                                    }}
                                >
                                    Latest project
                                </Button>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={handleOpenRandomProject}
                                    startIcon={<ShuffleIcon sx={{ fontSize: 18 }} />}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 999,
                                        px: 1.7,
                                        py: 0.6,
                                        fontSize: 12
                                    }}
                                >
                                    Random
                                </Button>
                            </Stack>
                            <Typography
                                variant="caption"
                                sx={{
                                    textTransform: 'uppercase',
                                    color: 'text.secondary'
                                }}
                            >
                                Pinned projects
                            </Typography>
                            <Stack
                                direction="row"
                                sx={{
                                    flexWrap: 'wrap',
                                    mt: 1.1,
                                    columnGap: 1.2,
                                    rowGap: 1.2
                                }}
                            >
                                {pinnedRepos.map(name => (
                                    <Chip
                                        key={name}
                                        label={name}
                                        size="small"
                                        onClick={() => handlePinnedClick(name)}
                                        clickable
                                        variant="outlined"
                                        sx={primaryPillChipSx}
                                    />
                                ))}
                            </Stack>

                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default AboutPage
