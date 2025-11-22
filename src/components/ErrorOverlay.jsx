import React from 'react'
import { Box, Typography, Stack, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ReplayIcon from '@mui/icons-material/Replay'

function ErrorOverlay({ text, title = 'Something went wrong.', onRetry }) {
    return (
        <Box
            sx={{
                mt: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Box
                sx={{
                    px: 2.6,
                    py: 2,
                    borderRadius: 2,
                    border: '1px solid rgba(248,113,113,0.7)',
                    backgroundColor: '#030712',
                    maxWidth: 520,
                    width: '100%',
                    boxShadow: '0 22px 45px rgba(15,23,42,0.9)'
                }}
            >
                <Stack direction="row" spacing={1.8} alignItems="flex-start">
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(248,113,113,0.1)'
                        }}
                    >
                        <ErrorOutlineIcon sx={{ fontSize: 20, color: 'rgba(248,113,113,0.9)' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ mb: 0.6 }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: onRetry ? 1.6 : 0 }}>
                            {text}
                        </Typography>
                        {onRetry && (
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={onRetry}
                                startIcon={<ReplayIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                    borderRadius: 999,
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    textTransform: 'none',
                                    fontSize: 13,
                                    px: 1.8,
                                    py: 0.4,
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: 'rgba(34,211,238,0.08)'
                                    }
                                }}
                            >
                                Try again
                            </Button>
                        )}
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}

export default ErrorOverlay
