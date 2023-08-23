import { newE2EPage } from '@stencil/core/testing';

describe('planit-collection', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<planit-collection></planit-collection>');
    const element = await page.find('planit-collection');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<planit-collection></planit-collection>');
    const component = await page.find('planit-collection');
    const element = await page.find('planit-collection >>> div');
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty('first', 'James');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James`);

    component.setProperty('last', 'Quincy');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Quincy`);

    component.setProperty('middle', 'Earl');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });
});
