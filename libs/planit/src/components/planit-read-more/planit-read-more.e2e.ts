import { newE2EPage } from '@stencil/core/testing';

describe('planit-read-more', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<planit-read-more></planit-read-more>');

    const element = await page.find('planit-read-more');
    expect(element).toHaveClass('hydrated');
  });
});
