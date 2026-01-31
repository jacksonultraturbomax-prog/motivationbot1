/**
 * Скрипт для автоматического перевода текстов мотивации
 * Использует бесплатный API перевода через fetch
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const textsPath = resolve(rootDir, 'data/texts.json');

/**
 * Перевод текста через бесплатный API
 */
async function translateText(text, targetLang) {
  try {
    // Используем бесплатный API перевода (MyMemory Translation API)
    const langMap = {
      'en': 'en',
      'uk': 'uk',
    };
    
    const target = langMap[targetLang];
    if (!target) {
      return text;
    }
    
    const sourceLang = 'ru';
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${target}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
      const translated = data.responseData.translatedText;
      // Не возвращаем результат, если API вернул тот же текст (не перевёл)
      if (translated && translated.trim() !== text.trim()) {
        return translated;
      }
    }
    
    return null; // Сигнал: перевод не удался
  } catch (error) {
    console.error(`Ошибка перевода на ${targetLang}:`, error.message);
    return null;
  }
}

async function translateTexts() {
  console.log('Загрузка текстов...');
  const fileContent = readFileSync(textsPath, 'utf-8');
  const texts = JSON.parse(fileContent);
  
  console.log(`Найдено ${texts.length} текстов`);
  console.log('Начинаем перевод...');
  console.log('Это может занять некоторое время (около 5-10 минут)...\n');
  
  let translated = 0;
  let skipped = 0;
  
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    
    // Проверяем, нужен ли перевод
    const needsEnTranslation = !text.translations?.en?.short || 
                               !text.translations?.en?.long ||
                               text.translations.en.short === text.short;
    
    const needsUkTranslation = !text.translations?.uk?.short || 
                               !text.translations?.uk?.long ||
                               text.translations.uk.short === text.short;
    
    if (!needsEnTranslation && !needsUkTranslation) {
      skipped++;
      continue;
    }
    
    console.log(`Перевод текста ${i + 1}/${texts.length} (ID: ${text.id})...`);
    
    // Переводим на английский
    if (needsEnTranslation) {
      console.log('  → Перевод на английский...');
      const enShort = await translateText(text.short, 'en');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const enLong = await translateText(text.long, 'en');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!text.translations) text.translations = {};
      if (!text.translations.en) text.translations.en = {};
      if (enShort != null) text.translations.en.short = enShort;
      if (enLong != null) text.translations.en.long = enLong;
    }
    
    // Переводим на украинский
    if (needsUkTranslation) {
      console.log('  → Перевод на украинский...');
      const ukShort = await translateText(text.short, 'uk');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const ukLong = await translateText(text.long, 'uk');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!text.translations) text.translations = {};
      if (!text.translations.uk) text.translations.uk = {};
      if (ukShort != null) text.translations.uk.short = ukShort;
      if (ukLong != null) text.translations.uk.long = ukLong;
    }
    
    translated++;
    
    // Сохраняем прогресс каждые 5 текстов
    if ((i + 1) % 5 === 0) {
      writeFileSync(textsPath, JSON.stringify(texts, null, 2), 'utf-8');
      console.log(`  ✓ Прогресс сохранен: ${i + 1}/${texts.length} (переведено: ${translated}, пропущено: ${skipped})`);
    }
  }
  
  // Финальное сохранение
  writeFileSync(textsPath, JSON.stringify(texts, null, 2), 'utf-8');
  
  console.log(`\n✅ Готово!`);
  console.log(`Переведено: ${translated} текстов`);
  console.log(`Пропущено (уже переведено): ${skipped} текстов`);
  console.log(`Все переводы сохранены в ${textsPath}`);
}

translateTexts().catch(error => {
  console.error('Критическая ошибка:', error);
  process.exit(1);
});
