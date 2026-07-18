import React, { useState } from 'react'
import {
    Box,
    Paper,
    Typography,
    Button,
    Stack,
    IconButton,
    Menu,
    MenuItem,
    Snackbar,
    Alert
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import DescriptionIcon from '@mui/icons-material/Description'
import LinkIcon from '@mui/icons-material/Link'
import {
    exportPortfolioPDF,
    exportMarkdown,
    copyStatsToClipboard,
    generateShareableLink
} from '../utils/export'

export default function ExportShare({ repos, username }) {
    const [exportAnchor, setExportAnchor] = useState(null)
    const [shareAnchor, setShareAnchor] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const handleExportPDF = async () => {
        try {
            await exportPortfolioPDF(repos, username)
            setSnackbar({ open: true, message: 'PDF exported successfully!', severity: 'success' })
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to export PDF', severity: 'error' })
        }
        setExportAnchor(null)
    }

    const handleExportMarkdown = () => {
        try {
            exportMarkdown(repos, username)
            setSnackbar({ open: true, message: 'Markdown exported successfully!', severity: 'success' })
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to export Markdown', severity: 'error' })
        }
        setExportAnchor(null)
    }

    const handleCopyStats = async () => {
        const success = await copyStatsToClipboard(repos, username)
        setSnackbar({
            open: true,
            message: success ? 'Stats copied to clipboard!' : 'Failed to copy stats',
            severity: success ? 'success' : 'error'
        })
        setShareAnchor(null)
    }

    const handleCopyLink = () => {
        const link = window.location.href
        navigator.clipboard.writeText(link)
        setSnackbar({ open: true, message: 'Link copied to clipboard!', severity: 'success' })
        setShareAnchor(null)
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                border: '1px solid rgba(31, 41, 55, 1)',
                bgcolor: '#0f172a',
                display: 'inline-flex',
                gap: 1
            }}
        >
            <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={(e) => setExportAnchor(e.currentTarget)}
                sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(34, 211, 238, 0.08)'
                    }
                }}
            >
                Export
            </Button>

            <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={(e) => setShareAnchor(e.currentTarget)}
                sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(34, 211, 238, 0.08)'
                    }
                }}
            >
                Share
            </Button>

            {/* Export Menu */}
            <Menu
                anchorEl={exportAnchor}
                open={Boolean(exportAnchor)}
                onClose={() => setExportAnchor(null)}
                PaperProps={{
                    sx: {
                        bgcolor: '#0f172a',
                        border: '1px solid rgba(31, 41, 55, 1)'
                    }
                }}
            >
                <MenuItem onClick={handleExportPDF} sx={{ color: '#e5e7eb' }}>
                    <PictureAsPdfIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                    Export as PDF
                </MenuItem>
                <MenuItem onClick={handleExportMarkdown} sx={{ color: '#e5e7eb' }}>
                    <DescriptionIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                    Export as Markdown
                </MenuItem>
            </Menu>

            {/* Share Menu */}
            <Menu
                anchorEl={shareAnchor}
                open={Boolean(shareAnchor)}
                onClose={() => setShareAnchor(null)}
                PaperProps={{
                    sx: {
                        bgcolor: '#0f172a',
                        border: '1px solid rgba(31, 41, 55, 1)'
                    }
                }}
            >
                <MenuItem onClick={handleCopyStats} sx={{ color: '#e5e7eb' }}>
                    <ContentCopyIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                    Copy Portfolio Stats
                </MenuItem>
                <MenuItem onClick={handleCopyLink} sx={{ color: '#e5e7eb' }}>
                    <LinkIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                    Copy Portfolio Link
                </MenuItem>
            </Menu>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar.severity}
                    sx={{
                        bgcolor: snackbar.severity === 'success' ? '#0f172a' : '#1e293b',
                        color: snackbar.severity === 'success' ? 'primary.main' : '#f87171',
                        border: `1px solid ${snackbar.severity === 'success' ? 'rgba(34, 211, 238, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    )
}
