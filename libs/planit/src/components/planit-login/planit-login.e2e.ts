import { newE2EPage } from '@stencil/core/testing';

describe('planit-login', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<planit-login></planit-login>');

    const element = await page.find('planit-login');
    expect(element).toHaveClass('hydrated');
  });
});
