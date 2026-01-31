/**
 * Вспомогательные функции для работы с языками
 */
import { getUserData } from '../services/database.js';
import { t } from './i18n.js';

/**
 * Получение языка пользователя из контекста
 * Возвращает язык пользователя или 'ru' по умолчанию для отображения интерфейса
 * ВАЖНО: это не означает, что язык сохранен в БД - используется только для отображения
 */
export function getLangFromContext(ctx) {
  const userId = ctx.from.id;
  const userData = getUserData(userId);
  const lang = userData?.language;
  // Если язык не выбран, возвращаем 'ru' для отображения интерфейса
  // Но это не означает, что язык сохранен в БД
  return (lang && lang !== '' && lang !== null && lang !== undefined) ? lang : 'ru';
}

/**
 * Получение перевода для пользователя из контекста
 */
export function translateForUser(ctx, key, params = {}) {
  const lang = getLangFromContext(ctx);
  return t(lang, key, params);
}

/**
 * Проверка, соответствует ли текст переводу на любом языке
 */
export function matchesTranslation(text, key) {
  const langs = ['ru', 'en', 'uk'];
  return langs.some(lang => t(lang, key) === text);
}

/**
 * Получение всех вариантов перевода для ключа
 */
export function getAllTranslations(key) {
  return {
    ru: t('ru', key),
    en: t('en', key),
    uk: t('uk', key),
  };
}
