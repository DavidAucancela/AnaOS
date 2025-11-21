import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, CooperativaDTO } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import CooperativaAvatar from '@/components/CooperativaAvatar';
import { DashboardNav } from '@/components/DashboardNav';
import { RightSidebar } from '@/components/RightSidebar';
import { DASHBOARD_SIDEBAR_WIDTH } from '@/constants/layout';

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [loadingCooperativa, setLoadingCooperativa] = useState(false);

  // Datos del Usuario
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [cargo, setCargo] = useState('');
  const [funcion, setFuncion] = useState('');
  const [celular, setCelular] = useState('');

  // Datos de la Cooperativa
  const [cooperativa, setCooperativa] = useState<CooperativaDTO | null>(null);
  const [nombreCooperativa, setNombreCooperativa] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefonoCooperativa, setTelefonoCooperativa] = useState('');
  const [correoCooperativa, setCorreoCooperativa] = useState('');

  // Archivos
  const [archivoNombramiento, setArchivoNombramiento] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Contraseña
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mensajes
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar datos del usuario y cooperativa
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        // Cargar datos del usuario
        const usuarioResponse = await apiService.getUsuarioById(user.idUsuario);
        if (usuarioResponse.isSuccess && usuarioResponse.data) {
          const usuario = usuarioResponse.data;
          setNombres(usuario.nombres);
          setApellidos(usuario.apellidos);
          setCargo(usuario.cargo || '');
          setFuncion(usuario.funcion || '');
          setCelular(usuario.celular || '');
        }

        // Cargar datos de la cooperativa si existe
        if (user.idCooperativa) {
          setLoadingCooperativa(true);
          const cooperativaResponse = await apiService.getCooperativaById(user.idCooperativa);
          if (cooperativaResponse.isSuccess && cooperativaResponse.data) {
            const coop = cooperativaResponse.data;
            setCooperativa(coop);
            setNombreCooperativa(coop.nombre);
            setDireccion(coop.direccion);
            setTelefonoCooperativa(coop.telefono || '');
            setCorreoCooperativa(coop.correo || '');
            
            // Si hay logo, crear preview
            if (coop.logo && Array.isArray(coop.logo) && coop.logo.length > 0) {
              try {
                const uint8Array = new Uint8Array(coop.logo);
                const base64Logo = btoa(String.fromCharCode(...uint8Array));
                setLogoPreview(`data:image/png;base64,${base64Logo}`);
              } catch (err) {
                console.error('Error al procesar logo:', err);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
      } finally {
        setLoadingCooperativa(false);
      }
    };

    loadData();
  }, [user]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpdateUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!user) return;

    try {
      const updateData = {
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        cargo: cargo.trim() || undefined,
        funcion: funcion.trim() || undefined,
        celular: celular.trim() || undefined,
      };

      const response = await apiService.updateUsuario(user.idUsuario, updateData);

      if (response.isSuccess) {
        await refreshProfile();
        setSuccess('Datos del usuario actualizados exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Error al actualizar los datos del usuario');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCooperativa = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!cooperativa) return;

    try {
      // Convertir archivos a base64 si existen
      let archivoNombramientoBase64: string | undefined;
      let nombreArchivo: string | undefined;
      let logoBase64: string | undefined;
      let nombreLogo: string | undefined;

      if (archivoNombramiento) {
        if (archivoNombramiento.type !== 'application/pdf') {
          setError('El archivo de nombramiento debe ser un PDF');
          setLoading(false);
          return;
        }
        archivoNombramientoBase64 = await convertFileToBase64(archivoNombramiento);
        nombreArchivo = archivoNombramiento.name;
      }

      if (logo) {
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validImageTypes.includes(logo.type)) {
          setError('El logo debe ser una imagen (JPG, PNG, GIF o WEBP)');
          setLoading(false);
          return;
        }
        logoBase64 = await convertFileToBase64(logo);
        nombreLogo = logo.name;
      }

      const updateData: {
        nombre: string;
        direccion: string;
        telefono?: string;
        correo?: string;
        archivoNombramiento?: string;
        nombreArchivo?: string;
        logo?: string;
        nombreLogo?: string;
      } = {
        nombre: nombreCooperativa.trim(),
        direccion: direccion.trim(),
        telefono: telefonoCooperativa.trim() || undefined,
        correo: correoCooperativa.trim() || undefined,
      };

      if (archivoNombramientoBase64) {
        updateData.archivoNombramiento = archivoNombramientoBase64;
        updateData.nombreArchivo = nombreArchivo;
      }

      if (logoBase64) {
        updateData.logo = logoBase64;
        updateData.nombreLogo = nombreLogo;
      }

      const response = await apiService.updateCooperativa(cooperativa.idCooperativa, updateData);

      if (response.isSuccess) {
        // Recargar datos de la cooperativa
        const coopResponse = await apiService.getCooperativaById(cooperativa.idCooperativa);
        if (coopResponse.isSuccess && coopResponse.data) {
          const coop = coopResponse.data;
          setCooperativa(coop);
          if (coop.logo && Array.isArray(coop.logo) && coop.logo.length > 0) {
            try {
              const uint8Array = new Uint8Array(coop.logo);
              const base64Logo = btoa(String.fromCharCode(...uint8Array));
              setLogoPreview(`data:image/png;base64,${base64Logo}`);
            } catch (err) {
              console.error('Error al procesar logo:', err);
            }
          }
        }
        setArchivoNombramiento(null);
        setLogo(null);
        setSuccess('Datos de la cooperativa actualizados exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Error al actualizar los datos de la cooperativa');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!user) return;

    setPasswordLoading(true);

    try {
      const response = await apiService.updateUsuario(user.idUsuario, {
        contrasena: newPassword,
      });

      if (response.isSuccess) {
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('Contraseña actualizada exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Error al cambiar la contraseña');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setPasswordLoading(false);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth >= 1024);
    }
  }, []);

  const sidebarOffset = isSidebarOpen ? DASHBOARD_SIDEBAR_WIDTH.OPEN : DASHBOARD_SIDEBAR_WIDTH.COLLAPSED;

  if (!user) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-fixed transition-[padding-left] duration-300 ease-in-out"
        style={{
          paddingLeft: `${sidebarOffset}px`,
          backgroundImage: 'url(/fondo.jpg)',
        }}
      >
        <DashboardNav />
        <div className="container max-w-4xl py-8">
          <p>Cargando...</p>
        </div>
        <RightSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((prev) => !prev)} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed transition-[padding-left] duration-300 ease-in-out"
      style={{
        paddingLeft: `${sidebarOffset}px`,
        backgroundImage: 'url(/fondo.jpg)',
      }}
    >
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 min-h-screen">
        {/* Header con diseño del Dashboard */}
        <div className="mb-8 bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 drop-shadow-md mb-2">
            Mi Perfil
          </h1>
          <p className="text-gray-800 drop-shadow-sm">
            Administra tu información personal y de la cooperativa
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
        {/* Información Personal */}
        <Card className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Información Personal</CardTitle>
            <CardDescription className="text-gray-700">Actualiza tus datos personales</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateUsuario} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombres">Nombres *</Label>
                  <Input
                    id="nombres"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    required
                    maxLength={75}
                  />
                </div>

                <div>
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    required
                    maxLength={75}
                  />
                </div>

                <div>
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="funcion">Función</Label>
                  <Input
                    id="funcion"
                    value={funcion}
                    onChange={(e) => setFuncion(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    type="tel"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                    maxLength={15}
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Información de la Cooperativa */}
        {cooperativa && (
          <Card className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Información de la Cooperativa</CardTitle>
              <CardDescription className="text-gray-700">Actualiza los datos de tu cooperativa</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateCooperativa} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombreCooperativa">Nombre de la Cooperativa *</Label>
                    <Input
                      id="nombreCooperativa"
                      value={nombreCooperativa}
                      onChange={(e) => setNombreCooperativa(e.target.value)}
                      required
                      maxLength={300}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ruc">RUC</Label>
                    <Input
                      id="ruc"
                      value={cooperativa.ruc}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">El RUC no se puede modificar</p>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="direccion">Dirección *</Label>
                    <Input
                      id="direccion"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      required
                      maxLength={300}
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefonoCooperativa">Teléfono</Label>
                    <Input
                      id="telefonoCooperativa"
                      type="tel"
                      value={telefonoCooperativa}
                      onChange={(e) => setTelefonoCooperativa(e.target.value)}
                      maxLength={15}
                    />
                  </div>

                  <div>
                    <Label htmlFor="correoCooperativa">Correo Electrónico</Label>
                    <Input
                      id="correoCooperativa"
                      type="email"
                      value={correoCooperativa}
                      onChange={(e) => setCorreoCooperativa(e.target.value)}
                      maxLength={150}
                    />
                  </div>

                  <div>
                    <Label htmlFor="archivoNombramiento">Archivo de Nombramiento (PDF)</Label>
                    <Input
                      id="archivoNombramiento"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.type !== 'application/pdf') {
                            setError('El archivo debe ser un PDF');
                            e.target.value = '';
                            setArchivoNombramiento(null);
                            return;
                          }
                          setArchivoNombramiento(file);
                          setError('');
                        } else {
                          setArchivoNombramiento(null);
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Solo archivos PDF. Dejar vacío para mantener el actual.</p>
                    {archivoNombramiento && (
                      <p className="text-sm text-green-600 mt-1">Nuevo archivo: {archivoNombramiento.name}</p>
                    )}
                    {cooperativa.nombreArchivo && !archivoNombramiento && (
                      <p className="text-sm text-gray-600 mt-1">Archivo actual: {cooperativa.nombreArchivo}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="logo">Logo de la Cooperativa</Label>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                          if (!validImageTypes.includes(file.type)) {
                            setError('El logo debe ser una imagen (JPG, PNG, GIF o WEBP)');
                            e.target.value = '';
                            setLogo(null);
                            return;
                          }
                          setLogo(file);
                          setLogoPreview(URL.createObjectURL(file));
                          setError('');
                        } else {
                          setLogo(null);
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Formatos aceptados: JPG, PNG, GIF, WEBP. Dejar vacío para mantener el actual.</p>
                    <div className="mt-3 flex items-center gap-4">
                      {(logoPreview || (cooperativa.logo && Array.isArray(cooperativa.logo) && cooperativa.logo.length > 0 && !logo)) && (
                        <CooperativaAvatar 
                          logo={logoPreview || cooperativa.logo || null}
                          nombre={nombreCooperativa}
                          size="lg"
                        />
                      )}
                      {logo && (
                        <div>
                          <p className="text-sm text-green-600 font-medium">{logo.name}</p>
                          <p className="text-xs text-gray-500">Nuevo logo (se guardará al actualizar)</p>
                        </div>
                      )}
                      {cooperativa.nombreLogo && !logo && (
                        <div>
                          <p className="text-sm text-gray-600">Logo actual: {cooperativa.nombreLogo}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar Cambios
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Detalles de la Cuenta */}
        <Card className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Detalles de la Cuenta</CardTitle>
            <CardDescription className="text-gray-700">Información de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-muted-foreground">Correo Electrónico</Label>
                <p className="font-medium">{user.email}</p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verificado
              </Badge>
            </div>

            <Separator />

            <div>
              <Label className="text-muted-foreground">Rol</Label>
              <p className="font-medium capitalize">{user.rol}</p>
            </div>

            {cooperativa && (
              <>
                <Separator />
                <div>
                  <Label className="text-muted-foreground">Cooperativa</Label>
                  <p className="font-medium">{cooperativa.nombre}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Cambiar Contraseña */}
        <Card className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Cambiar Contraseña</CardTitle>
            <CardDescription className="text-gray-700">Actualiza tu contraseña</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="relative">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingresa nueva contraseña"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma la nueva contraseña"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-600 hover:text-gray-800"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cambiar Contraseña
              </Button>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
      <RightSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((prev) => !prev)} />
    </div>
  );
}
