import React, { useMemo } from 'react'
import { Box, Typography, Stack, Chip, Paper } from '@mui/material'
import TimelineIcon from '@mui/icons-material/Timeline'
import LanguageIcon from '@mui/icons-material/Language'
import TagIcon from '@mui/icons-material/Tag'
import CommitIcon from '@mui/icons-material/Commit'
import StarIcon from '@mui/icons-material/Star'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import BoltIcon from '@mui/icons-material/Bolt'
import { Link as RouterLink } from 'react-router-dom'

function formatNumber(value) {
  const n = Number(value) || 0
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}m`
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

function SidebarStats({ repos, selectedLanguage, selectedTag, onLanguageClick, onTagClick }) {
  const stats = useMemo(() => {
    const totalRepos = repos.length
    if (!totalRepos) {
      return {
        totalRepos: 0,
        totalCommits: 0,
        totalStars: 0,
        totalForks: 0,
        averageCommits: 0,
        averageStars: 0,
        latestRepoName: '',
        latestRepoDate: '',
        topStarRepoName: '',
        topStarRepoStars: 0,
        recentActiveCount: 0,
        sinceYear: '',
        languageList: [],
        tagList: [],
        primaryLanguageName: '',
        languagesCount: 0
      }
    }

    let totalCommits = 0
    let totalStars = 0
    let totalForks = 0
    const languages = {}
    const tags = {}
    let latestRepo = null
    let topStarRepo = null
    let recentActiveCount = 0
    let minYear = null
    const now = Date.now()
    const days30 = 1000 * 60 * 60 * 24 * 30

    repos.forEach(r => {
      const commits = r.commitsCount || 0
      const stars = r.stargazers_count || 0
      const forks = r.forks_count || 0

      totalCommits += commits
      totalStars += stars
      totalForks += forks

      if (r.language) {
        languages[r.language] = (languages[r.language] || 0) + 1
      }

      if (Array.isArray(r.topics)) {
        r.topics.forEach(t => {
          tags[t] = (tags[t] || 0) + 1
        })
      }

      const updatedRaw = r.pushed_at || r.updated_at || r.created_at
      if (updatedRaw) {
        const updated = new Date(updatedRaw)
        if (!latestRepo || updated > latestRepo.date) {
          latestRepo = { name: r.name, date: updated }
        }
        if (now - updated.getTime() <= days30) {
          recentActiveCount += 1
        }
      }

      if (r.created_at) {
        const year = new Date(r.created_at).getFullYear()
        if (!minYear || year < minYear) {
          minYear = year
        }
      }

      if (!topStarRepo || stars > topStarRepo.stars) {
        topStarRepo = { name: r.name, stars }
      }
    })

    const languageList = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)

    const tagList = Object.entries(tags)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)

    const primaryLanguageName = languageList.length > 0 ? languageList[0][0] : ''
    const languagesCount = Object.keys(languages).length

    return {
      totalRepos,
      totalCommits,
      totalStars,
      totalForks,
      averageCommits: totalRepos ? Math.round(totalCommits / totalRepos) : 0,
      averageStars: totalRepos ? Math.round(totalStars / totalRepos) : 0,
      latestRepoName: latestRepo ? latestRepo.name : '',
      latestRepoDate: latestRepo ? latestRepo.date.toLocaleDateString() : '',
      topStarRepoName: topStarRepo ? topStarRepo.name : '',
      topStarRepoStars: topStarRepo ? topStarRepo.stars : 0,
      recentActiveCount,
      sinceYear: minYear ? String(minYear) : '',
      languageList,
      tagList,
      primaryLanguageName,
      languagesCount
    }
  }, [repos])

  const {
    totalRepos,
    totalCommits,
    totalStars,
    averageCommits,
    averageStars,
    latestRepoName,
    latestRepoDate,
    topStarRepoName,
    topStarRepoStars,
    recentActiveCount,
    sinceYear,
    languageList,
    tagList,
    primaryLanguageName,
    languagesCount
  } = stats

  return (
      <Paper
          elevation={0}
          sx={{
            p: 2.4,
            position: 'sticky',
            top: 96
          }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <TimelineIcon sx={{ color: 'primary.main' }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Overview
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Stats across all repositories
            </Typography>
          </Box>
        </Stack>

        {totalRepos === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No repositories to analyze yet.
            </Typography>
        ) : (
            <>
              <Stack direction="row" spacing={1.8} sx={{ mb: 2.2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Repositories
                  </Typography>
                  <Typography variant="h6">{totalRepos}</Typography>
                  {sinceYear && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        since {sinceYear}
                      </Typography>
                  )}
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Stars
                  </Typography>
                  <Stack direction="row" spacing={0.6} alignItems="center">
                    <StarIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    <Typography variant="h6">
                      {formatNumber(totalStars)}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    avg {formatNumber(averageStars)} / repo
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Commits
                  </Typography>
                  <Stack direction="row" spacing={0.6} alignItems="center">
                    <CommitIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    <Typography variant="h6">
                      {formatNumber(totalCommits)}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    avg {formatNumber(averageCommits)} / repo
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={0.8} sx={{ mb: 2.2 }}>
                {topStarRepoName && (
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <TrendingUpIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Top starred
                        </Typography>
                        <Typography
                            variant="body2"
                            component={RouterLink}
                            to={`/repo/${topStarRepoName}`}
                            sx={{
                              display: 'block',
                              color: 'primary.main',
                              textDecoration: 'none'
                            }}
                        >
                          {topStarRepoName} • {formatNumber(topStarRepoStars)}★
                        </Typography>
                      </Box>
                    </Stack>
                )}
                <Stack direction="row" spacing={0.8} alignItems="center">
                  <BoltIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Active last 30 days
                    </Typography>
                    <Typography variant="body2">
                      {recentActiveCount} repos updated
                    </Typography>
                  </Box>
                </Stack>
                {primaryLanguageName && (
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <LanguageIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Tech profile
                        </Typography>
                        <Typography variant="body2">
                          Main: {primaryLanguageName} • {languagesCount} languages
                        </Typography>
                      </Box>
                    </Stack>
                )}
              </Stack>

              {latestRepoName && (
                  <Box sx={{ mb: 2.4 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Latest update:{' '}
                    </Typography>
                    <Typography
                        variant="body2"
                        component={RouterLink}
                        to={`/repo/${latestRepoName}`}
                        sx={{
                          display: 'inline-block',
                          color: 'primary.main',
                          textDecoration: 'none',
                          mt: 0.4
                        }}
                    >
                      {latestRepoName}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ display: 'block', color: 'text.secondary', mt: 0.2 }}
                    >
                      {latestRepoDate}
                    </Typography>
                  </Box>
              )}

              {languageList.length > 0 && (
                  <Box sx={{ mb: 2.2 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <LanguageIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="subtitle2">Languages</Typography>
                    </Stack>
                    <Stack spacing={0.9}>
                      {languageList.map(([lang, count]) => {
                        const ratio = totalRepos ? count / totalRepos : 0
                        return (
                            <Box key={lang}>
                              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.2 }}>
                                <Typography variant="caption">{lang}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {count} • {Math.round(ratio * 100)}%
                                </Typography>
                              </Stack>
                              <Box
                                  onClick={() => onLanguageClick(lang)}
                                  sx={{
                                    height: 6,
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    bgcolor: '#020617'
                                  }}
                              >
                                <Box
                                    sx={{
                                      width: `${Math.max(10, ratio * 100)}%`,
                                      height: '100%',
                                      bgcolor: 'primary.main',
                                      opacity: selectedLanguage === lang ? 1 : 0.5,
                                      transition: 'width 200ms ease, opacity 150ms ease'
                                    }}
                                />
                              </Box>
                            </Box>
                        )
                      })}
                    </Stack>
                  </Box>
              )}

              {tagList.length > 0 && (
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <TagIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="subtitle2">Tags</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.7} sx={{ flexWrap: 'wrap' }}>
                      {tagList.map(([tag]) => (
                          <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              onClick={() => onTagClick(tag)}
                              sx={{
                                mb: 0.7,
                                borderRadius: 999,
                                fontSize: 11,
                                textTransform: 'lowercase',
                                borderColor: selectedTag === tag ? 'primary.main' : 'rgba(55,65,81,1)',
                                bgcolor: selectedTag === tag ? 'rgba(34,211,238,0.15)' : '#0f172a',
                                color: selectedTag === tag ? 'primary.main' : 'text.secondary'
                              }}
                              variant={selectedTag === tag ? 'outlined' : 'filled'}
                          />
                      ))}
                    </Stack>
                  </Box>
              )}
            </>
        )}
      </Paper>
  )
}

export default SidebarStats
