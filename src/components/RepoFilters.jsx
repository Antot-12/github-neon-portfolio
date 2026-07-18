import React from 'react'
import {
    Box,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    TextField,
    IconButton,
    Tooltip,
    Paper,
    InputAdornment,
    Chip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import TuneIcon from '@mui/icons-material/Tune'

function RepoFilters({
                         languages,
                         tags,
                         selectedLanguage,
                         selectedTag,
                         sortBy,
                         sortOptions,
                         searchText,
                         totalCount,
                         visibleCount,
                         onLanguageChange,
                         onTagChange,
                         onSortChange,
                         onSearchChange,
                         onReset,
                         searchInputRef,
                         onAdvancedFiltersClick,
                         hasAdvancedFilters
                     }) {
    const hasSearch = Boolean(searchText && searchText.trim().length > 0)
    const hasLanguageFilter = selectedLanguage && selectedLanguage !== 'All'
    const defaultSort = sortOptions && sortOptions.length > 0 ? sortOptions[0] : ''
    const hasSortCustom = sortBy && defaultSort && sortBy !== defaultSort
    const hasTagFilter = selectedTag && selectedTag !== 'All'
    const activeFiltersCount = [hasSearch, hasLanguageFilter, hasSortCustom, hasTagFilter].filter(
        Boolean
    ).length
    const hasActiveFilters = activeFiltersCount > 0

    const handleSearchChange = event => {
        onSearchChange(event.target.value)
    }

    const handleSearchKeyDown = event => {
        if (event.key === 'Escape') {
            onSearchChange('')
        }
    }

    return (
        <Paper elevation={0} sx={{ p: 2.4 }}>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2.2}
                alignItems="flex-start"
            >
                <TextField
                    size="small"
                    fullWidth
                    value={searchText}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    inputRef={searchInputRef}
                    placeholder="Search by name or description"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                            </InputAdornment>
                        )
                    }}
                />
                <FormControl fullWidth size="small">
                    <InputLabel id="sort-label">Sort</InputLabel>
                    <Select
                        labelId="sort-label"
                        label="Sort"
                        value={sortBy}
                        onChange={e => onSortChange(e.target.value)}
                    >
                        {sortOptions.map(option => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                    <InputLabel id="language-label">Language</InputLabel>
                    <Select
                        labelId="language-label"
                        label="Language"
                        value={selectedLanguage}
                        onChange={e => onLanguageChange(e.target.value)}
                    >
                        {languages.map(lang => (
                            <MenuItem key={lang} value={lang}>
                                {lang}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Tooltip title="Advanced Filters">
                    <IconButton
                        onClick={onAdvancedFiltersClick}
                        sx={{
                            borderRadius: 999,
                            border: '1px solid',
                            borderColor: hasAdvancedFilters ? 'primary.main' : 'divider',
                            bgcolor: hasAdvancedFilters ? 'rgba(34,211,238,0.08)' : 'transparent',
                            alignSelf: { xs: 'flex-end', md: 'center' },
                            mt: { xs: 0.5, md: 0 }
                        }}
                    >
                        <TuneIcon sx={{ fontSize: 20, color: hasAdvancedFilters ? 'primary.main' : 'text.secondary' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Reset filters">
                    <IconButton
                        onClick={onReset}
                        sx={{
                            borderRadius: 999,
                            border: '1px solid',
                            borderColor: 'divider',
                            alignSelf: { xs: 'flex-end', md: 'center' },
                            mt: { xs: 0.5, md: 0 }
                        }}
                    >
                        <RestartAltIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </IconButton>
                </Tooltip>
            </Stack>

            <Box
                sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    flexWrap: 'wrap'
                }}
            >
                <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block' }}
                >
                    Showing {visibleCount} of {totalCount} repositories.
                </Typography>
                {hasActiveFilters && (
                    <Chip
                        label={`Filters active: ${activeFiltersCount}`}
                        size="small"
                        sx={{
                            borderRadius: 999,
                            fontSize: 11,
                            borderColor: 'primary.main',
                            bgcolor: 'rgba(34,211,238,0.1)',
                            color: 'primary.main'
                        }}
                        variant="outlined"
                    />
                )}
            </Box>
        </Paper>
    )
}

export default RepoFilters
