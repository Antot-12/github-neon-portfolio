import React, { useMemo, useState } from 'react'
import { Box, Paper, Typography, Grid, Stack, Chip } from '@mui/material'
import {
    PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    Tooltip, Legend, LineChart, Line, AreaChart, Area, CartesianGrid
} from 'recharts'
import { motion } from 'framer-motion'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CodeIcon from '@mui/icons-material/Code'
import StarIcon from '@mui/icons-material/Star'
import CommitIcon from '@mui/icons-material/Commit'
import TechStackVisualization from '../components/TechStackVisualization'
import ContributionTimeline from '../components/ContributionTimeline'
import AnalyticsControls from '../components/AnalyticsControls'
import GrowthMetrics from '../components/GrowthMetrics'
import RepositoryHealth from '../components/RepositoryHealth'
import Achievements from '../components/Achievements'

const COLORS = ['#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63']

export default function AnalyticsDashboard({ repos }) {
    const [dateRange, setDateRange] = useState(null)
    const [chartType, setChartType] = useState('bar')
    const [selectedLanguage, setSelectedLanguage] = useState(null)

    const analytics = useMemo(() => {
        // Filter repos based on date range
        let filteredRepos = repos
        if (dateRange) {
            const cutoffDate = new Date()
            cutoffDate.setDate(cutoffDate.getDate() - dateRange)
            filteredRepos = repos.filter(r => new Date(r.created_at) >= cutoffDate)
        }

        // Filter by selected language
        if (selectedLanguage) {
            filteredRepos = filteredRepos.filter(r => r.language === selectedLanguage)
        }

        const totalLoc = filteredRepos.reduce((sum, r) => sum + (r.size ? r.size * 20 : 0), 0)
        const totalStars = filteredRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
        const totalCommits = filteredRepos.reduce((sum, r) => sum + (r.commitsCount || 0), 0)

        // Calculate total unique languages
        const uniqueLanguages = new Set(filteredRepos.map(r => r.language).filter(Boolean)).size

        // Language distribution
        const langMap = {}
        filteredRepos.forEach(r => {
            if (r.language) {
                langMap[r.language] = (langMap[r.language] || 0) + 1
            }
        })
        const languageData = Object.entries(langMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6)

        // Repository creation timeline - by month with cumulative count
        const timelineMap = {}
        const sortedByDate = [...filteredRepos].sort((a, b) =>
            new Date(a.created_at) - new Date(b.created_at)
        )

        let cumulative = 0
        sortedByDate.forEach(r => {
            if (r.created_at) {
                const date = new Date(r.created_at)
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                if (!timelineMap[key]) {
                    timelineMap[key] = {
                        key,
                        label,
                        count: 0,
                        cumulative: 0,
                        repos: [],
                        year: date.getFullYear()
                    }
                }
                timelineMap[key].count++
                cumulative++
                timelineMap[key].cumulative = cumulative
                timelineMap[key].repos.push(r.name)
            }
        })
        const timeline = Object.values(timelineMap)
            .sort((a, b) => a.key.localeCompare(b.key))

        // Calculate peak month
        const peakMonth = timeline.reduce((max, item) =>
            item.count > (max?.count || 0) ? item : max
        , null)

        // Calculate average repos per month
        const avgPerMonth = timeline.length > 0
            ? (filteredRepos.length / timeline.length).toFixed(1)
            : 0

        // Commit frequency (group by months in last year)
        const lastYear = new Date()
        lastYear.setFullYear(lastYear.getFullYear() - 1)
        const commitFrequency = {}
        filteredRepos.forEach(r => {
            const updated = r.pushed_at || r.updated_at
            if (updated && new Date(updated) >= lastYear) {
                const month = new Date(updated).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                commitFrequency[month] = (commitFrequency[month] || 0) + 1
            }
        })
        const commitData = Object.entries(commitFrequency)
            .map(([month, updates]) => ({ month, updates }))
            .slice(-12)

        return {
            totalLoc,
            totalStars,
            totalCommits,
            uniqueLanguages,
            languageData,
            timeline,
            peakMonth,
            avgPerMonth,
            commitData,
            filteredCount: filteredRepos.length,
            filteredRepos // Export filtered repos for other components
        }
    }, [repos, dateRange, selectedLanguage])

    const StatCard = ({ icon, label, value, color = 'primary.main' }) => (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                border: '1px solid rgba(31, 41, 55, 1)',
                bgcolor: '#0f172a'
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center">
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'rgba(34, 211, 238, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {icon}
                </Box>
                <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {label}
                    </Typography>
                    <Typography variant="h5" sx={{ color, fontWeight: 600 }}>
                        {value.toLocaleString()}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    )

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        bgcolor: '#0f172a',
                        border: '2px solid rgba(34, 211, 238, 0.5)',
                        minWidth: 200,
                        maxWidth: 300
                    }}
                >
                    <Typography variant="subtitle2" sx={{ color: '#22d3ee', fontWeight: 700, mb: 1.5 }}>
                        {data.label}
                    </Typography>

                    <Stack spacing={1} sx={{ mb: data.repos ? 1.5 : 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Created this month:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#e5e7eb', fontWeight: 600 }}>
                                {data.count || payload[0].value}
                            </Typography>
                        </Box>
                        {data.cumulative && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Total repositories:
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                    {data.cumulative}
                                </Typography>
                            </Box>
                        )}
                    </Stack>

                    {data.repos && data.repos.length > 0 && (
                        <Box sx={{ pt: 1.5, borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.8, fontWeight: 600 }}>
                                Repositories:
                            </Typography>
                            {data.repos.slice(0, 5).map((repo, idx) => (
                                <Typography key={idx} variant="caption" sx={{ color: '#94a3b8', display: 'block', lineHeight: 1.8 }}>
                                    • {repo}
                                </Typography>
                            ))}
                            {data.repos.length > 5 && (
                                <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mt: 0.5 }}>
                                    +{data.repos.length - 5} more...
                                </Typography>
                            )}
                        </Box>
                    )}
                </Paper>
            )
        }
        return null
    }

    return (
        <Box sx={{ py: 1 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2, textAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Box>
                        <Typography variant="h4" className="neon-text">
                            Analytics Dashboard
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {dateRange || selectedLanguage
                                ? `Filtered: ${analytics.filteredCount} of ${repos.length} repositories`
                                : 'Comprehensive overview of your portfolio statistics'}
                        </Typography>
                        <Chip
                            label="Public repositories only"
                            size="small"
                            sx={{
                                mt: 1,
                                bgcolor: 'rgba(34, 211, 238, 0.1)',
                                color: 'primary.main',
                                border: '1px solid rgba(34, 211, 238, 0.3)',
                                fontSize: 11
                            }}
                        />
                    </Box>
                </Stack>

                {/* Analytics Controls */}
                <AnalyticsControls
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    chartType={chartType}
                    onChartTypeChange={setChartType}
                    languages={analytics.languageData.map(item => item.name)}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                />

                {/* Summary Cards */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<CodeIcon sx={{ color: 'primary.main' }} />}
                            label="Total Lines of Code"
                            value={analytics.totalLoc}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<StarIcon sx={{ color: 'primary.main' }} />}
                            label="Total Stars"
                            value={analytics.totalStars}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<CodeIcon sx={{ color: 'primary.main' }} />}
                            label="Languages Used"
                            value={analytics.uniqueLanguages}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<TrendingUpIcon sx={{ color: 'primary.main' }} />}
                            label="Open Repositories"
                            value={analytics.filteredCount}
                        />
                    </Grid>
                </Grid>

                {/* Charts */}
                <Grid container spacing={3}>
                    {/* Language Distribution Pie Chart */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid rgba(31, 41, 55, 1)',
                                bgcolor: '#0f172a',
                                height: '100%'
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                Language Distribution
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={analytics.languageData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {analytics.languageData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Repository Timeline */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid rgba(31, 41, 55, 1)',
                                bgcolor: '#0f172a',
                                height: '100%'
                            }}
                        >
                            <Stack spacing={2}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="h6" sx={{ color: 'primary.main', mb: 0.5 }}>
                                            Repository Creation Timeline
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Growth over time with cumulative total
                                        </Typography>
                                    </Box>
                                    <Stack spacing={0.5} alignItems="flex-end">
                                        <Chip
                                            label={`${analytics.filteredCount} total`}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(34, 211, 238, 0.15)',
                                                color: 'primary.main',
                                                fontWeight: 600,
                                                fontSize: 11
                                            }}
                                        />
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Avg: {analytics.avgPerMonth}/month
                                        </Typography>
                                    </Stack>
                                </Stack>

                                {analytics.peakMonth && (
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            bgcolor: 'rgba(34, 211, 238, 0.05)',
                                            border: '1px solid rgba(34, 211, 238, 0.2)',
                                            borderRadius: 1
                                        }}
                                    >
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <TrendingUpIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                Peak month:
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                                {analytics.peakMonth.label}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                ({analytics.peakMonth.count} repos)
                                            </Typography>
                                        </Stack>
                                    </Box>
                                )}
                            </Stack>

                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={analytics.timeline}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
                                        </linearGradient>
                                        <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis
                                        dataKey="label"
                                        stroke="#94a3b8"
                                        angle={-45}
                                        textAnchor="end"
                                        height={90}
                                        interval={Math.max(0, Math.floor(analytics.timeline.length / 6))}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        stroke="#22d3ee"
                                        allowDecimals={false}
                                        label={{ value: 'Monthly', angle: -90, position: 'insideLeft', style: { fill: '#22d3ee', fontSize: 11 } }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="#10b981"
                                        allowDecimals={false}
                                        label={{ value: 'Total', angle: 90, position: 'insideRight', style: { fill: '#10b981', fontSize: 11 } }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        wrapperStyle={{ paddingTop: '10px' }}
                                        iconType="circle"
                                    />
                                    <Area
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="count"
                                        name="Monthly Created"
                                        stroke="#22d3ee"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                        dot={{ fill: '#22d3ee', r: 3 }}
                                        activeDot={{ r: 6, stroke: '#22d3ee', strokeWidth: 2 }}
                                    />
                                    <Area
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="cumulative"
                                        name="Cumulative Total"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        fillOpacity={1}
                                        fill="url(#colorCumulative)"
                                        dot={false}
                                        activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Activity Heatmap (Last 12 months) */}
                <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
                    <Grid item xs={12}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid rgba(31, 41, 55, 1)',
                                bgcolor: '#0f172a'
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                Activity Frequency (Last Year)
                            </Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={analytics.commitData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="month" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="updates"
                                        stroke="#22d3ee"
                                        strokeWidth={2}
                                        dot={{ fill: '#22d3ee', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Repository Health */}
                <Box sx={{ my: 4 }}>
                    <RepositoryHealth repos={analytics.filteredRepos} />
                </Box>

                {/* Achievements */}
                <Box sx={{ my: 4 }}>
                    <Achievements repos={analytics.filteredRepos} />
                </Box>

                {/* Tech Stack Visualization */}
                <Box sx={{ my: 4 }}>
                    <Typography variant="h5" sx={{ color: 'primary.main', mb: 3 }}>
                        Technology Stack
                    </Typography>
                    <TechStackVisualization repos={analytics.filteredRepos} />
                </Box>

                {/* Contribution Timeline */}
                <Box sx={{ my: 4 }}>
                    <Typography variant="h5" sx={{ color: 'primary.main', mb: 3 }}>
                        Contribution History
                    </Typography>
                    <ContributionTimeline repos={analytics.filteredRepos} />
                </Box>
            </motion.div>
        </Box>
    )
}
