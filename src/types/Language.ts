export const specificatedLanguages = ['en', 'ja'] as const;
export type SpecificatedLanguage = typeof specificatedLanguages[number];

export function isValidateLanguage(str: string): str is SpecificatedLanguage {
    return (specificatedLanguages as readonly string[]).includes(str);
}