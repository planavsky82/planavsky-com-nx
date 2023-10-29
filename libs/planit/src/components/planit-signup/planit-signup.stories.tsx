// MyComponent.stories.js
import { html } from 'lit-html'; // Use your preferred web component library

export default {
  title: 'PlanitSignup', // The title in the Storybook UI
  component: 'planit-signup', // Replace with your web component's tag name
};

export const Default = () => html`
<planit-signup>
  <span slot="error">
    <planit-error>Error</planit-error>
  </span>
  <div slot="footer">
    Already have an account?
  </div>
</planit-signup>
`;
