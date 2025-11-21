import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Solo redirigir si el usuario está completamente cargado y autenticado
    // Esto evita redirecciones prematuras durante la carga inicial
    if (!loading && user) {
      // Opcional: redirigir usuarios autenticados al dashboard
      // Si prefieres que vean la página principal, comenta esta línea
      // navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Mostrar siempre el contenido del frontend, incluso si el usuario está autenticado
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
};

export default Index;
