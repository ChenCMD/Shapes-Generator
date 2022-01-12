import { SetStateAction, useCallback, useState } from 'react';
import { locale, setupLanguage } from '../locales';
import { isValidateLanguage, SpecificatedLanguage } from '../types/Language';
import { StateDispatcher } from '../types/StateDispatcher';

const useLocalize = (initialLanguage?: string): {
    locale: typeof locale,
    language: SpecificatedLanguage,
    setLanguage: StateDispatcher<string>
} => {
    const [language, setLanguage] = useState<SpecificatedLanguage>(initialLanguage && isValidateLanguage(initialLanguage) ? initialLanguage : 'en');
    const setLanguageWrap = useCallback((value: SetStateAction<string>) => {
        const newLang = typeof value === 'function' ? value(language) : value;

        if (isValidateLanguage(newLang)) {
            setupLanguage([newLang]).then(() => setLanguage(newLang));
        }
    }, [language]);
    return {
        // localeは更新時に利用するすべてのコンポーネントを再描画する必要があるためuseCallbackでwrapしない
        locale: (key, ...params) => locale(key, ...params),
        language,
        setLanguage: setLanguageWrap
    };
};

export default useLocalize;