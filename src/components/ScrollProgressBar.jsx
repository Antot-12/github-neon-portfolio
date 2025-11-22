import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'

function ScrollProgressBar({
                               height = 3,
                               color = 'primary.main',
                               zIndex = 1300
                           }) {
    const [progress, setProgress] = useState(0)
    const tickingRef = useRef(false)

    useEffect(() => {
        const updateProgress = () => {
            const doc = document.documentElement
            const scrollTop = window.scrollY || doc.scrollTop || 0
            const scrollHeight = doc.scrollHeight - doc.clientHeight
            if (scrollHeight <= 0) {
                setProgress(0)
            } else {
                const value = (scrollTop / scrollHeight) * 100
                setProgress(value)
            }
        }

        const handleScroll = () => {
            if (tickingRef.current) return
            tickingRef.current = true
            window.requestAnimationFrame(() => {
                updateProgress()
                tickingRef.current = false
            })
        }

        updateProgress()
        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('resize', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleScroll)
        }
    }, [])

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height,
                zIndex,
                bgcolor: 'transparent'
            }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <Box
                sx={{
                    width: `${progress}%`,
                    height: '100%',
                    bgcolor: color,
                    transition: 'width 120ms linear'
                }}
            />
        </Box>
    )
}

export default ScrollProgressBar
