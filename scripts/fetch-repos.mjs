import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const username = process.env.GITHUB_USERNAME || 'Antot-12'
const token = process.env.GITHUB_TOKEN || ''

const headers = {
    'User-Agent': 'github-neon-portfolio',
    Accept: 'application/vnd.github+json'
}

if (token) {
    headers.Authorization = `Bearer ${token}` // The magic was here...
}

async function fetchJson(url) {
    const res = await fetch(url, { headers })
    if (!res.ok) {
        throw new Error(`GitHub API error ${res.status} for ${url}`)
    }
    return res.json()
}

function parseCommitsFromLink(linkHeader) {
    if (!linkHeader || !linkHeader.includes('rel="last"')) return null
    const parts = linkHeader.split(',')
    const lastPart = parts.find(p => p.includes('rel="last"'))
    if (!lastPart) return null
    const match = lastPart.match(/page=(\d+)/)
    if (!match || !match[1]) return null
    const value = parseInt(match[1], 10)
    if (Number.isNaN(value)) return null
    return value
}

async function fetchCommitsCount(owner, name) {
    try {
        const url = `https://api.github.com/repos/${owner}/${name}/commits?per_page=1`
        const res = await fetch(url, { headers })
        if (!res.ok) return 0

        const link = res.headers.get('Link')
        const parsedFromLink = parseCommitsFromLink(link)
        if (parsedFromLink != null) return parsedFromLink

        const commitsData = await res.json()
        return Array.isArray(commitsData) ? commitsData.length : 0
    } catch {
        return 0
    }
}

async function main() {
    const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
    const rawRepos = await fetchJson(reposUrl)

    const withCommits = await Promise.all(
        rawRepos.map(async repo => {
            const ownerLogin = repo.owner?.login || username
            const commitsCount = await fetchCommitsCount(ownerLogin, repo.name)

            return {
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                description: repo.description,
                html_url: repo.html_url,
                language: repo.language,
                topics: repo.topics || [],
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                open_issues_count: repo.open_issues_count,
                created_at: repo.created_at,
                updated_at: repo.updated_at,
                pushed_at: repo.pushed_at,
                watchers_count: repo.watchers_count,
                size: repo.size,
                commitsCount,
                ownerLogin,
                homepage: repo.homepage || ''
            }
        })
    )

    const outPath = path.join(__dirname, '..', 'public', 'repos.json')
    await fs.mkdir(path.dirname(outPath), { recursive: true })
    await fs.writeFile(outPath, JSON.stringify(withCommits, null, 2), 'utf8')

    console.log(`Saved ${withCommits.length} repos to public/repos.json`)
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
