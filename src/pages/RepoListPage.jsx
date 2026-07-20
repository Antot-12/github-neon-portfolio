import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { Box, Grid, Typography, Stack, Chip, Pagination } from '@mui/material'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useGithub } from '../GithubContext'
import RepoFilters from '../components/RepoFilters'
import RepoGrid from '../components/RepoGrid'
import SidebarStats from '../components/SidebarStats'
import LoadingOverlay from '../components/LoadingOverlay'
import ErrorOverlay from '../components/ErrorOverlay'
import RepoCardSkeleton from '../components/RepoCardSkeleton'
import AdvancedFilters, { PROJECT_SIZES } from '../components/AdvancedFilters'

const SORT_OPTIONS = ['Newest', 'Oldest', 'Most commits', 'Fewest commits']
const PAGE_SIZE = 9

const HIDDEN_REPO_NAMES = new Set([
  'site',
  'site2',
  'Bomba_Production',
  'You-are-gay',
  'skills-introduction-to-github',
  'resume-project',
  'LAB_3',
  'LAB_4',
  'Lab_2',
  'Labs',
  'X',
  'antot-12',
  'github-readme-streak-stats'
])

function loadStoredFilters() {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null
  }
  try {
    const raw = window.localStorage.getItem('githubPortfolioFilters')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function RepoListPage() {
  const { repos, loading, error } = useGithub()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const searchInputRef = useRef(null)

  const visibleRepos = useMemo(
      () => repos.filter(r => !HIDDEN_REPO_NAMES.has(r.name)),
      [repos]
  )

  const storedFilters = useMemo(() => loadStoredFilters(), [])

  const initialLanguage = searchParams.get('lang') || storedFilters?.lang || 'All'
  const initialTag = searchParams.get('tag') || storedFilters?.tag || 'All'
  const initialSort = searchParams.get('sort') || storedFilters?.sort || 'Newest'
  const initialSearch = searchParams.get('q') || storedFilters?.search || ''
  const initialPage = Number(searchParams.get('page') || storedFilters?.page || '1')

  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage)
  const [selectedTag, setSelectedTag] = useState(initialTag)
  const [sortBy, setSortBy] = useState(initialSort)
  const [searchText, setSearchText] = useState(initialSearch)
  const [page, setPage] = useState(initialPage)
  const [activeIndex, setActiveIndex] = useState(-1)

  // Advanced filters state
  const [minStars, setMinStars] = useState(0)
  const [maxStars, setMaxStars] = useState(Infinity)
  const [projectSizes, setProjectSizes] = useState([])
  const [hasHomepage, setHasHomepage] = useState(false)
  const [dateRange, setDateRange] = useState(null)
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)

  const filtersInitialized = useRef(false)

  const languages = useMemo(() => {
    const set = new Set()
    visibleRepos.forEach(r => {
      if (r.language) {
        set.add(r.language)
      }
    })
    return ['All', ...Array.from(set).sort()]
  }, [visibleRepos])

  const tags = useMemo(() => {
    const set = new Set()
    visibleRepos.forEach(r => {
      if (Array.isArray(r.topics)) {
        r.topics.forEach(t => set.add(t))
      }
    })
    return ['All', ...Array.from(set).sort()]
  }, [visibleRepos])

  const filteredRepos = useMemo(() => {
    let list = [...visibleRepos]

    if (selectedLanguage !== 'All') {
      list = list.filter(r => r.language === selectedLanguage)
    }

    if (selectedTag !== 'All') {
      list = list.filter(r => Array.isArray(r.topics) && r.topics.includes(selectedTag))
    }

    const q = searchText.trim().toLowerCase()
    if (q) {
      list = list.filter(r => {
        const name = r.name ? r.name.toLowerCase() : ''
        const desc = r.description ? r.description.toLowerCase() : ''
        return name.includes(q) || desc.includes(q)
      })
    }

    // Advanced filters
    if (minStars > 0) {
      list = list.filter(r => (r.stargazers_count || 0) >= minStars)
    }

    if (projectSizes.length > 0) {
      list = list.filter(r => {
        const size = r.size || 0
        return projectSizes.some(sizeKey => {
          const sizeConfig = PROJECT_SIZES.find(s => s.value === sizeKey)
          if (!sizeConfig) return false
          const prevConfig = PROJECT_SIZES[PROJECT_SIZES.indexOf(sizeConfig) - 1]
          const min = prevConfig ? prevConfig.max : 0
          return size >= min && size < sizeConfig.max
        })
      })
    }

    if (hasHomepage) {
      list = list.filter(r => r.homepage && r.homepage.trim() !== '')
    }

    if (dateRange !== null) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - dateRange)
      list = list.filter(r => {
        const updated = r.pushed_at || r.updated_at
        if (!updated) return false
        return new Date(updated) >= cutoffDate
      })
    }

    list.sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at)
      }
      if (sortBy === 'Oldest') {
        return new Date(a.created_at) - new Date(b.created_at)
      }
      if (sortBy === 'Most commits') {
        return (b.commitsCount || 0) - (a.commitsCount || 0)
      }
      if (sortBy === 'Fewest commits') {
        return (a.commitsCount || 0) - (b.commitsCount || 0)
      }
      return 0
    })

    return list
  }, [visibleRepos, selectedLanguage, selectedTag, sortBy, searchText, minStars, projectSizes, hasHomepage, dateRange])

  useEffect(() => {
    if (!filtersInitialized.current) {
      filtersInitialized.current = true
      return
    }
    setPage(1)
    setActiveIndex(-1)
  }, [selectedLanguage, selectedTag, sortBy, searchText, minStars, projectSizes, hasHomepage, dateRange])

  useEffect(() => {
    const params = {}
    if (selectedLanguage !== 'All') params.lang = selectedLanguage
    if (selectedTag !== 'All') params.tag = selectedTag
    if (sortBy !== 'Newest') params.sort = sortBy
    if (searchText.trim()) params.q = searchText.trim()
    if (page > 1) params.page = String(page)
    setSearchParams(params, { replace: true })
  }, [selectedLanguage, selectedTag, sortBy, searchText, page, setSearchParams])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return
    const data = {
      lang: selectedLanguage,
      tag: selectedTag,
      sort: sortBy,
      search: searchText,
      page
    }
    try {
      window.localStorage.setItem('githubPortfolioFilters', JSON.stringify(data))
    } catch {
    }
  }, [selectedLanguage, selectedTag, sortBy, searchText, page])

  const totalCount = visibleRepos.length
  const visibleCount = filteredRepos.length
  const totalPages = visibleCount ? Math.ceil(visibleCount / PAGE_SIZE) : 1

  const paginatedRepos = useMemo(() => {
    const validPage = Math.min(page, totalPages || 1)
    const start = (validPage - 1) * PAGE_SIZE
    return filteredRepos.slice(start, start + PAGE_SIZE)
  }, [filteredRepos, page, totalPages])

  useEffect(() => {
    setActiveIndex(prev => {
      if (!paginatedRepos.length) return -1
      if (prev < 0) return -1
      if (prev >= paginatedRepos.length) return paginatedRepos.length - 1
      return prev
    })
  }, [paginatedRepos])

  const handleResetFilters = () => {
    setSelectedLanguage('All')
    setSelectedTag('All')
    setSortBy('Newest')
    setSearchText('')
    setPage(1)
    setActiveIndex(-1)
    setMinStars(0)
    setMaxStars(Infinity)
    setProjectSizes([])
    setHasHomepage(false)
    setDateRange(null)
    setAdvancedFiltersOpen(false)
  }

  const hasAdvancedFilters = minStars > 0 || projectSizes.length > 0 || hasHomepage || dateRange !== null

  const handleLanguageClickFromSidebar = lang => {
    setSelectedLanguage(lang)
  }

  const handleTagClickFromSidebar = tag => {
    setSelectedTag(tag)
  }

  const languageLabel = selectedLanguage === 'All' ? 'Any' : selectedLanguage
  const tagLabel = selectedTag === 'All' ? 'Any' : selectedTag

  const handleGlobalKeyDown = useCallback(
      event => {
        const tagName = event.target.tagName.toLowerCase()
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
          return
        }

        if (event.key === '/') {
          event.preventDefault()
          if (searchInputRef.current) {
            searchInputRef.current.focus()
          }
          return
        }

        if (event.key === 'Escape') {
          setSearchText('')
          return
        }

        if (event.key === 'ArrowRight') {
          if (page < totalPages) {
            event.preventDefault()
            setPage(prev => Math.min(prev + 1, totalPages))
            setActiveIndex(-1)
          }
          return
        }

        if (event.key === 'ArrowLeft') {
          if (page > 1) {
            event.preventDefault()
            setPage(prev => Math.max(prev - 1, 1))
            setActiveIndex(-1)
          }
          return
        }

        if (event.key === 'j') {
          if (!paginatedRepos.length) return
          event.preventDefault()
          setActiveIndex(prev => {
            if (prev < 0) return 0
            if (prev >= paginatedRepos.length - 1) return paginatedRepos.length - 1
            return prev + 1
          })
          return
        }

        if (event.key === 'k') {
          if (!paginatedRepos.length) return
          event.preventDefault()
          setActiveIndex(prev => {
            if (prev <= 0) return 0
            return prev - 1
          })
          return
        }

        if (event.key === 'Enter' && activeIndex >= 0 && paginatedRepos[activeIndex]) {
          event.preventDefault()
          const repo = paginatedRepos[activeIndex]
          navigate(`/repo/${repo.name}`)
        }
      },
      [page, totalPages, paginatedRepos, activeIndex, navigate]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [handleGlobalKeyDown])

  return (
      <Box sx={{ position: 'relative' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8} lg={9}>
            <Box sx={{ mb: 3.5 }}>
              <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4" sx={{ mb: 0.5 }} className="neon-text">
                    Projects
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 520 }}>
                    Browse all public repositories, filter by language, tags and commits, and open
                    each project with its README.
                  </Typography>
                </Box>
                <Stack
                    direction="row"
                    spacing={1.1}
                    alignItems="center"
                    sx={{ flexWrap: 'wrap' }}
                >
                  <Chip
                      label={`Total: ${totalCount}`}
                      size="small"
                      sx={{
                        borderRadius: 999,
                        border: '1px solid rgba(148,163,184,0.7)',
                        fontSize: 11
                      }}
                  />
                  <Chip
                      label={`Visible: ${visibleCount}`}
                      size="small"
                      sx={{
                        borderRadius: 999,
                        border: '1px solid rgba(34,211,238,0.7)',
                        fontSize: 11
                      }}
                  />
                </Stack>
              </Stack>
              <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 1.4, display: 'block' }}
              >
                Sort: {sortBy} • Language: {languageLabel} • Tag: {tagLabel}
              </Typography>
            </Box>

            <RepoFilters
                languages={languages}
                tags={tags}
                selectedLanguage={selectedLanguage}
                selectedTag={selectedTag}
                sortBy={sortBy}
                sortOptions={SORT_OPTIONS}
                searchText={searchText}
                totalCount={totalCount}
                visibleCount={visibleCount}
                onLanguageChange={setSelectedLanguage}
                onTagChange={setSelectedTag}
                onSortChange={setSortBy}
                onSearchChange={setSearchText}
                onReset={handleResetFilters}
                searchInputRef={searchInputRef}
                onAdvancedFiltersClick={() => setAdvancedFiltersOpen(true)}
                hasAdvancedFilters={hasAdvancedFilters}
            />

            <AdvancedFilters
                open={advancedFiltersOpen}
                onClose={() => setAdvancedFiltersOpen(false)}
                minStars={minStars}
                maxStars={maxStars}
                onStarsChange={(min, max) => {
                  setMinStars(min)
                  setMaxStars(max)
                }}
                projectSizes={projectSizes}
                onProjectSizesChange={setProjectSizes}
                hasHomepage={hasHomepage}
                onHasHomepageChange={setHasHomepage}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
            />

            <Box sx={{ mt: 3 }}>
              {loading ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <RepoCardSkeleton key={i} />
                  ))}
                </Box>
              ) : (
                <RepoGrid repos={paginatedRepos} activeIndex={activeIndex} />
              )}
            </Box>

            {totalPages > 1 && (
                <Box sx={{ mt: 3.5, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(_, value) => {
                        setPage(value)
                        setActiveIndex(-1)
                      }}
                      color="primary"
                      size="medium"
                      siblingCount={1}
                      boundaryCount={1}
                  />
                </Box>
            )}
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <SidebarStats
                repos={visibleRepos}
                selectedLanguage={selectedLanguage}
                selectedTag={selectedTag}
                onLanguageClick={handleLanguageClickFromSidebar}
                onTagClick={handleTagClickFromSidebar}
            />
          </Grid>
        </Grid>
        {!loading && error && <ErrorOverlay text={error} />}
      </Box>
  )
}

export default RepoListPage
