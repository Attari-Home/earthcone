import { defineConfig, devices } from '@playwright/test';

// Runs against a production build (astro build, then `astro preview --background`), never
// `astro dev`: the dev server's on-demand /_image transform is flaky under the concurrent
// requests Playwright's parallel workers generate — it can lose its reference to `sharp`
// mid-session and 500 every image until restarted. A prod build pre-renders every image at
// build time, so preview serves static files and never touches that code path.
//
// Start the server yourself before running tests (this project's `astro` CLI manages dev/
// preview as background processes with their own stop/status subcommands, which doesn't
// play well with Playwright's own `webServer` auto-start/health-check):
//   npm run build && npx astro preview --background
//   npm run test:visual
//   npx astro preview stop
// See CLAUDE.md's "Visual QA workflow" section for the full story.
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    reporter: [['list']],
    use: {
        baseURL: 'http://localhost:4321',
        trace: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
