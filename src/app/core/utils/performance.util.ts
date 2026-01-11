/**
 * Performance Utilities
 * 
 * Utilitários para otimização de performance
 */

/**
 * Debounce function para limitar chamadas de funções
 * @param func - Função a executar
 * @param wait - Tempo de espera em milissegundos
 * @returns Função com debounce aplicado
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function para limitar chamadas de funções
 * @param func - Função a executar
 * @param limit - Tempo limite em milissegundos
 * @returns Função com throttle aplicado
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load de imagens
 * @param imageSrc - Source da imagem
 * @returns Promise que resolve quando a imagem está carregada
 */
export function loadImage(imageSrc: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = imageSrc;
  });
}
