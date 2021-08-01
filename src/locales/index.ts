import jaLocale from './ja.json';

const locales: Record<string, Record<string, string>> = { '': jaLocale, 'ja': jaLocale };
let language = 'ja';

async function loadLocale(lang: string): Promise<void> {
    const data: Record<string, string> = await import(`./${lang}.json`);
    if (!data) return;
    locales[lang] = data;
}

export async function setupLanguage(lang: string | undefined, defaultLang: string): Promise<void> {
    const targetLanguage = lang ? lang : defaultLang;
    if (targetLanguage !== language) {
        if (locales[targetLanguage] === undefined) await loadLocale(targetLanguage);
        language = targetLanguage;
    }
}

export function locale<P extends { toString(): string }>(key: string, ...params: P[]): string {
    const value: string | undefined = locales[language][key] ?? locales['ja'][key];
    return resolveLocalePlaceholders(value, params) ?? (console.warn(`Unknown locale key "${key}"`), 'missing locale');
}

function resolveLocalePlaceholders<P extends { toString(): string }>(val: string | undefined, params?: P[]): string | undefined {
    return val?.replace(/%\d+%/g, match => {
        const index = parseInt(match.slice(1, -1));
        return params?.[index] !== undefined ? params[index].toString() : match;
    });
}