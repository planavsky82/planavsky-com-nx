import { newSpecPage } from '@stencil/core/testing';
import { PlanitModal } from './planit-modal';

describe('planit-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PlanitModal],
      html: `<planit-modal></planit-modal>`,
    });
    expect(page.root).toEqualHtml(`
      <planit-modal>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </planit-modal>
    `);
  });
});
