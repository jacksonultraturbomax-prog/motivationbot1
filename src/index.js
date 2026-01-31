/**
 * Точка входа приложения
 * Только bootstrap логика - инициализация и запуск бота
 */
import { initializeBot, shutdownBot } from './bot.js';
import { config, validateEnv } from './config/env.js';

/**
 * Главная функция запуска приложения
 */
async function main() {
  try {
    // ✅ ВАЖНО: валидируем env ЯВНО, после старта Node
    validateEnv();

    const modeLabel = config.mode === 'prod' ? 'PRODUCTION' : 'DEVELOPMENT';

    console.log('='.repeat(50));
    console.log(`🚀 Запуск мотивационного бота [${modeLabel} MODE]`);
    console.log(`📡 Режим: Long Polling (без webhook)`);
    console.log(`🌍 Порт: ${config.port} (Railway friendly)`);
    console.log('='.repeat(50));

    const bot = await initializeBot();

    bot.start();

    console.log('✅ Бот успешно запущен и готов к работе!');
    console.log('📥 Long polling активен');

    if (config.mode === 'dev') {
      console.log('💡 Dev режим: Ctrl+C для остановки');
    } else {
      console.log('🏭 Production режим (Railway)');
    }

    /**
     * Graceful shutdown
     */
    const shutdown = async (signal) => {
      console.log(`\n📴 Получен сигнал ${signal}, завершаем работу...`);
      try {
        await shutdownBot(bot);
        process.exit(0);
      } catch (error) {
        console.error('❌ Ошибка при shutdown:', error);
        process.exit(1);
      }
    };

    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));

    process.on('unhandledRejection', (reason) => {
      console.error('❌ Unhandled Promise Rejection:', reason);
    });

    process.on('uncaughtException', async (error) => {
      console.error('❌ Uncaught Exception:', error);
      try {
        await shutdownBot(bot);
      } finally {
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Критическая ошибка при запуске бота:');
    console.error(error.message);
    process.exit(1);
  }
}

// 🚀 Запуск
main();
