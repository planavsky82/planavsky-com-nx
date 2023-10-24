import { newE2EPage } from '@stencil/core/testing';

describe('planit-signup', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<planit-signup></planit-signup>');

    const element = await page.find('planit-signup');
    expect(element).toHaveClass('hydrated');
  });
});
