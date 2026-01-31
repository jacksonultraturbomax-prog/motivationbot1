/**
 * Скрипт для автоматического перевода текстов мотивации
 * Использует microsoft-translate-api для перевода на английский и украинский
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const textsPath = resolve(rootDir, 'data/texts.json');

// Динамический импорт для microsoft-translate-api
let translate = null;

async function initTranslator() {
  try {
    // Пытаемся использовать microsoft-translate-api
    const translateModule = await import('microsoft-translate-api');
    translate = translateModule.translate || translateModule.default?.translate;
    
    if (!translate) {
      console.error('Не удалось загрузить модуль перевода');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при загрузке модуля перевода:', error.message);
    console.log('\nДля использования автоматического перевода установите:');
    console.log('npm install microsoft-translate-api');
    return false;
  }
}

async function translateText(text, targetLang) {
  if (!translate) {
    return text; // Возвращаем оригинал, если переводчик не инициализирован
  }
  
  try {
    // Microsoft Translator поддерживает: 'ru', 'en', 'uk'
    const langMap = {
      'en': 'en',
      'uk': 'uk',
    };
    
    const target = langMap[targetLang];
    if (!target) {
      return text;
    }
    
    const result = await translate(text, null, target);
    return result.text || text;
  } catch (error) {
    console.error(`Ошибка перевода на ${targetLang}:`, error.message);
    return text; // Возвращаем оригинал при ошибке
  }
}

async function translateTexts() {
  console.log('Загрузка текстов...');
  const fileContent = readFileSync(textsPath, 'utf-8');
  const texts = JSON.parse(fileContent);
  
  console.log(`Найдено ${texts.length} текстов`);
  
  // Инициализируем переводчик
  const translatorReady = await initTranslator();
  if (!translatorReady) {
    console.log('\nПереводчик не доступен. Тексты останутся на русском языке.');
    console.log('Для автоматического перевода установите: npm install microsoft-translate-api');
    return;
  }
  
  console.log('Начинаем перевод...');
  console.log('Это может занять некоторое время...\n');
  
  let translated = 0;
  let skipped = 0;
  
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    
    // Пропускаем, если переводы уже есть и не пустые
    if (text.translations?.en?.short && text.translations?.en?.long &&
        text.translations?.uk?.short && text.translations?.uk?.long) {
      skipped++;
      continue;
    }
    
    console.log(`Перевод текста ${i + 1}/${texts.length} (ID: ${text.id})...`);
    
    // Переводим на английский
    if (!text.translations?.en?.short || !text.translations?.en?.long) {
      const enShort = await translateText(text.short, 'en');
      const enLong = await translateText(text.long, 'en');
      
      if (!text.translations) text.translations = {};
      if (!text.translations.en) text.translations.en = {};
      text.translations.en.short = enShort;
      text.translations.en.long = enLong;
      
      // Небольшая задержка, чтобы не перегружать API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Переводим на украинский
    if (!text.translations?.uk?.short || !text.translations?.uk?.long) {
      const ukShort = await translateText(text.short, 'uk');
      const ukLong = await translateText(text.long, 'uk');
      
      if (!text.translations) text.translations = {};
      if (!text.translations.uk) text.translations.uk = {};
      text.translations.uk.short = ukShort;
      text.translations.uk.long = ukLong;
      
      // Небольшая задержка, чтобы не перегружать API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    translated++;
    
    // Сохраняем прогресс каждые 10 текстов
    if ((i + 1) % 10 === 0) {
      writeFileSync(textsPath, JSON.stringify(texts, null, 2), 'utf-8');
      console.log(`Прогресс сохранен: ${i + 1}/${texts.length}`);
    }
  }
  
  // Финальное сохранение
  writeFileSync(textsPath, JSON.stringify(texts, null, 2), 'utf-8');
  
  console.log(`\nГотово!`);
  console.log(`Переведено: ${translated} текстов`);
  console.log(`Пропущено (уже переведено): ${skipped} текстов`);
}

translateTexts().catch(error => {
  console.error('Критическая ошибка:', error);
  process.exit(1);
});
