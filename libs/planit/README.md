# @planit Web Components

## @planit/web-components

`@planit/web-components` is a web component library that can be used within any application, regardless of technology. Check out the [Storybook](https://planit-web-components.web.app) for the library documentation.

### Get started!

To use the standard web components, run the following script:

```
npm i @planit/web-components
```

Then load the package into your app:

```
import { defineCustomElements } from '@planit/web-components/loader';
defineCustomElements();
```

To use the web components within React Wrappers for a more efficient utilization in a React application.

For an example of how to use the React Wrapper version of the web components, please review [this example](https://github.com/planavsky82/component-lib-platform/blob/main/apps/react-demo/src/App.js).
