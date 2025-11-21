import { useState, useEffect, useMemo } from 'react';
import { apiService, AgenciaDTO, AgenciaCreateDTO, AgenciaUpdateDTO } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Search, Landmark, MapPin, Phone, User, Clock, Eye, Plus, Edit, Trash2 } from 'lucide-react';
import { DashboardNav } from '@/components/DashboardNav';
import { RightSidebar } from '@/components/RightSidebar';
import { DASHBOARD_SIDEBAR_WIDTH } from '@/constants/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/lib/toast';
import { provinciasEcuador, getCantonesByProvincia, getCiudadesByCanton, getProvincias } from '@/data/ecuador';

export default function Agencias() {
  const { user, profile } = useAuth();
  const [agencias, setAgencias] = useState<AgenciaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedAgencia, setSelectedAgencia] = useState<AgenciaDTO | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [agenciaToDelete, setAgenciaToDelete] = useState<AgenciaDTO | null>(null);
  const [formData, setFormData] = useState<AgenciaCreateDTO>({
    idCooperativa: user?.idCooperativa || 0,
    nombre: '',
    codigoInterno: '',
    direccion: '',
    telefono: '',
    nombreResponsable: '',
    provincia: '',
    canton: '',
    ciudad: '',
    horaApertura: '',
    horaCierre: '',
  });
  
  // Estados para manejar la selección de ubicación
  const [selectedProvincia, setSelectedProvincia] = useState<string>('');
  const [selectedCanton, setSelectedCanton] = useState<string>('');
  const [selectedCiudad, setSelectedCiudad] = useState<string>('');
  
  // Obtener cantones disponibles según la provincia seleccionada
  const cantonesDisponibles = useMemo(() => {
    if (!selectedProvincia) return [];
    return getCantonesByProvincia(selectedProvincia);
  }, [selectedProvincia]);
  
  // Obtener ciudades disponibles según el cantón seleccionado
  const ciudadesDisponibles = useMemo(() => {
    if (!selectedProvincia || !selectedCanton) return [];
    return getCiudadesByCanton(selectedProvincia, selectedCanton);
  }, [selectedProvincia, selectedCanton]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth >= 1024);
    }
    if (user?.idCooperativa) {
      loadAgencias();
    }
  }, [user]);

  const loadAgencias = async () => {
    if (!user?.idCooperativa) return;

    setLoading(true);
    setError('');
    try {
      const response = await apiService.getAgenciasByCooperativa(user.idCooperativa);
      if (response.isSuccess && response.data) {
        setAgencias(response.data);
      } else {
        setError(response.message || 'Error al cargar agencias');
      }
    } catch (err) {
      setError('Error al cargar agencias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar agencias según el término de búsqueda
  const filteredAgencias = useMemo(() => {
    if (!searchTerm.trim()) {
      return agencias;
    }

    const term = searchTerm.toLowerCase().trim();
    return agencias.filter(
      (agencia) =>
        agencia.nombre.toLowerCase().includes(term) ||
        agencia.codigoInterno?.toLowerCase().includes(term) ||
        agencia.direccion?.toLowerCase().includes(term) ||
        agencia.telefono?.toLowerCase().includes(term) ||
        agencia.nombreResponsable?.toLowerCase().includes(term) ||
        agencia.provincia?.toLowerCase().includes(term) ||
        agencia.canton?.toLowerCase().includes(term) ||
        agencia.ciudad?.toLowerCase().includes(term)
    );
  }, [agencias, searchTerm]);

  const handleView = (agencia: AgenciaDTO) => {
    setSelectedAgencia(agencia);
    setIsViewDialogOpen(true);
  };

  const formatTime = (time?: string) => {
    if (!time) return '-';
    try {
      // Si viene en formato HH:mm:ss, tomar solo HH:mm
      return time.substring(0, 5);
    } catch {
      return time;
    }
  };

  // Verificar si una agencia es la matriz
  const isMatriz = (agencia: AgenciaDTO): boolean => {
    return agencia.codigoInterno?.toUpperCase() === 'MATRIZ' || 
           agencia.nombre?.toUpperCase() === 'MATRIZ';
  };

  const handleCreate = () => {
    setFormData({
      idCooperativa: user?.idCooperativa || 0,
      nombre: '',
      codigoInterno: '',
      direccion: '',
      telefono: '',
      nombreResponsable: '',
      provincia: '',
      canton: '',
      ciudad: '',
      horaApertura: '',
      horaCierre: '',
    });
    setSelectedProvincia('');
    setSelectedCanton('');
    setSelectedCiudad('');
    setIsCreateDialogOpen(true);
  };

  // Función para convertir formato de hora de "HH:mm:ss" a "HH:mm" para el input
  const formatTimeForInput = (time?: string): string => {
    if (!time) return '';
    // Si viene en formato HH:mm:ss, tomar solo HH:mm
    if (time.includes(':') && time.split(':').length === 3) {
      return time.substring(0, 5);
    }
    return time;
  };

  const handleEdit = (agencia: AgenciaDTO) => {
    setSelectedAgencia(agencia);
    setFormData({
      idCooperativa: agencia.idCooperativa || user?.idCooperativa || 0,
      nombre: agencia.nombre,
      codigoInterno: agencia.codigoInterno || '',
      direccion: agencia.direccion || '',
      telefono: agencia.telefono || '',
      nombreResponsable: agencia.nombreResponsable || '',
      provincia: agencia.provincia || '',
      canton: agencia.canton || '',
      ciudad: agencia.ciudad || '',
      horaApertura: formatTimeForInput(agencia.horaApertura),
      horaCierre: formatTimeForInput(agencia.horaCierre),
    });
    // Establecer las selecciones de ubicación
    setSelectedProvincia(agencia.provincia || '');
    setSelectedCanton(agencia.canton || '');
    setSelectedCiudad(agencia.ciudad || '');
    setIsEditDialogOpen(true);
  };

  const handleDelete = (agencia: AgenciaDTO) => {
    if (isMatriz(agencia)) {
      toast.error('No se puede eliminar', 'La agencia matriz no puede ser eliminada.');
      return;
    }
    setAgenciaToDelete(agencia);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.idCooperativa) {
      toast.error('Error', 'No se pudo obtener la información de la cooperativa.');
      return;
    }

    try {
      // Validar formato de horas (HH:mm)
      const isValidTime = (time: string | undefined) => {
        if (!time || !time.trim()) return false;
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time.trim());
      };

      // Preparar los datos para enviar, incluyendo solo horas válidas
      const dataToSend: AgenciaCreateDTO = {
        idCooperativa: user.idCooperativa,
        nombre: formData.nombre.trim(),
        codigoInterno: formData.codigoInterno?.trim() || undefined,
        direccion: formData.direccion?.trim() || undefined,
        telefono: formData.telefono?.trim() || undefined,
        nombreResponsable: formData.nombreResponsable?.trim() || undefined,
        provincia: selectedProvincia || undefined,
        canton: selectedCanton || undefined,
        ciudad: selectedCiudad || undefined,
        horaApertura: isValidTime(formData.horaApertura) ? formData.horaApertura!.trim() : undefined,
        horaCierre: isValidTime(formData.horaCierre) ? formData.horaCierre!.trim() : undefined,
      };

      const response = await apiService.createAgencia(dataToSend);

      if (response.isSuccess) {
        toast.success('Agencia creada', 'La agencia se ha creado exitosamente.');
        setIsCreateDialogOpen(false);
        loadAgencias();
      } else {
        toast.error('Error', response.message || 'No se pudo crear la agencia.');
      }
    } catch (error) {
      toast.error('Error', 'No se pudo crear la agencia.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgencia) return;

    try {
      // Validar formato de horas (HH:mm)
      const isValidTime = (time: string | undefined) => {
        if (!time || !time.trim()) return false;
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time.trim());
      };

      const updateData: AgenciaUpdateDTO = {
        nombre: formData.nombre.trim(),
        codigoInterno: formData.codigoInterno?.trim() || undefined,
        direccion: formData.direccion?.trim() || undefined,
        telefono: formData.telefono?.trim() || undefined,
        nombreResponsable: formData.nombreResponsable?.trim() || undefined,
        provincia: selectedProvincia || undefined,
        canton: selectedCanton || undefined,
        ciudad: selectedCiudad || undefined,
        horaApertura: isValidTime(formData.horaApertura) ? formData.horaApertura!.trim() : undefined,
        horaCierre: isValidTime(formData.horaCierre) ? formData.horaCierre!.trim() : undefined,
      };

      const response = await apiService.updateAgencia(selectedAgencia.idAgencia, updateData);

      if (response.isSuccess) {
        toast.success('Agencia actualizada', 'La agencia se ha actualizado exitosamente.');
        setIsEditDialogOpen(false);
        setSelectedAgencia(null);
        loadAgencias();
      } else {
        toast.error('Error', response.message || 'No se pudo actualizar la agencia.');
      }
    } catch (error) {
      toast.error('Error', 'No se pudo actualizar la agencia.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!agenciaToDelete) return;

    try {
      const response = await apiService.deleteAgencia(agenciaToDelete.idAgencia);

      if (response.isSuccess) {
        toast.success('Agencia eliminada', 'La agencia se ha eliminado exitosamente.');
        setIsDeleteDialogOpen(false);
        setAgenciaToDelete(null);
        loadAgencias();
      } else {
        toast.error('Error', response.message || 'No se pudo eliminar la agencia.');
      }
    } catch (error) {
      toast.error('Error', 'No se pudo eliminar la agencia.');
    }
  };

  const sidebarOffset = isSidebarOpen ? DASHBOARD_SIDEBAR_WIDTH.OPEN : DASHBOARD_SIDEBAR_WIDTH.COLLAPSED;

  if (!user?.idCooperativa) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-fixed transition-[padding-left] duration-300 ease-in-out"
        style={{
          paddingLeft: `${sidebarOffset}px`,
          backgroundImage: 'url(/fondo.jpg)',
        }}
      >
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertDescription>
              No tienes una cooperativa asociada. No puedes gestionar agencias.
            </AlertDescription>
          </Alert>
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
        {/* Header */}
        <div className="mb-8 bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 drop-shadow-md mb-2">
                Agencias
              </h1>
              <p className="text-gray-800 drop-shadow-sm">
                Listado de todas las agencias de tu cooperativa
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Agencia
            </Button>
          </div>
        </div>

        {/* Filtros de búsqueda */}
        <Card className="mb-6 bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Filtros de búsqueda</CardTitle>
            <CardDescription className="text-gray-700">
              Busca agencias por nombre, código interno, dirección, teléfono, responsable, provincia, cantón o ciudad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-gray-700 mb-2 block">
                  Buscar
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Buscar por nombre, código, dirección, teléfono, responsable, ubicación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 border-gray-300"
                  />
                </div>
              </div>
            </div>
            {searchTerm && (
              <div className="mt-4 text-sm text-gray-600">
                Mostrando {filteredAgencias.length} de {agencias.length} agencias
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mensajes de error */}
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Listado de agencias */}
        <Card className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">
              Listado de Agencias ({filteredAgencias.length})
            </CardTitle>
            <CardDescription className="text-gray-700">
              Todas las agencias de tu cooperativa registradas en la base de datos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <span className="ml-3 text-gray-600">Cargando agencias...</span>
              </div>
            ) : filteredAgencias.length === 0 ? (
              <div className="text-center py-12">
                <Landmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  {searchTerm ? 'No se encontraron agencias con los filtros aplicados' : 'No hay agencias registradas'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="font-semibold text-gray-900">Nombre</TableHead>
                      <TableHead className="font-semibold text-gray-900">Código Interno</TableHead>
                      <TableHead className="font-semibold text-gray-900">Dirección</TableHead>
                      <TableHead className="font-semibold text-gray-900">Teléfono</TableHead>
                      <TableHead className="font-semibold text-gray-900">Ubicación</TableHead>
                      <TableHead className="font-semibold text-gray-900">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgencias.map((agencia) => (
                      <TableRow
                        key={agencia.idAgencia}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <Landmark className="h-4 w-4 text-emerald-600" />
                            {agencia.nombre}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {agencia.codigoInterno || <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {agencia.direccion ? (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              <span className="max-w-xs truncate">{agencia.direccion}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {agencia.telefono ? (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5 text-gray-400" />
                              <span>{agencia.telefono}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {agencia.provincia || agencia.canton || agencia.ciudad ? (
                            <span className="text-sm">
                              {[agencia.ciudad, agencia.canton, agencia.provincia].filter(Boolean).join(', ')}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleView(agencia)}
                              className="h-8 w-8"
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(agencia)}
                              className="h-8 w-8"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(agencia)}
                              disabled={isMatriz(agencia)}
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de visualización detallada */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Landmark className="h-6 w-6 text-emerald-600" />
              Detalles de la Agencia
            </DialogTitle>
            <DialogDescription>
              Información completa de la agencia seleccionada
            </DialogDescription>
          </DialogHeader>
          
          {selectedAgencia && (
            <div className="space-y-6 py-4">
              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Información Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nombre</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAgencia.nombre}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Código Interno</Label>
                    <p className="text-gray-900 mt-1">{selectedAgencia.codigoInterno || <span className="text-gray-400">-</span>}</p>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Ubicación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      Dirección
                    </Label>
                    <p className="text-gray-900 mt-1">{selectedAgencia.direccion || <span className="text-gray-400">-</span>}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Provincia</Label>
                    <p className="text-gray-900 mt-1">{selectedAgencia.provincia || <span className="text-gray-400">-</span>}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Cantón</Label>
                    <p className="text-gray-900 mt-1">{selectedAgencia.canton || <span className="text-gray-400">-</span>}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Ciudad</Label>
                    <p className="text-gray-900 mt-1">{selectedAgencia.ciudad || <span className="text-gray-400">-</span>}</p>
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      Teléfono
                    </Label>
                    <p className="text-gray-900 mt-1">{selectedAgencia.telefono || <span className="text-gray-400">-</span>}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      Responsable
                    </Label>
                    <p className="text-gray-900 mt-1">{selectedAgencia.nombreResponsable || <span className="text-gray-400">-</span>}</p>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Horarios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Hora de Apertura
                    </Label>
                    <p className="text-gray-900 mt-1">{formatTime(selectedAgencia.horaApertura)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Hora de Cierre
                    </Label>
                    <p className="text-gray-900 mt-1">{formatTime(selectedAgencia.horaCierre)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de creación */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Plus className="h-6 w-6 text-emerald-600" />
              Nueva Agencia
            </DialogTitle>
            <DialogDescription>
              Completa los datos para crear una nueva agencia
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="codigoInterno">Código Interno</Label>
                <Input
                  id="codigoInterno"
                  value={formData.codigoInterno}
                  onChange={(e) => setFormData({ ...formData, codigoInterno: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="nombreResponsable">Responsable</Label>
                <Input
                  id="nombreResponsable"
                  value={formData.nombreResponsable}
                  onChange={(e) => setFormData({ ...formData, nombreResponsable: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="provincia">Provincia</Label>
                <Select
                  value={selectedProvincia}
                  onValueChange={(value) => {
                    setSelectedProvincia(value);
                    setSelectedCanton(''); // Resetear cantón cuando cambia provincia
                    setSelectedCiudad(''); // Resetear ciudad cuando cambia provincia
                  }}
                >
                  <SelectTrigger id="provincia">
                    <SelectValue placeholder="Selecciona una provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    {getProvincias().map((provincia) => (
                      <SelectItem key={provincia} value={provincia}>
                        {provincia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="canton">Cantón</Label>
                <Select
                  value={selectedCanton}
                  onValueChange={(value) => {
                    setSelectedCanton(value);
                    setSelectedCiudad(''); // Resetear ciudad cuando cambia cantón
                  }}
                  disabled={!selectedProvincia}
                >
                  <SelectTrigger id="canton">
                    <SelectValue placeholder={selectedProvincia ? "Selecciona un cantón" : "Primero selecciona una provincia"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cantonesDisponibles.map((canton) => (
                      <SelectItem key={canton.nombre} value={canton.nombre}>
                        {canton.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ciudad">Ciudad</Label>
                <Select
                  value={selectedCiudad}
                  onValueChange={(value) => setSelectedCiudad(value)}
                  disabled={!selectedCanton}
                >
                  <SelectTrigger id="ciudad">
                    <SelectValue placeholder={selectedCanton ? "Selecciona una ciudad" : "Primero selecciona un cantón"} />
                  </SelectTrigger>
                  <SelectContent>
                    {ciudadesDisponibles.map((ciudad) => (
                      <SelectItem key={ciudad} value={ciudad}>
                        {ciudad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="horaApertura">Hora de Apertura (HH:mm)</Label>
                <Input
                  id="horaApertura"
                  type="time"
                  value={formData.horaApertura}
                  onChange={(e) => setFormData({ ...formData, horaApertura: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="horaCierre">Hora de Cierre (HH:mm)</Label>
                <Input
                  id="horaCierre"
                  type="time"
                  value={formData.horaCierre}
                  onChange={(e) => setFormData({ ...formData, horaCierre: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Crear Agencia
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Edit className="h-6 w-6 text-emerald-600" />
              Editar Agencia
            </DialogTitle>
            <DialogDescription>
              Modifica los datos de la agencia
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-nombre">Nombre *</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-codigoInterno">Código Interno</Label>
                <Input
                  id="edit-codigoInterno"
                  value={formData.codigoInterno}
                  onChange={(e) => setFormData({ ...formData, codigoInterno: e.target.value })}
                  disabled={selectedAgencia && isMatriz(selectedAgencia)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="edit-direccion">Dirección</Label>
                <Input
                  id="edit-direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-telefono">Teléfono</Label>
                <Input
                  id="edit-telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-nombreResponsable">Responsable</Label>
                <Input
                  id="edit-nombreResponsable"
                  value={formData.nombreResponsable}
                  onChange={(e) => setFormData({ ...formData, nombreResponsable: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-provincia">Provincia</Label>
                <Select
                  value={selectedProvincia}
                  onValueChange={(value) => {
                    setSelectedProvincia(value);
                    setSelectedCanton(''); // Resetear cantón cuando cambia provincia
                    setSelectedCiudad(''); // Resetear ciudad cuando cambia provincia
                  }}
                >
                  <SelectTrigger id="edit-provincia">
                    <SelectValue placeholder="Selecciona una provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    {getProvincias().map((provincia) => (
                      <SelectItem key={provincia} value={provincia}>
                        {provincia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-canton">Cantón</Label>
                <Select
                  value={selectedCanton}
                  onValueChange={(value) => {
                    setSelectedCanton(value);
                    setSelectedCiudad(''); // Resetear ciudad cuando cambia cantón
                  }}
                  disabled={!selectedProvincia}
                >
                  <SelectTrigger id="edit-canton">
                    <SelectValue placeholder={selectedProvincia ? "Selecciona un cantón" : "Primero selecciona una provincia"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cantonesDisponibles.map((canton) => (
                      <SelectItem key={canton.nombre} value={canton.nombre}>
                        {canton.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-ciudad">Ciudad</Label>
                <Select
                  value={selectedCiudad}
                  onValueChange={(value) => setSelectedCiudad(value)}
                  disabled={!selectedCanton}
                >
                  <SelectTrigger id="edit-ciudad">
                    <SelectValue placeholder={selectedCanton ? "Selecciona una ciudad" : "Primero selecciona un cantón"} />
                  </SelectTrigger>
                  <SelectContent>
                    {ciudadesDisponibles.map((ciudad) => (
                      <SelectItem key={ciudad} value={ciudad}>
                        {ciudad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-horaApertura">Hora de Apertura (HH:mm)</Label>
                <Input
                  id="edit-horaApertura"
                  type="time"
                  value={formData.horaApertura}
                  onChange={(e) => setFormData({ ...formData, horaApertura: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-horaCierre">Hora de Cierre (HH:mm)</Label>
                <Input
                  id="edit-horaCierre"
                  type="time"
                  value={formData.horaCierre}
                  onChange={(e) => setFormData({ ...formData, horaCierre: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la agencia "{agenciaToDelete?.nombre}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <RightSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((prev) => !prev)} />
    </div>
  );
}
