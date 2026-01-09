/**
 * ID Generator Utility
 * 
 * Funções utilitárias para gerar identificadores únicos
 */

/**
 * Gera um ID único usando timestamp e número aleatório
 * @returns String com ID único
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${randomPart}`;
}

/**
 * Gera um UUID v4 simplificado
 * @returns String com UUID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
