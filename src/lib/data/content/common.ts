import type { ContentItem } from '@/types/content';

const CURRENT_CONTENT_VERSION = 2;

export const commonContent: { [key: string]: ContentItem & { version: number } } = {
    days: { en: "days", ru: "дней", se: "дана", "se-lat": "dana", version: CURRENT_CONTENT_VERSION },
    cancel: { en: "Cancel", ru: "Отмена", se: "Откажи", "se-lat": "Otkaži", version: CURRENT_CONTENT_VERSION },
    continue: { en: "Continue", ru: "Продолжить", se: "Настави", "se-lat": "Nastavi", version: CURRENT_CONTENT_VERSION },
    save: { en: "Save", ru: "Сохранить", se: "Сачувај", "se-lat": "Sačuvaj", version: CURRENT_CONTENT_VERSION },
    saveChanges: { en: 'Save Changes', 'se-lat': 'Sačuvaj izmene', se: 'Сачувај измене', ru: 'Сохранить изменения', version: CURRENT_CONTENT_VERSION },
    loading: { en: "Loading...", ru: "Загрузка...", se: "Учитавање...", "se-lat": "Učitavanje...", version: CURRENT_CONTENT_VERSION },
    data_management: { en: "Data Management", ru: "Управление данными", se: "Управљање подацима", "se-lat": "Upravljanje podacima", version: CURRENT_CONTENT_VERSION },
    deleteAllData: { en: "Delete All My Data", ru: "Удалить все мои данные", se: "Обриши све моје податке", "se-lat": "Obriši sve moje podatke", version: CURRENT_CONTENT_VERSION },
    deleteAllDataConfirmTitle: { en: "Are you absolutely sure?", ru: "Вы абсолютно уверены?", se: "Да ли сте апсолутно сигурни?", "se-lat": "Da li ste apsolutno sigurni?", version: CURRENT_CONTENT_VERSION },
    deleteAllDataConfirmDesc: { en: "This action cannot be undone. This will permanently delete all your cycle and event data.", ru: "Это действие необратимо. Все данные о ваших циклах и событиях будут безвозвратно удалены.", se: "Ова радња се не може опозвати. Ово ће трајно обрисати све податке о вашим циклусима и догађајима.", "se-lat": "Ova radnja se ne može opozvati. Ovo će trajno obrisati sve podatke o vašim ciklusima i događajima.", version: CURRENT_CONTENT_VERSION },
    dataDeletedTitle: { en: "Data Deleted", ru: "Данные удалены", se: "Подаци обрисани", "se-lat": "Podaci obrisani", version: CURRENT_CONTENT_VERSION },
    dataDeletedDesc: { en: "All your calendar data has been successfully deleted.", ru: "Все ваши данные календаря были успешно удалены.", se: "Сви ваши подаци из календара су успешно обрисани.", "se-lat": "Svi vaši podaci iz kalendara su uspešno obrisani.", version: CURRENT_CONTENT_VERSION },
    dataDeletedError: { en: "Failed to delete data. Please try again.", ru: "Не удалось удалить данные. Пожалуйста, попробуйте еще раз.", se: "Брисање података није успело. Молимо покушајте поново.", "se-lat": "Brisanje podataka nije uspelo. Molimo pokušajte ponovo.", version: CURRENT_CONTENT_VERSION },
};
