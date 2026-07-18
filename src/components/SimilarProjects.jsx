import React, { useMemo } from 'react'
import { Box, Paper, Typography, Grid, Stack, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import RepoCard from './RepoCard'
import { getSimilarRepos } from '../utils/recommendations'

export default function SimilarProjects({ currentRepo, allRepos }) {
    const navigate = useNavigate()

    const similarRepos = useMemo(() => {
        return getSimilarRepos(currentRepo, allRepos, 3)
    }, [currentRepo, allRepos])

    if (similarRepos.length === 0) {
        return null
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mt: 4,
                    border: '1px solid rgba(31, 41, 55, 1)',
                    bgcolor: '#0f172a'
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                    <AutoAwesomeIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                    <Box>
                        <Typography variant="h6" sx={{ color: 'primary.main' }}>
                            Similar Projects
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.3 }}>
                            Based on shared topics, language, and characteristics
                        </Typography>
                    </Box>
                </Stack>

                <Grid container spacing={3}>
                    {similarRepos.map(repo => (
                        <Grid item xs={12} sm={6} md={4} key={repo.id}>
                            <RepoCard repo={repo} />
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </motion.div>
    )
}
