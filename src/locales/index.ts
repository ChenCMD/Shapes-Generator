import { showNotification } from '../components/ShapesGenerator';
import { camelCaseToSnakeCase } from '../utils/common';
import enLocale from './en.json';

const locales: Record<string, Record<string, string>> = { '': enLocale, 'en': enLocale };
let language = 'en';

async function loadLocale(lang: string): Promise<void> {
    const data: Record<string, string> = await import(`./${lang}.json`);
    if (!data) return;
    locales[lang] = data;
}

export async function setupLanguage(lang: string | undefined, defaultLang: string, ignoreError = false): Promise<void> {
    const targetLanguage = lang ? lang : defaultLang;
    if (targetLanguage !== language) {
        try {
            if (locales[targetLanguage] === undefined) await loadLocale(targetLanguage);
            language = targetLanguage;
        } catch (e) {
            if (ignoreError) return;
            showNotification('error', locale('error.invalid-language'));
        }
    }
}

export function locale<P extends { toString(): string }>(key: string, ...params: P[]): string {
    const snakedKey = camelCaseToSnakeCase(key);
    const value: string | undefined = locales[language][snakedKey] ?? locales['ja'][snakedKey];
    return resolveLocalePlaceholders(value, params) ?? (console.warn(`Unknown locale key "${snakedKey}"`), 'missing locale');
}

function resolveLocalePlaceholders<P extends { toString(): string }>(val: string | undefined, params?: P[]): string | undefined {
    return val?.replace(/%\d+%/g, match => {
        const index = parseInt(match.slice(1, -1));
        return params?.[index] !== undefined ? params[index].toString() : match;
    });
}