// MyComponent.stories.js
import { html } from 'lit-html'; // Use your preferred web component library

export default {
  title: 'PlanitButton', // The title in the Storybook UI
  component: 'planit-button', // Replace with your web component's tag name
};

export const Default = () => html`
<main>
  <h1>Button</h1>
  <planit-button first="1"></planit-button>
</main>
`;
