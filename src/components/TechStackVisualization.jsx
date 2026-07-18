import React, { useMemo } from 'react'
import { Box, Paper, Typography, Chip, Stack, Grid } from '@mui/material'
import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import { motion } from 'framer-motion'
import CodeIcon from '@mui/icons-material/Code'
import CategoryIcon from '@mui/icons-material/Category'

const CATEGORY_COLORS = ['#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63']

export default function TechStackVisualization({ repos }) {
    const techStackData = useMemo(() => {
        // Calculate technology usage
        const techCount = {}
        const frameworkCount = {}

        repos.forEach(repo => {
            // Count primary languages
            if (repo.language) {
                techCount[repo.language] = (techCount[repo.language] || 0) + 1
            }

            // Count frameworks from topics
            if (repo.topics) {
                const frameworks = repo.topics.filter(t =>
                    ['react', 'vue', 'angular', 'svelte', 'nextjs', 'express',
                     'django', 'flask', 'spring', 'nodejs', 'typescript', 'python',
                     'java', 'kotlin', 'swift', 'rust', 'go'].includes(t.toLowerCase())
                )
                frameworks.forEach(fw => {
                    frameworkCount[fw] = (frameworkCount[fw] || 0) + 1
                })
            }
        })

        // Categorize projects
        const categories = {
            'Web Apps': 0,
            'CLI Tools': 0,
            'Libraries': 0,
            'Learning': 0,
            'Automation': 0,
            'Other': 0
        }

        repos.forEach(repo => {
            const name = repo.name.toLowerCase()
            const desc = (repo.description || '').toLowerCase()
            const topics = repo.topics || []
            const topicsStr = topics.join(' ').toLowerCase()

            // Web Apps
            if (
                topics.includes('webapp') ||
                topics.includes('website') ||
                topics.includes('react') ||
                topics.includes('vue') ||
                topics.includes('nextjs') ||
                name.includes('portfolio') ||
                name.includes('blog') ||
                name.includes('site') ||
                desc.includes('web app') ||
                desc.includes('website')
            ) {
                categories['Web Apps']++
            }
            // CLI Tools
            else if (
                topics.includes('cli') ||
                topics.includes('command-line') ||
                name.includes('cli') ||
                name.includes('cmd') ||
                desc.includes('command-line') ||
                desc.includes('terminal')
            ) {
                categories['CLI Tools']++
            }
            // Libraries
            else if (
                topics.includes('library') ||
                topics.includes('package') ||
                topics.includes('module') ||
                name.includes('lib') ||
                name.includes('package') ||
                desc.includes('library') ||
                desc.includes('reusable')
            ) {
                categories['Libraries']++
            }
            // Learning Projects
            else if (
                topics.includes('learning') ||
                topics.includes('tutorial') ||
                topics.includes('practice') ||
                topics.includes('course') ||
                name.includes('learn') ||
                name.includes('tutorial') ||
                name.includes('practice') ||
                name.includes('exercise') ||
                desc.includes('learning') ||
                desc.includes('practice')
            ) {
                categories['Learning']++
            }
            // Automation
            else if (
                topics.includes('automation') ||
                topics.includes('bot') ||
                topics.includes('script') ||
                name.includes('bot') ||
                name.includes('auto') ||
                name.includes('script') ||
                desc.includes('automation') ||
                desc.includes('bot')
            ) {
                categories['Automation']++
            }
            // Other
            else {
                categories['Other']++
            }
        })

        const categoryData = Object.entries(categories)
            .filter(([, value]) => value > 0)
            .map(([name, value]) => ({ name, value }))

        // Prepare radar chart data (top 6 languages)
        const radarData = Object.entries(techCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([tech, count]) => ({
                technology: tech,
                projects: count,
                fullMark: repos.length
            }))

        // Framework breakdown
        const topFrameworks = Object.entries(frameworkCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)

        return { radarData, topFrameworks, techCount, categoryData }
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
                    <Typography variant="body2" sx={{ color: '#22d3ee' }}>
                        {payload[0].payload.technology}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        {payload[0].value} projects
                    </Typography>
                </Paper>
            )
        }
        return null
    }

    return (
        <Grid container spacing={3}>
            {/* Technology Radar Chart */}
            <Grid item xs={12} md={6}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: '1px solid rgba(31, 41, 55, 1)',
                            bgcolor: '#0f172a',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                            <CodeIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                            <Typography variant="h6" sx={{ color: 'primary.main' }}>
                                Technology Radar
                            </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                            Your primary technology stack usage
                        </Typography>

                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={techStackData.radarData}>
                                    <PolarGrid stroke="#1e293b" />
                                    <PolarAngleAxis
                                        dataKey="technology"
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <PolarRadiusAxis
                                        angle={90}
                                        domain={[0, 'dataMax']}
                                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                                    />
                                    <Radar
                                        name="Projects"
                                        dataKey="projects"
                                        stroke="#22d3ee"
                                        fill="#22d3ee"
                                        fillOpacity={0.6}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </motion.div>
            </Grid>

            {/* Project Categories */}
            <Grid item xs={12} md={6}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: '1px solid rgba(31, 41, 55, 1)',
                            bgcolor: '#0f172a',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                            <CategoryIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                            <Typography variant="h6" sx={{ color: 'primary.main' }}>
                                Project Categories
                            </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                            Distribution of project types
                        </Typography>

                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={techStackData.categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={90}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {techStackData.categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Category Legend */}
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                                {techStackData.categoryData.map((category, index) => (
                                    <Chip
                                        key={category.name}
                                        label={`${category.name}: ${category.value}`}
                                        size="small"
                                        sx={{
                                            bgcolor: `${CATEGORY_COLORS[index % CATEGORY_COLORS.length]}15`,
                                            color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                                            border: `1px solid ${CATEGORY_COLORS[index % CATEGORY_COLORS.length]}30`,
                                            fontWeight: 500,
                                            fontSize: 11
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Paper>
                </motion.div>
            </Grid>

            {/* All Languages Used */}
            <Grid item xs={12}>
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
                        <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
                            All Languages Used ({Object.keys(techStackData.techCount).length})
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {Object.entries(techStackData.techCount)
                                .sort(([, a], [, b]) => b - a)
                                .map(([lang, count]) => (
                                    <Chip
                                        key={lang}
                                        label={`${lang} (${count})`}
                                        sx={{
                                            bgcolor: 'rgba(34, 211, 238, 0.1)',
                                            color: 'primary.main',
                                            border: '1px solid rgba(34, 211, 238, 0.3)',
                                            '&:hover': {
                                                bgcolor: 'rgba(34, 211, 238, 0.15)'
                                            }
                                        }}
                                    />
                                ))}
                        </Box>
                    </Paper>
                </motion.div>
            </Grid>
        </Grid>
    )
}
