import { useTranslation } from 'react-i18next';
export const useI18nProvider = () => {
    const { i18n, t } = useTranslation();
    return {
        i18nProvider: {
            translate: (key, params) => t(key, params),
            changeLocale: (lang) => i18n.changeLanguage(lang),
            getLocale: () => i18n.language,
        },
        i18n: i18n,
    };
};
