import { newSpecPage } from '@stencil/core/testing';
import { PlanitCollection } from './planit-collection';

describe('planit-collection', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [PlanitCollection],
      html: '<planit-collection></planit-collection>',
    });
    expect(root).toEqualHtml(`
      <planit-collection>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </planit-collection>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [PlanitCollection],
      html: `<planit-collection first="Stencil" last="'Don't call me a framework' JS"></planit-collection>`,
    });
    expect(root).toEqualHtml(`
      <planit-collection first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </planit-collection>
    `);
  });
});
