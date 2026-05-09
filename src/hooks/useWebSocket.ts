import { useEffect, useRef, useState } from 'react'
import { useUIStore } from '@/store/uiStore'

export const useWebSocket = (url: string) => {
    const [isConnected, setIsConnected] = useState(false)
    const ws = useRef<WebSocket | null>(null)
    const { pushLiveEvent } = useUIStore()

    useEffect(() => {
        ws.current = new WebSocket(url)

        ws.current.onopen = () => setIsConnected(true)
        ws.current.onclose = () => setIsConnected(false)
        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                pushLiveEvent(data)
            } catch (error) {
                console.error('Failed to parse WebSocket message', error)
            }
        }

        return () => {
            ws.current?.close()
        }
    }, [url, pushLiveEvent])

    return { isConnected }
}
