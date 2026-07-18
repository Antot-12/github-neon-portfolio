import React from 'react'
import { Card, CardContent, Box, Skeleton, Stack } from '@mui/material'

export default function RepoCardSkeleton() {
    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Skeleton
                variant="rectangular"
                height={140}
                sx={{ bgcolor: 'rgba(31, 41, 55, 0.5)' }}
            />
            <CardContent
                sx={{
                    flexGrow: 1,
                    p: 2.2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                <Skeleton
                    variant="text"
                    width="60%"
                    height={28}
                    sx={{ mb: 0.4, bgcolor: 'rgba(31, 41, 55, 0.5)' }}
                />
                <Skeleton
                    variant="text"
                    width="80%"
                    height={20}
                    sx={{ mb: 0.8, bgcolor: 'rgba(31, 41, 55, 0.5)' }}
                />
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={60}
                    sx={{ mb: 1, borderRadius: 1, bgcolor: 'rgba(31, 41, 55, 0.5)' }}
                />
                <Stack direction="row" spacing={1} sx={{ mb: 1.1 }}>
                    <Skeleton
                        variant="rounded"
                        width={80}
                        height={24}
                        sx={{ borderRadius: 999, bgcolor: 'rgba(31, 41, 55, 0.5)' }}
                    />
                    <Skeleton
                        variant="rounded"
                        width={100}
                        height={24}
                        sx={{ borderRadius: 999, bgcolor: 'rgba(31, 41, 55, 0.5)' }}
                    />
                </Stack>
                <Box sx={{ width: '100%', height: 1, bgcolor: 'rgba(31, 41, 55, 0.5)', my: 1 }} />
                <Stack direction="row" spacing={1.6} justifyContent="center" sx={{ mb: 1.2, width: '100%' }}>
                    {[40, 40, 40, 40].map((width, i) => (
                        <Skeleton
                            key={i}
                            variant="text"
                            width={width}
                            height={20}
                            sx={{ bgcolor: 'rgba(31, 41, 55, 0.5)' }}
                        />
                    ))}
                </Stack>
            </CardContent>
        </Card>
    )
}
