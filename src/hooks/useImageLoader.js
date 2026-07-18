import { useState, useEffect } from 'react'

/**
 * Custom hook to handle image loading with fallback
 * Prevents blinking by managing image state properly
 */
export function useImageLoader(imageUrl, fallbackUrl) {
    const [imgSrc, setImgSrc] = useState(imageUrl)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        setImgSrc(imageUrl)
        setIsLoading(true)
        setHasError(false)

        const img = new Image()

        img.onload = () => {
            setIsLoading(false)
        }

        img.onerror = () => {
            setHasError(true)
            setIsLoading(false)
            setImgSrc(fallbackUrl)
        }

        img.src = imageUrl

        return () => {
            img.onload = null
            img.onerror = null
        }
    }, [imageUrl, fallbackUrl])

    const handleError = () => {
        if (!hasError) {
            setHasError(true)
            setImgSrc(fallbackUrl)
        }
    }

    return { imgSrc, isLoading, hasError, handleError }
}
