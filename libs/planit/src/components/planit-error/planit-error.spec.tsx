import { newSpecPage } from '@stencil/core/testing';
import { PlanitError } from './planit-error';

describe('planit-error', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PlanitError],
      html: `<planit-error></planit-error>`,
    });
    expect(page.root).toEqualHtml(`
      <planit-error>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </planit-error>
    `);
  });
});
