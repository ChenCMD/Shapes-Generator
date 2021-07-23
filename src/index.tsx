import React from 'react';
import ReactDOM from 'react-dom';
import ShapesGenerator from './components/ShapesGenerator';
import { importShape } from './ShapeNodes';
import './styles/global.scss';

const params = window.location.search.substring(1).split('&').reduce<Record<string, string>>((obj, param) => {
    const [key, val] = param.split('=');
    obj[key] = val;
    return obj;
}, {});
if (params.theme) document.documentElement.setAttribute('theme', params.theme);

ReactDOM.render(
    <React.StrictMode>
        <ShapesGenerator defaultShapes={params['key'] ? importShape(params.key) : undefined} />
    </React.StrictMode>,
    document.getElementById('root')
);