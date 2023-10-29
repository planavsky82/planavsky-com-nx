// MyComponent.stories.js
import { html } from 'lit-html'; // Use your preferred web component library

export default {
  title: 'PlanitNav', // The title in the Storybook UI
  component: 'planit-nav', // Replace with your web component's tag name
};

export const Default = () => html`
<script>
  const fullNavigation = [
    {
      route: '',
      name: 'Home',
      secure: false
    },
    {
      route: 'login',
      name: 'Login',
      secure: false
    },
    {
      route: 'signup',
      name: 'Sign Up',
      secure: false
    },
    {
      route: 'main',
      name: 'Profile',
      secure: true
    },
    {
      route: 'rankings',
      name: 'Rankings',
      secure: true
    }
  ];

  document.querySelector("planit-nav").data = fullNavigation;
  document.querySelector("planit-nav").route = 'main';
</script>

<planit-nav></planit-nav>
`;
