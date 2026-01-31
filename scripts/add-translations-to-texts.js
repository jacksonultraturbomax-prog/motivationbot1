/**
 * Скрипт для добавления переводов к существующим текстам мотивации
 * Добавляет структуру translations с переводами на английский и украинский
 * 
 * ВАЖНО: Этот скрипт создает структуру для переводов, но сами переводы нужно добавить вручную
 * или использовать API для автоматического перевода
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const textsPath = resolve(rootDir, 'data/texts.json');

// Маппинг категорий на все языки
const categoryMap = {
  'Жесткая мотивация': {
    ru: 'Жесткая мотивация',
    en: 'Hard Motivation',
    uk: 'Жорстка мотивація',
  },
  'Мягкая поддержка': {
    ru: 'Мягкая поддержка',
    en: 'Soft Support',
    uk: 'М\'яка підтримка',
  },
  'Братский подзатыльник': {
    ru: 'Братский подзатыльник',
    en: 'Brotherly Nudge',
    uk: 'Братський підзатільник',
  },
  'Психологическая перезагрузка': {
    ru: 'Психологическая перезагрузка',
    en: 'Psychological Reboot',
    uk: 'Психологічна перезавантаження',
  },
};

function addTranslationsStructure(texts) {
  return texts.map(text => {
    // Если у текста уже есть переводы, оставляем как есть
    if (text.translations) {
      return text;
    }
    
    // Создаем структуру с переводами
    // Для русского языка используем оригинальный текст
    // Для других языков оставляем пустыми - они будут добавлены позже
    const newText = {
      ...text,
      translations: {
        ru: {
          short: text.short,
          long: text.long,
        },
        en: {
          short: text.short, // Временно используем русский текст, пока нет перевода
          long: text.long,   // Временно используем русский текст, пока нет перевода
        },
        uk: {
          short: text.short, // Временно используем русский текст, пока нет перевода
          long: text.long,   // Временно используем русский текст, пока нет перевода
        },
      },
    };
    
    // Обновляем категорию, если есть маппинг
    if (categoryMap[text.category]) {
      newText.categoryTranslations = categoryMap[text.category];
    }
    
    return newText;
  });
}

try {
  console.log('Загрузка текстов...');
  const fileContent = readFileSync(textsPath, 'utf-8');
  const texts = JSON.parse(fileContent);
  
  console.log(`Найдено ${texts.length} текстов`);
  
  console.log('Добавление структуры переводов...');
  const textsWithTranslations = addTranslationsStructure(texts);
  
  // Создаем резервную копию
  const backupPath = textsPath + '.backup';
  writeFileSync(backupPath, fileContent, 'utf-8');
  console.log(`Резервная копия создана: ${backupPath}`);
  
  // Сохраняем обновленные тексты
  writeFileSync(textsPath, JSON.stringify(textsWithTranslations, null, 2), 'utf-8');
  console.log(`Структура переводов добавлена к ${textsWithTranslations.length} текстам`);
  console.log('\nВАЖНО: Переводы на английский и украинский нужно добавить вручную!');
  console.log('Структура translations создана, но поля en и uk пустые.');
  
} catch (error) {
  console.error('Ошибка:', error.message);
  process.exit(1);
}
