import React from 'react'
import { Box, Paper, Stack, ToggleButtonGroup, ToggleButton, Chip } from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChart'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import TimelineIcon from '@mui/icons-material/Timeline'
import FilterListIcon from '@mui/icons-material/FilterList'

export default function AnalyticsControls({
    dateRange,
    onDateRangeChange,
    chartType,
    onChartTypeChange,
    languages,
    selectedLanguage,
    onLanguageChange
}) {
    const dateRanges = [
        { label: '30D', value: 30 },
        { label: '90D', value: 90 },
        { label: '6M', value: 180 },
        { label: '1Y', value: 365 },
        { label: 'All', value: null }
    ]

    const chartTypes = [
        { icon: <BarChartIcon />, value: 'bar', label: 'Bar' },
        { icon: <ShowChartIcon />, value: 'line', label: 'Line' },
        { icon: <TimelineIcon />, value: 'area', label: 'Area' }
    ]

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                mb: 3,
                border: '1px solid rgba(31, 41, 55, 1)',
                bgcolor: '#0f172a',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
        >
            {/* Date Range Selector */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                <FilterListIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                {dateRanges.map(range => (
                    <Chip
                        key={range.value || 'all'}
                        label={range.label}
                        onClick={() => onDateRangeChange(range.value)}
                        sx={{
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: dateRange === range.value ? 'primary.main' : 'rgba(148, 163, 184, 0.3)',
                            bgcolor: dateRange === range.value ? 'rgba(34, 211, 238, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                            color: dateRange === range.value ? 'primary.main' : '#94a3b8',
                            cursor: 'pointer',
                            fontWeight: dateRange === range.value ? 600 : 400,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                bgcolor: 'rgba(34, 211, 238, 0.1)',
                                borderColor: 'primary.main'
                            }
                        }}
                    />
                ))}
            </Stack>

            {/* Chart Type Toggle */}
            <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={(e, value) => value && onChartTypeChange(value)}
                size="small"
                sx={{
                    '& .MuiToggleButton-root': {
                        border: '1px solid',
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                        color: '#94a3b8',
                        bgcolor: 'rgba(15, 23, 42, 0.5)',
                        px: 2,
                        py: 1,
                        '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'rgba(34, 211, 238, 0.08)'
                        },
                        '&.Mui-selected': {
                            bgcolor: 'rgba(34, 211, 238, 0.15)',
                            color: 'primary.main',
                            borderColor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'rgba(34, 211, 238, 0.2)'
                            }
                        }
                    }
                }}
            >
                {chartTypes.map(type => (
                    <ToggleButton key={type.value} value={type.value} aria-label={type.label}>
                        {type.icon}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>

            {/* Language Filter */}
            {languages && languages.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
                    {languages.slice(0, 5).map(lang => (
                        <Chip
                            key={lang}
                            label={lang}
                            size="small"
                            onClick={() => onLanguageChange(selectedLanguage === lang ? null : lang)}
                            sx={{
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: selectedLanguage === lang ? 'primary.main' : 'rgba(148, 163, 184, 0.3)',
                                bgcolor: selectedLanguage === lang ? 'rgba(34, 211, 238, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                                color: selectedLanguage === lang ? 'primary.main' : '#94a3b8',
                                cursor: 'pointer',
                                fontSize: 11,
                                fontWeight: selectedLanguage === lang ? 600 : 400,
                                '&:hover': {
                                    bgcolor: 'rgba(34, 211, 238, 0.1)',
                                    borderColor: 'primary.main'
                                }
                            }}
                        />
                    ))}
                </Stack>
            )}
        </Paper>
    )
}
