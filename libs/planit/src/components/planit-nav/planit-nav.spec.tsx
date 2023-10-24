import { newSpecPage } from '@stencil/core/testing';
import { PlanitNav } from './planit-nav';

describe('planit-nav', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PlanitNav],
      html: `<planit-nav></planit-nav>`,
    });
    expect(page.root).toEqualHtml(`
      <planit-nav>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </planit-nav>
    `);
  });
});
