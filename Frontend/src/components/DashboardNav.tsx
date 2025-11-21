import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { apiService } from '@/services/api';
import CooperativaAvatar from '@/components/CooperativaAvatar';
import { SubscriptionPanel } from '@/components/SubscriptionPanel';
import { Mail } from 'lucide-react';

const DEFAULT_COOPERATIVE_NAME = 'Cooperativa Ana-OS';

export const DashboardNav = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [cooperativeName, setCooperativeName] = useState(DEFAULT_COOPERATIVE_NAME);
  const [cooperativaLogo, setCooperativaLogo] = useState<number[] | null>(null);
  const [subscriptionPanelOpen, setSubscriptionPanelOpen] = useState(false);
  const isAdmin = profile?.rol?.toLowerCase() === 'administrador';

  useEffect(() => {
    let isMounted = true;

    const loadCooperativeName = async () => {
      if (!profile?.idCooperativa) {
        setCooperativeName(DEFAULT_COOPERATIVE_NAME);
        return;
      }

      try {
        const response = await apiService.getCooperativaById(profile.idCooperativa);
        if (response.isSuccess && response.data && isMounted) {
          setCooperativeName(response.data.nombre || DEFAULT_COOPERATIVE_NAME);
          if (response.data.logo && Array.isArray(response.data.logo) && response.data.logo.length > 0) {
            setCooperativaLogo(response.data.logo);
          }
        }
      } catch (error) {
        console.error('Error al obtener la cooperativa:', error);
        if (isMounted) {
          setCooperativeName(DEFAULT_COOPERATIVE_NAME);
        }
      }
    };

    loadCooperativeName();

    return () => {
      isMounted = false;
    };
  }, [profile?.idCooperativa]);

  const handleSupportClick = () => {
    const subject = encodeURIComponent('Solicitud de soporte técnico - Ana-OS');
    const body = encodeURIComponent(
      [
        'Hola equipo de soporte de Ana-OS,',
        '',
        'Necesito ayuda con el siguiente requerimiento:',
        '- Descripción del problema:',
        '- Impacto en la operación:',
        '- Datos de contacto:',
        '',
        'Gracias por su pronta respuesta.',
      ].join('\n')
    );

    window.location.href = `mailto:soporte@anaos.com?subject=${subject}&body=${body}`;
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSubscriptionClick = () => {
    setSubscriptionPanelOpen(true);
  };

  return (
    <nav className="bg-white/50 backdrop-blur-md border-b border-white/30 sticky top-0 z-50 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            {!isAdmin && cooperativaLogo && (
              <CooperativaAvatar 
                logo={cooperativaLogo}
                nombre={cooperativeName}
                size="md"
              />
            )}
            <p className="text-base font-semibold text-gray-900 drop-shadow-md">
              {isAdmin ? 'Bienvenido Admin' : cooperativeName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="text-gray-800 hover:text-blue-600 bg-white/80 backdrop-blur-sm border-white/40"
              onClick={handleSupportClick}
              aria-label="Contactar soporte de Ana-OS"
            >
              <Mail className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 rounded-full border border-white/40 bg-white/80 backdrop-blur-sm hover:text-blue-600 p-0"
                  aria-label="Opciones de cuenta"
                >
                  {cooperativaLogo ? (
                    <CooperativaAvatar 
                      logo={cooperativaLogo}
                      nombre={cooperativeName}
                      size="sm"
                      className="h-10 w-10"
                    />
                  ) : (
                    <span className="text-gray-800 font-semibold">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md">
                <DropdownMenuLabel>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-900">{profile ? `${profile.nombres} ${profile.apellidos}` : 'Usuario Ana-OS'}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleGoToProfile}>Modificar cuenta</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSubscriptionClick}>Suscripción</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>Cerrar sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <SubscriptionPanel 
        open={subscriptionPanelOpen} 
        onOpenChange={setSubscriptionPanelOpen} 
      />
    </nav>
  );
};
