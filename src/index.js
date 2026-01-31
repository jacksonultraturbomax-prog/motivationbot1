/**
 * Точка входа приложения
 * Только bootstrap логика - инициализация и запуск бота
 * Вся бизнес-логика вынесена в отдельные модули
 */
import { initializeBot, shutdownBot } from './bot.js';
import { config } from './config/env.js';

/**
 * Главная функция запуска приложения
 */
async function main() {
  try {
    // Логирование режима работы
    const modeLabel = config.mode === 'prod' ? 'PRODUCTION' : 'DEVELOPMENT';
    console.log('='.repeat(50));
    console.log(`🚀 Запуск мотивационного бота [${modeLabel} MODE]`);
    console.log(`📡 Режим: Long Polling (без webhook)`);
    console.log(`🌍 Порт: ${config.port} (для Railway совместимости)`);
    console.log('='.repeat(50));
    
    // Инициализация и запуск бота
    const bot = await initializeBot();
    
    // Запуск бота с long polling
    // Grammy использует long polling по умолчанию через bot.start()
    // Это идеально для Railway - процесс будет работать непрерывно
    bot.start();
    
    console.log('✅ Бот успешно запущен и готов к работе!');
    console.log('📥 Long polling активен - бот получает обновления');
    
    if (config.mode === 'dev') {
      console.log('💡 Режим разработки: используйте Ctrl+C для остановки');
    } else {
      console.log('🏭 Production режим: бот работает на Railway');
    }
    
    // Обработка сигналов для graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n📴 Получен сигнал ${signal}, выполняется graceful shutdown...`);
      try {
        await shutdownBot(bot);
        process.exit(0);
      } catch (error) {
        console.error('❌ Ошибка при shutdown:', error);
        process.exit(1);
      }
    };
    
    process.once('SIGINT', () => {
      shutdown('SIGINT').catch(err => {
        console.error('❌ Ошибка при обработке SIGINT:', err);
        process.exit(1);
      });
    });
    
    process.once('SIGTERM', () => {
      shutdown('SIGTERM').catch(err => {
        console.error('❌ Ошибка при обработке SIGTERM:', err);
        process.exit(1);
      });
    });
    
    // Обработка необработанных ошибок
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Необработанное отклонение промиса:', reason);
    });
    
    process.on('uncaughtException', (error) => {
      console.error('❌ Необработанное исключение:', error);
      shutdownBot(bot).then(() => process.exit(1));
    });
    
  } catch (error) {
    console.error('❌ Критическая ошибка при запуске бота:', error);
    console.error('Стек ошибки:', error.stack);
    process.exit(1);
  }
}

// Запуск приложения
main();
