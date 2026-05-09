/**
 * Data Binding & Integration Utilities for AegisShare v4
 * Provides hooks and helpers for real-time data synchronization
 */

import { useState, useCallback, useEffect, useRef } from 'react'

/**
 * Real-time data model for component state management
 */
export interface DataModel {
    [key: string]: any
}

/**
 * Observer callback for model changes
 */
export type ModelObserver = (model: DataModel, changes: Record<string, any>) => void

/**
 * Reactive data model class
 */
export class ReactiveModel {
    private data: DataModel = {}
    private observers: Set<ModelObserver> = new Set()
    private history: Array<{ timestamp: number; changes: Record<string, any> }> = []

    constructor(initial: DataModel = {}) {
        this.data = { ...initial }
    }

    /**
     * Get value by path (supports dot notation)
     */
    get(path: string, defaultValue?: any) {
        const parts = path.split('.')
        let current = this.data
        for (const part of parts) {
            current = current?.[part]
            if (current === undefined) return defaultValue
        }
        return current
    }

    /**
     * Set value by path (supports dot notation)
     */
    set(path: string, value: any) {
        const parts = path.split('.')
        const key = parts[parts.length - 1]
        let current = this.data

        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i]
            if (!current[part]) {
                current[part] = {}
            }
            current = current[part]
        }

        const oldValue = current[key]
        if (oldValue !== value) {
            current[key] = value
            this.notifyObservers({ [path]: { from: oldValue, to: value } })
        }
    }

    /**
     * Subscribe to model changes
     */
    subscribe(observer: ModelObserver): () => void {
        this.observers.add(observer)
        return () => this.observers.delete(observer)
    }

    /**
     * Notify all observers of changes
     */
    private notifyObservers(changes: Record<string, any>) {
        this.history.push({
            timestamp: Date.now(),
            changes,
        })
        this.observers.forEach((observer) => observer(this.data, changes))
    }

    /**
     * Get change history
     */
    getHistory() {
        return [...this.history]
    }

    /**
     * Clear change history
     */
    clearHistory() {
        this.history = []
    }

    /**
     * Get full data snapshot
     */
    snapshot(): DataModel {
        return JSON.parse(JSON.stringify(this.data))
    }

    /**
     * Restore from snapshot
     */
    restore(snapshot: DataModel) {
        const changes: Record<string, any> = {}
        Object.entries(snapshot).forEach(([key, value]) => {
            changes[key] = { from: this.data[key], to: value }
        })
        this.data = JSON.parse(JSON.stringify(snapshot))
        this.notifyObservers(changes)
    }
}

/**
 * Hook for binding component to reactive model
 */
export function useModel(model: ReactiveModel, path: string) {
    const [value, setValue] = useState(() => model.get(path))

    useEffect(() => {
        const unsubscribe = model.subscribe((_, changes) => {
            if (path in changes) {
                setValue(model.get(path))
            }
        })
        return unsubscribe
    }, [model, path])

    const update = useCallback(
        (newValue: any) => {
            model.set(path, newValue)
        },
        [model, path]
    )

    return [value, update] as const
}

/**
 * Hook for binding to multiple model properties
 */
export function useModelBatch(model: ReactiveModel, paths: string[]) {
    const [values, setValues] = useState(() =>
        paths.reduce(
            (acc, path) => {
                acc[path] = model.get(path)
                return acc
            },
            {} as Record<string, any>
        )
    )

    useEffect(() => {
        const unsubscribe = model.subscribe((_, changes) => {
            const relevantChanges = paths.filter((p) => p in changes)
            if (relevantChanges.length > 0) {
                setValues((prev) =>
                    paths.reduce(
                        (acc, path) => {
                            acc[path] = model.get(path)
                            return acc
                        },
                        { ...prev }
                    )
                )
            }
        })
        return unsubscribe
    }, [model, paths])

    const update = useCallback(
        (updates: Record<string, any>) => {
            Object.entries(updates).forEach(([path, value]) => {
                model.set(path, value)
            })
        },
        [model]
    )

    return [values, update] as const
}

/**
 * Persist model to localStorage
 */
export function persistModel(model: ReactiveModel, key: string) {
    // Load from localStorage on init
    const stored = localStorage.getItem(key)
    if (stored) {
        try {
            model.restore(JSON.parse(stored))
        } catch (e) {
            console.error(`Failed to restore model from ${key}:`, e)
        }
    }

    // Subscribe to changes and persist
    model.subscribe(() => {
        localStorage.setItem(key, JSON.stringify(model.snapshot()))
    })
}

/**
 * Sync model with remote API
 */
export function syncModel(
    model: ReactiveModel,
    apiUrl: string,
    options?: {
        interval?: number
        onError?: (error: Error) => void
    }
) {
    const { interval = 5000, onError } = options || {}

    // Initial fetch
    fetch(apiUrl)
        .then((r) => r.json())
        .then((data) => model.restore(data))
        .catch((e) => onError?.(e))

    // Poll for updates
    const pollInterval = setInterval(() => {
        fetch(apiUrl)
            .then((r) => r.json())
            .then((data) => model.restore(data))
            .catch((e) => onError?.(e))
    }, interval)

    return () => clearInterval(pollInterval)
}

/**
 * Create model instance with initial data
 */
export function createModel(initial: DataModel = {}): ReactiveModel {
    return new ReactiveModel(initial)
}
