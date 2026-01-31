/**
 * Планировщик автоматических напоминаний
 * Отправляет мотивационные сообщения пользователям по расписанию
 * Использует setInterval для периодической проверки
 */
import { getUsersToNotify, updateUserSchedule, markTextSent } from './database.js';
import { getRandomText, updateTextStatus } from './texts.js';
import { EMOJIS, TIME_INTERVALS, TWICE_DAILY_SCHEDULE } from '../utils/constants.js';
import { t } from '../utils/i18n.js';

let botInstance = null;
let intervalId = null;

/**
 * Инициализация планировщика
 * @param {Bot} bot - Экземпляр grammy бота
 */
export function initScheduler(bot) {
  botInstance = bot;
  
  // Проверяем каждые 5 минут
  const CHECK_INTERVAL = 5 * 60 * 1000; // 5 минут в миллисекундах
  
  intervalId = setInterval(() => {
    checkAndSendScheduledMessages();
  }, CHECK_INTERVAL);
  
  // Запускаем сразу при старте
  checkAndSendScheduledMessages();
  
  console.log('Планировщик инициализирован');
}

/**
 * Остановка планировщика (для graceful shutdown)
 */
export function stopScheduler() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('Планировщик остановлен');
  }
}

/**
 * Проверка и отправка запланированных сообщений
 */
async function checkAndSendScheduledMessages() {
  if (!botInstance) {
    return;
  }
  
  const now = Math.floor(Date.now() / 1000);
  const users = getUsersToNotify(now);
  
  for (const user of users) {
    try {
      await sendScheduledMessage(user, now);
    } catch (error) {
      console.error(`Ошибка при отправке сообщения пользователю ${user.user_id}:`, error.message);
    }
  }
}

/**
 * Отправка запланированного сообщения пользователю
 */
async function sendScheduledMessage(user, currentTime) {
  const { user_id, motivation_type, frequency } = user;
  
  // Получаем язык пользователя
  const userLang = user.language || 'ru';
  
  // Получаем случайный текст на языке пользователя
  const text = getRandomText(motivation_type, userLang);
  
  if (!text) {
    console.warn(`Нет доступных текстов для пользователя ${user_id}`);
    return;
  }
  
  // Отмечаем текст как отправленный
  markTextSent(user_id, text.id);
  updateTextStatus(text.id);
  
  // Выбираем случайный эмодзи
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  
  // Формируем сообщение с учетом языка
  const scheduledText = t(userLang, 'scheduler.scheduledMessage');
  const message = `${scheduledText}\n\n${text.short}\n\n${text.long} ${emoji}`;
  
  // Отправляем сообщение
  await botInstance.api.sendMessage(user_id, message, {
    parse_mode: 'Markdown',
  });
  
  // Вычисляем следующее время отправки
  const nextSend = calculateNextSend(currentTime, frequency);
  
  // Обновляем расписание пользователя
  updateUserSchedule(user_id, nextSend, currentTime);
}

/**
 * Вычисление следующего времени отправки на основе частоты
 */
function calculateNextSend(currentTime, frequency) {
  const now = currentTime;
  const dayStart = now - (now % TIME_INTERVALS.DAY);
  
  // Проверяем частоту на всех языках
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
      // Следующая отправка через день с разбросом ±12 часов
      return now + TIME_INTERVALS.DAY + 
        Math.floor(Math.random() * TIME_INTERVALS.HALF_DAY * 2) - TIME_INTERVALS.HALF_DAY;
    
    case 'twiceDaily':
      // Определяем, утро или вечер
      const timeOfDay = now % TIME_INTERVALS.DAY;
      
      if (timeOfDay < TWICE_DAILY_SCHEDULE.EVENING_START) {
        // Следующая отправка - вечер сегодня
        const eveningTime = dayStart + 
          Math.floor(Math.random() * 
            (TWICE_DAILY_SCHEDULE.EVENING_END - TWICE_DAILY_SCHEDULE.EVENING_START)) + 
          TWICE_DAILY_SCHEDULE.EVENING_START;
        
        return eveningTime > now ? eveningTime : eveningTime + TIME_INTERVALS.DAY;
      } else {
        // Следующая отправка - утро завтра
        return dayStart + TIME_INTERVALS.DAY + 
          Math.floor(Math.random() * 
            (TWICE_DAILY_SCHEDULE.MORNING_END - TWICE_DAILY_SCHEDULE.MORNING_START)) + 
          TWICE_DAILY_SCHEDULE.MORNING_START;
      }
    
    case 'every3Days':
      // Следующая отправка через 3 дня с разбросом ±1 день
      return now + TIME_INTERVALS.THREE_DAYS + 
        Math.floor(Math.random() * TIME_INTERVALS.DAY * 2) - TIME_INTERVALS.DAY;
    
    default:
      return now + TIME_INTERVALS.DAY;
  }
}
