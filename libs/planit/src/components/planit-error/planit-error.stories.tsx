// MyComponent.stories.js
import { html } from 'lit-html'; // Use your preferred web component library

export default {
  title: 'PlanitError', // The title in the Storybook UI
  component: 'planit-error', // Replace with your web component's tag name
};

export const Default = () => html`<planit-error>Test</planit-error>`;
