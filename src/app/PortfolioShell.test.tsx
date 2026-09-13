import { StrictMode } from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { PortfolioShell } from './PortfolioShell';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it.each([false, true])('adapts scrolling when reduced motion starts as %s', (initiallyReduced) => {
  vi.useFakeTimers({ toFake: ['Date'] });
  let reducedMotion = initiallyReduced;
  const preference = new EventTarget();
  const matchMedia = window.matchMedia.bind(window);
  const createSmoother = vi.spyOn(ScrollSmoother, 'create');
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
    const media = matchMedia(query);
    if (!query.startsWith('(prefers-reduced-motion:')) return media;
    const isReducedQuery = query === '(prefers-reduced-motion: reduce)';
    return Object.assign(isReducedQuery ? preference : media, {
      matches: isReducedQuery ? reducedMotion : !reducedMotion,
      media: query,
      onchange: null,
    }) as MediaQueryList;
  });

  const { unmount } = render(
    <StrictMode>
      <MemoryRouter>
        <PortfolioShell />
      </MemoryRouter>
    </StrictMode>,
  );
  const wrapper = document.getElementById('smooth-wrapper');
  const content = document.getElementById('smooth-content');

  function expectMotion(reduced: boolean) {
    expect(ScrollSmoother.get()?.smooth()).toBe(reduced ? 0 : 1);
    expect(createSmoother).toHaveBeenLastCalledWith({
      smooth: reduced ? 0 : 1,
      effects: !reduced,
    });
    expect(wrapper).toHaveStyle({ position: reduced ? 'relative' : 'fixed' });
    if (reduced) expect(content?.style.transform).toBe('');
  }

  expectMotion(initiallyReduced);
  for (const reduced of [!initiallyReduced, initiallyReduced]) {
    reducedMotion = reduced;
    // GSAP throttles media-query changes within the same two milliseconds.
    vi.advanceTimersByTime(10);
    act(() => {
      preference.dispatchEvent(new Event('change'));
    });
    expectMotion(reduced);
  }

  unmount();
  expect(ScrollSmoother.get()).toBeNull();
  expect(wrapper?.getAttribute('style')).toBe('');
  expect(content?.getAttribute('style')).toBe('');
  reducedMotion = !reducedMotion;
  vi.advanceTimersByTime(10);
  preference.dispatchEvent(new Event('change'));
  expect(ScrollSmoother.get()).toBeNull();
});
