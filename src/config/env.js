/**
 * Конфигурация окружения
 * Загружает переменные окружения из .env файла
 * Использует dotenv для безопасного хранения секретов
 */
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Получаем путь к корню проекта
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

// Загружаем переменные окружения
dotenv.config({ path: join(rootDir, '.env') });

/**
 * Валидация обязательных переменных окружения
 */
function validateEnv() {
  const required = ['BOT_TOKEN'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Отсутствуют обязательные переменные окружения: ${missing.join(', ')}\n` +
      `Создайте файл .env на основе .env.example`
    );
  }
  
  // Валидация MODE
  const mode = process.env.MODE || 'dev';
  if (!['dev', 'prod'].includes(mode)) {
    throw new Error(
      `Недопустимое значение MODE: ${mode}. Допустимые значения: dev, prod`
    );
  }
}

// Валидируем при загрузке модуля
validateEnv();

/**
 * Экспорт конфигурации
 */
export const config = {
  botToken: process.env.BOT_TOKEN,
  mode: process.env.MODE || 'dev',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  dbPath: process.env.DB_PATH || './data/bot.db',
  textsPath: process.env.TEXTS_PATH || './data/texts.json',
};
