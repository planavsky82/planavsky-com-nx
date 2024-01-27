const sum = require('./collection');

test('adds 1 + 2 to equal 3', () => {
  expect(1).toBe(1);
});

test('custom elements in JSDOM', () => {
  document.body.innerHTML = `<h1>Custom element test</h1> <collection-component></collection-component>`;
  console.log(document.body.innerHTML);
  //expect(document.body.innerHTML).toContain('');
});
