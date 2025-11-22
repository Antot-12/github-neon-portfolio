import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

function LoadingOverlay({ text = 'Loading...', variant = 'fullscreen' }) {
    const isFullScreen = variant === 'fullscreen'

    return (
        <Box
            sx={{
                position: isFullScreen ? 'fixed' : 'relative',
                ...(isFullScreen && {
                    inset: 0,
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(15,23,42,0.92)'
                }),
                ...(!isFullScreen && {
                    py: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                })
            }}
        >
            <Box
                sx={{
                    px: 2.8,
                    py: 2,
                    borderRadius: 999,
                    border: '1px solid rgba(34,211,238,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.6,
                    backgroundColor: '#020617',
                    boxShadow: isFullScreen
                        ? '0 20px 55px rgba(15,23,42,0.95)'
                        : '0 10px 30px rgba(15,23,42,0.8)'
                }}
            >
                <Box sx={{ position: 'relative', width: 32, height: 32, mr: 0.4 }}>
                    <CircularProgress
                        size={32}
                        thickness={4}
                        sx={{
                            color: '#22d3ee'
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 6,
                            borderRadius: '50%',
                            border: '1px solid rgba(34,211,238,0.35)'
                        }}
                    />
                </Box>
                <Box>
                    <Typography sx={{ fontSize: 14 }}>{text}</Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.3 }}>
                        Loading data
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default LoadingOverlay
