/**
 * Инициализация и настройка Telegram бота
 * Использует grammy - современную библиотеку для Telegram Bot API
 * 
 * Почему grammy вместо node-telegram-bot-api:
 * - Лучшая поддержка TypeScript и ES modules
 * - Более современная архитектура
 * - Встроенная поддержка middleware и сессий
 * - Лучшая производительность
 * - Активная разработка и поддержка
 */
import { Bot, session } from 'grammy';
import { config } from './config/env.js';
import { initDatabase } from './services/database.js';
import { initTexts } from './services/texts.js';
import { initScheduler, stopScheduler } from './services/scheduler.js';
import {
  handleStart,
  handleRandom,
  handleUseful,
  handleMotivationType,
  handleMotivation,
  handleChangeMotivation,
  handleChangeFrequency,
  handleReloadTexts,
  handleHelp,
} from './handlers/commands.js';
import { handleTextMessage } from './handlers/messages.js';

/**
 * Инициализация сессии (для хранения состояния пользователя)
 */
function initialSession() {
  return {
    selectingMotivation: false,
    changing: null,
  };
}

/**
 * Создание и настройка бота
 */
export function createBot() {
  const bot = new Bot(config.botToken);
  
  // Настройка сессий для хранения состояния пользователя
  bot.use(session({ initial: initialSession }));
  
  // Регистрация обработчиков команд
  bot.command('start', handleStart);
  bot.command('random', handleRandom);
  bot.command('useful', handleUseful);
  bot.command('motivation_type', handleMotivationType);
  bot.command('motivation', handleMotivation);
  bot.command('change_motivation', handleChangeMotivation);
  bot.command('change_frequency', handleChangeFrequency);
  bot.command('reload_texts', handleReloadTexts);
  bot.command('help', handleHelp);
  
  // Обработчик всех текстовых сообщений (кнопки и обычные сообщения)
  bot.on('message:text', handleTextMessage);
  
  // Обработчик ошибок
  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Ошибка при обработке обновления ${ctx.update.update_id}:`);
    console.error(err.error);
  });
  
  return bot;
}

/**
 * Инициализация всех сервисов
 */
export async function initializeBot() {
  // Инициализация базы данных
  initDatabase();
  console.log('База данных инициализирована');
  
  // Инициализация текстов
  initTexts();
  
  // Создание бота
  const bot = createBot();
  
  // Инициализация планировщика
  initScheduler(bot);
  
  return bot;
}

/**
 * Graceful shutdown
 * Корректно останавливает бота и все сервисы
 */
export async function shutdownBot(bot) {
  try {
    console.log('🛑 Остановка бота...');
    
    // Останавливаем планировщик
    stopScheduler();
    
    // Останавливаем long polling
    await bot.stop();
    
    console.log('✅ Бот успешно остановлен');
  } catch (error) {
    console.error('❌ Ошибка при остановке бота:', error);
    throw error;
  }
}
