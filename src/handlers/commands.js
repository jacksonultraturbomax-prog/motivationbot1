/**
 * Обработчики команд бота
 * Все команды Telegram бота обрабатываются здесь
 */
import { getRandomText, updateTextsCache, updateTextStatus } from '../services/texts.js';
import { getUserData, saveUserData, markTextSent } from '../services/database.js';
import { 
  getMainMenu, 
  getConfirmationButton, 
  getStartButton,
  getMotivationTypeKeyboard,
  getFrequencyKeyboard,
  getSettingsMenu,
  getLanguageKeyboard
} from '../utils/keyboards.js';
import { EMOJIS, MOTIVATION_TYPES, FREQUENCIES } from '../utils/constants.js';
import { TIME_INTERVALS, TWICE_DAILY_SCHEDULE } from '../utils/constants.js';
import { t, getUserLanguage, setUserLanguage, SUPPORTED_LANGUAGES } from '../utils/i18n.js';
import { getLangFromContext, translateForUser } from '../utils/langHelper.js';

/**
 * Обработчик команды /start
 * Сначала проверяет, выбран ли язык, если нет - показывает выбор языка
 */
export async function handleStart(ctx) {
  const userId = ctx.from.id;
  const userData = getUserData(userId);
  
  // Проверяем, есть ли язык у пользователя (null, undefined или пустая строка)
  const lang = userData?.language;
  const hasLanguage = lang && lang !== '' && lang !== null && lang !== undefined;
  
  // Если язык не выбран, показываем выбор языка
  if (!hasLanguage) {
    await ctx.reply(
      t('ru', 'language.select'), // Показываем на русском для выбора языка
      {
        reply_markup: getLanguageKeyboard(),
      }
    );
    // Устанавливаем флаг выбора языка в сессии
    if (!ctx.session) ctx.session = {};
    ctx.session.selectingLanguage = true;
    return;
  }
  
  // Язык выбран, показываем приветствие
  await ctx.reply(
    t(lang, 'start.welcome'),
    {
      reply_markup: getStartButton(lang),
    }
  );
}

/**
 * Обработчик команды /random - случайная мотивация
 */
export async function handleRandom(ctx) {
  const userId = ctx.from.id;
  const lang = getLangFromContext(ctx);
  const text = getRandomText(null, lang);
  
  if (text) {
    markTextSent(userId, text.id);
    updateTextStatus(text.id);
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    
    await ctx.reply(
      `${text.short}\n\n${text.long} ${emoji}`,
      {
        reply_markup: getConfirmationButton(lang),
      }
    );
  } else {
    await ctx.reply(
      translateForUser(ctx, 'common.noTexts'),
      {
        reply_markup: getMainMenu(lang),
      }
    );
  }
}

/**
 * Обработчик команды /useful - полезные материалы
 */
export async function handleUseful(ctx) {
  const lang = getLangFromContext(ctx);
  const message = `${translateForUser(ctx, 'useful.title')}\n\n` +
    `${translateForUser(ctx, 'useful.youtube')}\n\n` +
    `${translateForUser(ctx, 'useful.videos')}\n\n` +
    `◾️ [Принципы, которые упрощают жизнь](https://www.youtube.com/watch?v=3JQJ_M8ZZOM)\n` +
    `◾️ [Действительно ли важно любить себя, чтобы быть любимым и жить полной жизнью](https://youtu.be/Wm7zoHXxsIQ)\n` +
    `◾️ [Идеальные отношения: 3 принципа](https://youtu.be/9GN5jKER0lU)\n` +
    `◾️ [Почему твоя жизнь кажется НЕДОСТАТОЧНО хорошей?](https://youtu.be/O9iOzXpmsBk?si=QNWPhgx8RtcRks9j)\n` +
    `◾️ [Эти 5 книг ПЕРЕВЕРНУТ твое сознание! Что почитать?](https://youtu.be/ESP76k4mewo)\n\n` +
    `${translateForUser(ctx, 'useful.books')}\n\n` +
    `◾️ Чуть выше есть видео, где рассказали о книгах. А тут доступны 5 классных книг.\n` +
    `[тут](https://t.me/imperium_motivation/143)\n` +
    `◾️ Вот тут подборка классных книг\n` +
    `[тут](https://t.me/imperium_motivation/65)\n` +
    `◾️ И тут хорошие книги\n` +
    `[тут](https://t.me/imperium_motivation/73)\n\n` +
    `${translateForUser(ctx, 'useful.bot')}\n\n` +
    `${translateForUser(ctx, 'useful.pinterest')}`;
  
  await ctx.reply(message, {
    parse_mode: 'Markdown',
    link_preview_options: { is_disabled: true },
    reply_markup: getConfirmationButton(lang),
  });
}

/**
 * Обработчик команды /motivation_type - типы поддержки
 */
export async function handleMotivationType(ctx) {
  const lang = getLangFromContext(ctx);
  await ctx.reply(
    translateForUser(ctx, 'motivation.description'),
    {
      reply_markup: getSettingsMenu(lang),
    }
  );
}

/**
 * Обработчик команды /motivation - мотивация по категориям
 */
export async function handleMotivation(ctx) {
  const lang = getLangFromContext(ctx);
  ctx.session.selectingMotivation = true;
  
  await ctx.reply(
    translateForUser(ctx, 'motivation.select'),
    {
      reply_markup: getMotivationTypeKeyboard(lang),
    }
  );
}

/**
 * Обработчик команды /change_motivation - смена типа мотивации
 */
export async function handleChangeMotivation(ctx) {
  const lang = getLangFromContext(ctx);
  
  // Устанавливаем флаг, что пользователь меняет тип мотивации
  if (!ctx.session) ctx.session = {};
  ctx.session.changing = 'motivation';
  
  // Сразу показываем клавиатуру выбора типа мотивации
  await ctx.reply(
    translateForUser(ctx, 'motivation.select'),
    {
      reply_markup: getMotivationTypeKeyboard(lang),
    }
  );
}

/**
 * Обработчик команды /change_frequency - смена частоты напоминаний
 */
export async function handleChangeFrequency(ctx) {
  const lang = getLangFromContext(ctx);
  
  // Устанавливаем флаг, что пользователь меняет частоту
  if (!ctx.session) ctx.session = {};
  ctx.session.changing = 'frequency';
  
  // Сразу показываем клавиатуру выбора частоты
  await ctx.reply(
    translateForUser(ctx, 'frequency.select'),
    {
      reply_markup: getFrequencyKeyboard(lang),
    }
  );
}

/**
 * Обработчик смены языка
 */
export async function handleChangeLanguage(ctx) {
  const lang = getLangFromContext(ctx);
  await ctx.reply(
    translateForUser(ctx, 'language.select'),
    {
      reply_markup: getLanguageKeyboard(),
    }
  );
  
  // Устанавливаем флаг выбора языка в сессии
  if (!ctx.session) ctx.session = {};
  ctx.session.changing = 'language';
  ctx.session.selectingLanguage = true;
}

/**
 * Обработчик команды /reload_texts - обновление текстов
 */
export async function handleReloadTexts(ctx) {
  const lang = getLangFromContext(ctx);
  updateTextsCache();
  await ctx.reply(translateForUser(ctx, 'common.textsReloaded'), {
    reply_markup: getMainMenu(lang),
  });
}

/**
 * Обработчик команды /help - список команд
 */
export async function handleHelp(ctx) {
  const lang = getLangFromContext(ctx);
  const message = `${translateForUser(ctx, 'help.title')}\n\n` +
    `${translateForUser(ctx, 'help.commands.random')}\n` +
    `${translateForUser(ctx, 'help.commands.useful')}\n` +
    `${translateForUser(ctx, 'help.commands.motivationType')}\n` +
    `${translateForUser(ctx, 'help.commands.motivation')}\n` +
    `${translateForUser(ctx, 'help.commands.changeMotivation')}\n` +
    `${translateForUser(ctx, 'help.commands.changeFrequency')}\n` +
    `${translateForUser(ctx, 'help.commands.start')}\n` +
    `${translateForUser(ctx, 'help.commands.reloadTexts')}\n` +
    `${translateForUser(ctx, 'help.commands.help')}`;
  
  await ctx.reply(message, {
    reply_markup: getMainMenu(lang),
  });
}

/**
 * Вычисление следующего времени отправки при выборе частоты
 */
function calculateNextSendForFrequency(frequency) {
  const now = Math.floor(Date.now() / 1000);
  
  // Маппинг частоты на всех языках
  const frequencyMap = {
    'Раз в День': 'daily',
    'Once a Day': 'daily',
    'Раз на День': 'daily',
    'Два Раза в День': 'twiceDaily',
    'Twice a Day': 'twiceDaily',
    'Двічі на День': 'twiceDaily',
    'Раз в 3 Дня': 'every3Days',
    'Every 3 Days': 'every3Days',
    'Раз в 3 Дні': 'every3Days',
  };
  
  const freqKey = frequencyMap[frequency] || 'daily';
  
  switch (freqKey) {
    case 'daily':
      return now + Math.floor(Math.random() * TIME_INTERVALS.DAY);
    
    case 'twiceDaily':
      const dayStart = now - (now % TIME_INTERVALS.DAY);
      return dayStart + 
        Math.floor(Math.random() * 
          (TWICE_DAILY_SCHEDULE.MORNING_END - TWICE_DAILY_SCHEDULE.MORNING_START)) + 
        TWICE_DAILY_SCHEDULE.MORNING_START;
    
    case 'every3Days':
      return now + Math.floor(Math.random() * TIME_INTERVALS.THREE_DAYS);
    
    default:
      return 0;
  }
}

/**
 * Обработка выбора типа мотивации при первоначальной настройке
 */
export async function handleInitialMotivationType(ctx, motivationType) {
  const userId = ctx.from.id;
  const lang = getLangFromContext(ctx);
  saveUserData(userId, { motivationType });
  
  await ctx.reply(
    translateForUser(ctx, 'frequency.accepted'),
    {
      reply_markup: getFrequencyKeyboard(lang),
    }
  );
}

/**
 * Обработка выбора частоты при первоначальной настройке
 */
export async function handleInitialFrequency(ctx, frequency) {
  const userId = ctx.from.id;
  const lang = getLangFromContext(ctx);
  const userData = getUserData(userId);
  const motivationType = userData?.motivation_type || null;
  const nextSend = calculateNextSendForFrequency(frequency);
  
  saveUserData(userId, { motivationType, frequency, nextSend });
  
  const message = `${translateForUser(ctx, 'frequency.saved')} ${translateForUser(ctx, 'help.title')}\n\n` +
    `${translateForUser(ctx, 'help.commands.random')}\n` +
    `${translateForUser(ctx, 'help.commands.useful')}\n` +
    `${translateForUser(ctx, 'help.commands.motivationType')}\n` +
    `${translateForUser(ctx, 'help.commands.motivation')}\n` +
    `${translateForUser(ctx, 'help.commands.changeMotivation')}\n` +
    `${translateForUser(ctx, 'help.commands.changeFrequency')}\n` +
    `${translateForUser(ctx, 'help.commands.start')}\n` +
    `${translateForUser(ctx, 'help.commands.reloadTexts')}\n` +
    `${translateForUser(ctx, 'help.commands.help')}`;
  
  await ctx.reply(message, {
    reply_markup: getMainMenu(lang),
  });
}

/**
 * Обработка выбора частоты при изменении настроек
 */
export async function handleChangeFrequencySelection(ctx, frequency) {
  const userId = ctx.from.id;
  const lang = getLangFromContext(ctx);
  const userData = getUserData(userId);
  const motivationType = userData?.motivation_type || null;
  const nextSend = calculateNextSendForFrequency(frequency);
  
  saveUserData(userId, { motivationType, frequency, nextSend });
  
  // Очищаем флаг изменения
  if (ctx.session) {
    ctx.session.changing = null;
  }
  
  await ctx.reply(
    translateForUser(ctx, 'frequency.changed'),
    {
      reply_markup: getSettingsMenu(lang),
    }
  );
}

/**
 * Обработка выбора типа мотивации при изменении настроек
 */
export async function handleChangeMotivationSelection(ctx, motivationType) {
  const userId = ctx.from.id;
  const lang = getLangFromContext(ctx);
  saveUserData(userId, { motivationType });
  
  // Очищаем флаг изменения
  if (ctx.session) {
    ctx.session.changing = null;
  }
  
  await ctx.reply(
    translateForUser(ctx, 'frequency.changed'), // Используем тот же ключ, что и для частоты (сообщение одинаковое)
    {
      reply_markup: getSettingsMenu(lang),
    }
  );
}

/**
 * Обработка выбора типа мотивации для получения текста
 */
export async function handleMotivationTypeSelection(ctx, motivationType) {
  const userId = ctx.from.id;
  const lang = getLangFromContext(ctx);
  const text = getRandomText(motivationType, lang);
  
  if (text) {
    markTextSent(userId, text.id);
    updateTextStatus(text.id);
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    
    await ctx.reply(
      `${text.short}\n\n${text.long} ${emoji}`,
      {
        reply_markup: getConfirmationButton(lang),
      }
    );
  } else {
    await ctx.reply(
      translateForUser(ctx, 'common.noTexts'),
      {
        reply_markup: getMainMenu(lang),
      }
    );
  }
  
  ctx.session.selectingMotivation = false;
}
