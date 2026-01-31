/**
 * Сервис работы с базой данных SQLite
 * Использует better-sqlite3 для синхронной работы с БД
 * Это быстрее и проще для данного типа приложения
 */
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { config } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

// Создаем абсолютный путь к БД
const dbPath = resolve(rootDir, config.dbPath);

// Инициализация базы данных
const db = new Database(dbPath);

// Включаем WAL режим для лучшей производительности
db.pragma('journal_mode = WAL');

/**
 * Инициализация таблиц базы данных
 */
export function initDatabase() {
  // Таблица пользователей
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY,
      motivation_type TEXT,
      frequency TEXT,
      next_send INTEGER DEFAULT 0,
      last_sent INTEGER DEFAULT 0,
      language TEXT
    )
  `);
  
  // Добавляем колонку language, если её нет (для существующих БД)
  // Удаляем DEFAULT значение, если оно было установлено
  try {
    db.exec(`ALTER TABLE users ADD COLUMN language TEXT`);
  } catch (e) {
    // Колонка уже существует, игнорируем ошибку
  }
  
  // Обновляем существующие записи: если язык NULL или пустой, устанавливаем NULL явно
  // Это нужно для пользователей, которые еще не выбрали язык
  try {
    db.exec(`UPDATE users SET language = NULL WHERE language = '' OR language IS NULL`);
  } catch (e) {
    // Игнорируем ошибку, если что-то пошло не так
  }

  // Таблица отправленных текстов
  db.exec(`
    CREATE TABLE IF NOT EXISTS sent_texts (
      user_id INTEGER,
      text_id TEXT,
      FOREIGN KEY(user_id) REFERENCES users(user_id)
    )
  `);

  // Создаем индексы для оптимизации запросов
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_sent_texts_user_id 
    ON sent_texts(user_id)
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_next_send 
    ON users(next_send)
  `);
}

/**
 * Получение данных пользователя
 */
export function getUserData(userId) {
  const stmt = db.prepare(`
    SELECT motivation_type, frequency, next_send, last_sent, language 
    FROM users 
    WHERE user_id = ?
  `);
  return stmt.get(userId) || null;
}

/**
 * Сохранение данных пользователя
 */
export function saveUserData(userId, { motivationType = null, frequency = null, nextSend = null, language = null }) {
  // Получаем текущие данные, чтобы сохранить язык, если он не передан
  const currentData = getUserData(userId);
  // Сохраняем язык только если он явно передан, иначе используем существующий (или null)
  const langToSave = language !== null ? language : (currentData?.language || null);
  
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO users 
    (user_id, motivation_type, frequency, next_send, language) 
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(userId, motivationType, frequency, nextSend, langToSave);
}

/**
 * Обновление времени следующей отправки и последней отправки
 */
export function updateUserSchedule(userId, nextSend, lastSent) {
  const stmt = db.prepare(`
    UPDATE users 
    SET next_send = ?, last_sent = ? 
    WHERE user_id = ?
  `);
  stmt.run(nextSend, lastSent, userId);
}

/**
 * Проверка, был ли текст отправлен пользователю
 */
export function isTextSent(userId, textId) {
  const stmt = db.prepare(`
    SELECT 1 FROM sent_texts 
    WHERE user_id = ? AND text_id = ?
  `);
  return !!stmt.get(userId, textId);
}

/**
 * Отметка текста как отправленного
 * Примечание: обновление статуса в JSON файле выполняется отдельно
 * через updateTextStatus из services/texts.js для избежания циклических зависимостей
 */
export function markTextSent(userId, textId) {
  const stmt = db.prepare(`
    INSERT INTO sent_texts (user_id, text_id) 
    VALUES (?, ?)
  `);
  stmt.run(userId, textId);
}

/**
 * Получение всех пользователей для планировщика
 */
export function getAllUsers() {
  const stmt = db.prepare(`
    SELECT user_id, motivation_type, frequency, next_send, last_sent 
    FROM users
  `);
  return stmt.all();
}

/**
 * Получение пользователей, которым нужно отправить сообщение
 */
export function getUsersToNotify(currentTime) {
  // Получаем все переводы для "Не Надо Напоминаний"
  const noReminderTexts = [
    'Не Надо Напоминаний',
    'No Reminders',
    'Не Треба Нагадувань',
  ];
  
  const placeholders = noReminderTexts.map(() => '?').join(',');
  const stmt = db.prepare(`
    SELECT user_id, motivation_type, frequency, next_send, last_sent, language 
    FROM users 
    WHERE frequency NOT IN (${placeholders})
    AND next_send <= ?
  `);
  return stmt.all(...noReminderTexts, currentTime);
}

/**
 * Закрытие соединения с БД (для graceful shutdown)
 */
export function closeDatabase() {
  db.close();
}
