/**
 * Сервис работы с мотивационными текстами
 * Заменяет Google Sheets на JSON файл
 * Все операции с текстами выполняются через этот сервис
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { config } from '../config/env.js';
import { TEXT_STATUS } from '../utils/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

// Путь к файлу с текстами
const textsPath = resolve(rootDir, config.textsPath);

// Кэш текстов в памяти для быстрого доступа
let textsCache = [];

/**
 * Загрузка текстов из JSON файла
 */
export function loadTexts() {
  try {
    const fileContent = readFileSync(textsPath, 'utf-8');
    const texts = JSON.parse(fileContent);
    
    // Валидация структуры данных
    if (!Array.isArray(texts)) {
      throw new Error('Тексты должны быть массивом');
    }
    
    // Обновляем кэш
    textsCache = texts;
    return texts;
  } catch (error) {
    console.error('Ошибка при загрузке текстов:', error.message);
    return [];
  }
}

/**
 * Сохранение текстов в JSON файл
 */
export function saveTexts(texts) {
  try {
    writeFileSync(textsPath, JSON.stringify(texts, null, 2), 'utf-8');
    textsCache = texts;
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении текстов:', error.message);
    return false;
  }
}

/**
 * Обновление кэша текстов
 */
export function updateTextsCache() {
  loadTexts();
}

/**
 * Получение случайного текста по категории
 * @param {string|null} category - Категория мотивации (null для любой)
 * @param {string} lang - Язык пользователя (ru, en, uk), по умолчанию 'ru'
 * @returns {Object|null} - Текст или null, если нет доступных
 */
export function getRandomText(category = null, lang = 'ru') {
  // Если кэш пуст, загружаем тексты
  if (textsCache.length === 0) {
    loadTexts();
  }
  
  // Фильтруем доступные тексты
  const availableTexts = textsCache.filter(text => {
    const categoryMatch = category === null || text.category === category;
    const statusMatch = text.status === TEXT_STATUS.NEW || text.status === TEXT_STATUS.NEW_TEXT;
    return categoryMatch && statusMatch;
  });
  
  if (availableTexts.length === 0) {
    return null;
  }
  
  // Возвращаем случайный текст
  const randomIndex = Math.floor(Math.random() * availableTexts.length);
  const text = availableTexts[randomIndex];
  
  // Если запрашивается русский язык, возвращаем оригинальный текст
  if (lang === 'ru') {
    return text;
  }
  
  // Если переводов нет, возвращаем оригинальный текст (русский) как fallback
  if (!text.translations) {
    return text;
  }
  
  // Если текст имеет переводы на нужный язык, проверяем их
  if (text.translations[lang]) {
    const translatedShort = text.translations[lang].short;
    const translatedLong = text.translations[lang].long;
    
    // Если переводы есть и не пустые (и не совпадают с оригиналом), используем их
    if (translatedShort && translatedLong && 
        (translatedShort !== text.short || translatedLong !== text.long)) {
      return {
        id: text.id,
        category: text.category,
        short: translatedShort,
        long: translatedLong,
        status: text.status,
      };
    }
  }
  
  // Если перевода нет или он пустой/совпадает с оригиналом, возвращаем оригинальный текст (русский) как fallback
  return text;
}

/**
 * Обновление статуса текста в JSON файле
 * @param {string} textId - ID текста
 * @param {string} status - Новый статус
 */
export function updateTextStatus(textId, status = TEXT_STATUS.SENT) {
  try {
    // Если кэш пуст, загружаем тексты
    if (textsCache.length === 0) {
      loadTexts();
    }
    
    // Находим и обновляем текст
    const textIndex = textsCache.findIndex(text => text.id === textId);
    if (textIndex !== -1) {
      textsCache[textIndex].status = status;
      saveTexts(textsCache);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Ошибка при обновлении статуса текста:', error.message);
    return false;
  }
}

/**
 * Получение всех текстов (для отладки)
 */
export function getAllTexts() {
  if (textsCache.length === 0) {
    loadTexts();
  }
  return textsCache;
}

/**
 * Инициализация - загрузка текстов при старте
 */
export function initTexts() {
  loadTexts();
  console.log(`Загружено ${textsCache.length} текстов`);
}
