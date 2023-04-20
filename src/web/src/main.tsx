import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './providers/AppProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>
);
