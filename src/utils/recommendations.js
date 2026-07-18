/**
 * Calculate similarity score between two repositories based on:
 * - Shared topics/tags
 * - Same language
 * - Similar size
 * - Similar star count
 */
export function calculateSimilarity(repo1, repo2) {
    let score = 0

    // Shared topics (weighted heavily)
    const topics1 = repo1.topics || []
    const topics2 = repo2.topics || []
    const sharedTopics = topics1.filter(t => topics2.includes(t))
    score += sharedTopics.length * 10

    // Same language
    if (repo1.language && repo2.language && repo1.language === repo2.language) {
        score += 15
    }

    // Similar star count (within 50% range)
    const stars1 = repo1.stargazers_count || 0
    const stars2 = repo2.stargazers_count || 0
    if (stars1 > 0 && stars2 > 0) {
        const ratio = Math.min(stars1, stars2) / Math.max(stars1, stars2)
        if (ratio > 0.5) {
            score += 8
        }
    }

    // Similar size (within 50% range)
    const size1 = repo1.size || 0
    const size2 = repo2.size || 0
    if (size1 > 0 && size2 > 0) {
        const ratio = Math.min(size1, size2) / Math.max(size1, size2)
        if (ratio > 0.5) {
            score += 5
        }
    }

    return score
}

/**
 * Get similar repositories for a given repo
 */
export function getSimilarRepos(targetRepo, allRepos, limit = 3) {
    const scored = allRepos
        .filter(r => r.id !== targetRepo.id)
        .map(repo => ({
            repo,
            score: calculateSimilarity(targetRepo, repo)
        }))
        .filter(item => item.score > 10) // Minimum similarity threshold
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)

    return scored.map(item => item.repo)
}

/**
 * Group repositories by common topics
 */
export function groupReposByTopics(repos) {
    const groups = {}

    repos.forEach(repo => {
        const topics = repo.topics || []
        topics.forEach(topic => {
            if (!groups[topic]) {
                groups[topic] = []
            }
            groups[topic].push(repo)
        })
    })

    // Only keep groups with 2+ repos
    const filteredGroups = {}
    Object.entries(groups).forEach(([topic, repoList]) => {
        if (repoList.length >= 2) {
            filteredGroups[topic] = repoList
        }
    })

    return filteredGroups
}

/**
 * Get recommended repos based on viewing history and preferences
 */
export function getRecommendedRepos(viewedRepos, allRepos, limit = 6) {
    if (!viewedRepos || viewedRepos.length === 0) {
        // If no history, return most starred repos
        return [...allRepos]
            .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
            .slice(0, limit)
    }

    // Get all topics from viewed repos
    const viewedTopics = new Set()
    const viewedLanguages = new Set()

    viewedRepos.forEach(repo => {
        if (repo.topics) {
            repo.topics.forEach(t => viewedTopics.add(t))
        }
        if (repo.language) {
            viewedLanguages.add(repo.language)
        }
    })

    // Score all repos based on matching topics/languages
    const scored = allRepos
        .filter(r => !viewedRepos.some(viewed => viewed.id === r.id))
        .map(repo => {
            let score = 0

            // Match topics
            const repoTopics = repo.topics || []
            const matchingTopics = repoTopics.filter(t => viewedTopics.has(t))
            score += matchingTopics.length * 5

            // Match language
            if (repo.language && viewedLanguages.has(repo.language)) {
                score += 3
            }

            // Boost for stars
            score += Math.min((repo.stargazers_count || 0) / 10, 5)

            return { repo, score }
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)

    return scored.map(item => item.repo)
}
