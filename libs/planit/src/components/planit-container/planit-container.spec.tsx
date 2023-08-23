import { newSpecPage } from '@stencil/core/testing';
import { PlanitContainer } from './planit-container';

describe('planit-container', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [PlanitContainer],
      html: '<planit-container></planit-container>',
    });
    expect(root).toEqualHtml(`
      <planit-container>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </planit-container>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [PlanitContainer],
      html: `<planit-container first="Stencil" last="'Don't call me a framework' JS"></planit-container>`,
    });
    expect(root).toEqualHtml(`
      <planit-container first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </planit-container>
    `);
  });
});
