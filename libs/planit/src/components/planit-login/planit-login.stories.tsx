// MyComponent.stories.js
import { html } from 'lit-html'; // Use your preferred web component library

export default {
  title: 'PlanitLogin', // The title in the Storybook UI
  component: 'planit-login', // Replace with your web component's tag name
};

export const Default = () => html`<planit-login></planit-login>`;
