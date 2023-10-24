import { newE2EPage } from '@stencil/core/testing';

describe('planit-button-legacy', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<planit-button-legacy></planit-button-legacy>');

    const element = await page.find('planit-button-legacy');
    expect(element).toHaveClass('hydrated');
  });
});
