import { newE2EPage } from '@stencil/core/testing';

describe('planit-nav', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<planit-nav></planit-nav>');

    const element = await page.find('planit-nav');
    expect(element).toHaveClass('hydrated');
  });
});
