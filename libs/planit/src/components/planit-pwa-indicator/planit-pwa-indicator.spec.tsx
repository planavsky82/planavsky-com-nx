import { newSpecPage } from '@stencil/core/testing';
import { PlanitPwaIndicator } from './planit-pwa-indicator';

describe('planit-pwa-indicator', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PlanitPwaIndicator],
      html: `<planit-pwa-indicator></planit-pwa-indicator>`,
    });
    expect(page.root).toEqualHtml(`
      <planit-pwa-indicator>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </planit-pwa-indicator>
    `);
  });
});
