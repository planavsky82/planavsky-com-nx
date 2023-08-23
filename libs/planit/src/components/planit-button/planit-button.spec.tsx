import { newSpecPage } from '@stencil/core/testing';
import { PlanitButton } from './planit-button';

describe('planit-button', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [PlanitButton],
      html: '<planit-button></planit-button>',
    });
    expect(root).toEqualHtml(`
      <planit-button>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </planit-button>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [PlanitButton],
      html: `<planit-button first="Stencil" last="'Don't call me a framework' JS"></planit-button>`,
    });
    expect(root).toEqualHtml(`
      <planit-button first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </planit-button>
    `);
  });
});
