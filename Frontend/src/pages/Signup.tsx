import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { apiService } from '@/services/api';
import CooperativaAvatar from '@/components/CooperativaAvatar';

export default function Signup() {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [nombreCooperativa, setNombreCooperativa] = useState('');
  const [ruc, setRuc] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [direccion, setDireccion] = useState('');
  const [cargo, setCargo] = useState('');
  const [funcion, setFuncion] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [archivoNombramiento, setArchivoNombramiento] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error'>('error');
  const navigate = useNavigate();

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // readAsDataURL devuelve "data:[mime];base64,[base64string]"
        const result = reader.result as string;
        const base64String = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const showValidationDialog = (message: string, type: 'success' | 'error' = 'error') => {
    setDialogMessage(message);
    setDialogType(type);
    setShowDialog(true);
    // Cerrar automáticamente después de 3 segundos
    setTimeout(() => {
      setShowDialog(false);
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!nombres.trim()) {
      showValidationDialog('Los nombres son requeridos');
      return;
    }

    if (!apellidos.trim()) {
      showValidationDialog('Los apellidos son requeridos');
      return;
    }

    if (!nombreCooperativa.trim()) {
      showValidationDialog('El nombre de la cooperativa es requerido');
      return;
    }

    if (!ruc.trim()) {
      showValidationDialog('El RUC es requerido');
      return;
    }

    if (ruc.length !== 13) {
      showValidationDialog('El RUC debe tener 13 caracteres');
      return;
    }

    if (!correo.trim()) {
      showValidationDialog('El correo electrónico es requerido');
      return;
    }

    if (!direccion.trim()) {
      showValidationDialog('La dirección es requerida');
      return;
    }

    if (!contrasena.trim()) {
      showValidationDialog('La contraseña es requerida');
      return;
    }

    if (contrasena.length < 6) {
      showValidationDialog('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (contrasena !== confirmPassword) {
      showValidationDialog('Las contraseñas no coinciden');
      return;
    }

    // Validar archivo PDF de nombramiento
    if (archivoNombramiento && archivoNombramiento.type !== 'application/pdf') {
      showValidationDialog('El archivo de nombramiento debe ser un PDF');
      return;
    }

    // Validar logo (imágenes comunes)
    if (logo) {
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(logo.type)) {
        showValidationDialog('El logo debe ser una imagen (JPG, PNG, GIF o WEBP)');
        return;
      }
    }

    setLoading(true);

    try {
      // Convertir archivos a base64 si existen
      let archivoNombramientoBase64: string | undefined;
      let nombreArchivo: string | undefined;
      let logoBase64: string | undefined;
      let nombreLogo: string | undefined;

      if (archivoNombramiento) {
        archivoNombramientoBase64 = await convertFileToBase64(archivoNombramiento);
        nombreArchivo = archivoNombramiento.name;
      }

      if (logo) {
        logoBase64 = await convertFileToBase64(logo);
        nombreLogo = logo.name;
      }

      const registroData = {
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        nombreCooperativa: nombreCooperativa.trim(),
        ruc: ruc.trim(),
        correo: correo.trim().toLowerCase(),
        celular: celular.trim() || undefined,
        direccion: direccion.trim(),
        cargo: cargo.trim() || undefined,
        funcion: funcion.trim() || undefined,
        contrasena: contrasena,
        archivoNombramiento: archivoNombramientoBase64,
        nombreArchivo,
        logo: logoBase64,
        nombreLogo,
      };

      const response = await apiService.registroCompleto(registroData);

      if (response.isSuccess) {
        showValidationDialog('¡Formulario correcto! Cooperativa y usuario registrados exitosamente.', 'success');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        showValidationDialog(response.message || 'Error al registrar la cooperativa y usuario');
        setLoading(false);
      }
    } catch (err) {
      showValidationDialog(err instanceof Error ? err.message : 'Error desconocido al registrar');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Columna izquierda: Logo con Background */}
      <div 
        className="hidden lg:flex lg:w-1/2 items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(/montanas.jpg)' }}
      >
        <div className="text-center px-8">

        </div>
      </div>

      {/* Columna derecha: Formulario de Registro */}
      <div className="w-full lg:w-1/2 flex items-start justify-center px-4 py-6 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-y-auto h-screen relative z-10">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6 my-4">
        
          {/* TÍTULO */}
          <div className="text-center mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Registro de nuevo usuario</h1>
            <p className="text-sm text-gray-600">Ingresa los datos para crear tu cuenta</p>
          </div>
  
        {/* ALERTAS */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
  
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              ¡Cooperativa y usuario registrados exitosamente! Redirigiendo...
            </AlertDescription>
          </Alert>
        )}
  
        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-4">
  
          {/* --- DATOS PERSONALES --- */}
          <h2 className="text-base font-semibold text-gray-800 border-b pb-1">Datos Personales</h2>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="nombres" className="text-sm">Nombres *</Label>
              <Input id="nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} required className="h-9 mt-1" />
            </div>
  
            <div>
              <Label htmlFor="apellidos" className="text-sm">Apellidos *</Label>
              <Input id="apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required className="h-9 mt-1" />
            </div>
  
            <div>
              <Label htmlFor="correo" className="text-sm">Correo *</Label>
              <Input type="email" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required className="h-9 mt-1" />
            </div>
  
            <div>
              <Label htmlFor="celular" className="text-sm">Celular</Label>
              <Input id="celular" value={celular} onChange={(e) => setCelular(e.target.value)} className="h-9 mt-1" />
            </div>
          </div>
  
          {/* --- DATOS LABORALES --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cargo" className="text-sm">Cargo</Label>
              <Input id="cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} className="h-9 mt-1" />
            </div>
  
            <div>
              <Label htmlFor="funcion" className="text-sm">Función</Label>
              <Input id="funcion" value={funcion} onChange={(e) => setFuncion(e.target.value)} className="h-9 mt-1" />
            </div>
          </div>
  
          {/* --- DATOS COOPERATIVA --- */}
          <h2 className="text-base font-semibold text-gray-800 border-b pb-1">Datos de la Cooperativa</h2>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="nombreCooperativa" className="text-sm">Nombre Cooperativa *</Label>
              <Input id="nombreCooperativa" value={nombreCooperativa} onChange={(e) => setNombreCooperativa(e.target.value)} required className="h-9 mt-1" />
            </div>
  
            <div>
              <Label htmlFor="ruc" className="text-sm">RUC *</Label>
              <Input
                id="ruc"
                value={ruc}
                maxLength={13}
                onChange={(e) => setRuc(e.target.value)}
                required
                className="h-9 mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Debe tener 13 dígitos</p>
            </div>
          </div>
  
          <div>
            <Label htmlFor="direccion" className="text-sm">Dirección *</Label>
            <Input id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} required className="h-9 mt-1" />
          </div>
  
          {/* --- CONTRASEÑA: con toggle mostrar/ocultar --- */}
          <h2 className="text-base font-semibold text-gray-800 border-b pb-1">Credenciales</h2>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* contraseña */}
            <div className="relative">
              <Label htmlFor="contrasena" className="text-sm">Contraseña *</Label>
              <Input
                id="contrasena"
                type={showPassword ? "text" : "password"}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                className="h-9 mt-1 pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-600 text-xs hover:text-gray-800"
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
  
            {/* confirmar contraseña */}
            <div className="relative">
              <Label htmlFor="confirmPassword" className="text-sm">Confirmar Contraseña *</Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-9 mt-1 pr-16"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-8 text-gray-600 text-xs hover:text-gray-800"
              >
                {showConfirmPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>
  
          {/* --- ARCHIVOS: PDF + LOGO --- */}
          <h2 className="text-base font-semibold text-gray-800 border-b pb-1">Archivos</h2>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PDF */}
            <div>
              <Label htmlFor="archivoNombramiento" className="text-sm">Nombramiento (PDF)</Label>
              <Input type="file" accept="application/pdf" onChange={(e) => setArchivoNombramiento(e.target.files?.[0] ?? null)} className="h-9 mt-1 text-xs" />
              {archivoNombramiento && (
                <p className="text-xs text-green-600 mt-1">{archivoNombramiento.name}</p>
              )}
            </div>
  
            {/* Logo */}
            <div>
              <Label htmlFor="logo" className="text-sm">Logo Cooperativa</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setLogo(e.target.files?.[0] ?? null)} 
                  className="flex-1 h-9 text-xs"
                />
                {logo && (
                  <div className="flex items-center gap-2">
                    <CooperativaAvatar 
                      logo={URL.createObjectURL(logo)} 
                      nombre={nombreCooperativa}
                      size="md"
                    />
                    <div>
                      <p className="text-xs text-green-600 font-medium">{logo.name}</p>
                      <p className="text-xs text-gray-500">Vista previa</p>
                    </div>
                  </div>
                )}
              </div>
              {!logo && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <CooperativaAvatar 
                    logo={null} 
                    nombre={nombreCooperativa || 'Cooperativa'}
                    size="sm"
                  />
                  <span>Avatar predeterminado si no subes logo</span>
                </div>
              )}
            </div>
          </div>
  
          {/* BOTÓN */}
          <Button type="submit" className="w-full mt-3" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>
  
          <p className="mt-4 text-center text-xs text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium underline">Iniciar sesión</Link>
          </p>
        </div>
      </div>

      {/* Dialog de validación */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className={dialogType === 'success' ? 'text-green-600' : 'text-red-600'}>
              {dialogType === 'success' ? 'Formulario Correcto' : 'Error de Validación'}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}