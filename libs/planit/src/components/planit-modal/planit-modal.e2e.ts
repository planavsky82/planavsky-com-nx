import { newE2EPage } from '@stencil/core/testing';

describe('planit-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<planit-modal></planit-modal>');

    const element = await page.find('planit-modal');
    expect(element).toHaveClass('hydrated');
  });
});
