import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building2 } from 'lucide-react';

interface CooperativaAvatarProps {
  logo?: number[] | string | null; // Puede ser byte[] del backend o base64 string o URL
  nombre?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Componente Avatar para mostrar el logo de la cooperativa
 * Convierte automáticamente byte[] a base64 si es necesario
 */
export default function CooperativaAvatar({ 
  logo, 
  nombre = 'Cooperativa',
  size = 'md',
  className 
}: CooperativaAvatarProps) {
  // Función para convertir byte[] a base64
  const convertByteArrayToBase64 = (byteArray: number[]): string => {
    try {
      const uint8Array = new Uint8Array(byteArray);
      const base64 = btoa(String.fromCharCode(...uint8Array));
      // Intentar detectar el tipo MIME basado en los primeros bytes
      // Por defecto usamos image/png, pero podría mejorarse
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.error('Error al convertir byte array a base64:', error);
      return '';
    }
  };

  // Determinar la URL de la imagen
  const getImageSrc = (): string | undefined => {
    if (!logo) return undefined;
    
    // Si es un string (base64 o URL), usarlo directamente
    if (typeof logo === 'string') {
      // Si ya tiene el prefijo data:, usarlo tal cual
      if (logo.startsWith('data:') || logo.startsWith('http')) {
        return logo;
      }
      // Si es base64 sin prefijo, agregar el prefijo
      return `data:image/png;base64,${logo}`;
    }
    
    // Si es un array de números (byte[]), convertirlo
    if (Array.isArray(logo) && logo.length > 0) {
      return convertByteArrayToBase64(logo);
    }
    
    return undefined;
  };

  // Obtener las iniciales para el fallback
  const getInitials = (): string => {
    if (!nombre) return 'CO';
    const words = nombre.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  const imageSrc = getImageSrc();

  return (
    <Avatar size={size} className={className}>
      {imageSrc && (
        <AvatarImage 
          src={imageSrc} 
          alt={`Logo de ${nombre}`}
          onError={(e) => {
            // Si falla la carga de la imagen, mostrar el fallback
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <AvatarFallback className="bg-[#0066FF] text-white">
        {imageSrc ? (
          <Building2 className="h-1/2 w-1/2" />
        ) : (
          <span className="text-xs font-semibold">{getInitials()}</span>
        )}
      </AvatarFallback>
    </Avatar>
  );
}




