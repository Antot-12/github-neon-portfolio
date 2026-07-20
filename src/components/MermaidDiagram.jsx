import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { Box, Paper } from '@mui/material'

mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    themeVariables: {
        primaryColor: '#22d3ee',
        primaryTextColor: '#e5e7eb',
        primaryBorderColor: '#22d3ee',
        lineColor: '#22d3ee',
        secondaryColor: '#0f172a',
        tertiaryColor: '#1e293b',
        background: '#0f172a',
        mainBkg: '#0f172a',
        secondBkg: '#1e293b',
        border1: '#22d3ee',
        border2: '#475569',
        note: '#1e293b',
        noteBkgColor: '#1e293b',
        noteTextColor: '#e5e7eb',
        noteBorderColor: '#22d3ee',
        textColor: '#e5e7eb',
        fontSize: '14px'
    }
})

export default function MermaidDiagram({ chart }) {
    const ref = useRef(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (ref.current && chart) {
            const renderDiagram = async () => {
                try {
                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
                    const { svg } = await mermaid.render(id, chart)
                    if (ref.current) {
                        ref.current.innerHTML = svg
                    }
                } catch (err) {
                    console.error('Mermaid render error:', err)
                    setError('Failed to render diagram')
                }
            }
            renderDiagram()
        }
    }, [chart])

    if (error) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    my: 2,
                    bgcolor: '#1e293b',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                    color: '#f87171'
                }}
            >
                {error}
            </Paper>
        )
    }

    return (
        <Box
            ref={ref}
            sx={{
                my: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: '#0f172a',
                border: '1px solid rgba(31, 41, 55, 1)',
                overflow: 'auto',
                '& svg': {
                    maxWidth: '100%',
                    height: 'auto'
                }
            }}
        />
    )
}
