import { useState, useEffect, useMemo } from 'react';
import { apiService, CooperativaDTO, AgenciaDTO } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Building2, MapPin, Phone, Mail, Clock, User } from 'lucide-react';
import { DashboardNav } from '@/components/DashboardNav';
import { RightSidebar } from '@/components/RightSidebar';
import { DASHBOARD_SIDEBAR_WIDTH } from '@/constants/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CooperativaAvatar from '@/components/CooperativaAvatar';

export default function Cooperativas() {
  const [cooperativas, setCooperativas] = useState<CooperativaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCooperativa, setSelectedCooperativa] = useState<CooperativaDTO | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [agencias, setAgencias] = useState<AgenciaDTO[]>([]);
  const [loadingAgencias, setLoadingAgencias] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth >= 1024);
    }
    loadCooperativas();
  }, []);

  const loadCooperativas = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getAllCooperativas();
      if (response.isSuccess && response.data) {
        setCooperativas(response.data);
      } else {
        setError(response.message || 'Error al cargar cooperativas');
      }
    } catch (err) {
      setError('Error al cargar cooperativas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar cooperativas según el término de búsqueda
  const filteredCooperativas = useMemo(() => {
    if (!searchTerm.trim()) {
      return cooperativas;
    }

    const term = searchTerm.toLowerCase().trim();
    return cooperativas.filter(
      (coop) =>
        coop.nombre.toLowerCase().includes(term) ||
        coop.ruc.toLowerCase().includes(term) ||
        coop.direccion?.toLowerCase().includes(term) ||
        coop.telefono?.toLowerCase().includes(term) ||
        coop.correo?.toLowerCase().includes(term)
    );
  }, [cooperativas, searchTerm]);

  const sidebarOffset = isSidebarOpen ? DASHBOARD_SIDEBAR_WIDTH.OPEN : DASHBOARD_SIDEBAR_WIDTH.COLLAPSED;

  const handleCooperativaClick = async (cooperativa: CooperativaDTO) => {
    setSelectedCooperativa(cooperativa);
    setIsDetailDialogOpen(true);
    setLoadingAgencias(true);
    
    try {
      const response = await apiService.getAgenciasByCooperativa(cooperativa.idCooperativa);
      if (response.isSuccess && response.data) {
        setAgencias(response.data);
      } else {
        setAgencias([]);
      }
    } catch (err) {
      console.error('Error al cargar agencias:', err);
      setAgencias([]);
    } finally {
      setLoadingAgencias(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 drop-shadow-md mb-2">
            Cooperativas
          </h1>
          <p className="text-gray-800 drop-shadow-sm">
            Listado de todas las cooperativas registradas en el sistema
          </p>
        </div>

        {/* Filtros de búsqueda */}
        <Card className="mb-6 bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Filtros de búsqueda</CardTitle>
            <CardDescription className="text-gray-700">
              Busca cooperativas por nombre, RUC, dirección, teléfono o correo
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
                    placeholder="Buscar por nombre, RUC, dirección, teléfono o correo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 border-gray-300"
                  />
                </div>
              </div>
            </div>
            {searchTerm && (
              <div className="mt-4 text-sm text-gray-600">
                Mostrando {filteredCooperativas.length} de {cooperativas.length} cooperativas
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

        {/* Listado de cooperativas */}
        <Card className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">
              Listado de Cooperativas ({filteredCooperativas.length})
            </CardTitle>
            <CardDescription className="text-gray-700">
              Todas las cooperativas registradas en la base de datos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <span className="ml-3 text-gray-600">Cargando cooperativas...</span>
              </div>
            ) : filteredCooperativas.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  {searchTerm ? 'No se encontraron cooperativas con los filtros aplicados' : 'No hay cooperativas registradas'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="font-semibold text-gray-900">Nombre</TableHead>
                      <TableHead className="font-semibold text-gray-900">RUC</TableHead>
                      <TableHead className="font-semibold text-gray-900">Dirección</TableHead>
                      <TableHead className="font-semibold text-gray-900">Teléfono</TableHead>
                      <TableHead className="font-semibold text-gray-900">Correo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCooperativas.map((cooperativa) => (
                      <TableRow
                        key={cooperativa.idCooperativa}
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => handleCooperativaClick(cooperativa)}
                      >
                        <TableCell className="font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-emerald-600" />
                            {cooperativa.nombre}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700">{cooperativa.ruc}</TableCell>
                        <TableCell className="text-gray-700">
                          {cooperativa.direccion ? (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              <span>{cooperativa.direccion}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {cooperativa.telefono ? (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5 text-gray-400" />
                              <span>{cooperativa.telefono}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {cooperativa.correo ? (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5 text-gray-400" />
                              <span>{cooperativa.correo}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
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

      <RightSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((prev) => !prev)} />

      {/* Dialog de detalles de cooperativa */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {selectedCooperativa && (
                <CooperativaAvatar
                  logo={selectedCooperativa.logo || null}
                  nombre={selectedCooperativa.nombre}
                  size="md"
                />
              )}
              {selectedCooperativa?.nombre}
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Información completa de la cooperativa y sus sucursales
            </DialogDescription>
          </DialogHeader>

          {selectedCooperativa && (
            <div className="space-y-6 py-4">
              {/* Información de la Cooperativa */}
              <Card className="bg-gray-50/80">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Información de la Cooperativa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">RUC</Label>
                      <p className="font-medium text-gray-900">{selectedCooperativa.ruc}</p>
                    </div>
                    {selectedCooperativa.telefono && (
                      <div>
                        <Label className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          Teléfono
                        </Label>
                        <p className="font-medium text-gray-900">{selectedCooperativa.telefono}</p>
                      </div>
                    )}
                    {selectedCooperativa.correo && (
                      <div>
                        <Label className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          Correo Electrónico
                        </Label>
                        <p className="font-medium text-gray-900">{selectedCooperativa.correo}</p>
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <Label className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        Dirección
                      </Label>
                      <p className="font-medium text-gray-900">{selectedCooperativa.direccion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sucursales */}
              <Card className="bg-gray-50/80">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Sucursales ({agencias.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingAgencias ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                      <span className="ml-3 text-gray-600">Cargando sucursales...</span>
                    </div>
                  ) : agencias.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No hay sucursales registradas para esta cooperativa</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {agencias.map((agencia) => (
                        <div
                          key={agencia.idAgencia}
                          className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-5 w-5 text-emerald-600" />
                              <h4 className="font-semibold text-gray-900">{agencia.nombre}</h4>
                            </div>
                            {agencia.codigoInterno && (
                              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                                {agencia.codigoInterno}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {agencia.direccion && (
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <Label className="text-xs text-gray-600">Dirección</Label>
                                  <p className="text-gray-900">{agencia.direccion}</p>
                                </div>
                              </div>
                            )}
                            {agencia.telefono && (
                              <div className="flex items-start gap-2">
                                <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <Label className="text-xs text-gray-600">Teléfono</Label>
                                  <p className="text-gray-900">{agencia.telefono}</p>
                                </div>
                              </div>
                            )}
                            {agencia.nombreResponsable && (
                              <div className="flex items-start gap-2">
                                <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <Label className="text-xs text-gray-600">Responsable</Label>
                                  <p className="text-gray-900">{agencia.nombreResponsable}</p>
                                </div>
                              </div>
                            )}
                            {(agencia.horaApertura || agencia.horaCierre) && (
                              <div className="flex items-start gap-2">
                                <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <Label className="text-xs text-gray-600">Horario</Label>
                                  <p className="text-gray-900">
                                    {agencia.horaApertura && agencia.horaCierre
                                      ? `${agencia.horaApertura} - ${agencia.horaCierre}`
                                      : agencia.horaApertura || agencia.horaCierre || '-'}
                                  </p>
                                </div>
                              </div>
                            )}
                            {(agencia.provincia || agencia.canton || agencia.ciudad) && (
                              <div className="md:col-span-2 flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <Label className="text-xs text-gray-600">Ubicación</Label>
                                  <p className="text-gray-900">
                                    {[agencia.provincia, agencia.canton, agencia.ciudad]
                                      .filter(Boolean)
                                      .join(', ') || '-'}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

