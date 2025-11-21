// Servicio API para conectarse al backend ASP.NET Web API

const API_BASE_URL = 'http://localhost:5133/api';

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  token?: string;
  usuario?: {
    idUsuario: number;
    nombres: string;
    apellidos: string;
    correo: string;
    rol: string;
    idCooperativa?: number;
    cargo?: string;
    celular?: string;
  };
  message?: string;
}

export interface UsuarioCreateDTO {
  idCooperativa?: number;
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  rol?: string;
  cargo?: string;
  celular?: string;
}

export interface RegistroCompletoDTO {
  // Datos de Usuario
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  rol?: string;
  cargo?: string;
  funcion?: string;
  celular?: string;
  // Datos de Cooperativa
  nombreCooperativa: string;
  ruc: string;
  direccion: string;
  telefono?: string;
  // Archivos (solo uno de nombramiento, compartido) - enviados como base64
  archivoNombramiento?: string;
  nombreArchivo?: string;
  // Logo de la cooperativa - enviado como base64
  logo?: string;
  nombreLogo?: string;
}

export interface UsuarioUpdateDTO {
  idCooperativa?: number;
  nombres?: string;
  apellidos?: string;
  contrasena?: string;
  rol?: string;
  cargo?: string;
  funcion?: string;
  celular?: string;
  archivoNombramiento?: string;
  nombreArchivo?: string;
}

export interface UsuarioDTO {
  idUsuario: number;
  idCooperativa?: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: string;
  cargo?: string;
  funcion?: string;
  celular?: string;
}

// Cooperativa
export interface CooperativaDTO {
  idCooperativa: number;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono?: string;
  correo?: string;
  archivoNombramiento?: number[];
  nombreArchivo?: string;
  logo?: number[];
  nombreLogo?: string;
}

export interface CooperativaCreateDTO {
  nombre: string;
  ruc: string;
  direccion: string;
  telefono?: string;
  correo?: string;
  archivoNombramiento?: number[];
  nombreArchivo?: string;
}

export interface CooperativaUpdateDTO {
  nombre?: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
  archivoNombramiento?: string; // base64
  nombreArchivo?: string;
  logo?: string; // base64
  nombreLogo?: string;
}

// Agencia
export interface AgenciaDTO {
  idAgencia: number;
  idCooperativa?: number;
  nombre: string;
  codigoInterno?: string;
  direccion?: string;
  telefono?: string;
  nombreResponsable?: string;
  provincia?: string;
  canton?: string;
  ciudad?: string;
  horaApertura?: string;
  horaCierre?: string;
}

export interface AgenciaCreateDTO {
  idCooperativa?: number;
  nombre: string;
  codigoInterno?: string;
  direccion?: string;
  telefono?: string;
  nombreResponsable?: string;
  provincia?: string;
  canton?: string;
  ciudad?: string;
  horaApertura?: string;
  horaCierre?: string;
}

export interface AgenciaUpdateDTO {
  nombre?: string;
  codigoInterno?: string;
  direccion?: string;
  telefono?: string;
  nombreResponsable?: string;
  provincia?: string;
  canton?: string;
  ciudad?: string;
  horaApertura?: string;
  horaCierre?: string;
}

// Cuenta
export interface CuentaDTO {
  idCuenta: number;
  idCooperativa: number;
  numeroCuenta: string;
  tipoCuenta: string;
  saldo: number;
  moneda: string;
  estado: string;
  fechaApertura?: string;
  fechaCierre?: string;
  descripcion?: string;
}

export interface CuentaCreateDTO {
  idCooperativa: number;
  numeroCuenta: string;
  tipoCuenta: string;
  saldo?: number;
  moneda?: string;
  estado?: string;
  descripcion?: string;
}

export interface CuentaUpdateDTO {
  tipoCuenta?: string;
  saldo?: number;
  moneda?: string;
  estado?: string;
  fechaCierre?: string;
  descripcion?: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  message?: string;
}

// Suscripciones
export interface PlanSuscripcionDTO {
  idPlan: number;
  nombre: string;
  tipoPlan: string; // basica, professional, enterprise, custom
  descripcion?: string;
  precioMensual: number;
  precioAnual: number;
  moneda: string;
  maxUsuarios?: number;
  maxAgencias?: number;
  maxCuentas?: number;
  almacenamientoGb?: number;
  soportePrioritario: boolean;
  apiAccess: boolean;
  customizacionBranding: boolean;
  activo: boolean;
  destacado: boolean;
}

export interface SuscripcionDTO {
  idSuscripcion: number;
  idCooperativa: number;
  nombreCooperativa?: string;
  idPlan: number;
  nombrePlan?: string;
  tipoPlan?: string;
  estado: string; // active, canceled, expired, pending, past_due, suspended
  periodo: string; // monthly, annual
  fechaInicio: string;
  fechaFin: string;
  fechaCancelacion?: string;
  proximaFechaCobro: string;
  montoPagado: number;
  moneda: string;
  renovacionAutomatica: boolean;
  metodoPago?: string;
  idMetodoPago?: string;
  ultimos4Digitos?: string;
  nombreComprobante?: string;
  notas?: string;
  motivoCancelacion?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  diasRestantes?: number;
  estaPorVencer?: boolean;
}

export interface SuscripcionCreateDTO {
  idCooperativa: number;
  idPlan: number;
  periodo: string; // monthly, annual
  montoPagado: number;
  moneda?: string;
  renovacionAutomatica?: boolean;
  metodoPago?: string;
  idMetodoPago?: string;
  ultimos4Digitos?: string;
  comprobantePago?: string;
  nombreComprobante?: string;
  notas?: string;
}

export interface SuscripcionUpdateDTO {
  idPlan?: number;
  estado?: string;
  periodo?: string;
  fechaInicio?: string;
  fechaFin?: string;
  fechaCancelacion?: string;
  proximaFechaCobro?: string;
  montoPagado?: number;
  moneda?: string;
  renovacionAutomatica?: boolean;
  metodoPago?: string;
  idMetodoPago?: string;
  ultimos4Digitos?: string;
  comprobantePago?: string;
  nombreComprobante?: string;
  notas?: string;
  motivoCancelacion?: string;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        return {
          isSuccess: false,
          message: text || `Error: ${response.statusText}`,
        };
      }

      if (!response.ok) {
        if (response.status === 404) {
          return {
            isSuccess: false,
            message: `Endpoint no encontrado. Asegúrate de que el backend esté corriendo y recompilado.`,
          };
        }
        return {
          isSuccess: false,
          message: data.message || `Error: ${response.statusText}`,
        };
      }

      return data;
    } catch (error) {
      console.error('Error en request:', error);
      return {
        isSuccess: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Autenticación
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${API_BASE_URL}/Acceso/Login`, {
        method: 'POST',
        headers,
        body: JSON.stringify(credentials),
      });

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Respuesta no JSON del servidor:', text);
        return {
          isSuccess: false,
          message: text || `Error: ${response.statusText}`,
        };
      }

      if (!response.ok) {
        console.error('Error en login:', data);
        return {
          isSuccess: false,
          message: data.message || `Error: ${response.statusText}`,
        };
      }

      // El backend devuelve directamente { isSuccess, token, usuario }
      if (data.isSuccess && data.token) {
        localStorage.setItem('token', data.token);
        if (data.usuario) {
          localStorage.setItem('user', JSON.stringify(data.usuario));
        }
        return {
          isSuccess: true,
          token: data.token,
          usuario: data.usuario,
        };
      }

      console.error('Respuesta sin token:', data);
      return {
        isSuccess: false,
        message: data.message || 'Error al iniciar sesión',
      };
    } catch (error) {
      console.error('Excepción en login:', error);
      return {
        isSuccess: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  async register(userData: UsuarioCreateDTO): Promise<ApiResponse<{ idUsuario: number }>> {
    return this.request<{ idUsuario: number }>('/Acceso/Registrarse', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async registroCompleto(data: RegistroCompletoDTO): Promise<ApiResponse<{ idCooperativa: number; idUsuario: number }>> {
    return this.request<{ idCooperativa: number; idUsuario: number }>('/Acceso/RegistroCompleto', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(correo: string): Promise<ApiResponse<void>> {
    return this.request<void>('/Acceso/ResetPassword', {
      method: 'POST',
      body: JSON.stringify({ correo }),
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Usuarios
  async getAllUsuarios(): Promise<ApiResponse<UsuarioDTO[]>> {
    return this.request<UsuarioDTO[]>('/Usuario');
  }

  async getUsuarioById(id: number): Promise<ApiResponse<UsuarioDTO>> {
    return this.request<UsuarioDTO>(`/Usuario/${id}`);
  }

  async getUsuarioByCorreo(correo: string): Promise<ApiResponse<UsuarioDTO>> {
    return this.request<UsuarioDTO>(`/Usuario/ByCorreo/${encodeURIComponent(correo)}`);
  }

  async updateUsuario(id: number, userData: UsuarioUpdateDTO): Promise<ApiResponse<void>> {
    return this.request<void>(`/Usuario/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUsuario(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/Usuario/${id}`, {
      method: 'DELETE',
    });
  }

  async crearGerente(userData: UsuarioCreateDTO): Promise<ApiResponse<UsuarioDTO>> {
    return this.request<UsuarioDTO>('/Usuario/CrearGerente', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  getCurrentUser(): UsuarioDTO | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as UsuarioDTO;
      } catch {
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Cooperativas
  async getAllCooperativas(): Promise<ApiResponse<CooperativaDTO[]>> {
    return this.request<CooperativaDTO[]>('/Cooperativa');
  }

  async getCooperativaById(id: number): Promise<ApiResponse<CooperativaDTO>> {
    return this.request<CooperativaDTO>(`/Cooperativa/${id}`);
  }

  async getCooperativaByRuc(ruc: string): Promise<ApiResponse<CooperativaDTO>> {
    return this.request<CooperativaDTO>(`/Cooperativa/ByRuc/${encodeURIComponent(ruc)}`);
  }

  async createCooperativa(cooperativa: CooperativaCreateDTO): Promise<ApiResponse<CooperativaDTO>> {
    return this.request<CooperativaDTO>('/Cooperativa', {
      method: 'POST',
      body: JSON.stringify(cooperativa),
    });
  }

  async updateCooperativa(id: number, cooperativa: CooperativaUpdateDTO): Promise<ApiResponse<CooperativaDTO>> {
    return this.request<CooperativaDTO>(`/Cooperativa/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cooperativa),
    });
  }

  async deleteCooperativa(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/Cooperativa/${id}`, {
      method: 'DELETE',
    });
  }

  // Agencias
  async getAllAgencias(): Promise<ApiResponse<AgenciaDTO[]>> {
    return this.request<AgenciaDTO[]>('/Agencia');
  }

  async getAgenciaById(id: number): Promise<ApiResponse<AgenciaDTO>> {
    return this.request<AgenciaDTO>(`/Agencia/${id}`);
  }

  async getAgenciasByCooperativa(idCooperativa: number): Promise<ApiResponse<AgenciaDTO[]>> {
    return this.request<AgenciaDTO[]>(`/Agencia/ByCooperativa/${idCooperativa}`);
  }

  async getAgenciaByCodigoInterno(codigoInterno: string): Promise<ApiResponse<AgenciaDTO>> {
    return this.request<AgenciaDTO>(`/Agencia/ByCodigoInterno/${encodeURIComponent(codigoInterno)}`);
  }

  async createAgencia(agencia: AgenciaCreateDTO): Promise<ApiResponse<AgenciaDTO>> {
    return this.request<AgenciaDTO>('/Agencia', {
      method: 'POST',
      body: JSON.stringify(agencia),
    });
  }

  async updateAgencia(id: number, agencia: AgenciaUpdateDTO): Promise<ApiResponse<AgenciaDTO>> {
    return this.request<AgenciaDTO>(`/Agencia/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agencia),
    });
  }

  async deleteAgencia(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/Agencia/${id}`, {
      method: 'DELETE',
    });
  }

  // Cuentas
  async getAllCuentas(): Promise<ApiResponse<CuentaDTO[]>> {
    return this.request<CuentaDTO[]>('/Cuenta');
  }

  async getCuentaById(id: number): Promise<ApiResponse<CuentaDTO>> {
    return this.request<CuentaDTO>(`/Cuenta/${id}`);
  }

  async getCuentasByCooperativa(idCooperativa: number): Promise<ApiResponse<CuentaDTO[]>> {
    return this.request<CuentaDTO[]>(`/Cuenta/ByCooperativa/${idCooperativa}`);
  }

  async getCuentaByNumero(numeroCuenta: string): Promise<ApiResponse<CuentaDTO>> {
    return this.request<CuentaDTO>(`/Cuenta/ByNumero/${encodeURIComponent(numeroCuenta)}`);
  }

  async createCuenta(cuenta: CuentaCreateDTO): Promise<ApiResponse<CuentaDTO>> {
    return this.request<CuentaDTO>('/Cuenta', {
      method: 'POST',
      body: JSON.stringify(cuenta),
    });
  }

  async updateCuenta(id: number, cuenta: CuentaUpdateDTO): Promise<ApiResponse<void>> {
    return this.request<void>(`/Cuenta/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cuenta),
    });
  }

  async updateCuentaSaldo(id: number, nuevoSaldo: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/Cuenta/${id}/Saldo`, {
      method: 'PUT',
      body: JSON.stringify(nuevoSaldo),
    });
  }

  async cambiarEstadoCuenta(id: number, nuevoEstado: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Cuenta/${id}/Estado`, {
      method: 'PUT',
      body: JSON.stringify(nuevoEstado),
    });
  }

  async getSaldoTotalCooperativa(idCooperativa: number): Promise<ApiResponse<{ idCooperativa: number; saldoTotal: number }>> {
    return this.request<{ idCooperativa: number; saldoTotal: number }>(`/Cuenta/SaldoTotal/${idCooperativa}`);
  }

  async deleteCuenta(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/Cuenta/${id}`, {
      method: 'DELETE',
    });
  }

  async getAllPlanesSuscripcion(): Promise<ApiResponse<PlanSuscripcionDTO[]>> {
    return this.request<PlanSuscripcionDTO[]>('/PlanSuscripcion');
  }

  async getPlanSuscripcionById(id: number): Promise<ApiResponse<PlanSuscripcionDTO>> {
    return this.request<PlanSuscripcionDTO>(`/PlanSuscripcion/${id}`);
  }

  async getPlanesByType(tipoPlan: string): Promise<ApiResponse<PlanSuscripcionDTO[]>> {
    return this.request<PlanSuscripcionDTO[]>(`/PlanSuscripcion/ByType/${tipoPlan}`);
  }

  async getFeaturedPlans(): Promise<ApiResponse<PlanSuscripcionDTO[]>> {
    return this.request<PlanSuscripcionDTO[]>('/PlanSuscripcion/Featured');
  }

  async getSuscripcionesByCooperativa(idCooperativa: number): Promise<ApiResponse<SuscripcionDTO[]>> {
    return this.request<SuscripcionDTO[]>(`/Suscripcion/ByCooperativa/${idCooperativa}`);
  }

  async getActiveSubscriptionByCooperativa(idCooperativa: number): Promise<ApiResponse<SuscripcionDTO>> {
    return this.request<SuscripcionDTO>(`/Suscripcion/Active/ByCooperativa/${idCooperativa}`);
  }

  async createSuscripcion(suscripcion: SuscripcionCreateDTO): Promise<ApiResponse<SuscripcionDTO>> {
    return this.request<SuscripcionDTO>('/Suscripcion', {
      method: 'POST',
      body: JSON.stringify(suscripcion),
    });
  }

  async updateSuscripcion(id: number, suscripcion: SuscripcionUpdateDTO): Promise<ApiResponse<SuscripcionDTO>> {
    return this.request<SuscripcionDTO>(`/Suscripcion/${id}`, {
      method: 'PUT',
      body: JSON.stringify(suscripcion),
    });
  }

  async cancelSuscripcion(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/Suscripcion/${id}/Cancel`, {
      method: 'POST',
    });
  }

  async hasActiveSubscription(idCooperativa: number): Promise<ApiResponse<{ hasActive: boolean }>> {
    return this.request<{ hasActive: boolean }>(`/Suscripcion/HasActive/${idCooperativa}`);
  }

  async getSubscriptionsExpiringSoon(days: number = 30): Promise<ApiResponse<SuscripcionDTO[]>> {
    return this.request<SuscripcionDTO[]>(`/Suscripcion/ExpiringSoon/${days}`);
  }

  async getSubscriptionsForRenewal(): Promise<ApiResponse<SuscripcionDTO[]>> {
    return this.request<SuscripcionDTO[]>('/Suscripcion/ForRenewal');
  }

  async renewSubscription(id: number): Promise<ApiResponse<SuscripcionDTO>> {
    return this.request<SuscripcionDTO>(`/Suscripcion/${id}/Renew`, {
      method: 'POST',
    });
  }

  // Procesar pago y crear suscripción
  async processPayment(data: {
    idCooperativa: number;
    idPlan: number;
    periodo: string;
    montoPagado: number;
    moneda?: string;
    renovacionAutomatica?: boolean;
    metodoPago: string;
    idMetodoPago?: string;
    ultimos4Digitos?: string;
    tokenKushki?: string;
    comprobantePago?: string;
    nombreComprobante?: string;
    notas?: string;
  }): Promise<ApiResponse<SuscripcionDTO>> {
    return this.request<SuscripcionDTO>('/Suscripcion/ProcessPayment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Obtener todas las cooperativas con sus suscripciones (para admin)
  async getAllCooperativasWithSubscriptions(): Promise<ApiResponse<Array<CooperativaDTO & { suscripcion?: SuscripcionDTO }>>> {
    return this.request<Array<CooperativaDTO & { suscripcion?: SuscripcionDTO }>>('/Cooperativa/WithSubscriptions');
  }
}

export const apiService = new ApiService();

