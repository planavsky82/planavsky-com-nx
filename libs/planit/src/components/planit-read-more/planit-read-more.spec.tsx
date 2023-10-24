import { newSpecPage } from '@stencil/core/testing';
import { PlanitReadMore } from './planit-read-more';

describe('planit-read-more', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PlanitReadMore],
      html: `<planit-read-more></planit-read-more>`,
    });
    expect(page.root).toEqualHtml(`
      <planit-read-more>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </planit-read-more>
    `);
  });
});
