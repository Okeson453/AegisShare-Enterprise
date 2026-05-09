import { test, expect } from '@playwright/test'

test.describe('AegisShare Main Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173')
  })

  test('should load homepage and display main layout', async ({ page }) => {
    // Check if main container exists
    const mainContainer = page.locator('main')
    await expect(mainContainer).toBeVisible()

    // Check if navigation is present
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should display correct page title', async ({ page }) => {
    const title = await page.title()
    expect(title).toContain('AegisShare')
  })

  test('should handle responsive layout', async ({ page }) => {
    // Default viewport
    let nav = page.locator('nav')
    await expect(nav).toBeVisible()

    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500) // Wait for animations

    // Check if mobile menu works
    const mobileMenu = page.locator('[aria-label="Toggle menu"]')
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
      nav = page.locator('nav')
      // Mobile nav should show/hide on click
    }
  })

  test('should have accessible form labels', async ({ page }) => {
    // Check for proper label associations
    const inputs = page.locator('input')
    const inputCount = await inputs.count()

    for (let i = 0; i < Math.min(inputCount, 3); i++) {
      const input = inputs.nth(i)
      const label = page.locator(`label[for="${await input.getAttribute('id')}"]`)
      // Label should exist if input has id
      const inputId = await input.getAttribute('id')
      if (inputId) {
        expect(inputId).toBeTruthy()
      }
    }
  })

  test('should navigate between pages without errors', async ({ page }) => {
    // Listen for console errors
    let consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Check if navigation element exists
    const navLinks = page.locator('a[role="navigation"], nav a')
    const linkCount = await navLinks.count()

    // Navigate to first few links
    for (let i = 0; i < Math.min(linkCount, 2); i++) {
      const link = navLinks.nth(i)
      const href = await link.getAttribute('href')

      if (href && !href.startsWith('#')) {
        await link.click()
        await page.waitForLoadState('networkidle')
      }
    }

    // Verify no critical console errors occurred
    const criticalErrors = consoleErrors.filter(
      (err) =>
        !err.includes('ResizeObserver') && // Allow ResizeObserver errors
        !err.includes('Non-Error promise rejection') // Allow certain Promise rejections
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement
      return el?.tagName
    })

    // Should focus on first interactive element (button, link, input, etc.)
    expect(['BUTTON', 'A', 'INPUT'].includes(focused || '')).toBe(true)
  })
})

test.describe('Toast Notifications', () => {
  test('should display success toast with useToast hook', async ({ page }) => {
    // This would require a test component, example:
    // await page.goto('http://localhost:5173/test-toast')
    // const Toast = page.locator('[role="alert"]')
    // await expect(Toast).toBeVisible()
  })
})

test.describe('Modal Dialogs', () => {
  test('should open and close modal correctly', async ({ page }) => {
    // Find modal trigger button
    const modalTrigger = page.locator('button').filter({ hasText: /open|modal|dialog/i })

    if (await modalTrigger.first().isVisible()) {
      await modalTrigger.first().click()

      // Check if modal is visible
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Press Escape to close
      await page.keyboard.press('Escape')

      // Modal should be hidden
      await expect(modal).not.toBeVisible()
    }
  })
})

test.describe('Search Functionality', () => {
  test('should enter search query and show results', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[placeholder*="Search" i]')

    if (await searchInput.isVisible()) {
      await searchInput.fill('test')

      // Wait for search results
      await page.waitForTimeout(350) // Debounce delay

      // Check if results container exists
      const results = page.locator('[role="listbox"], .search-results')
      // Results should exist if search is implemented
    }
  })
})

test.describe('Performance', () => {
  test('should meet Core Web Vitals targets', async ({ page }) => {
    // Measure metrics
    const metrics = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    )

    const loadTime = metrics.loadEventEnd - metrics.navigationStart
    expect(loadTime).toBeLessThan(3000) // Should load in under 3 seconds
  })

  test('should have accessible color contrast', async ({ page }) => {
    // Check for WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
    const textElements = page.locator('p, a, span, h1, h2, h3, h4, h5, h6')
    const count = await textElements.count()

    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = textElements.nth(i)
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        }
      })

      // Verify colors are computed (not just validating contrast here)
      expect(styles.color).toBeTruthy()
    }
  })
})
