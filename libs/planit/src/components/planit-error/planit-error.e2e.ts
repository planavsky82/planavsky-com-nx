import { newE2EPage } from '@stencil/core/testing';

describe('planit-error', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<planit-error></planit-error>');

    const element = await page.find('planit-error');
    expect(element).toHaveClass('hydrated');
  });
});
