import { newSpecPage } from '@stencil/core/testing';
import { PlanitSignup } from './planit-signup';

describe('planit-signup', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PlanitSignup],
      html: `<planit-signup></planit-signup>`,
    });
    expect(page.root).toEqualHtml(`
      <planit-signup>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </planit-signup>
    `);
  });
});
