/**
 * Скрипт для конвертации CSV файла с текстами в JSON
 * Запуск: node scripts/convert-csv-to-json.js
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Пути к файлам
const csvPath = resolve(rootDir, 'old_bot_py/motivation_texts.csv');
const jsonPath = resolve(rootDir, 'data/texts.json');

// Создаем директорию data, если её нет
try {
  mkdirSync(resolve(rootDir, 'data'), { recursive: true });
} catch (error) {
  // Директория уже существует
}

// Читаем CSV файл
const csvContent = readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());

// Парсим CSV (простой парсер, учитывающий кавычки)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Экранированная кавычка
        current += '"';
        i++;
      } else {
        // Начало/конец кавычек
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Разделитель полей
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Добавляем последнее поле
  result.push(current.trim());
  
  return result;
}

// Парсим заголовки
const headers = parseCSVLine(lines[0]);
console.log('Заголовки:', headers);

// Парсим данные
const texts = [];
for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i]);
  
  if (values.length >= 4) {
    const text = {
      id: values[0] || String(i),
      category: values[1] || '',
      short: values[2] || '',
      long: values[3] || '',
      status: values[4] || '0',
    };
    
    texts.push(text);
  }
}

// Сохраняем в JSON
writeFileSync(jsonPath, JSON.stringify(texts, null, 2), 'utf-8');

console.log(`✅ Конвертировано ${texts.length} текстов`);
console.log(`📁 Файл сохранен: ${jsonPath}`);
