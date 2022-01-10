import { useCallback, useState } from 'react';
import { locale, setupLanguage } from '../locales';
import { isValidateLanguage, SpecificatedLanguage } from '../types/Language';

const useLocalize = (initialLanguage?: string): {
    locale: typeof locale,
    language: SpecificatedLanguage,
    setLanguage: (value: string) => void
} => {
    const [language, setLanguage] = useState<SpecificatedLanguage>(initialLanguage && isValidateLanguage(initialLanguage) ? initialLanguage : 'en');
    const setLanguageWrap = useCallback((value: string) => {
        if (isValidateLanguage(value))
            setupLanguage([value]).then(() => setLanguage(value));
    }, []);
    return {
        // localeは更新時に利用するすべてのコンポーネントを再描画する必要があるためuseCallbackでwrapしない
        locale: (key, ...params) => locale(key, ...params),
        language,
        setLanguage: setLanguageWrap
    };
};

export default useLocalize;