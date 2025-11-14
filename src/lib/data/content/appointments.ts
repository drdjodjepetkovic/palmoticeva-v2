import type { ContentItem } from '@/types/content';

const CURRENT_CONTENT_VERSION = 2;

export const appointmentsContent: { [key: string]: ContentItem & { version: number } } = {
  appointments_title: { en: "Online Booking", ru: "Онлайн-запись", se: "Онлајн заказивање", "se-lat": "Online Zakazivanje", version: CURRENT_CONTENT_VERSION },
  appointments_inquiry_title: { en: "Contact & Inquiries", "se-lat": "Kontakt i Pitanja", se: "Контакт и Питања", ru: "Контакт и вопросы", version: CURRENT_CONTENT_VERSION },
  appointments_tab_booking: { en: "Booking", "se-lat": "Zakazivanje", se: "Заказивање", ru: "Запись", version: CURRENT_CONTENT_VERSION },
  appointments_tab_contact: { en: "Contact Us", "se-lat": "Kontaktirajte Nas", se: "Контактирајте Нас", ru: "Свяжитесь с нами", version: CURRENT_CONTENT_VERSION },
  appointments_fullname_label: { en: "Full Name", ru: "Полное имя", se: "Пуно име и презиме", "se-lat": "Puno Ime i Prezime", version: CURRENT_CONTENT_VERSION },
  appointments_email_label: { en: "Email Address", ru: "Адрес электронной почты", se: "Имејл адреса", "se-lat": "Email Adresa", version: CURRENT_CONTENT_VERSION },
  appointments_phone_label: { en: "Phone Number", ru: "Номер телефона", se: "Број телефона", "se-lat": "Broj Telefona", version: CURRENT_CONTENT_VERSION },
  appointments_date_label: { en: "Desired Appointment Date", ru: "Желаемая дата приема", se: "Жељени датум термина", "se-lat": "Željeni Datum Termina", version: CURRENT_CONTENT_VERSION },
  appointments_date_placeholder: { en: "Pick a date", ru: "Выберите дату", se: "Изаберите датум", "se-lat": "Izaberite datum", version: CURRENT_CONTENT_VERSION },
  appointments_time_label: { en: "Preferred Appointment Time", ru: "Предпочтительное время приема", se: "Преферирано време термина", "se-lat": "Preferirano Vreme Termina", version: CURRENT_CONTENT_VERSION },
  appointments_time_morning: { en: "Morning (08-12h)", ru: "Утро (08-12ч)", se: "Пре подне (08-12ч)", "se-lat": "Pre podne (08-12h)", version: CURRENT_CONTENT_VERSION },
  appointments_time_midday: { en: "Midday (12-16h)", ru: "Полдень (12-16ч)", se: "Средина дана (12-16ч)", "se-lat": "Sredina dana (12-16h)", version: CURRENT_CONTENT_VERSION },
  appointments_time_afternoon: { en: "Afternoon (16-20h)", ru: "После обеда (16-20ч)", se: "После подне (16-20ч)", "se-lat": "Posle podne (16-20h)", version: CURRENT_CONTENT_VERSION },
  appointments_message_label: { en: "Message (optional)", ru: "Сообщение (необязательно)", se: "Порука (опционо)", "se-lat": "Poruka (opciono)", version: CURRENT_CONTENT_VERSION },
  appointments_message_placeholder: { en: "Briefly describe the reason for your visit...", ru: "Кратко опишите причину вашего визита...", se: "Укратко опишите разлог Вашег доласка...", "se-lat": "Ukratko opišite razlog Vašeg dolaska...", version: CURRENT_CONTENT_VERSION },
  appointments_contact_message_placeholder: { 
    en: "If you have any questions, concerns, or need additional information, please write in this field. We will be happy to answer all your questions.",
    "se-lat": "Ukoliko imate bilo kakvih pitanja, nedoumica, ili su Vam potrebne dodatne informacije, napisite u ovom polju, rado cemo Vam odgovoriti na sva pitanja.",
    se: "Уколико имате било каквих питања, недоумица, или су Вам потребне додатне информације, напишите у овом пољу, радо ћемо Вам одговорити на сва питања.",
    ru: "Если у вас есть какие-либо вопросы, сомнения или вам нужна дополнительная информация, пожалуйста, напишите в этом поле. Мы с радостью ответим на все ваши вопросы.",
    version: CURRENT_CONTENT_VERSION
  },
  appointments_submit_button: { en: "SEND INQUIRY", ru: "ОТПРАВИТЬ ЗАПРОС", se: "ПОШАЉИ УПИТ", "se-lat": "POŠALJI UPIT", version: CURRENT_CONTENT_VERSION },
  appointments_contact_submit_button: { en: "SEND QUESTION", "se-lat": "POŠALJI PITANJE", se: "ПОШАЉИ ПИТАЊЕ", ru: "ОТПРАВИТЬ ВОПРОС", version: CURRENT_CONTENT_VERSION },
  appointments_secure_text: { en: "Your data is encrypted and secure.", ru: "Ваши данные зашифрованы и защищены.", se: "Ваши подаци су шифровани и сигурни.", "se-lat": "Vaši podaci su šifrovani i sigurni.", version: CURRENT_CONTENT_VERSION },
  appointments_toast_success_title: { en: "Inquiry Sent!", ru: "Запрос отправлен!", se: "Упит послат!", "se-lat": "Upit poslat!", version: CURRENT_CONTENT_VERSION },
  appointments_toast_success_desc: { en: "We have received your request and will contact you shortly.", ru: "Мы получили ваш запрос и свяжемся с вами в ближайшее время.", se: "Примили смо Ваш захтев и ускоро ћемо Вас контактирати.", "se-lat": "Primili smo Vaš zahtev i uskoro ćemo Vas kontaktirati.", version: CURRENT_CONTENT_VERSION },
  appointments_toast_error_title: { en: "Submission Error", ru: "Ошибка отправки", se: "Грешка при слању", "se-lat": "Greška pri slanju", version: CURRENT_CONTENT_VERSION },
  appointments_toast_error_desc: { en: "There was a problem submitting your form. Please try again.", ru: "Возникла проблема при отправке формы. Пожалуйста, попробуйте еще раз.", se: "Дошло је до проблема приликом слања обрасца. Молимо покушајте поново.", "se-lat": "Došlo je do problema prilikom slanja obrasca. Molimo pokušajte ponovo.", version: CURRENT_CONTENT_VERSION },
  appointments_dialog_save_info_title: { en: "Save Your Information?", ru: "Сохранить вашу информацию?", se: "Сачувати Ваше податке?", "se-lat": "Sačuvati Vaše podatke?", version: CURRENT_CONTENT_VERSION },
  appointments_dialog_save_info_desc: { en: "Would you like us to remember your details for next time? You can sign in with Google to pre-fill this form in the future.", ru: "Хотите, чтобы мы запомнили ваши данные для следующего раза? Вы можете войти через Google, чтобы в будущем предварительно заполнять эту форму.", se: "Да ли желите да запамтимо Ваше податке за следећи пут? Можете се пријавити преко Google-а како бисте убудуће лакше попунили овај формулар.", "se-lat": "Da li želite da zapamtimo Vaše podatke za sledeći put? Možete se prijaviti preko Google-a kako biste ubuduće lakše popunili ovaj formular.", version: CURRENT_CONTENT_VERSION },
  appointments_dialog_save_info_confirm: { en: "Yes, Thank You", ru: "Да, спасибо", se: "Да, хвала", "se-lat": "Da, hvala", version: CURRENT_CONTENT_VERSION },
  appointments_dialog_save_info_cancel: { en: "Next Time", ru: "В следующий раз", se: "Следећи пут", "se-lat": "Sledeći put", version: CURRENT_CONTENT_VERSION },
  appointments_dialog_update_profile_title: { en: "Update Your Profile?", ru: "Обновить ваш профиль?", se: "Ажурирати Ваш профил?", "se-lat": "Ažurirati Vaš profil?", version: CURRENT_CONTENT_VERSION },
  appointments_dialog_update_profile_desc: { en: "We noticed you've changed your details. Would you like to save these changes to your profile for next time?", ru: "Мы заметили, что вы изменили свои данные. Хотите сохранить эти изменения в своем профиле для следующего раза?", se: "Приметили смо да сте променили своје податке. Да ли желите да сачувате ове промене на свом профилу за следећи пут?", "se-lat": "Primetili smo da ste promenili svoje podatke. Da li želite da sačuvate ove promene na svom profilu za sledeći put?", version: CURRENT_CONTENT_VERSION },
  appointments_dialog_update_profile_confirm: { en: "Yes, Update", ru: "Да, обновить", se: "Да, ажурирај", "se-lat": "Da, ažuriraj", version: CURRENT_CONTENT_VERSION },
  appointments_dialog_update_profile_cancel: { en: "No, Thanks", ru: "Нет, спасибо", se: "Не, хвала", "se-lat": "Ne, hvala", version: CURRENT_CONTENT_VERSION },
};
