import React, { useMemo } from 'react'
import { Box, Paper, Typography, Stack, Chip, LinearProgress, Grid } from '@mui/material'
import { motion } from 'framer-motion'
import FolderIcon from '@mui/icons-material/Folder'
import DescriptionIcon from '@mui/icons-material/Description'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

// Estimate file types from language and topics
function estimateFileTypes(repo) {
    const fileTypes = []

    // Based on language
    const languageFiles = {
        'JavaScript': ['.js', '.jsx', '.json'],
        'TypeScript': ['.ts', '.tsx'],
        'Python': ['.py', '.ipynb'],
        'Java': ['.java', '.class'],
        'C++': ['.cpp', '.h', '.hpp'],
        'C': ['.c', '.h'],
        'Go': ['.go'],
        'Rust': ['.rs'],
        'Ruby': ['.rb'],
        'PHP': ['.php'],
        'Swift': ['.swift'],
        'Kotlin': ['.kt'],
        'C#': ['.cs'],
        'HTML': ['.html', '.htm'],
        'CSS': ['.css', '.scss', '.sass'],
        'Shell': ['.sh', '.bash']
    }

    if (repo.language && languageFiles[repo.language]) {
        fileTypes.push(...languageFiles[repo.language])
    }

    // Based on topics
    const topics = repo.topics || []
    if (topics.includes('react') || topics.includes('nextjs')) {
        fileTypes.push('.jsx', '.tsx')
    }
    if (topics.includes('vue')) {
        fileTypes.push('.vue')
    }
    if (topics.includes('svelte')) {
        fileTypes.push('.svelte')
    }
    if (topics.includes('typescript')) {
        fileTypes.push('.ts', '.tsx')
    }

    // Common config files
    fileTypes.push('.json', '.yml', '.yaml', '.md', '.txt')

    return [...new Set(fileTypes)]
}

export default function CodeStatistics({ repo }) {
    const stats = useMemo(() => {
        const size = repo.size || 0
        const estimatedLoc = Math.max(50, Math.round(size * 20))

        // Estimate file types
        const fileTypes = estimateFileTypes(repo)

        // Estimate file distribution
        const totalFiles = Math.max(10, Math.round(size / 10))

        // Create distribution based on language
        const distribution = []
        if (repo.language) {
            const primaryPercent = 0.6
            distribution.push({
                type: `${repo.language} files`,
                count: Math.round(totalFiles * primaryPercent),
                percent: primaryPercent * 100
            })
        }

        // Config files
        const configPercent = 0.15
        distribution.push({
            type: 'Config files',
            count: Math.round(totalFiles * configPercent),
            percent: configPercent * 100
        })

        // Documentation
        const docsPercent = 0.1
        distribution.push({
            type: 'Documentation',
            count: Math.round(totalFiles * docsPercent),
            percent: docsPercent * 100
        })

        // Other
        const otherPercent = 1 - (distribution.reduce((sum, d) => sum + d.percent, 0) / 100)
        distribution.push({
            type: 'Other',
            count: Math.round(totalFiles * otherPercent),
            percent: otherPercent * 100
        })

        // Estimate directory structure
        const hasTests = (repo.topics || []).some(t => ['testing', 'jest', 'mocha', 'pytest'].includes(t))
        const hasDocs = repo.description && repo.description.length > 50

        const structure = [
            { name: 'src/', type: 'Source code', present: true },
            { name: 'tests/', type: 'Test files', present: hasTests },
            { name: 'docs/', type: 'Documentation', present: hasDocs },
            { name: 'config/', type: 'Configuration', present: size > 500 },
            { name: 'scripts/', type: 'Build scripts', present: size > 1000 },
            { name: 'public/', type: 'Static assets', present: (repo.topics || []).includes('web') }
        ].filter(dir => dir.present)

        return {
            estimatedLoc,
            totalFiles,
            fileTypes,
            distribution,
            structure,
            size
        }
    }, [repo])

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    return (
        <Stack spacing={3}>
            {/* Overview Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: '1px solid rgba(31, 41, 55, 1)',
                        bgcolor: '#0f172a'
                    }}
                >
                    <Typography variant="h6" sx={{ color: 'primary.main', mb: 3 }}>
                        Code Statistics
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Stack spacing={1} alignItems="center">
                                <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                                <Typography variant="h4" sx={{ color: '#e5e7eb', fontWeight: 600 }}>
                                    ~{formatNumber(stats.estimatedLoc)}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Lines of Code
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Stack spacing={1} alignItems="center">
                                <InsertDriveFileIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                                <Typography variant="h4" sx={{ color: '#e5e7eb', fontWeight: 600 }}>
                                    ~{stats.totalFiles}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Files
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Stack spacing={1} alignItems="center">
                                <FolderIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                                <Typography variant="h4" sx={{ color: '#e5e7eb', fontWeight: 600 }}>
                                    {stats.structure.length}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Key Directories
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>
            </motion.div>

            {/* File Type Breakdown */}
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
                    <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 2 }}>
                        File Distribution
                    </Typography>

                    <Stack spacing={2}>
                        {stats.distribution.map((item, index) => (
                            <Box key={index}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ mb: 0.5 }}
                                >
                                    <Typography variant="body2" sx={{ color: '#e5e7eb' }}>
                                        {item.type}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            {item.count} files
                                        </Typography>
                                        <Chip
                                            label={`${item.percent.toFixed(0)}%`}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(34, 211, 238, 0.12)',
                                                color: 'primary.main',
                                                height: 20,
                                                fontSize: 10
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={item.percent}
                                    sx={{
                                        height: 6,
                                        borderRadius: 999,
                                        bgcolor: 'rgba(31, 41, 55, 1)',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: 'primary.main',
                                            borderRadius: 999
                                        }
                                    }}
                                />
                            </Box>
                        ))}
                    </Stack>
                </Paper>
            </motion.div>

            {/* File Types Used */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: '1px solid rgba(31, 41, 55, 1)',
                        bgcolor: '#0f172a'
                    }}
                >
                    <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 2 }}>
                        File Types ({stats.fileTypes.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {stats.fileTypes.map(type => (
                            <Chip
                                key={type}
                                label={type}
                                size="small"
                                sx={{
                                    bgcolor: 'rgba(31, 41, 55, 0.8)',
                                    color: '#e5e7eb',
                                    fontFamily: 'monospace',
                                    fontSize: 11
                                }}
                            />
                        ))}
                    </Box>
                </Paper>
            </motion.div>

            {/* Repository Structure */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: '1px solid rgba(31, 41, 55, 1)',
                        bgcolor: '#0f172a'
                    }}
                >
                    <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 2 }}>
                        Estimated Directory Structure
                    </Typography>
                    <Stack spacing={1}>
                        {stats.structure.map((dir, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: 1.5,
                                    bgcolor: 'rgba(15, 23, 42, 0.5)',
                                    border: '1px solid rgba(31, 41, 55, 0.5)',
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5
                                }}
                            >
                                <FolderIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#e5e7eb',
                                            fontFamily: 'monospace',
                                            fontWeight: 500
                                        }}
                                    >
                                        {dir.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {dir.type}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Stack>

                    <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', display: 'block', mt: 2, fontStyle: 'italic' }}
                    >
                        Note: Structure estimated from repository metadata and common patterns
                    </Typography>
                </Paper>
            </motion.div>
        </Stack>
    )
}
