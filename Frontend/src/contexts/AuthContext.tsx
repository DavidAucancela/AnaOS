import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService, UsuarioDTO } from '@/services/api';

interface UserProfile {
  idUsuario: number;
  email: string;
  nombres: string;
  apellidos: string;
  rol: string;
  idCooperativa?: number;
  cargo?: string;
  celular?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  loading: boolean;
  emailVerified: boolean;
  signUp: (email: string, password: string, nombres: string, apellidos: string, rol?: string) => Promise<{ error?: { message: string } }>;
  signIn: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: { message: string } }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  userProfile: UserProfile | null;
  resendVerificationEmail: () => Promise<{ error?: { message: string } }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const currentUser = apiService.getCurrentUser();
      if (currentUser && apiService.isAuthenticated()) {
        const userProfile: UserProfile = {
          idUsuario: currentUser.idUsuario,
          email: currentUser.correo,
          nombres: currentUser.nombres,
          apellidos: currentUser.apellidos,
          rol: currentUser.rol,
          idCooperativa: currentUser.idCooperativa,
          cargo: currentUser.cargo,
          celular: currentUser.celular,
        };
        setUser(userProfile);
        setProfile(userProfile);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    nombres: string,
    apellidos: string,
    rol: string = 'Usuario'
  ) => {
    try {
      const response = await apiService.register({
        correo: email,
        contrasena: password,
        nombres: nombres,
        apellidos: apellidos,
        rol: rol,
      });

      if (response.isSuccess) {
        return {};
      } else {
        return { error: { message: response.message || 'Error al registrar usuario' } };
      }
    } catch (error) {
      return { error: { message: error instanceof Error ? error.message : 'Error desconocido' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ correo: email, contrasena: password });

      if (response.isSuccess && response.usuario && response.token) {
        const userProfile: UserProfile = {
          idUsuario: response.usuario.idUsuario,
          email: response.usuario.correo,
          nombres: response.usuario.nombres,
          apellidos: response.usuario.apellidos,
          rol: response.usuario.rol,
          idCooperativa: response.usuario.idCooperativa,
          cargo: response.usuario.cargo,
          celular: response.usuario.celular,
        };
        setUser(userProfile);
        setProfile(userProfile);
        return {};
      } else {
        return { error: { message: response.message || 'Credenciales inválidas' } };
      }
    } catch (error) {
      return { error: { message: error instanceof Error ? error.message : 'Error al iniciar sesión' } };
    }
  };

  const signOut = async () => {
    apiService.logout();
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    try {
      if (!email.trim()) {
        return { error: { message: 'Por favor, ingresa tu correo electrónico' } };
      }

      const response = await apiService.resetPassword(email.trim());
      
      if (response.isSuccess) {
        return {};
      } else {
        return { error: { message: response.message || 'Error al restablecer la contraseña' } };
      }
    } catch (error) {
      return { error: { message: error instanceof Error ? error.message : 'Error desconocido' } };
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      const updateData: any = {};
      if (data.nombres) updateData.nombres = data.nombres;
      if (data.apellidos) updateData.apellidos = data.apellidos;
      if (data.cargo !== undefined) updateData.cargo = data.cargo;
      if (data.celular !== undefined) updateData.celular = data.celular;
      if (data.rol) updateData.rol = data.rol;
      if (data.idCooperativa !== undefined) updateData.idCooperativa = data.idCooperativa;

      const response = await apiService.updateUsuario(user.idUsuario, updateData);
      
      if (response.isSuccess) {
        await refreshProfile();
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const response = await apiService.getUsuarioById(user.idUsuario);
      if (response.isSuccess && response.data) {
        const usuario = response.data;
        const userProfile: UserProfile = {
          idUsuario: usuario.idUsuario,
          email: usuario.correo,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          rol: usuario.rol,
          idCooperativa: usuario.idCooperativa,
          cargo: usuario.cargo,
          celular: usuario.celular,
        };
        setUser(userProfile);
        setProfile(userProfile);
        localStorage.setItem('user', JSON.stringify(usuario));
      }
    } catch (error) {
      console.error('Error al refrescar perfil:', error);
    }
  };

  const resendVerificationEmail = async () => {
    // No aplicable para este backend
    return { error: { message: 'Funcionalidad no disponible' } };
  };

  const emailVerified = true; // Asumimos que el email está verificado si el usuario está autenticado

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      emailVerified,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateProfile,
      refreshProfile,
      userProfile: profile,
      resendVerificationEmail,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
