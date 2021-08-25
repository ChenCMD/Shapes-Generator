import React from 'react';
import ReactDOM from 'react-dom';
import ShapesGenerator from './components/ShapesGenerator';
import './styles/global.scss';
import 'react-toastify/dist/ReactToastify.min.css';
import { setupLanguage } from './locales';

const params = window.location.search.substring(1).split('&').reduce<Record<string, string>>((obj, param) => {
    const [key, val] = param.split('=');
    obj[key] = val;
    return obj;
}, {});
if (params.theme) document.documentElement.setAttribute('theme', params.theme);

const initialLanguage = params['lang'] ?? navigator.languages !== undefined ? navigator.languages[0] : navigator.language;
setupLanguage(initialLanguage, 'ja', !('lang' in params)).then(() => {
    ReactDOM.render(
        <React.StrictMode>
            <ShapesGenerator importKey={params['key'] ? params.key : undefined} initialLanguage={initialLanguage} />
        </React.StrictMode>,
        document.getElementById('root')
    );
});