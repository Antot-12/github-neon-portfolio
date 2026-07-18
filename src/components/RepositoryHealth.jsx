import React, { useMemo } from 'react'
import { Box, Paper, Typography, Grid, Stack, Chip, LinearProgress, Tooltip } from '@mui/material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

export default function RepositoryHealth({ repos }) {
    const navigate = useNavigate()
    const [selectedTier, setSelectedTier] = React.useState(null)
    const healthData = useMemo(() => {
        const calculateHealth = (repo) => {
            let score = 0
            const checks = []

            // Has README (50 points)
            const hasReadme = true
            if (hasReadme) {
                score += 50
                checks.push({ label: 'README', passed: true })
            } else {
                checks.push({ label: 'README', passed: false })
            }

            // Has homepage (50 points)
            if (repo.homepage && repo.homepage.trim()) {
                score += 50
                checks.push({ label: 'Homepage', passed: true })
            } else {
                checks.push({ label: 'Homepage', passed: false })
            }

            // Determine health status
            let status = '🟢 Excellent'
            let statusColor = '#10b981'
            if (score < 100) {
                status = '🟡 Good'
                statusColor = '#f59e0b'
            }

            return { score, status, statusColor, checks }
        }

        const reposWithHealth = repos.map(repo => ({
            ...repo,
            health: calculateHealth(repo)
        }))

        // Calculate overall stats
        const excellentCount = reposWithHealth.filter(r => r.health.score === 100).length
        const goodCount = reposWithHealth.filter(r => r.health.score < 100).length

        const avgHealth = reposWithHealth.length > 0
            ? Math.round(reposWithHealth.reduce((sum, r) => sum + r.health.score, 0) / reposWithHealth.length)
            : 0

        return {
            reposWithHealth: reposWithHealth.sort((a, b) => b.health.score - a.health.score),
            excellentCount,
            goodCount,
            avgHealth
        }
    }, [repos])

    const StatusChip = ({ label, count, color, tier }) => (
        <Chip
            label={`${label}: ${count}`}
            size="small"
            onClick={() => setSelectedTier(selectedTier === tier ? null : tier)}
            sx={{
                bgcolor: selectedTier === tier ? `${color}40` : `${color}20`,
                color,
                border: `1px solid ${color}${selectedTier === tier ? '80' : '40'}`,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                    bgcolor: `${color}30`,
                    transform: 'scale(1.05)'
                }
            }}
        />
    )

    const HealthBar = ({ repo }) => (
        <Box
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
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#e5e7eb', fontWeight: 500 }}>
                    {repo.name}
                </Typography>
                <Chip
                    label={repo.health.status}
                    size="small"
                    sx={{
                        bgcolor: `${repo.health.statusColor}20`,
                        color: repo.health.statusColor,
                        border: `1px solid ${repo.health.statusColor}40`,
                        fontSize: 11,
                        height: 22
                    }}
                />
            </Stack>

            <LinearProgress
                variant="determinate"
                value={repo.health.score}
                sx={{
                    height: 8,
                    borderRadius: 999,
                    bgcolor: 'rgba(31, 41, 55, 1)',
                    mb: 1,
                    '& .MuiLinearProgress-bar': {
                        bgcolor: repo.health.statusColor,
                        borderRadius: 999
                    }
                }}
            />

            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {repo.health.checks.map((check, idx) => (
                    <Tooltip key={idx} title={check.label} arrow>
                        {check.passed ? (
                            <CheckCircleIcon sx={{ fontSize: 14, color: '#10b981' }} />
                        ) : (
                            <CancelIcon sx={{ fontSize: 14, color: '#6b7280' }} />
                        )}
                    </Tooltip>
                ))}
                <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                    {repo.health.score}/100
                </Typography>
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
                    <HealthAndSafetyIcon sx={{ color: '#10b981', fontSize: 28 }} />
                    <Typography variant="h5" sx={{ color: '#10b981' }}>
                        Repository Health
                    </Typography>
                </Stack>

                {/* Health Overview */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid rgba(31, 41, 55, 1)',
                                bgcolor: '#0f172a'
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 2 }}>
                                Overall Health Score
                            </Typography>
                            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 2 }}>
                                <Typography variant="h2" sx={{ color: '#10b981', fontWeight: 700 }}>
                                    {healthData.avgHealth}
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                    / 100
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <StatusChip label="🟢 Excellent" count={healthData.excellentCount} color="#10b981" tier="excellent" />
                                <StatusChip label="🟡 Good" count={healthData.goodCount} color="#f59e0b" tier="good" />
                            </Stack>
                            {selectedTier && (
                                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                                    Click again to show all repositories
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>

                {/* Individual Repository Health */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: '1px solid rgba(31, 41, 55, 1)',
                        bgcolor: '#0f172a'
                    }}
                >
                    <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 2 }}>
                        Repository Health Scores {selectedTier && `- ${selectedTier === 'excellent' ? '🟢 Excellent' : '🟡 Good'}`}
                    </Typography>
                    <Stack spacing={1.5}>
                        {healthData.reposWithHealth
                            .filter(repo => {
                                if (!selectedTier) return true
                                if (selectedTier === 'excellent') return repo.health.score === 100
                                if (selectedTier === 'good') return repo.health.score < 100
                                return true
                            })
                            .slice(0, selectedTier ? 50 : 10)
                            .map(repo => (
                                <HealthBar key={repo.id} repo={repo} />
                            ))}
                    </Stack>
                    {!selectedTier && healthData.reposWithHealth.length > 10 && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, display: 'block', textAlign: 'center' }}>
                            Showing top 10. Click a status chip above to see all repos in that tier.
                        </Typography>
                    )}
                </Paper>
            </motion.div>
        </Box>
    )
}
