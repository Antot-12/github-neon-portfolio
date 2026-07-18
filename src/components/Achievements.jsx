import React, { useMemo } from 'react'
import { Box, Paper, Typography, Grid, Stack, Chip } from '@mui/material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import CodeIcon from '@mui/icons-material/Code'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import StarIcon from '@mui/icons-material/Star'

export default function Achievements({ repos }) {
    const navigate = useNavigate()
    const achievements = useMemo(() => {
        const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
        const totalCommits = repos.reduce((sum, r) => sum + (r.commitsCount || 0), 0)

        const mostActiveRepo = [...repos].sort((a, b) =>
            (b.commitsCount || 0) - (a.commitsCount || 0)
        )[0]

        const oldestMaintainedRepo = [...repos]
            .filter(r => {
                const daysSince = Math.floor((Date.now() - new Date(r.pushed_at || r.updated_at)) / (1000 * 60 * 60 * 24))
                return daysSince < 90
            })
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0]

        const badges = [
            {
                id: 'first-star',
                icon: <StarIcon sx={{ fontSize: 40 }} />,
                title: '🌟 First Star',
                description: 'Received your first star',
                earned: totalStars >= 1,
                color: '#f59e0b'
            },
            {
                id: '10-commits',
                icon: <CodeIcon sx={{ fontSize: 40 }} />,
                title: '💯 Developer',
                description: 'Made 10+ commits',
                earned: totalCommits >= 10,
                color: '#10b981'
            },
            {
                id: '50-commits',
                icon: <RocketLaunchIcon sx={{ fontSize: 40 }} />,
                title: '🚀 Code Master',
                description: 'Made 50+ commits across all projects',
                earned: totalCommits >= 50,
                color: '#22d3ee'
            },
            {
                id: '5-repos',
                icon: <Inventory2Icon sx={{ fontSize: 40 }} />,
                title: '📦 Creator',
                description: 'Created 5+ repositories',
                earned: repos.length >= 5,
                color: '#a855f7'
            },
            {
                id: 'polyglot',
                icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
                title: '🔥 Polyglot Coder',
                description: 'Used 5+ programming languages',
                earned: new Set(repos.map(r => r.language).filter(Boolean)).size >= 5,
                color: '#ef4444'
            },
            {
                id: 'maintainer',
                icon: <WorkspacePremiumIcon sx={{ fontSize: 40 }} />,
                title: '🛠️ Maintainer',
                description: 'Actively maintain a 1+ year old repo',
                earned: !!oldestMaintainedRepo &&
                    (Date.now() - new Date(oldestMaintainedRepo.created_at)) / (1000 * 60 * 60 * 24 * 365) >= 1,
                color: '#6366f1'
            }
        ]

        const earnedCount = badges.filter(b => b.earned).length

        return {
            badges,
            earnedCount,
            totalBadges: badges.length,
            mostActiveRepo,
            oldestMaintainedRepo
        }
    }, [repos])

    const BadgeCard = ({ badge }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    border: `2px solid ${badge.earned ? badge.color : 'rgba(31, 41, 55, 1)'}`,
                    bgcolor: badge.earned ? `${badge.color}10` : '#0f172a',
                    opacity: badge.earned ? 1 : 0.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: badge.earned ? 'translateY(-4px)' : 'none',
                        boxShadow: badge.earned ? `0 8px 24px ${badge.color}30` : 'none'
                    }
                }}
            >
                <Stack spacing={2} alignItems="center" textAlign="center">
                    <Box sx={{ color: badge.earned ? badge.color : '#6b7280' }}>
                        {badge.icon}
                    </Box>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: badge.earned ? badge.color : 'text.secondary',
                            fontWeight: 600
                        }}
                    >
                        {badge.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {badge.description}
                    </Typography>
                    {badge.earned && (
                        <Chip
                            label="UNLOCKED"
                            size="small"
                            sx={{
                                bgcolor: badge.color,
                                color: '#000',
                                fontWeight: 700,
                                fontSize: 10
                            }}
                        />
                    )}
                </Stack>
            </Paper>
        </motion.div>
    )

    const LeaderboardItem = ({ icon, label, repo, stat }) => (
        <Box
            onClick={() => repo && navigate(`/repo/${repo.name}`)}
            sx={{
                p: 2,
                bgcolor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(31, 41, 55, 0.5)',
                borderRadius: 2,
                cursor: repo ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                '&:hover': {
                    borderColor: repo ? 'primary.main' : 'rgba(31, 41, 55, 0.5)',
                    bgcolor: repo ? 'rgba(34, 211, 238, 0.03)' : 'rgba(15, 23, 42, 0.5)',
                    transform: repo ? 'translateX(4px)' : 'none'
                }
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ color: 'primary.main' }}>
                    {icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {label}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#e5e7eb', fontWeight: 500 }}>
                        {repo?.name || 'N/A'}
                    </Typography>
                </Box>
                <Chip
                    label={stat}
                    sx={{
                        bgcolor: 'rgba(34, 211, 238, 0.12)',
                        color: 'primary.main',
                        fontWeight: 600
                    }}
                />
            </Stack>
        </Box>
    )

    return (
        <Box>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                    <EmojiEventsIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
                    <Typography variant="h5" sx={{ color: '#f59e0b' }}>
                        Achievements & Milestones
                    </Typography>
                    <Chip
                        label={`${achievements.earnedCount}/${achievements.totalBadges} Unlocked`}
                        sx={{
                            bgcolor: 'rgba(245, 158, 11, 0.12)',
                            color: '#f59e0b',
                            fontWeight: 600
                        }}
                    />
                </Stack>

                {/* Achievement Badges */}
                <Grid container spacing={2}>
                    {achievements.badges.map(badge => (
                        <Grid item xs={12} sm={6} md={4} key={badge.id}>
                            <BadgeCard badge={badge} />
                        </Grid>
                    ))}
                </Grid>
            </motion.div>
        </Box>
    )
}
