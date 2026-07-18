import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Box, IconButton, Tooltip, Snackbar } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'

export default function CodeBlock({ inline, className, children, ...props }) {
    const [copied, setCopied] = useState(false)
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : ''
    const code = String(children).replace(/\n$/, '')

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    if (inline) {
        return (
            <code
                className={className}
                style={{
                    backgroundColor: 'rgba(34, 211, 238, 0.1)',
                    color: '#22d3ee',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                }}
                {...props}
            >
                {children}
            </code>
        )
    }

    return (
        <Box sx={{ position: 'relative', my: 2 }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1
                }}
            >
                <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
                    <IconButton
                        size="small"
                        onClick={handleCopy}
                        sx={{
                            bgcolor: 'rgba(15, 23, 42, 0.8)',
                            color: copied ? '#22d3ee' : '#e5e7eb',
                            '&:hover': {
                                bgcolor: 'rgba(15, 23, 42, 0.95)',
                                color: '#22d3ee'
                            }
                        }}
                    >
                        {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
            </Box>
            <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                customStyle={{
                    margin: 0,
                    borderRadius: '8px',
                    fontSize: '0.9em',
                    border: '1px solid rgba(31, 41, 55, 1)',
                    backgroundColor: '#0f172a'
                }}
                {...props}
            >
                {code}
            </SyntaxHighlighter>
        </Box>
    )
}
