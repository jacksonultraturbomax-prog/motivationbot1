/**
 * Скрипт для сброса языков у всех пользователей
 * Позволяет пользователям выбрать язык заново при следующем /start
 * Запуск: node scripts/reset-languages.js
 */
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Путь к БД
const dbPath = resolve(rootDir, 'data/bot.db');

const db = new Database(dbPath);

try {
  // Сбрасываем язык у всех пользователей
  const stmt = db.prepare('UPDATE users SET language = NULL');
  const result = stmt.run();
  
  console.log(`✅ Язык сброшен у ${result.changes} пользователей`);
  console.log('Теперь при следующем /start пользователи смогут выбрать язык заново');
} catch (error) {
  console.error('❌ Ошибка при сбросе языков:', error);
} finally {
  db.close();
}
