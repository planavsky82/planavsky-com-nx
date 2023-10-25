// MyComponent.stories.js
import { html } from 'lit-html'; // Use your preferred web component library

export default {
  title: 'PlanitPwaIndicator', // The title in the Storybook UI
  component: 'planit-pwa-indicator', // Replace with your web component's tag name
};

export const Default = () => html`<planit-pwa-indicator display="true"></planit-pwa-indicator>`;
