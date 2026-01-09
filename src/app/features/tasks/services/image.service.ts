import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

/**
 * Image Service
 * 
 * Serviço responsável pela captura e processamento de imagens.
 * Utiliza o Capacitor Camera para capturar imagens da câmara
 * ou galeria e converte para Base64.
 * 
 * @service ImageService
 */
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  /**
   * Captura uma imagem da câmara ou galeria
   * @param source - Fonte da imagem (camera ou gallery)
   * @returns Promise com a imagem em Base64 ou null
   */
  async captureImage(source: 'camera' | 'gallery' = 'camera'): Promise<string | null> {
    try {
      // Verificar se está em plataforma nativa
      if (!Capacitor.isNativePlatform()) {
        // Fallback para web - usar input file
        return await this.captureImageWeb();
      }

      const image: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
        width: 800,
        height: 800
      });

      return image.base64String || null;
    } catch (error) {
      console.error('Erro ao capturar imagem:', error);
      return null;
    }
  }

  /**
   * Captura imagem na web usando input file
   * @returns Promise com a imagem em Base64 ou null
   */
  private async captureImageWeb(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            // Remover o prefixo data:image/...;base64,
            const base64 = e.target.result.split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(file);
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  }

  /**
   * Obtém a URL da imagem para exibição
   * @param base64 - String Base64 da imagem
   * @returns URL da imagem
   */
  getImageUrl(base64: string | null | undefined): string | null {
    if (!base64) {
      return null;
    }
    return `data:image/jpeg;base64,${base64}`;
  }

  /**
   * Redimensiona uma imagem Base64
   * @param base64 - String Base64 da imagem
   * @param maxWidth - Largura máxima
   * @param maxHeight - Altura máxima
   * @returns Promise com a imagem redimensionada em Base64
   */
  async resizeImage(base64: string, maxWidth: number = 800, maxHeight: number = 800): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calcular novas dimensões mantendo proporção
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const resizedBase64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
          resolve(resizedBase64);
        } else {
          resolve(base64);
        }
      };
      img.src = `data:image/jpeg;base64,${base64}`;
    });
  }
}
