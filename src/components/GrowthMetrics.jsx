import React, { useMemo } from 'react'
import { Box, Paper, Typography, Grid, Stack, Chip, LinearProgress } from '@mui/material'
import { motion } from 'framer-motion'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import StarIcon from '@mui/icons-material/Star'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'

export default function GrowthMetrics({ repos }) {
    const metrics = useMemo(() => {
        const now = new Date()
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate())

        // Year over year growth
        const reposThisYear = repos.filter(r => new Date(r.created_at) >= oneYearAgo).length
        const reposLastYear = repos.filter(
            r => new Date(r.created_at) >= twoYearsAgo && new Date(r.created_at) < oneYearAgo
        ).length

        const starsThisYear = repos
            .filter(r => new Date(r.created_at) >= oneYearAgo)
            .reduce((sum, r) => sum + (r.stargazers_count || 0), 0)

        const starsLastYear = repos
            .filter(r => new Date(r.created_at) >= twoYearsAgo && new Date(r.created_at) < oneYearAgo)
            .reduce((sum, r) => sum + (r.stargazers_count || 0), 0)

        // Calculate streaks
        const sortedRepos = [...repos].sort((a, b) =>
            new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at)
        )

        let currentStreak = 0
        let longestStreak = 0
        let tempStreak = 0
        let lastDate = null

        sortedRepos.forEach(repo => {
            const repoDate = new Date(repo.pushed_at || repo.updated_at)
            if (!lastDate) {
                tempStreak = 1
                lastDate = repoDate
            } else {
                const daysDiff = Math.floor((lastDate - repoDate) / (1000 * 60 * 60 * 24))
                if (daysDiff <= 1) {
                    tempStreak++
                } else {
                    longestStreak = Math.max(longestStreak, tempStreak)
                    tempStreak = 1
                }
                lastDate = repoDate
            }
        })
        longestStreak = Math.max(longestStreak, tempStreak)

        const latestUpdate = sortedRepos[0]
        const daysSinceLastCommit = latestUpdate
            ? Math.floor((now - new Date(latestUpdate.pushed_at || latestUpdate.updated_at)) / (1000 * 60 * 60 * 24))
            : 0

        currentStreak = daysSinceLastCommit <= 30 ? tempStreak : 0

        // Velocity metrics
        const totalCommits = repos.reduce((sum, r) => sum + (r.commitsCount || 0), 0)
        const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
        const avgCommitsPerRepo = repos.length > 0 ? Math.round(totalCommits / repos.length) : 0

        // Calculate YoY growth percentage
        const repoGrowth = reposLastYear > 0
            ? Math.round(((reposThisYear - reposLastYear) / reposLastYear) * 100)
            : reposThisYear > 0 ? 100 : 0

        const starGrowth = starsLastYear > 0
            ? Math.round(((starsThisYear - starsLastYear) / starsLastYear) * 100)
            : starsThisYear > 0 ? 100 : 0

        return {
            reposThisYear,
            reposLastYear,
            repoGrowth,
            starsThisYear,
            starsLastYear,
            starGrowth,
            currentStreak,
            longestStreak,
            daysSinceLastCommit,
            avgCommitsPerRepo,
            totalCommits,
            totalStars
        }
    }, [repos])

    const GrowthCard = ({ title, thisYear, lastYear, growth, icon }) => (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                border: '1px solid rgba(31, 41, 55, 1)',
                bgcolor: '#0f172a'
            }}
        >
            <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                    {icon}
                    <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                        {title}
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="baseline" spacing={1}>
                    <Typography variant="h4" sx={{ color: '#e5e7eb', fontWeight: 600 }}>
                        {thisYear}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        this year
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                    {growth > 0 ? (
                        <TrendingUpIcon sx={{ fontSize: 16, color: '#10b981' }} />
                    ) : growth < 0 ? (
                        <TrendingDownIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                    ) : null}
                    <Typography
                        variant="body2"
                        sx={{
                            color: growth > 0 ? '#10b981' : growth < 0 ? '#ef4444' : 'text.secondary',
                            fontWeight: 600
                        }}
                    >
                        {growth > 0 ? '+' : ''}{growth}% vs last year ({lastYear})
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    )

    const StreakCard = ({ title, value, subtitle, icon, color }) => (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                border: '1px solid rgba(31, 41, 55, 1)',
                bgcolor: '#0f172a'
            }}
        >
            <Stack spacing={1.5} alignItems="center" textAlign="center">
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: `rgba(${color}, 0.1)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {icon}
                </Box>
                <Typography variant="h3" sx={{ color: `rgb(${color})`, fontWeight: 700 }}>
                    {value}
                </Typography>
                <Box>
                    <Typography variant="subtitle2" sx={{ color: '#e5e7eb' }}>
                        {title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {subtitle}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    )

    return (
        <Box>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                    <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                    <Typography variant="h5" sx={{ color: 'primary.main' }}>
                        Growth & Performance
                    </Typography>
                </Stack>

                {/* Year over Year Growth */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <GrowthCard
                            title="New Repositories"
                            thisYear={metrics.reposThisYear}
                            lastYear={metrics.reposLastYear}
                            growth={metrics.repoGrowth}
                            icon={<EmojiEventsIcon sx={{ fontSize: 20, color: 'primary.main' }} />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <GrowthCard
                            title="Stars Gained"
                            thisYear={metrics.starsThisYear}
                            lastYear={metrics.starsLastYear}
                            growth={metrics.starGrowth}
                            icon={<StarIcon sx={{ fontSize: 20, color: 'primary.main' }} />}
                        />
                    </Grid>
                </Grid>

                {/* Streaks & Activity */}
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, mt: 4 }}>
                    <WhatshotIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
                    <Typography variant="h5" sx={{ color: '#f59e0b' }}>
                        Activity Streaks
                    </Typography>
                </Stack>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <StreakCard
                            title="Current Streak"
                            value={metrics.currentStreak}
                            subtitle="consecutive updates"
                            icon={<LocalFireDepartmentIcon sx={{ fontSize: 32, color: '#f59e0b' }} />}
                            color="245, 158, 11"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StreakCard
                            title="Longest Streak"
                            value={metrics.longestStreak}
                            subtitle="all-time record"
                            icon={<WhatshotIcon sx={{ fontSize: 32, color: '#ef4444' }} />}
                            color="239, 68, 68"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StreakCard
                            title="Days Ago"
                            value={metrics.daysSinceLastCommit}
                            subtitle="since last commit"
                            icon={<TrendingUpIcon sx={{ fontSize: 32, color: 'primary.main' }} />}
                            color="34, 211, 238"
                        />
                    </Grid>
                </Grid>
            </motion.div>
        </Box>
    )
}
