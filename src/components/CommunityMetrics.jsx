import React, { useMemo } from 'react'
import { Box, Paper, Typography, Grid, Stack, Chip, LinearProgress } from '@mui/material'
import {
    LineChart, Line, AreaChart, Area, ResponsiveContainer,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend
} from 'recharts'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import GroupsIcon from '@mui/icons-material/Groups'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import StarIcon from '@mui/icons-material/Star'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'

export default function CommunityMetrics({ repos }) {
    const navigate = useNavigate()
    const metrics = useMemo(() => {
        // Engagement Analytics
        const totalWatchers = repos.reduce((sum, r) => sum + (r.watchers_count || 0), 0)
        const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
        const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0)
        const totalIssues = repos.reduce((sum, r) => sum + (r.open_issues_count || 0), 0)

        const avgWatchers = repos.length > 0 ? (totalWatchers / repos.length).toFixed(1) : 0
        const avgStars = repos.length > 0 ? (totalStars / repos.length).toFixed(1) : 0
        const forkToStarRatio = totalStars > 0 ? ((totalForks / totalStars) * 100).toFixed(1) : 0

        // Community Engagement Score (0-100)
        const engagementScore = Math.min(
            Math.round(
                (totalStars * 2 + totalForks * 3 + totalWatchers * 1.5 + (repos.length * 5)) / 10
            ),
            100
        )

        // Most Watched Repositories
        const mostWatched = [...repos]
            .sort((a, b) => (b.watchers_count || 0) - (a.watchers_count || 0))
            .slice(0, 5)

        // Growth over time (simulate - in real app would track historical data)
        const sortedByDate = [...repos].sort((a, b) =>
            new Date(a.created_at) - new Date(b.created_at)
        )

        const growthData = []
        let cumulativeStars = 0
        let cumulativeForks = 0
        let cumulativeWatchers = 0

        sortedByDate.forEach((repo, index) => {
            cumulativeStars += repo.stargazers_count || 0
            cumulativeForks += repo.forks_count || 0
            cumulativeWatchers += repo.watchers_count || 0

            // Sample every 5 repos or last repo
            if (index % 5 === 0 || index === sortedByDate.length - 1) {
                const date = new Date(repo.created_at)
                growthData.push({
                    date: date.toLocaleDateString('en-US', { year: '2-digit', month: 'short' }),
                    stars: cumulativeStars,
                    forks: cumulativeForks,
                    watchers: cumulativeWatchers,
                    repos: index + 1
                })
            }
        })

        // Community Size Tiers
        const getTier = (count) => {
            if (count >= 1000) return { label: 'Viral', color: '#ef4444', icon: '🔥' }
            if (count >= 500) return { label: 'Popular', color: '#f59e0b', icon: '⭐' }
            if (count >= 100) return { label: 'Growing', color: '#10b981', icon: '📈' }
            if (count >= 10) return { label: 'Emerging', color: '#22d3ee', icon: '🌱' }
            return { label: 'Starting', color: '#6b7280', icon: '🌰' }
        }

        const starTier = getTier(totalStars)
        const forkTier = getTier(totalForks)

        return {
            totalWatchers,
            totalStars,
            totalForks,
            totalIssues,
            avgWatchers,
            avgStars,
            forkToStarRatio,
            engagementScore,
            mostWatched,
            growthData,
            starTier,
            forkTier
        }
    }, [repos])

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <Paper
                    elevation={3}
                    sx={{
                        p: 1.5,
                        bgcolor: '#0f172a',
                        border: '1px solid rgba(34, 211, 238, 0.3)'
                    }}
                >
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                        {payload[0].payload.date}
                    </Typography>
                    {payload.map((entry, index) => (
                        <Typography key={index} variant="body2" sx={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </Typography>
                    ))}
                </Paper>
            )
        }
        return null
    }

    const MetricCard = ({ icon, label, value, sublabel, progress, color }) => (
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
                        {label}
                    </Typography>
                </Stack>

                <Typography variant="h3" sx={{ color: color || '#e5e7eb', fontWeight: 700 }}>
                    {value}
                </Typography>

                {sublabel && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {sublabel}
                    </Typography>
                )}

                {progress !== undefined && (
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 6,
                            borderRadius: 999,
                            bgcolor: 'rgba(31, 41, 55, 1)',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: color || 'primary.main',
                                borderRadius: 999
                            }
                        }}
                    />
                )}
            </Stack>
        </Paper>
    )

    const TierBadge = ({ tier }) => (
        <Chip
            label={`${tier.icon} ${tier.label}`}
            sx={{
                bgcolor: `${tier.color}20`,
                color: tier.color,
                border: `1px solid ${tier.color}40`,
                fontWeight: 600,
                fontSize: 14,
                px: 1
            }}
        />
    )

    return (
        <Box>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                    <GroupsIcon sx={{ color: '#10b981', fontSize: 28 }} />
                    <Typography variant="h5" sx={{ color: '#10b981' }}>
                        Community & Engagement
                    </Typography>
                </Stack>

                {/* Engagement Overview */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                            icon={<VisibilityIcon sx={{ fontSize: 20, color: 'primary.main' }} />}
                            label="Total Watchers"
                            value={metrics.totalWatchers}
                            sublabel={`${metrics.avgWatchers} avg per repo`}
                            color="#22d3ee"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                            icon={<StarIcon sx={{ fontSize: 20, color: '#f59e0b' }} />}
                            label="Total Stars"
                            value={metrics.totalStars}
                            sublabel={`${metrics.avgStars} avg per repo`}
                            color="#f59e0b"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                            icon={<CallSplitIcon sx={{ fontSize: 20, color: '#10b981' }} />}
                            label="Total Forks"
                            value={metrics.totalForks}
                            sublabel={`${metrics.forkToStarRatio}% fork-to-star ratio`}
                            color="#10b981"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                            icon={<TrendingUpIcon sx={{ fontSize: 20, color: '#a855f7' }} />}
                            label="Engagement Score"
                            value={metrics.engagementScore}
                            sublabel="Community impact rating"
                            progress={metrics.engagementScore}
                            color="#a855f7"
                        />
                    </Grid>
                </Grid>

                {/* Community Tiers */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 3,
                        border: '1px solid rgba(31, 41, 55, 1)',
                        bgcolor: '#0f172a'
                    }}
                >
                    <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 2 }}>
                        Community Size Tiers
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Star Tier
                                </Typography>
                                <TierBadge tier={metrics.starTier} />
                                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                                    Your projects have collected <strong style={{ color: metrics.starTier.color }}>{metrics.totalStars}</strong> total stars
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Fork Tier
                                </Typography>
                                <TierBadge tier={metrics.forkTier} />
                                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                                    Your projects have been forked <strong style={{ color: metrics.forkTier.color }}>{metrics.totalForks}</strong> times
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Growth Charts */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid rgba(31, 41, 55, 1)',
                                bgcolor: '#0f172a'
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 2 }}>
                                Stargazer Growth
                            </Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={metrics.growthData}>
                                    <defs>
                                        <linearGradient id="starGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="stars"
                                        stroke="#f59e0b"
                                        fillOpacity={1}
                                        fill="url(#starGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid rgba(31, 41, 55, 1)',
                                bgcolor: '#0f172a'
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 2 }}>
                                Fork & Watcher Growth
                            </Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={metrics.growthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="forks"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        name="Forks"
                                        dot={{ fill: '#10b981', r: 3 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="watchers"
                                        stroke="#22d3ee"
                                        strokeWidth={2}
                                        name="Watchers"
                                        dot={{ fill: '#22d3ee', r: 3 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Most Watched Repositories */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: '1px solid rgba(31, 41, 55, 1)',
                        bgcolor: '#0f172a'
                    }}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                        <PeopleIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                        <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                            Most Watched Repositories
                        </Typography>
                    </Stack>
                    <Stack spacing={1.5}>
                        {metrics.mostWatched.map((repo, index) => (
                            <Box
                                key={repo.id}
                                onClick={() => navigate(`/repo/${repo.name}`)}
                                sx={{
                                    p: 2,
                                    bgcolor: 'rgba(15, 23, 42, 0.5)',
                                    border: '1px solid rgba(31, 41, 55, 0.5)',
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        bgcolor: 'rgba(34, 211, 238, 0.03)',
                                        transform: 'translateX(4px)'
                                    }
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Chip
                                            label={`#${index + 1}`}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(34, 211, 238, 0.12)',
                                                color: 'primary.main',
                                                fontWeight: 700,
                                                minWidth: 36
                                            }}
                                        />
                                        <Typography variant="body1" sx={{ color: '#e5e7eb', fontWeight: 500 }}>
                                            {repo.name}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <VisibilityIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                                {repo.watchers_count || 0}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                                            <Typography variant="body2" sx={{ color: '#f59e0b' }}>
                                                {repo.stargazers_count || 0}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <CallSplitIcon sx={{ fontSize: 16, color: '#10b981' }} />
                                            <Typography variant="body2" sx={{ color: '#10b981' }}>
                                                {repo.forks_count || 0}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                </Paper>
            </motion.div>
        </Box>
    )
}
