import React from 'react';
import ReactDOM from 'react-dom';
import ShapesGenerator from './components/ShapesGenerator';
import { importShape } from './ShapeNodes';
import './styles/global.scss';
import 'react-toastify/dist/ReactToastify.min.css';
import { setupLanguage } from './locales';

const params = window.location.search.substring(1).split('&').reduce<Record<string, string>>((obj, param) => {
    const [key, val] = param.split('=');
    obj[key] = val;
    return obj;
}, {});
if (params.theme) document.documentElement.setAttribute('theme', params.theme);

setupLanguage(
    params['lang'] ?? navigator.languages !== undefined ? navigator.languages[0] : navigator.language,
    'ja', !('lang' in params)
).then(() => {
    ReactDOM.render(
        <React.StrictMode>
            <ShapesGenerator defaultShapes={params['key'] ? importShape(params.key) : undefined} />
        </React.StrictMode>,
        document.getElementById('root')
    );
});