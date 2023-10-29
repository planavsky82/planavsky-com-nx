// MyComponent.stories.js
import { html } from 'lit-html'; // Use your preferred web component library

export default {
  title: 'PlanitModal', // The title in the Storybook UI
  component: 'planit-modal', // Replace with your web component's tag name
};

export const Default = () => html`
<planit-modal>

<span>
  If you are a Fantasy Football enthusiast, you probably have ranking resources around the web that you utilize
  to help make lineup and draft day decisions.
</span>

<span>
  What if you were able to manage your own rankings to make your own lineup and draft day decisions,
  help others determine their lineups by sharing your rankings,
  and see how accurate you are compared to the rest of the MyFantasyFootballRankings.com community in a little friendly competition?
</span>

</planit-modal>

<script>
  document.querySelector("planit-modal").launch();
</script>`;
