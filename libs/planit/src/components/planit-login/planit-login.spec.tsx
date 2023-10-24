import { newSpecPage } from '@stencil/core/testing';
import { PlanitLogin } from './planit-login';

describe('planit-login', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PlanitLogin],
      html: `<planit-login></planit-login>`,
    });
    expect(page.root).toEqualHtml(`
      <planit-login>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </planit-login>
    `);
  });
});
