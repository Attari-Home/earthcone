import { expect, test, type Page } from '@playwright/test';

// The Web3Forms endpoint and the hCaptcha client are mocked/blocked so the test never
// sends a real submission or depends on a third party.
async function openForm(page: Page, reply: { status: number; body: object }) {
    await page.route('https://web3forms.com/client/script.js', (route) => route.abort());
    await page.route('https://api.web3forms.com/submit', (route) =>
        route.fulfill({
            status: reply.status,
            contentType: 'application/json',
            body: JSON.stringify(reply.body),
        }),
    );
    await page.goto('/contact/');
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Phone').fill('+971500000000');
    await page.getByLabel('Project details').fill('Test message');
}

test('contact form clears itself and confirms after a successful submission', async ({ page }) => {
    await openForm(page, { status: 200, body: { success: true, message: 'ok' } });
    await page.getByRole('button', { name: 'Send Request' }).click();

    await expect(page.locator('[data-form-status]')).toContainText('Thank you');
    await expect(page.getByLabel('Name')).toHaveValue('');
    await expect(page.getByLabel('Phone')).toHaveValue('');
    await expect(page.getByLabel('Project details')).toHaveValue('');
    await expect(page).toHaveURL(/\/contact\/?$/);
    await expect(page.getByRole('button', { name: 'Send Request' })).toBeEnabled();
});

test('contact form keeps the visitor input and shows an error when submission fails', async ({
    page,
}) => {
    await openForm(page, { status: 400, body: { success: false, message: 'bad' } });
    await page.getByRole('button', { name: 'Send Request' }).click();

    await expect(page.locator('[data-form-status]')).toContainText('could not send');
    await expect(page.getByLabel('Name')).toHaveValue('Test User');
    await expect(page.getByLabel('Project details')).toHaveValue('Test message');
    await expect(page.getByRole('button', { name: 'Send Request' })).toBeEnabled();
});
