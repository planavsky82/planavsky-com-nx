// MyComponent.stories.js
import { html } from 'lit-html'; // Use your preferred web component library

export default {
  title: 'PlanitCollection', // The title in the Storybook UI
  component: 'planit-collection', // Replace with your web component's tag name
};

export const Default = () => html`<planit-collection></planit-collection>`;
