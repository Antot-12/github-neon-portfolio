import React, { useMemo } from 'react'
import { Box, Paper, Typography, Stack, Chip, Divider } from '@mui/material'
import { motion } from 'framer-motion'
import CategoryIcon from '@mui/icons-material/Category'
import { groupReposByTopics } from '../utils/recommendations'

export default function TopicGroups({ repos, onTopicClick }) {
    const groupedRepos = useMemo(() => {
        const groups = groupReposByTopics(repos)
        // Sort by group size (most repos first)
        return Object.entries(groups)
            .sort(([, a], [, b]) => b.length - a.length)
            .slice(0, 8) // Show top 8 groups
    }, [repos])

    if (groupedRepos.length === 0) {
        return null
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    border: '1px solid rgba(31, 41, 55, 1)',
                    bgcolor: '#0f172a'
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                    <CategoryIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                    <Box>
                        <Typography variant="h6" sx={{ color: 'primary.main' }}>
                            Project Collections
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.3 }}>
                            Automatically grouped by shared topics
                        </Typography>
                    </Box>
                </Stack>

                <Stack spacing={2}>
                    {groupedRepos.map(([topic, topicRepos], index) => (
                        <Box key={topic}>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: 'rgba(15, 23, 42, 0.5)',
                                    border: '1px solid rgba(31, 41, 55, 0.5)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        bgcolor: 'rgba(34, 211, 238, 0.05)'
                                    }
                                }}
                                onClick={() => onTopicClick && onTopicClick(topic)}
                            >
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" sx={{ color: '#e5e7eb', mb: 0.5 }}>
                                        {topic}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {topicRepos.length} {topicRepos.length === 1 ? 'repository' : 'repositories'}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={topicRepos.length}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(34, 211, 238, 0.12)',
                                        color: 'primary.main',
                                        fontWeight: 600,
                                        minWidth: 40
                                    }}
                                />
                            </Stack>
                            {index < groupedRepos.length - 1 && (
                                <Divider sx={{ my: 1, borderColor: 'rgba(31, 41, 55, 0.3)' }} />
                            )}
                        </Box>
                    ))}
                </Stack>
            </Paper>
        </motion.div>
    )
}
