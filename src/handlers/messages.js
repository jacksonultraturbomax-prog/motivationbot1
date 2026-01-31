/**
 * Обработчики текстовых сообщений (кнопки и обычные сообщения)
 * Обрабатывает взаимодействие пользователя с кнопками клавиатуры
 */
import { 
  handleRandom, 
  handleUseful, 
  handleHelp,
  handleInitialMotivationType,
  handleInitialFrequency,
  handleChangeFrequencySelection,
  handleChangeMotivationSelection,
  handleMotivationTypeSelection,
  handleChangeLanguage,
  handleChangeMotivation,
  handleChangeFrequency,
} from './commands.js';
import { 
  getMainMenu, 
  getConfirmationButton,
  getMotivationTypeKeyboard,
  getFrequencyKeyboard,
  getSettingsMenu,
  getLanguageKeyboard,
  getStartButton,
} from '../utils/keyboards.js';
import { getUserData } from '../services/database.js';
import { t, setUserLanguage, getUserLanguage, SUPPORTED_LANGUAGES } from '../utils/i18n.js';
import { getLangFromContext, translateForUser, getAllTranslations, matchesTranslation } from '../utils/langHelper.js';

/**
 * Главный обработчик текстовых сообщений
 */
export async function handleTextMessage(ctx) {
  const text = ctx.message.text;
  const userId = ctx.from.id;
  
  // Инициализация сессии, если её нет
  if (!ctx.session) {
    ctx.session = {};
  }
  
  // Получаем данные пользователя и язык
  const userData = getUserData(userId);
  const lang = getLangFromContext(ctx);
  
  // Обработка выбора языка
  if (ctx.session.selectingLanguage) {
    const langMap = {
      [SUPPORTED_LANGUAGES.ru]: 'ru',
      [SUPPORTED_LANGUAGES.en]: 'en',
      [SUPPORTED_LANGUAGES.uk]: 'uk',
    };
    
    if (langMap[text]) {
      await setUserLanguage(userId, langMap[text]);
      ctx.session.selectingLanguage = false;
      
      // Если это смена языка из настроек, возвращаемся в настройки
      if (ctx.session.changing === 'language') {
        ctx.session.changing = null;
        await ctx.reply(
          t(langMap[text], 'language.selected'),
          {
            reply_markup: getSettingsMenu(langMap[text]),
          }
        );
      } else {
        // Если это первый выбор языка, показываем кнопку "Давай!"
        await ctx.reply(
          t(langMap[text], 'language.selected'),
          {
            reply_markup: getStartButton(langMap[text]),
          }
        );
      }
      return;
    }
  }
  
  // Если язык не выбран, перенаправляем на выбор языка
  const userLang = userData?.language;
  const hasLanguage = userLang && userLang !== '' && userLang !== null && userLang !== undefined;
  
  if (!hasLanguage) {
    await ctx.reply(
      t('ru', 'language.select'),
      {
        reply_markup: getLanguageKeyboard(),
      }
    );
    ctx.session.selectingLanguage = true;
    return;
  }
  
  // Обработка кнопки подтверждения (с учетом языка)
  const confirmationTexts = [
    t('ru', 'common.confirmation'),
    t('en', 'common.confirmation'),
    t('uk', 'common.confirmation'),
  ];
  
  if (confirmationTexts.includes(text)) {
    ctx.session.selectingMotivation = false;
    await handleHelp(ctx);
    return;
  }
  
  // Обработка кнопки начала работы (с учетом языка)
  const startTexts = [
    t('ru', 'start.letsGo'),
    t('en', 'start.letsGo'),
    t('uk', 'start.letsGo'),
  ];
  
  if (startTexts.includes(text)) {
    await ctx.reply(
      translateForUser(ctx, 'motivation.description'),
      {
        reply_markup: getMotivationTypeKeyboard(lang),
      }
    );
    return;
  }
  
  // Проверка кнопок главного меню (на всех языках)
  const menuRandom = getAllTranslations('menu.random');
  const menuUseful = getAllTranslations('menu.useful');
  const menuCommands = getAllTranslations('menu.commands');
  const menuSettings = getAllTranslations('menu.settings');
  
  if (Object.values(menuRandom).includes(text)) {
    await handleRandom(ctx);
    return;
  } else if (Object.values(menuUseful).includes(text)) {
    await handleUseful(ctx);
    return;
  } else if (Object.values(menuCommands).includes(text)) {
    await handleHelp(ctx);
    return;
  } else if (Object.values(menuSettings).includes(text)) {
    const lang = getLangFromContext(ctx);
    await ctx.reply(translateForUser(ctx, 'settings.title'), {
      reply_markup: getSettingsMenu(lang),
    });
    return;
  }
  
  // Проверка кнопок настроек
  const settingsChangeType = getAllTranslations('settings.changeType');
  const settingsChangeFrequency = getAllTranslations('settings.changeFrequency');
  const settingsChangeLanguage = getAllTranslations('settings.changeLanguage');
  const settingsBack = getAllTranslations('settings.back');
  
  if (Object.values(settingsChangeType).includes(text)) {
    await handleChangeMotivation(ctx);
    return;
  } else if (Object.values(settingsChangeFrequency).includes(text)) {
    await handleChangeFrequency(ctx);
    return;
  } else if (Object.values(settingsChangeLanguage).includes(text)) {
    await handleChangeLanguage(ctx);
    return;
  } else if (Object.values(settingsBack).includes(text)) {
    ctx.session.selectingMotivation = false;
    ctx.session.changing = null;
    await handleHelp(ctx);
    return;
  }
  
  // Проверка типов мотивации (на всех языках)
  const motivationTypes = {
    hard: getAllTranslations('motivation.types.hard'),
    soft: getAllTranslations('motivation.types.soft'),
    brotherly: getAllTranslations('motivation.types.brotherly'),
    psychological: getAllTranslations('motivation.types.psychological'),
  };
  
  let matchedMotivationType = null;
  for (const [key, translations] of Object.entries(motivationTypes)) {
    if (Object.values(translations).includes(text)) {
      // Маппинг на оригинальные названия для совместимости
      const typeMap = {
        hard: 'Жесткая мотивация',
        soft: 'Мягкая поддержка',
        brotherly: 'Братский подзатыльник',
        psychological: 'Психологическая перезагрузка',
      };
      matchedMotivationType = typeMap[key];
      break;
    }
  }
  
  if (matchedMotivationType) {
    if (!ctx.session.changing && !ctx.session.selectingMotivation) {
      await handleInitialMotivationType(ctx, matchedMotivationType);
    } else if (ctx.session.changing === 'motivation') {
      await handleChangeMotivationSelection(ctx, matchedMotivationType);
    } else if (ctx.session.selectingMotivation) {
      await handleMotivationTypeSelection(ctx, matchedMotivationType);
    }
    return;
  }
  
  // Проверка частоты (на всех языках)
  const frequencies = {
    none: getAllTranslations('frequency.none'),
    daily: getAllTranslations('frequency.daily'),
    twiceDaily: getAllTranslations('frequency.twiceDaily'),
    every3Days: getAllTranslations('frequency.every3Days'),
  };
  
  let matchedFrequency = null;
  for (const [key, translations] of Object.entries(frequencies)) {
    if (Object.values(translations).includes(text)) {
      // Маппинг на оригинальные названия для совместимости
      const freqMap = {
        none: 'Не Надо Напоминаний',
        daily: 'Раз в День',
        twiceDaily: 'Два Раза в День',
        every3Days: 'Раз в 3 Дня',
      };
      matchedFrequency = freqMap[key];
      break;
    }
  }
  
  if (matchedFrequency) {
    if (!ctx.session.changing) {
      await handleInitialFrequency(ctx, matchedFrequency);
    } else if (ctx.session.changing === 'frequency') {
      await handleChangeFrequencySelection(ctx, matchedFrequency);
    }
    return;
  }
  
  // Проверка кнопки изменения
  const changeButton = getAllTranslations('common.change');
  const allGood = getAllTranslations('common.allGood');
  const allOk = getAllTranslations('common.allOk');
  
  if (Object.values(changeButton).includes(text)) {
    if (ctx.session.changing === 'motivation') {
      await ctx.reply(
        translateForUser(ctx, 'motivation.select'),
        {
          reply_markup: getMotivationTypeKeyboard(lang),
        }
      );
    } else if (ctx.session.changing === 'frequency') {
      await ctx.reply(
        translateForUser(ctx, 'frequency.select'),
        {
          reply_markup: getFrequencyKeyboard(lang),
        }
      );
    }
    return;
  }
  
  if (Object.values(allGood).includes(text) || Object.values(allOk).includes(text)) {
    ctx.session.selectingMotivation = false;
    ctx.session.changing = null;
    await handleHelp(ctx);
    return;
  }
  
  // Неизвестная команда
  await ctx.reply(
    translateForUser(ctx, 'common.unknownCommand'),
    {
      reply_markup: getMainMenu(lang),
    }
  );
}
