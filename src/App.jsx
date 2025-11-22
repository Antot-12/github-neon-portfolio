import React from 'react'
import { Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom'
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Container,
    Link,
    Stack,
    Button
} from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import RepoListPage from './pages/RepoListPage'
import RepoDetailPage from './pages/RepoDetailPage'
import AboutPage from './pages/AboutPage'
import { useGithub } from './GithubContext'
import ScrollProgressBar from './components/ScrollProgressBar'

function App() {
    const { username } = useGithub()
    const location = useLocation()
    const isAbout = location.pathname.startsWith('/about')

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <ScrollProgressBar />
            <AppBar position="sticky" elevation={0}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography
                                variant="h6"
                                component={RouterLink}
                                to="/"
                                sx={{
                                    fontWeight: 600,
                                    letterSpacing: 1.2,
                                    textTransform: 'uppercase',
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    color: 'primary.main',
                                    textDecoration: 'none'
                                }}
                                className="neon-text"
                            >
                                GitHub Portfolio
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary', mt: 0.3, display: { xs: 'none', sm: 'block' } }}
                            >
                                All public repositories in one place
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <Button
                                component={RouterLink}
                                to="/"
                                size="small"
                                disableElevation
                                sx={{
                                    textTransform: 'none',
                                    fontSize: 13,
                                    px: 1.6,
                                    py: 0.4,
                                    borderRadius: 999,
                                    border: '1px solid',
                                    borderColor: isAbout ? 'transparent' : 'primary.main',
                                    color: isAbout ? 'text.secondary' : 'primary.main',
                                    bgcolor: isAbout ? 'transparent' : 'rgba(34,211,238,0.08)'
                                }}
                            >
                                Projects
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/about"
                                size="small"
                                disableElevation
                                sx={{
                                    textTransform: 'none',
                                    fontSize: 13,
                                    px: 1.6,
                                    py: 0.4,
                                    borderRadius: 999,
                                    border: '1px solid',
                                    borderColor: isAbout ? 'primary.main' : 'transparent',
                                    color: isAbout ? 'primary.main' : 'text.secondary',
                                    bgcolor: isAbout ? 'rgba(34,211,238,0.08)' : 'transparent'
                                }}
                            >
                                About
                            </Button>
                        </Stack>
                    </Stack>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}
                        >
                            @{username}
                        </Typography>
                        <IconButton
                            component={Link}
                            href={`https://github.com/${username}`}
                            target="_blank"
                            rel="noreferrer"
                            sx={{
                                borderRadius: 0,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.default',
                                padding: 0.8,
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: '#111827'
                                }
                            }}
                        >
                            <GitHubIcon sx={{ color: '#e5e7eb' }} />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ py: { xs: 3.5, md: 5 } }}>
                <Routes>
                    <Route path="/" element={<RepoListPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/repo/:name" element={<RepoDetailPage />} />
                </Routes>
            </Container>
        </Box>
    )
}

export default App
