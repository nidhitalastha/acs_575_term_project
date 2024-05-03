import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {MantineProvider} from '@mantine/core';
import reportWebVitals from './reportWebVitals';
import "./index.css";
import '@mantine/core/styles.css';

const AppColors = [
  '#e5f4ff',
  '#cde2ff',
  '#9bc2ff',
  '#64a0ff',
  '#3984fe',
  '#1d72fe',
  '#0969ff',
  '#0058e4',
  '#004ecc',
  '#0043b5'
];


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider>

      <App />
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();
