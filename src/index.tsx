import React from 'react';
import ReactDOM from 'react-dom';
import ShapesGenerator from './components/ShapesGenerator';
import './styles/global.css';

ReactDOM.render(
  <React.StrictMode>
    <ShapesGenerator />
  </React.StrictMode>,
  document.getElementById('root')
);