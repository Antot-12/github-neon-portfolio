import React from 'react'
import { Grid, Typography, Box } from '@mui/material'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import { AnimatePresence, motion } from 'framer-motion'
import RepoCard from './RepoCard'

function RepoGrid({ repos, activeIndex = -1 }) {
    if (!repos.length) {
        return (
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                sx={{
                    mt: 4,
                    borderRadius: 3,
                    border: '1px dashed rgba(75,85,99,0.9)',
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: '#030712',
                    boxShadow: '0 18px 45px rgba(15,23,42,0.9)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(15,23,42,1)',
                        mb: 0.5
                    }}
                >
                    <SearchOffIcon sx={{ fontSize: 22, color: 'rgba(148,163,184,0.9)' }} />
                </Box>
                <Typography variant="body1" sx={{ mb: 0.2 }}>
                    No projects match your filters.
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Try another language, tag or search query.
                </Typography>
            </Box>
        )
    }

    return (
        <AnimatePresence mode="popLayout">
            <Grid container spacing={3.2} alignItems="stretch">
                {repos.map((repo, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        lg={4}
                        key={repo.id}
                        component={motion.div}
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        style={{ height: '100%' }}
                    >
                        <RepoCard repo={repo} isActive={index === activeIndex} />
                    </Grid>
                ))}
            </Grid>
        </AnimatePresence>
    )
}

export default RepoGrid
