/**
 * Конфигурация окружения
 * Локально: загружает из .env файла
 * Продакшн (Railway): использует process.env
 */
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Определяем пути
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');
const envPath = join(rootDir, '.env');

// Загружаем .env ТОЛЬКО локально
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

/**
 * Валидация обязательных переменных окружения
 * ⚠️ НЕ вызывается при импорте
 */
export function validateEnv() {
  const required = ['BOT_TOKEN'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    const hint = `
❌ Отсутствуют обязательные переменные окружения: ${missing.join(', ')}

👉 Локально:
   - создайте файл .env
   - добавьте BOT_TOKEN=ваш_токен

👉 Railway:
   - Service → Variables
   - New Variable → BOT_TOKEN
   - После этого ОБЯЗАТЕЛЬНО нажмите Deploy
`;

    throw new Error(hint);
  }

  const mode = process.env.MODE || 'dev';
  if (!['dev', 'prod'].includes(mode)) {
    throw new Error(
      `Недопустимое значение MODE: ${mode}. Допустимые значения: dev, prod`
    );
  }
}

/**
 * Экспорт конфигурации
 * ⚠️ Просто читаем process.env, без валидации
 */
export const config = {
  botToken: process.env.BOT_TOKEN,
  mode: process.env.MODE || 'dev',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  dbPath: process.env.DB_PATH || './data/bot.db',
  textsPath: process.env.TEXTS_PATH || './data/texts.json',
};
