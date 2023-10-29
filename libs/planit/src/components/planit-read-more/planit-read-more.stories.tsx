// MyComponent.stories.js
import { html } from 'lit-html'; // Use your preferred web component library

export default {
  title: 'PlanitReadMore', // The title in the Storybook UI
  component: 'planit-read-more', // Replace with your web component's tag name
};

export const Default = () => html`<planit-read-more>Test</planit-read-more>`;
