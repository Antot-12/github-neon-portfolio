// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback
// } from 'react'
//
// const GithubContext = createContext(null)
//
// const CACHE_TTL_MS = 1000 * 60 * 5
//
// function getEnvString(value) {
//   if (!value) return ''
//   return String(value).trim()
// }
//
// function buildHeaders(token) {
//   const headers = {
//     Accept: 'application/vnd.github+json'
//   }
//   if (token) {
//     headers.Authorization = `Bearer ${token}`
//   }
//   return headers
// }
//
// function parseCommitsFromLink(linkHeader) {
//   if (!linkHeader || !linkHeader.includes('rel="last"')) return null
//   const parts = linkHeader.split(',')
//   const lastPart = parts.find(p => p.includes('rel="last"'))
//   if (!lastPart) return null
//   const match = lastPart.match(/page=(\d+)/)
//   if (!match || !match[1]) return null
//   const value = parseInt(match[1], 10)
//   if (Number.isNaN(value)) return null
//   return value
// }
//
// function loadReposFromCache(cacheKey) {
//   if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
//     return null
//   }
//   try {
//     const raw = window.localStorage.getItem(cacheKey)
//     if (!raw) return null
//     const parsed = JSON.parse(raw)
//     if (!parsed || typeof parsed !== 'object') return null
//     const { timestamp, data } = parsed
//     if (!Array.isArray(data) || typeof timestamp !== 'number') return null
//     const age = Date.now() - timestamp
//     if (age > CACHE_TTL_MS) return null
//     return data
//   } catch {
//     return null
//   }
// }
//
// function saveReposToCache(cacheKey, repos) {
//   if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return
//   try {
//     const payload = {
//       timestamp: Date.now(),
//       data: repos
//     }
//     window.localStorage.setItem(cacheKey, JSON.stringify(payload))
//   } catch {
//   }
// }
//
// export function GithubProvider({ children }) {
//   const username = getEnvString(import.meta.env.VITE_GITHUB_USERNAME)
//   const token = getEnvString(import.meta.env.VITE_GITHUB_TOKEN)
//
//   const [repos, setRepos] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//
//   const cacheKey = username ? `githubPortfolio:${username}:repos` : null
//
//   const loadRepos = useCallback(
//       async (force = false) => {
//         if (!username) {
//           setError('GitHub username is not configured. Set VITE_GITHUB_USERNAME in .env.')
//           setLoading(false)
//           setRepos([])
//           return
//         }
//
//         if (!force && cacheKey) {
//           const cached = loadReposFromCache(cacheKey)
//           if (cached) {
//             setRepos(cached)
//             setLoading(false)
//             setError('')
//             return
//           }
//         }
//
//         setLoading(true)
//         setError('')
//
//         const headers = buildHeaders(token)
//
//         try {
//           const response = await fetch(
//               `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
//               { headers }
//           )
//
//           if (!response.ok) {
//             let message = `GitHub API error ${response.status}`
//             try {
//               const data = await response.json()
//               if (data && data.message) {
//                 message = `GitHub API error ${response.status}: ${data.message}`
//               }
//             } catch {
//             }
//             throw new Error(message)
//           }
//
//           const rawRepos = await response.json()
//
//           const withCommits = await Promise.all(
//               rawRepos.map(async repo => {
//                 let commitsCount = 0
//                 try {
//                   const commitsResponse = await fetch(
//                       `https://api.github.com/repos/${repo.owner?.login}/${repo.name}/commits?per_page=1`,
//                       { headers }
//                   )
//                   if (commitsResponse.ok) {
//                     const link = commitsResponse.headers.get('Link')
//                     const parsedFromLink = parseCommitsFromLink(link)
//                     if (parsedFromLink != null) {
//                       commitsCount = parsedFromLink
//                     } else {
//                       const commitsData = await commitsResponse.json()
//                       commitsCount = Array.isArray(commitsData) ? commitsData.length : 0
//                     }
//                   }
//                 } catch {
//                   commitsCount = 0
//                 }
//
//                 return {
//                   id: repo.id,
//                   name: repo.name,
//                   full_name: repo.full_name,
//                   description: repo.description,
//                   html_url: repo.html_url,
//                   language: repo.language,
//                   topics: repo.topics || [],
//                   stargazers_count: repo.stargazers_count,
//                   forks_count: repo.forks_count,
//                   open_issues_count: repo.open_issues_count,
//                   created_at: repo.created_at,
//                   updated_at: repo.updated_at,
//                   pushed_at: repo.pushed_at,
//                   watchers_count: repo.watchers_count,
//                   size: repo.size,
//                   commitsCount,
//                   ownerLogin: repo.owner?.login || username,
//                   homepage: repo.homepage || ''
//                 }
//               })
//           )
//
//           setRepos(withCommits)
//           if (cacheKey) {
//             saveReposToCache(cacheKey, withCommits)
//           }
//         } catch (e) {
//           setError(e.message || 'Failed to load repositories.')
//           setRepos([])
//         } finally {
//           setLoading(false)
//         }
//       },
//       [username, token, cacheKey]
//   )
//
//   useEffect(() => {
//     loadRepos()
//   }, [loadRepos])
//
//   const refresh = useCallback(() => {
//     return loadRepos(true)
//   }, [loadRepos])
//
//   const value = {
//     username,
//     token,
//     repos,
//     loading,
//     error,
//     refresh
//   }
//
//   return <GithubContext.Provider value={value}>{children}</GithubContext.Provider>
// }
//
// export function useGithub() {
//   const ctx = useContext(GithubContext)
//   if (!ctx) {
//     throw new Error('useGithub must be used inside GithubProvider')
//   }
//   return ctx
// }

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from 'react'

const GithubContext = createContext(null)

const CACHE_TTL_MS = 1000 * 60 * 15 // Increased to 15 minutes

function getEnvString(value) {
  if (!value) return ''
  return String(value).trim()
}

function loadReposFromCache(cacheKey) {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null
  }
  try {
    const raw = window.localStorage.getItem(cacheKey)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const { timestamp, data } = parsed
    if (!Array.isArray(data) || typeof timestamp !== 'number') return null
    const age = Date.now() - timestamp
    if (age > CACHE_TTL_MS) return null
    return data
  } catch {
    return null
  }
}

function saveReposToCache(cacheKey, repos) {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return
  try {
    const payload = {
      timestamp: Date.now(),
      data: repos
    }
    window.localStorage.setItem(cacheKey, JSON.stringify(payload))
  } catch {
  }
}

export function GithubProvider({ children }) {
  const username = getEnvString(import.meta.env.VITE_GITHUB_USERNAME) || 'Antot-12'
  const token = getEnvString(import.meta.env.VITE_GITHUB_TOKEN)

  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cacheKey = username ? `githubPortfolio:${username}:repos:v2` : null

  const loadRepos = useCallback(
      async (force = false) => {
        if (!username) {
          setError('GitHub username is not configured. Set VITE_GITHUB_USERNAME in .env.')
          setLoading(false)
          setRepos([])
          return
        }

        // Check cache first unless force refresh
        if (!force && cacheKey) {
          const cached = loadReposFromCache(cacheKey)
          if (cached) {
            setRepos(cached)
            setLoading(false)
            setError('')
            return
          }
        }

        setLoading(true)
        setError('')

        try {
          // Load from pre-generated repos.json (no API calls)
          const baseUrl = import.meta.env.BASE_URL || '/'
          const res = await fetch(`${baseUrl}repos.json`)

          if (!res.ok) {
            throw new Error(`Failed to load repos.json (${res.status})`)
          }

          const raw = await res.json()
          const data = Array.isArray(raw) ? raw : []

          setRepos(data)
          if (cacheKey) {
            saveReposToCache(cacheKey, data)
          }
        } catch (e) {
          setError(e.message || 'Failed to load repositories.')
          setRepos([])
        } finally {
          setLoading(false)
        }
      },
      [username, cacheKey]
  )

  useEffect(() => {
    loadRepos()
  }, [loadRepos])

  const refresh = useCallback(() => {
    return loadRepos(true)
  }, [loadRepos])

  const value = {
    username,
    token,
    repos,
    loading,
    error,
    refresh
  }

  return <GithubContext.Provider value={value}>{children}</GithubContext.Provider>
}

export function useGithub() {
  const ctx = useContext(GithubContext)
  if (!ctx) {
    throw new Error('useGithub must be used inside GithubProvider')
  }
  return ctx
}

