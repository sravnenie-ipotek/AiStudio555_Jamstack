-- Update Russian contact form translations with complete form fields
UPDATE nd_home
SET content_ru = jsonb_set(
  COALESCE(content_ru, '{}'),
  '{contact,content,form}',
  '{
    "name_label": "Ваше имя *",
    "name_placeholder": "Введите ваше имя",
    "email_label": "Электронная почта *",
    "email_placeholder": "Например: email@example.com",
    "subject_label": "Тема *",
    "subject_placeholder": "Например: Хочу консультацию",
    "message_label": "Ваше сообщение *",
    "message_placeholder": "Напишите, что вы хотите нам сообщить...",
    "submit_button": "Отправить сообщение",
    "sending_message": "Отправка сообщения...",
    "success_message": "Сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.",
    "error_message": "Извините, произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз."
  }'::jsonb
)
WHERE section_key = 'contact';

-- Update Hebrew contact form translations with complete form fields
UPDATE nd_home
SET content_he = jsonb_set(
  COALESCE(content_he, '{}'),
  '{contact,content,form}',
  '{
    "name_label": "השם שלך *",
    "name_placeholder": "הכנס את שמך",
    "email_label": "כתובת אימייל *",
    "email_placeholder": "לדוגמה: email@example.com",
    "subject_label": "נושא *",
    "subject_placeholder": "לדוגמה: רוצה ייעוץ",
    "message_label": "ההודעה שלך *",
    "message_placeholder": "כתוב מה תרצה לשתף איתנו...",
    "submit_button": "שלח הודעה",
    "sending_message": "שולח הודעה...",
    "success_message": "ההודעה נשלחה בהצלחה. נחזור אליך בקרוב.",
    "error_message": "מצטערים, אירעה שגיאה בשליחת ההודעה. אנא נסה שוב."
  }'::jsonb
)
WHERE section_key = 'contact';

-- Also update the main content section with correct title and description
UPDATE nd_home
SET content_ru = jsonb_set(
  COALESCE(content_ru, '{}'),
  '{contact,content,content}',
  '{
    "title": "Свяжитесь с нами",
    "description": "Расскажите, как мы можем помочь вам в обучении",
    "form": {
      "name_label": "Ваше имя *",
      "name_placeholder": "Введите ваше имя",
      "email_label": "Электронная почта *",
      "email_placeholder": "Например: email@example.com",
      "subject_label": "Тема *",
      "subject_placeholder": "Например: Хочу консультацию",
      "message_label": "Ваше сообщение *",
      "message_placeholder": "Напишите, что вы хотите нам сообщить...",
      "submit_button": "Отправить сообщение",
      "sending_message": "Отправка сообщения...",
      "success_message": "Сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.",
      "error_message": "Извините, произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз."
    }
  }'::jsonb
)
WHERE section_key = 'contact';

UPDATE nd_home
SET content_he = jsonb_set(
  COALESCE(content_he, '{}'),
  '{contact,content,content}',
  '{
    "title": "צור קשר",
    "description": "ספר לנו כיצד נוכל לעזור לך במסע הלמידה שלך",
    "form": {
      "name_label": "השם שלך *",
      "name_placeholder": "הכנס את שמך",
      "email_label": "כתובת אימייל *",
      "email_placeholder": "לדוגמה: email@example.com",
      "subject_label": "נושא *",
      "subject_placeholder": "לדוגמה: רוצה ייעוץ",
      "message_label": "ההודעה שלך *",
      "message_placeholder": "כתוב מה תרצה לשתף איתנו...",
      "submit_button": "שלח הודעה",
      "sending_message": "שולח הודעה...",
      "success_message": "ההודעה נשלחה בהצלחה. נחזור אליך בקרוב.",
      "error_message": "מצטערים, אירעה שגיאה בשליחת ההודעה. אנא נסה שוב."
    }
  }'::jsonb
)
WHERE section_key = 'contact';