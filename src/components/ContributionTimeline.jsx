import React, { useMemo } from 'react'
import { Box, Paper, Typography, Chip, Stack, Tooltip as MuiTooltip } from '@mui/material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import TimelineIcon from '@mui/icons-material/Timeline'
import TodayIcon from '@mui/icons-material/Today'

export default function ContributionTimeline({ repos }) {
    const navigate = useNavigate()
    const timelineData = useMemo(() => {
        // Sort repos by creation date
        const sortedRepos = [...repos]
            .filter(r => r.created_at)
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

        // Group by year
        const byYear = {}
        sortedRepos.forEach(repo => {
            const year = new Date(repo.created_at).getFullYear()
            if (!byYear[year]) {
                byYear[year] = []
            }
            byYear[year].push(repo)
        })

        // Activity heatmap - last 365 days
        const today = new Date()
        const oneYearAgo = new Date(today)
        oneYearAgo.setFullYear(today.getFullYear() - 1)

        const activityMap = {}
        repos.forEach(repo => {
            const updated = repo.pushed_at || repo.updated_at
            if (updated) {
                const date = new Date(updated)
                if (date >= oneYearAgo && date <= today) {
                    const dateKey = date.toISOString().split('T')[0]
                    activityMap[dateKey] = (activityMap[dateKey] || 0) + 1
                }
            }
        })

        // Generate heatmap grid (last 52 weeks)
        const weeks = []
        const daysInWeek = 7
        const totalWeeks = 52

        for (let week = 0; week < totalWeeks; week++) {
            const weekDays = []
            for (let day = 0; day < daysInWeek; day++) {
                const date = new Date(today)
                date.setDate(date.getDate() - ((totalWeeks - week) * 7 - day))
                const dateKey = date.toISOString().split('T')[0]
                const count = activityMap[dateKey] || 0
                weekDays.push({ date: dateKey, count, dateObj: date })
            }
            weeks.push(weekDays)
        }

        return { sortedRepos, byYear, weeks }
    }, [repos])

    const getHeatmapColor = (count) => {
        if (count === 0) return 'rgba(31, 41, 55, 0.5)'
        if (count === 1) return 'rgba(34, 211, 238, 0.3)'
        if (count === 2) return 'rgba(34, 211, 238, 0.5)'
        if (count === 3) return 'rgba(34, 211, 238, 0.7)'
        return 'rgba(34, 211, 238, 1)'
    }

    return (
        <Stack spacing={3}>
            {/* Timeline by Year */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: '1px solid rgba(31, 41, 55, 1)',
                        bgcolor: '#0f172a'
                    }}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                        <TimelineIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                        <Box>
                            <Typography variant="h6" sx={{ color: 'primary.main' }}>
                                Repository Creation Timeline
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Projects created over the years
                            </Typography>
                        </Box>
                    </Stack>

                    <Box sx={{ position: 'relative', pl: 6 }}>
                        {/* Improved Timeline line with gradient */}
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 20,
                                top: 0,
                                bottom: 0,
                                width: 2.5,
                                background: 'linear-gradient(180deg, rgba(34, 211, 238, 0.5) 0%, rgba(34, 211, 238, 0.3) 50%, rgba(34, 211, 238, 0.15) 100%)',
                                borderRadius: 999,
                                boxShadow: '0 0 4px rgba(34, 211, 238, 0.2)'
                            }}
                        />

                        <Stack spacing={6}>
                            {Object.entries(timelineData.byYear)
                                .sort(([a], [b]) => b - a)
                                .map(([year, yearRepos], index) => (
                                    <motion.div
                                        key={year}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Box sx={{ position: 'relative' }}>
                                            {/* Enhanced Timeline dot - centered on line */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    left: -35,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: 16,
                                                    height: 16,
                                                    bgcolor: '#0f172a',
                                                    borderRadius: '50%',
                                                    border: '3px solid #22d3ee',
                                                    boxShadow: '0 0 0 3px rgba(34, 211, 238, 0.15), 0 0 8px rgba(34, 211, 238, 0.3)',
                                                    transition: 'all 0.3s ease',
                                                    zIndex: 2,
                                                    '&:hover': {
                                                        transform: 'translateY(-50%) scale(1.2)',
                                                        boxShadow: '0 0 0 4px rgba(34, 211, 238, 0.2), 0 0 12px rgba(34, 211, 238, 0.4)'
                                                    }
                                                }}
                                            >
                                                {/* Inner glow dot */}
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        width: 5,
                                                        height: 5,
                                                        bgcolor: '#22d3ee',
                                                        borderRadius: '50%',
                                                        boxShadow: '0 0 4px rgba(34, 211, 238, 0.6)'
                                                    }}
                                                />
                                            </Box>

                                            <Box
                                                sx={{
                                                    p: 3,
                                                    bgcolor: 'rgba(15, 23, 42, 0.6)',
                                                    border: '1px solid rgba(34, 211, 238, 0.2)',
                                                    borderRadius: 3,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        borderColor: 'rgba(34, 211, 238, 0.5)',
                                                        bgcolor: 'rgba(15, 23, 42, 0.8)',
                                                        transform: 'translateX(8px)',
                                                        boxShadow: '0 8px 24px rgba(34, 211, 238, 0.15)'
                                                    }
                                                }}
                                            >
                                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
                                                    <Typography
                                                        variant="h4"
                                                        sx={{
                                                            color: '#22d3ee',
                                                            fontWeight: 800,
                                                            fontSize: '2rem',
                                                            letterSpacing: 1,
                                                            textShadow: '0 0 8px rgba(34, 211, 238, 0.4), 0 0 16px rgba(34, 211, 238, 0.2)'
                                                        }}
                                                    >
                                                        {year}
                                                    </Typography>
                                                    <Chip
                                                        label={`${yearRepos.length} ${yearRepos.length === 1 ? 'project' : 'projects'}`}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'rgba(34, 211, 238, 0.12)',
                                                            color: '#22d3ee',
                                                            fontWeight: 700,
                                                            fontSize: 11,
                                                            border: '1px solid rgba(34, 211, 238, 0.3)',
                                                            px: 1.5
                                                        }}
                                                    />
                                                </Stack>

                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {yearRepos.map(repo => (
                                                        <Chip
                                                            key={repo.id}
                                                            label={repo.name}
                                                            size="small"
                                                            onClick={() => navigate(`/repo/${repo.name}`)}
                                                            sx={{
                                                                bgcolor: 'rgba(31, 41, 55, 0.9)',
                                                                color: '#cbd5e1',
                                                                fontSize: 11.5,
                                                                fontWeight: 500,
                                                                px: 1.5,
                                                                py: 1.5,
                                                                cursor: 'pointer',
                                                                border: '1px solid rgba(148, 163, 184, 0.15)',
                                                                borderRadius: 6,
                                                                transition: 'all 0.2s ease',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(34, 211, 238, 0.12)',
                                                                    color: '#22d3ee',
                                                                    borderColor: 'rgba(34, 211, 238, 0.5)',
                                                                    transform: 'translateY(-2px)',
                                                                    boxShadow: '0 4px 12px rgba(34, 211, 238, 0.2)'
                                                                }
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </motion.div>
                                ))}
                        </Stack>
                    </Box>
                </Paper>
            </motion.div>
        </Stack>
    )
}
