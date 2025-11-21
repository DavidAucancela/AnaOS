import { useState, useEffect } from 'react';
import { apiService, CooperativaDTO, SuscripcionDTO, PlanSuscripcionDTO } from '@/services/api';
import { DashboardNav } from '@/components/DashboardNav';
import { RightSidebar } from '@/components/RightSidebar';
import { DASHBOARD_SIDEBAR_WIDTH } from '@/constants/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Search, Building2, CreditCard, Edit, Calendar, DollarSign, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useAuth } from '@/contexts/AuthContext';
import CooperativaAvatar from '@/components/CooperativaAvatar';

interface CooperativaWithSubscription extends CooperativaDTO {
  suscripcion?: SuscripcionDTO;
}

export default function Suscripciones() {
  const { profile } = useAuth();
  const [cooperativas, setCooperativas] = useState<CooperativaWithSubscription[]>([]);
  const [planes, setPlanes] = useState<PlanSuscripcionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCooperativa, setSelectedCooperativa] = useState<CooperativaWithSubscription | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [periodo, setPeriodo] = useState<'monthly' | 'annual'>('monthly');
  const [montoPagado, setMontoPagado] = useState<string>('');
  const [moneda, setMoneda] = useState<string>('USD');
  const [renovacionAutomatica, setRenovacionAutomatica] = useState<boolean>(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth >= 1024);
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [cooperativasResponse, planesResponse] = await Promise.all([
        apiService.getAllCooperativasWithSubscriptions(),
        apiService.getAllPlanesSuscripcion(),
      ]);

      if (cooperativasResponse.isSuccess && cooperativasResponse.data) {
        setCooperativas(cooperativasResponse.data);
      } else {
        setError(cooperativasResponse.message || 'Error al cargar cooperativas');
      }

      if (planesResponse.isSuccess && planesResponse.data) {
        setPlanes(planesResponse.data);
      }
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCooperativas = cooperativas.filter((coop) => {
    const term = searchTerm.toLowerCase();
    return (
      coop.nombre.toLowerCase().includes(term) ||
      coop.ruc.toLowerCase().includes(term) ||
      coop.suscripcion?.nombrePlan?.toLowerCase().includes(term) ||
      coop.suscripcion?.estado?.toLowerCase().includes(term)
    );
  });

  const handleEdit = (cooperativa: CooperativaWithSubscription) => {
    setSelectedCooperativa(cooperativa);
    if (cooperativa.suscripcion) {
      setSelectedPlanId(cooperativa.suscripcion.idPlan);
      const periodoLower = cooperativa.suscripcion.periodo.toLowerCase();
      setPeriodo(periodoLower === 'annual' || periodoLower === 'anual' ? 'annual' : 'monthly');
      setMontoPagado(cooperativa.suscripcion.montoPagado.toString());
      setMoneda(cooperativa.suscripcion.moneda || 'USD');
      setRenovacionAutomatica(cooperativa.suscripcion.renovacionAutomatica ?? true);
    } else {
      setSelectedPlanId(null);
      setPeriodo('monthly');
      setMontoPagado('');
      setMoneda('USD');
      setRenovacionAutomatica(true);
    }
    setIsEditDialogOpen(true);
  };


  const handleUpdateSubscription = async () => {
    if (!selectedCooperativa) {
      toast.error('Error', 'No se seleccionó una cooperativa');
      return;
    }

    // Validar que se haya seleccionado un plan (excepto si es Custom)
    if ((selectedPlanId === null || selectedPlanId === -1) && !montoPagado) {
      toast.error('Error', 'Por favor, selecciona un plan o ingresa un monto para plan Custom');
      return;
    }

    setUpdating(true);
    try {
      let planId: number;
      let monto = parseFloat(montoPagado) || 0;

      // Si es Custom (selectedPlanId === -1), buscar plan Custom o Básica
      if (selectedPlanId === -1 || selectedPlanId === null) {
        // Buscar si existe un plan "Custom" o "Básica"
        const customPlan = planes.find(p => 
          p.nombre.toLowerCase().includes('custom') || 
          p.nombre.toLowerCase().includes('básica') ||
          p.nombre.toLowerCase().includes('basica')
        );
        
        if (customPlan) {
          planId = customPlan.idPlan;
        if (!montoPagado || monto === 0) {
          monto = periodo === 'annual' ? customPlan.precioAnual : customPlan.precioMensual;
        }
        } else {
          toast.error('Error', 'No se encontró un plan Custom o Básica. Por favor, crea uno primero en el sistema.');
          setUpdating(false);
          return;
        }
      } else {
        planId = selectedPlanId;
        const plan = planes.find(p => p.idPlan === selectedPlanId);
        if (!plan) {
          toast.error('Error', 'Plan no encontrado');
          setUpdating(false);
          return;
        }
        if (!montoPagado || monto === 0) {
          monto = periodo === 'annual' ? plan.precioAnual : plan.precioMensual;
        }
      }
      
      // Si ya tiene una suscripción, actualizarla
      if (selectedCooperativa.suscripcion) {
        // Calcular nuevas fechas si cambió el período o el plan
        const fechaInicio = new Date();
        const fechaFin = periodo === 'annual' 
          ? new Date(fechaInicio.getFullYear() + 1, fechaInicio.getMonth(), fechaInicio.getDate())
          : new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + 1, fechaInicio.getDate());

        const updateData = {
          idPlan: planId,
          periodo: periodo,
          montoPagado: monto,
          moneda: moneda,
          renovacionAutomatica: renovacionAutomatica,
          estado: 'active',
          fechaInicio: fechaInicio.toISOString(),
          fechaFin: fechaFin.toISOString(),
          proximaFechaCobro: fechaFin.toISOString(),
        };

        const response = await apiService.updateSuscripcion(
          selectedCooperativa.suscripcion.idSuscripcion,
          updateData
        );

        if (response.isSuccess) {
          toast.success('Suscripción actualizada', 'La suscripción se ha actualizado exitosamente.');
          setIsEditDialogOpen(false);
          loadData();
        } else {
          toast.error('Error', response.message || 'No se pudo actualizar la suscripción.');
        }
      } else {
        // Crear nueva suscripción
        const createData = {
          idCooperativa: selectedCooperativa.idCooperativa,
          idPlan: planId,
          periodo: periodo,
          montoPagado: monto,
          moneda: moneda,
          renovacionAutomatica: renovacionAutomatica,
          metodoPago: 'Admin',
        };

        const response = await apiService.createSuscripcion(createData);

        if (response.isSuccess) {
          // Activar la suscripción inmediatamente
          await apiService.updateSuscripcion(response.data!.idSuscripcion, {
            estado: 'active',
          });

          toast.success('Suscripción creada', 'La suscripción se ha creado exitosamente.');
          setIsEditDialogOpen(false);
          loadData();
        } else {
          toast.error('Error', response.message || 'No se pudo crear la suscripción.');
        }
      }
    } catch (error) {
      toast.error('Error', 'No se pudo procesar la solicitud.');
    } finally {
      setUpdating(false);
    }
  };

  const getEstadoBadge = (estado?: string) => {
    if (!estado) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-700">Sin suscripción</Badge>;
    }

    const estadoLower = estado.toLowerCase();
    switch (estadoLower) {
      case 'active':
      case 'activa':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" />Activa</Badge>;
      case 'pending':
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'canceled':
      case 'cancelada':
        return <Badge className="bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" />Cancelada</Badge>;
      case 'expired':
      case 'expirada':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Expirada</Badge>;
      case 'past_due':
        return <Badge className="bg-orange-100 text-orange-800"><Clock className="w-3 h-3 mr-1" />Pago Vencido</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Suspendida</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getPeriodoLabel = (periodo?: string) => {
    if (!periodo) return '-';
    const periodoLower = periodo.toLowerCase();
    if (periodoLower === 'monthly' || periodoLower === 'mensual') return 'Mensual';
    if (periodoLower === 'annual' || periodoLower === 'anual') return 'Anual';
    return periodo;
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const sidebarOffset = isSidebarOpen ? DASHBOARD_SIDEBAR_WIDTH.OPEN : DASHBOARD_SIDEBAR_WIDTH.COLLAPSED;

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
            Administración de Suscripciones
          </h1>
          <p className="text-gray-800 drop-shadow-sm">
            Gestiona las suscripciones de todas las cooperativas
          </p>
        </div>

        {/* Filtros de búsqueda */}
        <Card className="mb-6 bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Filtros de búsqueda</CardTitle>
            <CardDescription className="text-gray-700">
              Busca cooperativas por nombre, RUC, plan o estado
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
                    placeholder="Buscar por nombre, RUC, plan o estado..."
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
              Cooperativas y Suscripciones ({filteredCooperativas.length})
            </CardTitle>
            <CardDescription className="text-gray-700">
              Lista de todas las cooperativas con sus suscripciones activas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-3 text-gray-600">Cargando datos...</span>
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
                      <TableHead className="font-semibold text-gray-900">Cooperativa</TableHead>
                      <TableHead className="font-semibold text-gray-900">RUC</TableHead>
                      <TableHead className="font-semibold text-gray-900">Plan</TableHead>
                      <TableHead className="font-semibold text-gray-900">Estado</TableHead>
                      <TableHead className="font-semibold text-gray-900">Período</TableHead>
                      <TableHead className="font-semibold text-gray-900">Monto</TableHead>
                      <TableHead className="font-semibold text-gray-900">Vigencia</TableHead>
                      <TableHead className="font-semibold text-gray-900">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCooperativas.map((cooperativa) => (
                      <TableRow
                        key={cooperativa.idCooperativa}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            <CooperativaAvatar
                              logo={cooperativa.logo}
                              nombre={cooperativa.nombre}
                              size="sm"
                            />
                            <span>{cooperativa.nombre}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700">{cooperativa.ruc}</TableCell>
                        <TableCell className="text-gray-700">
                          {cooperativa.suscripcion?.nombrePlan || (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getEstadoBadge(cooperativa.suscripcion?.estado)}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {cooperativa.suscripcion ? getPeriodoLabel(cooperativa.suscripcion.periodo) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {cooperativa.suscripcion ? (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                              <span>
                                {cooperativa.suscripcion.moneda === 'USD' ? '$' : cooperativa.suscripcion.moneda}
                                {cooperativa.suscripcion.montoPagado.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {cooperativa.suscripcion ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3.5 w-3.5 text-gray-400" />
                              <span>
                                {formatDate(cooperativa.suscripcion.fechaInicio)} - {formatDate(cooperativa.suscripcion.fechaFin)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(cooperativa)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Editar
                          </Button>
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

      {/* Dialog de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <CreditCard className="h-6 w-6 text-purple-600" />
              {selectedCooperativa?.suscripcion ? 'Editar Suscripción' : 'Crear Suscripción'}
            </DialogTitle>
            <DialogDescription>
              {selectedCooperativa?.suscripcion
                ? 'Modifica la suscripción de la cooperativa'
                : 'Asigna una suscripción a la cooperativa'}
            </DialogDescription>
          </DialogHeader>

          {selectedCooperativa && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Cooperativa</Label>
                <p className="text-gray-900 font-medium mt-1">{selectedCooperativa.nombre}</p>
                <p className="text-sm text-gray-500">RUC: {selectedCooperativa.ruc}</p>
              </div>

              <div>
                <Label htmlFor="plan">Plan de Suscripción *</Label>
                <Select
                  value={selectedPlanId === -1 ? 'custom' : (selectedPlanId?.toString() || '')}
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      setSelectedPlanId(-1); // Usar -1 para indicar Custom
                      setMontoPagado('');
                    } else {
                      const planId = parseInt(value);
                      setSelectedPlanId(planId);
                      const plan = planes.find(p => p.idPlan === planId);
                      if (plan) {
                        const monto = periodo === 'Anual' ? plan.precioAnual : plan.precioMensual;
                        setMontoPagado(monto.toString());
                      }
                    }
                  }}
                >
                  <SelectTrigger id="plan" className="mt-1">
                    <SelectValue placeholder="Selecciona un plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {planes
                      .filter(p => p.activo)
                      .map((plan) => (
                        <SelectItem key={plan.idPlan} value={plan.idPlan.toString()}>
                          {plan.nombre} - ${plan.precioMensual.toFixed(2)}/mes
                        </SelectItem>
                      ))}
                    {/* Opción para plan Custom */}
                    <SelectItem value="custom">
                      Custom - Personalizado
                    </SelectItem>
                  </SelectContent>
                </Select>
                {selectedPlanId === -1 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Para plan Custom, ingresa el monto personalizado
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="periodo">Período *</Label>
                <Select
                  value={periodo}
                  onValueChange={(value) => setPeriodo(value as 'monthly' | 'annual')}
                >
                  <SelectTrigger id="periodo" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="annual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="moneda">Moneda *</Label>
                <Select
                  value={moneda}
                  onValueChange={(value) => setMoneda(value)}
                >
                  <SelectTrigger id="moneda" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - Dólar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="renovacionAutomatica"
                  checked={renovacionAutomatica}
                  onChange={(e) => setRenovacionAutomatica(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <Label htmlFor="renovacionAutomatica" className="text-sm font-normal cursor-pointer">
                  Renovación automática
                </Label>
              </div>

              <div>
                <Label htmlFor="monto">Monto Pagado *</Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  min="0"
                  value={montoPagado}
                  onChange={(e) => setMontoPagado(e.target.value)}
                  placeholder="0.00"
                  className="mt-1"
                />
                  {selectedPlanId && selectedPlanId !== -1 && selectedPlanId > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Precio sugerido: {moneda === 'USD' ? '$' : moneda}
                    {periodo === 'annual'
                      ? planes.find(p => p.idPlan === selectedPlanId)?.precioAnual.toFixed(2)
                      : planes.find(p => p.idPlan === selectedPlanId)?.precioMensual.toFixed(2)}
                  </p>
                )}
                {selectedPlanId === -1 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Para plan Custom, ingresa el monto personalizado
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={updating}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdateSubscription}
                  disabled={updating || ((selectedPlanId === null || selectedPlanId === -1) && !montoPagado)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {updating ? 'Guardando...' : selectedCooperativa.suscripcion ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <RightSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((prev) => !prev)} />
    </div>
  );
}

