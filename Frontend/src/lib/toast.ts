/**
 * Utilidad para mostrar notificaciones toast usando Sonner
 * Proporciona funciones simples para mostrar mensajes de éxito, error, información y advertencia
 */
import { toast as sonnerToast } from 'sonner';

export const toast = {
  /**
   * Muestra un mensaje de éxito
   */
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Muestra un mensaje de error
   */
  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 5000,
    });
  },

  /**
   * Muestra un mensaje de información
   */
  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Muestra un mensaje de advertencia
   */
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Muestra un mensaje de carga
   */
  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  /**
   * Actualiza un toast de carga a éxito o error
   */
  update: (toastId: string | number, type: 'success' | 'error', message: string, description?: string) => {
    sonnerToast[type](message, {
      id: toastId,
      description,
      duration: type === 'success' ? 4000 : 5000,
    });
  },

  /**
   * Cierra un toast específico
   */
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },
};




