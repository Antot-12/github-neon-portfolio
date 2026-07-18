import jsPDF from 'jspdf'

/**
 * Export portfolio as PDF
 */
export async function exportPortfolioPDF(repos, username) {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15
    let yPosition = margin

    // Header
    pdf.setFillColor(34, 211, 238)
    pdf.rect(0, 0, pageWidth, 40, 'F')

    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${username}'s Portfolio`, margin, 25)

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 33)

    yPosition = 50

    // Summary Stats
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
    const totalCommits = repos.reduce((sum, r) => sum + (r.commitsCount || 0), 0)
    const languages = [...new Set(repos.map(r => r.language).filter(Boolean))]

    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Portfolio Summary', margin, yPosition)
    yPosition += 8

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Total Repositories: ${repos.length}`, margin, yPosition)
    yPosition += 6
    pdf.text(`Total Stars: ${totalStars}`, margin, yPosition)
    yPosition += 6
    pdf.text(`Total Commits: ${totalCommits}`, margin, yPosition)
    yPosition += 6
    pdf.text(`Languages: ${languages.join(', ')}`, margin, yPosition)
    yPosition += 12

    // Repositories
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Projects', margin, yPosition)
    yPosition += 8

    repos.forEach((repo, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
            pdf.addPage()
            yPosition = margin
        }

        // Repo name
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(34, 211, 238)
        pdf.text(repo.name, margin, yPosition)
        yPosition += 6

        // Description
        if (repo.description) {
            pdf.setFontSize(9)
            pdf.setFont('helvetica', 'normal')
            pdf.setTextColor(80, 80, 80)
            const descLines = pdf.splitTextToSize(repo.description, pageWidth - (margin * 2))
            pdf.text(descLines, margin, yPosition)
            yPosition += descLines.length * 4 + 2
        }

        // Stats
        pdf.setFontSize(8)
        pdf.setTextColor(100, 100, 100)
        const stats = [
            `⭐ ${repo.stargazers_count || 0}`,
            `🍴 ${repo.forks_count || 0}`,
            `💻 ${repo.commitsCount || 0} commits`,
            repo.language || ''
        ].filter(Boolean).join(' | ')
        pdf.text(stats, margin, yPosition)
        yPosition += 6

        // Topics
        if (repo.topics && repo.topics.length > 0) {
            pdf.setFontSize(7)
            pdf.setTextColor(34, 211, 238)
            pdf.text(repo.topics.join(', '), margin, yPosition)
            yPosition += 5
        }

        yPosition += 5
    })

    // Footer on last page
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text(
        `Generated from GitHub Portfolio - ${window.location.origin}`,
        margin,
        pageHeight - 10
    )

    // Save
    pdf.save(`${username}-portfolio.pdf`)
}

/**
 * Export selected repos as Markdown
 */
export function exportMarkdown(repos, username) {
    let markdown = `# ${username}'s GitHub Portfolio\n\n`
    markdown += `Generated on ${new Date().toLocaleDateString()}\n\n`

    // Summary
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
    const totalCommits = repos.reduce((sum, r) => sum + (r.commitsCount || 0), 0)
    const languages = [...new Set(repos.map(r => r.language).filter(Boolean))]

    markdown += `## Summary\n\n`
    markdown += `- **Total Repositories:** ${repos.length}\n`
    markdown += `- **Total Stars:** ${totalStars}\n`
    markdown += `- **Total Commits:** ${totalCommits}\n`
    markdown += `- **Languages:** ${languages.join(', ')}\n\n`

    // Projects
    markdown += `## Projects\n\n`

    repos.forEach(repo => {
        markdown += `### [${repo.name}](${repo.html_url})\n\n`

        if (repo.description) {
            markdown += `${repo.description}\n\n`
        }

        markdown += `**Stats:** ⭐ ${repo.stargazers_count || 0} | 🍴 ${repo.forks_count || 0} | 💻 ${repo.commitsCount || 0} commits`
        if (repo.language) {
            markdown += ` | 📝 ${repo.language}`
        }
        markdown += `\n\n`

        if (repo.topics && repo.topics.length > 0) {
            markdown += `**Topics:** ${repo.topics.map(t => `\`${t}\``).join(', ')}\n\n`
        }

        if (repo.homepage) {
            markdown += `🔗 [Live Demo](${repo.homepage})\n\n`
        }

        markdown += `---\n\n`
    })

    // Download
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${username}-portfolio.md`
    a.click()
    URL.revokeObjectURL(url)
}

/**
 * Generate shareable portfolio link with selected repos
 */
export function generateShareableLink(selectedRepoIds, baseUrl) {
    const params = new URLSearchParams()
    params.set('repos', selectedRepoIds.join(','))
    return `${baseUrl}?${params.toString()}`
}

/**
 * Copy stats to clipboard
 */
export async function copyStatsToClipboard(repos, username) {
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
    const totalCommits = repos.reduce((sum, r) => sum + (r.commitsCount || 0), 0)
    const languages = [...new Set(repos.map(r => r.language).filter(Boolean))]

    const text = `📊 ${username}'s GitHub Portfolio\n\n` +
        `📦 ${repos.length} repositories\n` +
        `⭐ ${totalStars} total stars\n` +
        `💻 ${totalCommits} total commits\n` +
        `🔧 ${languages.length} languages: ${languages.join(', ')}\n\n` +
        `View portfolio: ${window.location.origin}`

    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch (err) {
        console.error('Failed to copy:', err)
        return false
    }
}
