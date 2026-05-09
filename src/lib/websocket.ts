export class WebSocketClient {
    private ws: WebSocket | null = null
    private url: string
    private reconnectAttempts = 0
    private maxReconnectAttempts = 30
    private reconnectDelay = 1000

    constructor(url: string) {
        this.url = url
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.url)

                this.ws.onopen = () => {
                    this.reconnectAttempts = 0
                    resolve()
                }

                this.ws.onerror = (error) => {
                    reject(error)
                }

                this.ws.onclose = () => {
                    this.attemptReconnect()
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            const delay = Math.min(this.reconnectDelay * this.reconnectAttempts, 30000)

            setTimeout(() => {
                this.connect().catch(console.error)
            }, delay)
        }
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close()
            this.ws = null
        }
    }

    send(message: any): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message))
        }
    }

    on(eventName: string, callback: (data: any) => void): void {
        if (!this.ws) return

        if (eventName === 'message') {
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    callback(data)
                } catch (error) {
                    console.error('Failed to parse WebSocket message', error)
                }
            }
        }
    }

    isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN
    }
}
