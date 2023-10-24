import { newSpecPage } from '@stencil/core/testing';
import { PlanitButtonLegacy } from './planit-button-legacy';

describe('planit-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PlanitButtonLegacy],
      html: `<planit-button-legacy></planit-button-legacy>`,
    });
    expect(page.root).toEqualHtml(`
      <planit-button-legacy>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </planit-button-legacy>
    `);
  });
});
