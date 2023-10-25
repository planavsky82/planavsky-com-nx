// MyComponent.stories.js
import { html } from 'lit-html'; // Use your preferred web component library

export default {
  title: 'PlanitContainer', // The title in the Storybook UI
  component: 'planit-container', // Replace with your web component's tag name
};

export const Default = () => html`<planit-button-legacy>Test</planit-button-legacy>`;
