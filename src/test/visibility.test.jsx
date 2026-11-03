import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../App';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('React shell & text visibility', () => {
  it('shows skeleton loading on home before legacy boots', () => {
    renderAt('/');
    const status = screen.getByRole('status');
    expect(status).toBeVisible();
    expect(status.textContent).toMatch(/Loading Bharat HIE Portal/i);
    expect(status.className).toMatch(/skeleton-screen/);
  });

  it('keeps route components mounted for key pages', () => {
    const paths = [
      '/',
      '/about',
      '/find-healthcare',
      '/book-appointment',
      '/health-camps',
      '/complaints',
      '/faq',
      '/health-dashboards',
      '/dashboard/matru',
      '/role/citizen',
    ];

    for (const path of paths) {
      const { unmount } = renderAt(path);
      expect(screen.getByRole('status')).toBeVisible();
      expect(document.getElementById('app')).toBeTruthy();
      unmount();
    }
  });

  it('unknown routes redirect to home shell', () => {
    render(
      <MemoryRouter initialEntries={['/not-a-real-page']}>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole('status')).toBeVisible();
  });
});

describe('CSS visibility contract', () => {
  it('portal and visibility styles define readable foreground colors', async () => {
    const { readFileSync } = await import('node:fs');
    const { resolve } = await import('node:path');
    const portal = readFileSync(resolve(__dirname, '../styles/portal.css'), 'utf8');
    const visibility = readFileSync(resolve(__dirname, '../styles/visibility.css'), 'utf8');
    expect(portal).toMatch(/--fg:/);
    expect(visibility).toMatch(/color-scheme:\s*light/);
    expect(visibility).toMatch(/pn-find/);
    expect(visibility).toMatch(/#123b5d\s*!important/i);
    expect(visibility).toMatch(/footer/);
    expect(visibility).not.toMatch(/color:\s*transparent/);
  });
});
