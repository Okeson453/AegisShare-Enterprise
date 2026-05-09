import { render, fireEvent, screen } from '@testing-library/react'
import { expect, it, describe, vi } from 'vitest'
import Button from '@/components/ui/Button'

describe('Button Component', () => {
    it('renders button with text', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByRole('button')).toHaveTextContent('Click me')
    })

    it('handles click events', () => {
        const handleClick = vi.fn()
        render(<Button onClick={handleClick}>Click me</Button>)
        fireEvent.click(screen.getByRole('button'))
        expect(handleClick).toHaveBeenCalled()
    })

    it('renders different variants', () => {
        const { rerender } = render(<Button variant="primary">Primary</Button>)
        let button = screen.getByRole('button')
        expect(button).toHaveClass('bg-cy')

        rerender(<Button variant="danger">Danger</Button>)
        button = screen.getByRole('button')
        expect(button).toHaveClass('bg-red-500/10')
    })
})
