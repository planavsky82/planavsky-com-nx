// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import * as React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'planit-button': any
    }
  }
}

import NxWelcome from './nx-welcome';

import { defineCustomElements } from '@planit/web-components/loader';
defineCustomElements();

export function App() {
  return (
    <div>
      <div className="App">
        <planit-button>123</planit-button>
        <NxWelcome title="react-sample-app" />
      </div>
    </div>
  );
}

export default App;
