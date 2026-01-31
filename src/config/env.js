/**
 * Конфигурация окружения
 * Локально: загружает из .env файла
 * Railway/облако: использует process.env (платформа инжектит переменные)
 */
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Получаем путь к корню проекта
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');
const envPath = join(rootDir, '.env');

// Загружаем .env только если файл существует (локальная разработка)
// На Railway/облаке .env нет — переменные уже в process.env
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

/**
 * Валидация обязательных переменных окружения
 */
function validateEnv() {
  const required = ['BOT_TOKEN'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    const isRailway = !!(
      process.env.RAILWAY_PROJECT_ID ||
      process.env.RAILWAY_SERVICE_NAME ||
      process.env.RAILWAY_PUBLIC_DOMAIN
    );
    const envKeys = Object.keys(process.env).sort().join(', ');
    const hint = isRailway
      ? `\n\n💡 Railway: добавьте BOT_TOKEN во вкладке Variables вашего сервиса → New Variable → BOT_TOKEN = ваш_токен\n   После добавления ОБЯЗАТЕЛЬНО нажмите Deploy (переменные — staged changes).\n\n   Доступные переменные: ${envKeys}`
      : `\n\nСоздайте файл .env на основе .env.example`;
    throw new Error(
      `Отсутствуют обязательные переменные окружения: ${missing.join(', ')}${hint}`
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
