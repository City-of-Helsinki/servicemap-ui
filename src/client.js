import React from 'react';
import ReactDOM from 'react-dom';

import TestView from './views/TestView';

const app = document.getElementById('app');
ReactDOM.hydrate(<TestView />, app);
