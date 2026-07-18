import React, { useState } from 'react'
import {
    Box,
    Paper,
    Typography,
    Slider,
    FormControlLabel,
    Checkbox,
    Stack,
    Chip,
    IconButton,
    Collapse,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import FilterListIcon from '@mui/icons-material/FilterList'

const PROJECT_SIZES = [
    { label: 'Tiny', value: 'tiny', max: 100 },
    { label: 'Small', value: 'small', max: 1000 },
    { label: 'Medium', value: 'medium', max: 10000 },
    { label: 'Large', value: 'large', max: Infinity }
]

export default function AdvancedFilters({
    open,
    onClose,
    minStars,
    maxStars,
    onStarsChange,
    projectSizes,
    onProjectSizesChange,
    hasHomepage,
    onHasHomepageChange,
    dateRange,
    onDateRangeChange
}) {
    const handleSizeToggle = (size) => {
        const newSizes = projectSizes.includes(size)
            ? projectSizes.filter(s => s !== size)
            : [...projectSizes, size]
        onProjectSizesChange(newSizes)
    }

    const hasActiveFilters = minStars > 0 || projectSizes.length > 0 || hasHomepage || dateRange !== null

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#0f172a',
                    border: '1px solid rgba(31, 41, 55, 1)'
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 2
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <FilterListIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                        Advanced Filters
                    </Typography>
                    {hasActiveFilters && (
                        <Chip
                            label="Active"
                            size="small"
                            sx={{
                                bgcolor: 'rgba(34, 211, 238, 0.12)',
                                color: 'primary.main',
                                height: 20,
                                fontSize: 10
                            }}
                        />
                    )}
                </Stack>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: 'rgba(31, 41, 55, 1)' }}>
                <Stack spacing={3}>
                    {/* Star Count Filter */}
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                            Minimum Stars: <strong style={{ color: '#22d3ee' }}>{minStars}</strong>
                        </Typography>
                        <Slider
                            value={minStars}
                            onChange={(e, value) => onStarsChange(value, maxStars)}
                            min={0}
                            max={100}
                            step={1}
                            valueLabelDisplay="auto"
                            sx={{
                                color: 'primary.main',
                                '& .MuiSlider-thumb': {
                                    bgcolor: 'primary.main'
                                },
                                '& .MuiSlider-track': {
                                    bgcolor: 'primary.main'
                                }
                            }}
                        />
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(31, 41, 55, 1)' }} />

                    {/* Project Size Filter */}
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                            Project Size (by repository KB)
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {PROJECT_SIZES.map(size => (
                                    <Chip
                                        key={size.value}
                                        label={size.label}
                                        onClick={() => handleSizeToggle(size.value)}
                                        variant={projectSizes.includes(size.value) ? 'filled' : 'outlined'}
                                        sx={{
                                            borderRadius: 999,
                                            borderColor: 'primary.main',
                                            bgcolor: projectSizes.includes(size.value)
                                                ? 'rgba(34, 211, 238, 0.12)'
                                                : 'transparent',
                                            color: projectSizes.includes(size.value) ? 'primary.main' : 'text.secondary',
                                            '&:hover': {
                                                bgcolor: 'rgba(34, 211, 238, 0.12)',
                                                borderColor: 'primary.main',
                                                color: 'primary.main'
                                            }
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(31, 41, 55, 1)' }} />

                        {/* Has Homepage Filter */}
                        <Box>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={hasHomepage}
                                        onChange={(e) => onHasHomepageChange(e.target.checked)}
                                        sx={{
                                            color: 'rgba(148, 163, 184, 0.7)',
                                            '&.Mui-checked': {
                                                color: 'primary.main'
                                            }
                                        }}
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Only show repos with live demo/homepage
                                    </Typography>
                                }
                            />
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(31, 41, 55, 1)' }} />

                        {/* Date Range Filter */}
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                                Last Updated
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {[
                                    { label: 'Last 7 days', value: 7 },
                                    { label: 'Last 30 days', value: 30 },
                                    { label: 'Last 90 days', value: 90 },
                                    { label: 'Last year', value: 365 },
                                    { label: 'All time', value: null }
                                ].map(option => (
                                    <Chip
                                        key={option.value || 'all'}
                                        label={option.label}
                                        onClick={() => onDateRangeChange(option.value)}
                                        variant={dateRange === option.value ? 'filled' : 'outlined'}
                                        sx={{
                                            borderRadius: 999,
                                            borderColor: 'primary.main',
                                            bgcolor: dateRange === option.value
                                                ? 'rgba(34, 211, 238, 0.12)'
                                                : 'transparent',
                                            color: dateRange === option.value ? 'primary.main' : 'text.secondary',
                                            '&:hover': {
                                                bgcolor: 'rgba(34, 211, 238, 0.12)',
                                                borderColor: 'primary.main',
                                                color: 'primary.main'
                                            }
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} variant="outlined" sx={{ borderColor: 'primary.main', color: 'primary.main' }}>
                        Apply Filters
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

export { PROJECT_SIZES }
