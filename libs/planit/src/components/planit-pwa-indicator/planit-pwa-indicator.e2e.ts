import { newE2EPage } from '@stencil/core/testing';

describe('planit-pwa-indicator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<planit-pwa-indicator></planit-pwa-indicator>');

    const element = await page.find('planit-pwa-indicator');
    expect(element).toHaveClass('hydrated');
  });
});
