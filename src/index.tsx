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

const initialLanguages = [];
params['lang'] && initialLanguages.push(params['lang']);
navigator.languages !== undefined && initialLanguages.push(...navigator.languages);
initialLanguages.push(navigator.language);

setupLanguage(initialLanguages, !('lang' in params)).then(lang => {
    ReactDOM.render(
        <React.StrictMode>
            <ShapesGenerator importKey={params['key'] ? params.key : undefined} initialLanguage={lang} />
        </React.StrictMode>,
        document.getElementById('root')
    );
});