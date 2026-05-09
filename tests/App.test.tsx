import { render, screen } from '@testing-library/react'
import { expect, it, describe } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import App from '@/App'

describe('App Component', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        )
        expect(screen.getByRole('main')).toBeInTheDocument()
    })
})
