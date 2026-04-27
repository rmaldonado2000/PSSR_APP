export type Locale = 'en' | 'fr';

const dictionary = {
  en: {
    home: 'Home',
    plans: 'Plans',
    planDetails: 'Plan Details',
    checklistDetails: 'Checklist Details',
    templateLibrary: 'Template Library',
    searchPlans: 'Search plans',
    noRecords: 'No records found',
    loading: 'Loading',
    save: 'Save',
    cancel: 'Cancel',
    deficiencies: 'Deficiencies',
  },
  fr: {
    home: 'Accueil',
    plans: 'Plans',
    planDetails: 'Details du plan',
    checklistDetails: 'Details de la liste',
    templateLibrary: 'Bibliotheque de modeles',
    searchPlans: 'Rechercher des plans',
    noRecords: 'Aucun enregistrement',
    loading: 'Chargement',
    save: 'Enregistrer',
    cancel: 'Annuler',
    deficiencies: 'Deficiences',
  },
} as const;

export const DEFAULT_LOCALE: Locale = 'en';

export function t(key: keyof typeof dictionary.en, locale: Locale = DEFAULT_LOCALE): string {
  return dictionary[locale][key] ?? dictionary.en[key];
}
