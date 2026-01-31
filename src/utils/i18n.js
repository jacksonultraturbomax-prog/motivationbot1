/**
 * Система интернационализации (i18n)
 * Поддерживает русский, английский и украинский языки
 */

// Переводы для всех языков
const translations = {
  ru: {
    // Выбор языка
    language: {
      select: 'Выберите язык / Choose language / Оберіть мову:',
      russian: 'Русский',
      english: 'English',
      ukrainian: 'Українська',
      selected: 'Язык установлен: Русский',
    },
    
    // Команда /start
    start: {
      welcome: 'Привет! Я - Саня, старший брат Жеки... Неважно, в общем. Я могу поддержать тебя так, чтобы от этого был реальный эффект. И в душе теплее стало. Ну, и могу напоминать тебе каждый день, чтобы ты не расслаблялся. Попробуем?',
      letsGo: 'Давай!',
    },
    
    // Главное меню
    menu: {
      random: 'Случайная Мотивация',
      useful: 'Полезные Материалы',
      commands: 'Список Команд',
      settings: 'Настройки',
    },
    
    // Настройки
    settings: {
      title: 'Выбери, что настроить:',
      changeType: 'Сменить Тип',
      changeFrequency: 'Сменить Частоту',
      changeLanguage: 'Сменить Язык',
      back: 'Назад',
    },
    
    // Типы мотивации
    motivation: {
      types: {
        hard: 'Жесткая мотивация',
        soft: 'Мягкая поддержка',
        brotherly: 'Братский подзатыльник',
        psychological: 'Психологическая перезагрузка',
      },
      description: 'Я могу поддержать тебя по-разному:\n\nЖесткая мотивация - правда в лицо, без соплей\nМягкая поддержка - тепло и спокойно\nБратский подзатыльник - трезво и с заботой\nПсихологическая перезагрузка - научно и размеренно',
      select: 'Какую мотивацию хочешь?',
      change: 'Вот как я могу поддержать:\n\nЖесткая мотивация - правда в лицо, без соплей\nМягкая поддержка - тепло и спокойно\nБратский подзатыльник - трезво и с заботой\nПсихологическая перезагрузка - научно и размеренно\n\nХочешь сменить стиль? Нажми +',
    },
    
    // Частота
    frequency: {
      none: 'Не Надо Напоминаний',
      daily: 'Раз в День',
      twiceDaily: 'Два Раза в День',
      every3Days: 'Раз в 3 Дня',
      select: 'Как часто тебе отправлять напоминания?\n\n- без напоминаний\n- раз в день\n- дважды в день\n- раз в 3 дня\n\nХочешь изменить? Нажми +',
      accepted: 'Принято, сделаем. И финальный вопрос: как часто тебе отправлять напоминания?',
      saved: 'Договорились, я запомнил. Тогда на связи.',
      changed: 'Отлично, запомнил! Если что, то можно сменить в любой момент.',
    },
    
    // Общие
    common: {
      confirmation: 'ПО КАЙФУ. ОБНЯЛ ☀️',
      allGood: 'Всё Устраивает',
      allOk: 'Всё Ок',
      change: '+',
      noTexts: 'Похоже, все тексты закончились! Проверь файл с текстами или обнови командой /reload_texts.',
      textsReloaded: 'Тексты обновлены!',
      unknownCommand: 'Не понимаю эту команду. Используй /help для списка доступных команд.',
    },
    
    // Полезные материалы
    useful: {
      title: 'Да, родной, держи хорошие материалы, которые помогут зарядиться:',
      youtube: '▶️ YouTube канал Жеки: там он делится и умными материалами, и мотивацией для жизни, и полезными вещами.\n[youtube канал](https://www.youtube.com/@grebinenko)',
      videos: '🔹 Другие хорошие видео: 🔹',
      books: '📘 Что почитать? 📘',
      bot: '🤔 Если не знаешь что делать прямо сейчас, можешь воспользоваться подсказкой из нашего бота: [ЧТО ДЕЛАТЬ?](https://t.me/chtomnedelat_bot) 🤔',
      pinterest: '📌 А если нужна визуальная мотивация, то рекомендуем этот [Pinterest](https://www.pinterest.com/imperium1motivation/) 📌',
    },
    
    // Помощь
    help: {
      title: 'Вот список того, чем я могу помочь прямо сейчас:',
      commands: {
        random: '🎯 /random Присылаю случайную мотивацию',
        useful: '📚 /useful Полезные материалы',
        motivationType: '🧠 /motivation_type Типы поддержки',
        motivation: '✨ /motivation Мотивация по категориям',
        changeMotivation: '🔄 /change_motivation Сменить тип мотивации',
        changeFrequency: '⏰ /change_frequency Сменить частоту напоминаний',
        start: '🚀 /start Начать заново',
        reloadTexts: '🔃 /reload_texts Обновить тексты из файла',
        help: 'ℹ️ /help Список команд',
      },
    },
    
    // Планировщик
    scheduler: {
      scheduledMessage: '**📅 Прочитай, пожалуйста. И я верю в тебя! 📅**',
    },
  },
  
  en: {
    // Language selection
    language: {
      select: 'Choose your language:',
      russian: 'Русский',
      english: 'English',
      ukrainian: 'Українська',
      selected: 'Language set: English',
    },
    
    // /start command
    start: {
      welcome: 'Hi! I\'m Sanya, Zheka\'s older brother... Never mind. I can support you in a way that has a real effect. And it will warm your soul. And I can remind you every day so you don\'t relax. Shall we try?',
      letsGo: 'Let\'s go!',
    },
    
    // Main menu
    menu: {
      random: 'Random Motivation',
      useful: 'Useful Materials',
      commands: 'Command List',
      settings: 'Settings',
    },
    
    // Settings
    settings: {
      title: 'Choose what to configure:',
      changeType: 'Change Type',
      changeFrequency: 'Change Frequency',
      changeLanguage: 'Change Language',
      back: 'Back',
    },
    
    // Motivation types
    motivation: {
      types: {
        hard: 'Hard Motivation',
        soft: 'Soft Support',
        brotherly: 'Brotherly Nudge',
        psychological: 'Psychological Reboot',
      },
      description: 'I can support you in different ways:\n\nHard Motivation - truth in your face, no BS\nSoft Support - warm and calm\nBrotherly Nudge - sober and caring\nPsychological Reboot - scientific and measured',
      select: 'What kind of motivation do you want?',
      change: 'Here\'s how I can support you:\n\nHard Motivation - truth in your face, no BS\nSoft Support - warm and calm\nBrotherly Nudge - sober and caring\nPsychological Reboot - scientific and measured\n\nWant to change style? Press +',
    },
    
    // Frequency
    frequency: {
      none: 'No Reminders',
      daily: 'Once a Day',
      twiceDaily: 'Twice a Day',
      every3Days: 'Every 3 Days',
      select: 'How often should I send reminders?\n\n- no reminders\n- once a day\n- twice a day\n- every 3 days\n\nWant to change? Press +',
      accepted: 'Got it. And the final question: how often should I send reminders?',
      saved: 'Deal, I remember. Then we\'re in touch.',
      changed: 'Great, I remember! If anything, you can change it anytime.',
    },
    
    // Common
    common: {
      confirmation: 'AWESOME. HUGGED ☀️',
      allGood: 'All Good',
      allOk: 'All Ok',
      change: '+',
      noTexts: 'Looks like all texts are gone! Check the texts file or update with /reload_texts command.',
      textsReloaded: 'Texts updated!',
      unknownCommand: 'I don\'t understand this command. Use /help for a list of available commands.',
    },
    
    // Useful materials
    useful: {
      title: 'Yes, buddy, here are good materials that will help you recharge:',
      youtube: '▶️ Zheka\'s YouTube channel: there he shares smart materials, life motivation, and useful things.\n[youtube channel](https://www.youtube.com/@grebinenko)',
      videos: '🔹 Other good videos: 🔹',
      books: '📘 What to read? 📘',
      bot: '🤔 If you don\'t know what to do right now, you can use a hint from our bot: [WHAT TO DO?](https://t.me/chtomnedelat_bot) 🤔',
      pinterest: '📌 And if you need visual motivation, we recommend this [Pinterest](https://www.pinterest.com/imperium1motivation/) 📌',
    },
    
    // Help
    help: {
      title: 'Here\'s a list of what I can help you with right now:',
      commands: {
        random: '🎯 /random I send random motivation',
        useful: '📚 /useful Useful materials',
        motivationType: '🧠 /motivation_type Types of support',
        motivation: '✨ /motivation Motivation by categories',
        changeMotivation: '🔄 /change_motivation Change motivation type',
        changeFrequency: '⏰ /change_frequency Change reminder frequency',
        start: '🚀 /start Start over',
        reloadTexts: '🔃 /reload_texts Update texts from file',
        help: 'ℹ️ /help Command list',
      },
    },
    
    // Scheduler
    scheduler: {
      scheduledMessage: '**📅 Please read. And I believe in you! 📅**',
    },
  },
  
  uk: {
    // Вибір мови
    language: {
      select: 'Оберіть мову:',
      russian: 'Русский',
      english: 'English',
      ukrainian: 'Українська',
      selected: 'Мову встановлено: Українська',
    },
    
    // Команда /start
    start: {
      welcome: 'Привіт! Я - Саня, старший брат Жеки... Неважливо, загалом. Я можу підтримати тебе так, щоб від цього був реальний ефект. І на душі тепліше стало. Ну, і можу нагадувати тобі кожен день, щоб ти не розслаблявся. Спробуємо?',
      letsGo: 'Давай!',
    },
    
    // Головне меню
    menu: {
      random: 'Випадкова Мотивація',
      useful: 'Корисні Матеріали',
      commands: 'Список Команд',
      settings: 'Налаштування',
    },
    
    // Налаштування
    settings: {
      title: 'Оберіть, що налаштувати:',
      changeType: 'Змінити Тип',
      changeFrequency: 'Змінити Частоту',
      changeLanguage: 'Змінити Мову',
      back: 'Назад',
    },
    
    // Типи мотивації
    motivation: {
      types: {
        hard: 'Жорстка мотивація',
        soft: 'М\'яка підтримка',
        brotherly: 'Братський підзатільник',
        psychological: 'Психологічна перезавантаження',
      },
      description: 'Я можу підтримати тебе по-різному:\n\nЖорстка мотивація - правда в обличчя, без соплів\nМ\'яка підтримка - тепло і спокійно\nБратський підзатільник - тверезо і з турботою\nПсихологічна перезавантаження - науково і вимірено',
      select: 'Яку мотивацію хочеш?',
      change: 'Ось як я можу підтримати:\n\nЖорстка мотивація - правда в обличчя, без соплів\nМ\'яка підтримка - тепло і спокійно\nБратський підзатільник - тверезо і з турботою\nПсихологічна перезавантаження - науково і вимірено\n\nХочеш змінити стиль? Натисни +',
    },
    
    // Частота
    frequency: {
      none: 'Не Треба Нагадувань',
      daily: 'Раз на День',
      twiceDaily: 'Двічі на День',
      every3Days: 'Раз в 3 Дні',
      select: 'Як часто тобі надсилати нагадування?\n\n- без нагадувань\n- раз на день\n- двічі на день\n- раз в 3 дні\n\nХочеш змінити? Натисни +',
      accepted: 'Прийнято, зробимо. І фінальне питання: як часто тобі надсилати нагадування?',
      saved: 'Домовилися, я запам\'ятав. Тоді на зв\'язку.',
      changed: 'Відмінно, запам\'ятав! Якщо що, то можна змінити в будь-який момент.',
    },
    
    // Загальне
    common: {
      confirmation: 'ПО КАЙФУ. ОБІЙМАВ ☀️',
      allGood: 'Все Влаштовує',
      allOk: 'Все Ок',
      change: '+',
      noTexts: 'Схоже, всі тексти закінчилися! Перевір файл з текстами або онови командою /reload_texts.',
      textsReloaded: 'Тексти оновлено!',
      unknownCommand: 'Не розумію цю команду. Використовуй /help для списку доступних команд.',
    },
    
    // Корисні матеріали
    useful: {
      title: 'Так, рідний, тримай хороші матеріали, які допоможуть зарядитися:',
      youtube: '▶️ YouTube канал Жеки: там він ділиться і розумними матеріалами, і мотивацією для життя, і корисними речами.\n[youtube канал](https://www.youtube.com/@grebinenko)',
      videos: '🔹 Інші хороші відео: 🔹',
      books: '📘 Що почитати? 📘',
      bot: '🤔 Якщо не знаєш що робити прямо зараз, можеш скористатися підказкою з нашого бота: [ЩО РОБИТИ?](https://t.me/chtomnedelat_bot) 🤔',
      pinterest: '📌 А якщо потрібна візуальна мотивація, то рекомендуємо цей [Pinterest](https://www.pinterest.com/imperium1motivation/) 📌',
    },
    
    // Допомога
    help: {
      title: 'Ось список того, чим я можу допомогти прямо зараз:',
      commands: {
        random: '🎯 /random Надсилаю випадкову мотивацію',
        useful: '📚 /useful Корисні матеріали',
        motivationType: '🧠 /motivation_type Типи підтримки',
        motivation: '✨ /motivation Мотивація за категоріями',
        changeMotivation: '🔄 /change_motivation Змінити тип мотивації',
        changeFrequency: '⏰ /change_frequency Змінити частоту нагадувань',
        start: '🚀 /start Почати заново',
        reloadTexts: '🔃 /reload_texts Оновити тексти з файлу',
        help: 'ℹ️ /help Список команд',
      },
    },
    
    // Планувальник
    scheduler: {
      scheduledMessage: '**📅 Прочитай, будь ласка. І я вірю в тебе! 📅**',
    },
  },
};

/**
 * Получение перевода по ключу
 * @param {string} lang - Язык (ru, en, uk)
 * @param {string} key - Ключ перевода (например: 'start.welcome')
 * @param {object} params - Параметры для подстановки
 * @returns {string} - Переведенный текст
 */
export function t(lang, key, params = {}) {
  const defaultLang = 'ru';
  const langToUse = translations[lang] ? lang : defaultLang;
  
  const keys = key.split('.');
  let value = translations[langToUse];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback на русский, если ключ не найден
      value = translations[defaultLang];
      for (const k2 of keys) {
        if (value && typeof value === 'object' && k2 in value) {
          value = value[k2];
        } else {
          return key; // Возвращаем ключ, если перевод не найден
        }
      }
      break;
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // Подстановка параметров
  return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
    return params[paramKey] !== undefined ? params[paramKey] : match;
  });
}

/**
 * Получение языка пользователя из базы данных
 * @param {number} userId - ID пользователя
 * @returns {Promise<string>} - Язык пользователя (ru, en, uk)
 */
export async function getUserLanguage(userId) {
  // Импортируем динамически, чтобы избежать циклических зависимостей
  const { getUserData } = await import('../services/database.js');
  const userData = getUserData(userId);
  return userData?.language || 'ru'; // По умолчанию русский
}

/**
 * Сохранение языка пользователя
 * @param {number} userId - ID пользователя
 * @param {string} lang - Язык (ru, en, uk)
 */
export async function setUserLanguage(userId, lang) {
  const { getUserData, saveUserData } = await import('../services/database.js');
  const userData = getUserData(userId);
  
  saveUserData(userId, {
    motivationType: userData?.motivation_type || null,
    frequency: userData?.frequency || null,
    nextSend: userData?.next_send || null,
    language: lang,
  });
}

/**
 * Поддерживаемые языки
 */
export const SUPPORTED_LANGUAGES = {
  ru: 'Русский',
  en: 'English',
  uk: 'Українська',
};

/**
 * Получение перевода для пользователя
 * @param {number} userId - ID пользователя
 * @param {string} key - Ключ перевода
 * @param {object} params - Параметры
 * @returns {Promise<string>} - Переведенный текст
 */
export async function translate(userId, key, params = {}) {
  const lang = await getUserLanguage(userId);
  return t(lang, key, params);
}
