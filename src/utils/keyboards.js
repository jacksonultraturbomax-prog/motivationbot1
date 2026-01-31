/**
 * Клавиатуры для Telegram бота
 * Использует grammy для создания клавиатур
 * Поддерживает мультиязычность
 */
import { Keyboard } from 'grammy';
import { t, SUPPORTED_LANGUAGES } from './i18n.js';

/**
 * Клавиатура выбора языка
 */
export function getLanguageKeyboard() {
  return new Keyboard()
    .text(SUPPORTED_LANGUAGES.ru)
    .text(SUPPORTED_LANGUAGES.en)
    .row()
    .text(SUPPORTED_LANGUAGES.uk)
    .resized()
    .oneTime();
}

/**
 * Главное меню (с учетом языка)
 */
export function getMainMenu(lang = 'ru') {
  return new Keyboard()
    .text(t(lang, 'menu.random'))
    .text(t(lang, 'menu.useful'))
    .row()
    .text(t(lang, 'menu.commands'))
    .text(t(lang, 'menu.settings'))
    .resized();
}

/**
 * Меню настроек (с учетом языка)
 */
export function getSettingsMenu(lang = 'ru') {
  return new Keyboard()
    .text(t(lang, 'settings.changeType'))
    .text(t(lang, 'settings.changeFrequency'))
    .row()
    .text(t(lang, 'settings.changeLanguage'))
    .row()
    .text(t(lang, 'settings.back'))
    .resized();
}

/**
 * Кнопка подтверждения (с учетом языка)
 */
export function getConfirmationButton(lang = 'ru') {
  return new Keyboard()
    .text(t(lang, 'common.confirmation'))
    .resized()
    .oneTime();
}

/**
 * Кнопка начала работы (с учетом языка)
 */
export function getStartButton(lang = 'ru') {
  return new Keyboard()
    .text(t(lang, 'start.letsGo'))
    .resized()
    .oneTime();
}

/**
 * Выбор типа мотивации (с учетом языка)
 */
export function getMotivationTypeKeyboard(lang = 'ru') {
  return new Keyboard()
    .text(t(lang, 'motivation.types.hard'))
    .text(t(lang, 'motivation.types.brotherly'))
    .row()
    .text(t(lang, 'motivation.types.soft'))
    .text(t(lang, 'motivation.types.psychological'))
    .resized()
    .oneTime();
}

/**
 * Выбор частоты напоминаний (с учетом языка)
 */
export function getFrequencyKeyboard(lang = 'ru') {
  return new Keyboard()
    .text(t(lang, 'frequency.none'))
    .text(t(lang, 'frequency.daily'))
    .row()
    .text(t(lang, 'frequency.twiceDaily'))
    .text(t(lang, 'frequency.every3Days'))
    .resized()
    .oneTime();
}

/**
 * Кнопка изменения настроек (с учетом языка)
 */
export function getChangeSettingsKeyboard(lang = 'ru') {
  return new Keyboard()
    .text(t(lang, 'common.change'))
    .text(t(lang, 'common.allGood'))
    .resized()
    .oneTime();
}

/**
 * Кнопка изменения частоты (с учетом языка)
 */
export function getChangeFrequencyKeyboard(lang = 'ru') {
  return new Keyboard()
    .text(t(lang, 'common.change'))
    .text(t(lang, 'common.allOk'))
    .resized()
    .oneTime();
}
