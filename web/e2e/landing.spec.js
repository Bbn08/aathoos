import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows brand logo', async ({ page }) => {
    await expect(page.locator('.nav-logo')).toHaveText('aathoos')
  })

  test('has Features nav link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Features' })).toBeVisible()
  })

  test('has Contribute nav link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Contribute' })).toBeVisible()
  })

  test('has GitHub nav link pointing to repo', async ({ page }) => {
    const githubLink = page.locator('.nav-links a', { hasText: 'GitHub' })
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/aathoos/aathoos')
    await expect(githubLink).toHaveAttribute('target', '_blank')
  })
})

test.describe('Hero section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows open source badge', async ({ page }) => {
    await expect(page.locator('.hero-badge')).toContainText('Open Source')
  })

  test('shows main headline', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your student OS.')
  })

  test('shows tagline copy', async ({ page }) => {
    await expect(page.locator('.hero p')).toContainText('One place to manage academics')
  })

  test('View on GitHub button links to repo', async ({ page }) => {
    const btn = page.getByRole('link', { name: 'View on GitHub' })
    await expect(btn).toBeVisible()
    await expect(btn).toHaveAttribute('href', 'https://github.com/aathoos/aathoos')
    await expect(btn).toHaveAttribute('target', '_blank')
  })

  test('See features button anchors to features section', async ({ page }) => {
    const btn = page.getByRole('link', { name: 'See features' })
    await expect(btn).toBeVisible()
    await expect(btn).toHaveAttribute('href', '#features')
  })
})

test.describe('Features section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows section heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Built for how students actually work.' })
    ).toBeVisible()
  })

  test('renders exactly six feature cards', async ({ page }) => {
    await expect(page.locator('.feature-card')).toHaveCount(6)
  })

  const features = [
    'Dashboard',
    'Task Tracker',
    'Notes',
    'Study Planner',
    'Goal Tracking',
    'Focus Mode',
  ]

  for (const name of features) {
    test(`shows ${name} card`, async ({ page }) => {
      await expect(page.getByRole('heading', { level: 3, name })).toBeVisible()
    })
  }
})

test.describe('CTA section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows CTA heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Come build with us.' })).toBeVisible()
  })

  test('Start contributing button links to GitHub', async ({ page }) => {
    const btn = page.getByRole('link', { name: 'Start contributing' })
    await expect(btn).toBeVisible()
    await expect(btn).toHaveAttribute('href', 'https://github.com/aathoos/aathoos')
    await expect(btn).toHaveAttribute('target', '_blank')
  })
})

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows MIT license text', async ({ page }) => {
    await expect(page.locator('.footer')).toContainText('MIT License')
  })

  test('footer link points to GitHub repo', async ({ page }) => {
    await expect(page.locator('.footer a')).toHaveAttribute(
      'href',
      'https://github.com/aathoos/aathoos'
    )
  })
})
