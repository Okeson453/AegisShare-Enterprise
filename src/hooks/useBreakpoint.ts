import { useState, useEffect, useCallback } from 'react'
import {
  BP,
  Breakpoint,
  getBreakpointFromWidth,
  getBreakpointState,
  type BreakpointState,
} from '@/styles/breakpoints'

/**
 * Hook to get current breakpoint and responsive info
 * Usage: const { isMobile, isDesktop } = useBreakpoint()
 */
export function useBreakpoint(): BreakpointState {
  const [state, setState] = useState<BreakpointState>(() =>
    getBreakpointState(
      getBreakpointFromWidth(typeof window !== 'undefined' ? window.innerWidth : 1280)
    ),
  )

  const handleResize = useCallback(() => {
    setState(getBreakpointState(getBreakpointFromWidth(window.innerWidth)))
  }, [])

  useEffect(() => {
    // Sync on mount
    handleResize()

    // Add listener for window resize
    // Note: orientationchange is deprecated and often not fired on modern browsers.
    // Orientation changes always trigger resize events on modern browsers.
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  return state
}

/**
 * Hook to check if viewport is at or above a specific breakpoint
 * Usage: const isDesktop = useBreakpointUp('lg')
 */
export function useBreakpointUp(breakpoint: Breakpoint): boolean {
  const { bp } = useBreakpoint()
  const breakpoints = Object.keys(BP) as Breakpoint[]
  const targetIndex = breakpoints.indexOf(breakpoint)
  const currentIndex = breakpoints.indexOf(bp)
  return currentIndex >= targetIndex
}

/**
 * Hook to check if viewport is below a specific breakpoint
 * Usage: const isMobile = useBreakpointDown('md')
 */
export function useBreakpointDown(breakpoint: Breakpoint): boolean {
  return !useBreakpointUp(breakpoint)
}

/**
 * Hook to check if device is touch-capable
 * Reads from media query (hover: none) and ontouchstart
 */
export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window && window.matchMedia('(hover: none)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(hover: none)')
    const handleChange = () => {
      setIsTouch('ontouchstart' in window && mq.matches)
    }

    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  return isTouch
}

/**
 * Hook to detect dark mode preference from active DOM
 */
export function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true // Default to dark
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  return isDark
}

/**
 * Convenience hook: all responsive state at once
 * Usage: const { isMobile, isTablet, isDesktop, isTouch, isDarkMode } = useResponsiveState()
 */
export function useResponsiveState() {
  const breakpoint = useBreakpoint()
  const isTouch = useTouchDevice()
  const isDarkMode = useDarkMode()

  return {
    ...breakpoint,
    isTouch,
    isDarkMode,
  }
}
