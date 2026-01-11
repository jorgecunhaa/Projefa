/**
 * Application Constants
 * 
 * Constantes globais da aplicação
 */

/**
 * Configurações da aplicação
 */
export const APP_CONFIG = {
  name: 'Projefa',
  version: '1.0.0',
  primaryColor: '#8B0000', // Bordô
  defaultLanguage: 'pt',
  debounceTime: 300, // ms
  imageMaxSize: 800, // pixels
  imageQuality: 0.9,
  notificationDefaultTime: { hour: 9, minute: 0 },
  notificationDefaultMinutesBefore: 60
} as const;

/**
 * Chaves de armazenamento
 */
export const STORAGE_KEYS = {
  SEED_EXECUTED: 'seedExecuted',
  NOTIFICATIONS_ENABLED: 'notificationsEnabled',
  NOTIFICATION_TIME: 'notificationTime',
  NOTIFICATION_MINUTES_BEFORE: 'notificationMinutesBefore',
  DARK_MODE: 'darkMode',
  ORIENTATION_LOCK: 'orientationLock'
} as const;

/**
 * Mensagens de erro comuns
 */
export const ERROR_MESSAGES = {
  GENERIC: 'Ocorreu um erro. Por favor, tenta novamente.',
  NETWORK: 'Erro de ligação. Verifica a tua ligação à internet.',
  NOT_FOUND: 'Item não encontrado.',
  VALIDATION: 'Por favor, verifica os dados introduzidos.',
  PERMISSION: 'Permissão negada. Por favor, permite o acesso nas configurações.'
} as const;

/**
 * Mensagens de sucesso comuns
 */
export const SUCCESS_MESSAGES = {
  SAVED: 'Guardado com sucesso!',
  DELETED: 'Eliminado com sucesso!',
  UPDATED: 'Atualizado com sucesso!',
  CREATED: 'Criado com sucesso!'
} as const;
