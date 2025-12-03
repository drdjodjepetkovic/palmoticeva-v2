
import type { ContentItem } from '@/types/content';

const CURRENT_CONTENT_VERSION = 3;

export const profileContent: { [key: string]: ContentItem & { version: number } } = {
  profile_title: { en: "My Profile", ru: "Мой профиль", se: "Мој профил", "sr": "Moj Profil", version: CURRENT_CONTENT_VERSION },
  profile_description: { en: "Manage your account settings and set e-mail preferences.", ru: "Управляйте настройками своей учетной записи и настраивайте параметры электронной почты.", se: "Управљајте подешавањима свог налога и подесите преференције е-поште.", "sr": "Upravljajte podešavanjima svog nalogа i podesite preferencije e-pošte.", version: CURRENT_CONTENT_VERSION },
  profile_verify_cta_title: { en: "Unlock Your Patient Portal", ru: "Разблокируйте свой портал пациента", se: "Откључајте Ваш Портал за Пацијенте", "sr": "Otključajte Vaš Portal za Pacijente", version: CURRENT_CONTENT_VERSION },
  profile_verify_cta_desc: { 
      en: "If you are a patient of the Palmotićeva clinic, request verification to access exclusive features such as online results, appointments, and direct messages.", 
      ru: "Если вы пациент клиники «Палмотичева», запросите верификацию, чтобы получить доступ к эксклюзивным функциям, таким как онлайн-результаты, запись на прием и прямые сообщения.", 
      se: "Уколико сте пацијент ординације Палмотићева, затражите верификацију како бисте приступили ексклузивним функцијама као што су онлине резултати, заказивања и директне поруке.", 
      "sr": "Ukoliko ste pacijent ordinacije Palmotićeva, zatražite verifikaciju kako biste pristupili ekskluzivnim funkcijama kao što su online rezultati, zakazivanja i direktne poruke.", 
      version: CURRENT_CONTENT_VERSION 
  },
  profile_verify_cta_button: { en: "Request Verification", ru: "Запросить подтверждение", se: "Затражи Верификацију", "sr": "Zatraži Verifikaciju", version: CURRENT_CONTENT_VERSION },
  profile_nav_profile: { en: "My Profile", ru: "Мой профиль", se: "Мој Профил", "sr": "Moj Profil", version: CURRENT_CONTENT_VERSION },
  profile_nav_notifications: { en: "Notifications", ru: "Уведомления", se: "Обавештења", "sr": "Obaveštenja", version: CURRENT_CONTENT_VERSION },
  profile_nav_results: { en: "My Results", ru: "Мои результаты", se: "Моји Резултати", "sr": "Moji Rezultati", version: CURRENT_CONTENT_VERSION },
  profile_nav_appointments: { en: "My Appointments", ru: "Мои записи", se: "Моји Термини", "sr": "Moji Termini", version: CURRENT_CONTENT_VERSION },
  profile_nav_messages: { en: "My Messages", ru: "Мои сообщения", se: "Моје Поруке", "sr": "Moje Poruke", version: CURRENT_CONTENT_VERSION },
  profile_form_name_label: { en: "Full Name", ru: "Полное имя", se: "Име и презиме", "sr": "Ime i prezime", version: CURRENT_CONTENT_VERSION },
  profile_form_email_label: { en: "Email Address", ru: "Адрес электронной почты", se: "Имејл адреса", "sr": "Email adresa", version: CURRENT_CONTENT_VERSION },
  profile_form_phone_label: { en: "Phone Number", ru: "Номер телефона", se: "Број телефона", "sr": "Broj telefona", version: CURRENT_CONTENT_VERSION },
  profile_form_save_button: { en: "Save Changes", ru: "Сохранить изменения", se: "Сачувај измене", "sr": "Sačuvaj izmene", version: CURRENT_CONTENT_VERSION },
  toast_profile_updated_title: { en: "Profile Updated", ru: "Профиль обновлен", se: "Профил је ажуриран", "sr": "Profil je ažuriran", version: CURRENT_CONTENT_VERSION },
  toast_profile_updated_desc: { en: "Your information has been successfully saved.", ru: "Ваша информация была успешно сохранена.", se: "Ваши подаци су успешно сачувани.", "sr": "Vaši podaci su uspešno sačuvani.", version: CURRENT_CONTENT_VERSION },
  toast_profile_update_error_title: { en: "Update Error", ru: "Ошибка обновления", se: "Грешка при ажурирању", "sr": "Greška pri ažuriranju", version: CURRENT_CONTENT_VERSION },
  toast_profile_update_error_desc: { en: "There was a problem updating your profile. Please try again.", ru: "Возникла проблема при обновлении вашего профиля.", se: "Дошло је до проблема приликом ажурирања Вашег профила.", "sr": "Došlo je do problema prilikom ажурирања Vašeg profila. Molimo pokušajte ponovo.", version: CURRENT_CONTENT_VERSION },
  results_title: { en: "My Results", "sr": "Moji Nalazi", se: "Моји Налази", ru: "Мои Результаты", version: CURRENT_CONTENT_VERSION },
  results_description: { en: "Here you can find all your medical results in PDF format.", "sr": "Ovde možete pronaći sve Vaše nalaze u PDF formatu.", se: "Овде можете пронаћи све Ваше налазе у ПДФ формату.", ru: "Здесь вы можете найти все ваши медицинские результаты в формате PDF.", version: CURRENT_CONTENT_VERSION },
  results_no_results_title: { en: "No Results Yet", "sr": "Još Uvek Nema Nalaza", se: "Још Увек Нема Налаза", ru: "Результатов Пока Нет", version: CURRENT_CONTENT_VERSION },
  results_no_results_desc: { en: "Your medical results will appear here as soon as they are ready.", "sr": "Vaši nalazi će se pojaviti ovde čim budu gotovi.", se: "Ваши налази ће се појавити овде чим буду готови.", ru: "Ваши медицинские результаты появятся здесь, как только будут готовы.", version: CURRENT_CONTENT_VERSION },
  
  verification_request_sent_title: { en: "Request Sent", "sr": "Zahtev poslat", se: "Захтев послат", ru: "Запрос отправлен", version: CURRENT_CONTENT_VERSION },
  verification_request_sent_desc: { en: "Your verification request has been sent. You will be notified when it's approved.", "sr": "Vaš zahtev za verifikaciju je poslat. Bićete obavešteni kada bude odobren.", se: "Ваш захтев за верификацију је послат. Бићете обавештени када буде одобрен.", ru: "Ваш запрос на верификацию отправлен. Вы получите уведомление, когда он будет одобрен.", version: CURRENT_CONTENT_VERSION },
  verification_request_error_title: { en: "Error", "sr": "Greška", se: "Грешка", ru: "Ошибка", version: CURRENT_CONTENT_VERSION },
  verification_request_pending_title: { en: "Request Pending", "sr": "Zahtev na čekanju", se: "Захтев на чекању", ru: "Запрос в ожидании", version: CURRENT_CONTENT_VERSION },
  verification_request_pending_desc: { en: "You have sent a verification request. Our team will process it shortly.", "sr": "Poslali ste zahtev za verifikaciju. Naš tim će ga obraditi u najkraćem roku.", se: "Послали сте захтев за верификацију. Наш тим ће га обрадити у најкраћем року.", ru: "Вы отправили запрос на верификацию. Наша команда обработает его в ближайшее время.", version: CURRENT_CONTENT_VERSION },

  verify_title: { en: "Account Verification", ru: "Подтверждение аккаунта", se: "Верификација налога", "sr": "Verifikacija naloga", version: CURRENT_CONTENT_VERSION },
  verify_desc_prefix: { en: "Welcome", ru: "Добро пожаловать", se: "Добродошли", "sr": "Dobrodošli", version: CURRENT_CONTENT_VERSION },
  verify_desc_suffix: { en: "Please enter your verification code to gain full access.", ru: "Пожалуйста, введите ваш код верификации, чтобы получить полный доступ.", se: "Молимо унесите свој верификациони код да бисте добили пун приступ.", "sr": "Molimo unesite svoj verifikacioni kod da biste dobili pun pristup.", version: CURRENT_CONTENT_VERSION },
  verify_label: { en: "Verification Code", ru: "Код верификации", se: "Верификациони код", "sr": "Verifikacioni kod", version: CURRENT_CONTENT_VERSION },
  verify_input_placeholder: { en: "Enter code...", ru: "Введите код...", se: "Унесите код...", "sr": "Unesite kod...", version: CURRENT_CONTENT_VERSION },
  verify_button_verifying: { en: "Verifying...", ru: "Проверка...", se: "Верификује се...", "sr": "Verifikuje se...", version: CURRENT_CONTENT_VERSION },
  verify_button_default: { en: "Verify Account", ru: "Подтвердить аккаунт", se: "Верификуј налог", "sr": "Verifikuj nalog", version: CURRENT_CONTENT_VERSION },
  verify_toast_error_title: { en: "Error", ru: "Ошибка", se: "Грешка", "sr": "Greška", version: CURRENT_CONTENT_VERSION },
  verify_toast_error_loggedin: { en: "You must be logged in.", ru: "Вы должны быть авторизованы.", se: "Морате бити пријављени.", "sr": "Morate biti prijavljeni.", version: CURRENT_CONTENT_VERSION },
  verify_toast_success_title: { en: "Success!", ru: "Успешно!", se: "Успех!", "sr": "Uspeh!", version: CURRENT_CONTENT_VERSION },
  verify_toast_success_desc: { en: "Your account has been verified. You now have full access.", ru: "Ваш аккаунт был подтвержден. Теперь у вас есть полный доступ.", se: "Ваш налог је верификован. Сада имате пун приступ.", "sr": "Vaš nalog je verifikovan. Sada imate pun pristup.", version: CURRENT_CONTENT_VERSION },
  verify_toast_error_update: { en: "Could not update your role. Please try again.", ru: "Не удалось обновить вашу роль. Пожалуйста, попробуйте еще раз.", se: "Није могуће ажурирати вашу улогу. Молимо покушајте поново.", "sr": "Nije moguće ažurirati vašu ulogu. Molimo pokušajte ponovo.", version: CURRENT_CONTENT_VERSION },
  verify_toast_invalid_code_title: { en: "Invalid Code", ru: "Неверный код", se: "Неважећи код", "sr": "Nevažeći kod", version: CURRENT_CONTENT_VERSION },
  verify_toast_invalid_code_desc: { en: "The code you entered is incorrect. Please try again.", ru: "Введенный вами код неверен. Пожалуйста, попробуйте еще раз.", se: "Код који сте унели је нетачан. Молимо покушајте поново.", "sr": "Kod koji ste uneli je netačan. Molimo pokušajte ponovo.", version: CURRENT_CONTENT_VERSION },
};
