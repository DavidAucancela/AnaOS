import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, SocioDTO, SocioCreateDTO, SocioUpdateDTO } from '@/services/api';
import { DashboardNav } from '@/components/DashboardNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Search, Pencil, UserX, Users } from 'lucide-react';
import { DASHBOARD_SIDEBAR_WIDTH } from '@/constants/layout';

const EMPTY_CREATE: SocioCreateDTO = {
  idCooperativa: 0,
  cedula: '',
  nombres: '',
  apellidos: '',
  telefono: '',
  correo: '',
  direccion: '',
};

export default function Socios() {
  const { profile } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [socios, setSocios] = useState<SocioDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<SocioCreateDTO>(EMPTY_CREATE);
  const [saving, setSaving] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SocioDTO | null>(null);
  const [editForm, setEditForm] = useState<SocioUpdateDTO>({});

  const [deactivateTarget, setDeactivateTarget] = useState<SocioDTO | null>(null);

  const idCooperativa = profile?.idCooperativa;

  useEffect(() => {
    if (typeof window !== 'undefined') setIsSidebarOpen(window.innerWidth >= 1024);
  }, []);

  useEffect(() => {
    if (idCooperativa) loadSocios();
  }, [idCooperativa]);

  const loadSocios = async () => {
    if (!idCooperativa) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiService.getSociosByCooperativa(idCooperativa);
      if (res.isSuccess && res.data) setSocios(res.data);
      else setError(res.message || 'Error al cargar socios');
    } catch {
      setError('Error al cargar socios');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return socios;
    const q = search.toLowerCase();
    return socios.filter(s =>
      s.cedula.includes(q) ||
      s.nombres.toLowerCase().includes(q) ||
      s.apellidos.toLowerCase().includes(q) ||
      s.correo?.toLowerCase().includes(q) ||
      s.telefono?.includes(q)
    );
  }, [socios, search]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  // ── CREATE ───────────────────────────────────────────────────────────────────
  const openCreate = () => {
    setCreateForm({ ...EMPTY_CREATE, idCooperativa: idCooperativa ?? 0 });
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    if (!createForm.cedula || !createForm.nombres || !createForm.apellidos) {
      setError('Cédula, nombres y apellidos son obligatorios.');
      return;
    }
    setSaving(true);
    try {
      const res = await apiService.createSocio(createForm);
      if (res.isSuccess) {
        setCreateOpen(false);
        showSuccess('Socio registrado exitosamente.');
        loadSocios();
      } else {
        setError(res.message || 'Error al crear socio');
      }
    } catch {
      setError('Error al crear socio');
    } finally {
      setSaving(false);
    }
  };

  // ── EDIT ─────────────────────────────────────────────────────────────────────
  const openEdit = (s: SocioDTO) => {
    setEditTarget(s);
    setEditForm({
      nombres: s.nombres,
      apellidos: s.apellidos,
      telefono: s.telefono ?? '',
      correo: s.correo ?? '',
      direccion: s.direccion ?? '',
      estado: s.estado,
    });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      const res = await apiService.updateSocio(editTarget.idSocio, editForm);
      if (res.isSuccess) {
        setEditOpen(false);
        showSuccess('Socio actualizado.');
        loadSocios();
      } else {
        setError(res.message || 'Error al actualizar');
      }
    } catch {
      setError('Error al actualizar socio');
    } finally {
      setSaving(false);
    }
  };

  // ── DEACTIVATE ───────────────────────────────────────────────────────────────
  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      const res = await apiService.deactivateSocio(deactivateTarget.idSocio);
      if (res.isSuccess) {
        setDeactivateTarget(null);
        showSuccess('Socio desactivado.');
        loadSocios();
      } else {
        setError(res.message || 'Error al desactivar');
      }
    } catch {
      setError('Error al desactivar socio');
    }
  };

  const sidebarOffset = isSidebarOpen ? DASHBOARD_SIDEBAR_WIDTH.OPEN : DASHBOARD_SIDEBAR_WIDTH.COLLAPSED;
  const activos = socios.filter(s => s.estado === 'Activo').length;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed transition-[padding-left] duration-300 ease-in-out"
      style={{ paddingLeft: `${sidebarOffset}px`, backgroundImage: 'url(/fondo.jpg)' }}
    >
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        {/* Header */}
        <div className="mb-6 bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 drop-shadow-md flex items-center gap-2">
              <Users className="w-7 h-7 text-blue-600" /> Socios
            </h1>
            <p className="text-gray-700 mt-1">
              {activos} activos · {socios.length} total
            </p>
          </div>
          <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" /> Nuevo socio
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-500/80 backdrop-blur-sm border-red-600">
            <AlertDescription className="text-white font-semibold">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 bg-green-500/80 backdrop-blur-sm border-green-600">
            <AlertDescription className="text-white font-semibold">{success}</AlertDescription>
          </Alert>
        )}

        {/* Tabla */}
        <Card className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Buscar por cédula, nombre, correo o teléfono..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="max-w-sm bg-white/70"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-10 text-gray-600">Cargando socios...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                {search ? 'Sin resultados para esa búsqueda.' : 'No hay socios registrados aún.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/60">
                    <tr>
                      {['Cédula', 'Apellidos', 'Nombres', 'Teléfono', 'Correo', 'Estado', 'Acciones'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-medium text-gray-900">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {filtered.map(s => (
                      <tr key={s.idSocio} className="hover:bg-white/30 transition-colors">
                        <td className="px-4 py-3 text-gray-900 font-mono">{s.cedula}</td>
                        <td className="px-4 py-3 text-gray-900 font-medium">{s.apellidos}</td>
                        <td className="px-4 py-3 text-gray-900">{s.nombres}</td>
                        <td className="px-4 py-3 text-gray-700">{s.telefono || '—'}</td>
                        <td className="px-4 py-3 text-gray-700">{s.correo || '—'}</td>
                        <td className="px-4 py-3">
                          <Badge className={s.estado === 'Activo'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-100'}>
                            {s.estado}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => openEdit(s)}
                              className="bg-white/60 hover:bg-white/90 h-7 px-2">
                              <Pencil className="w-3 h-3" />
                            </Button>
                            {s.estado === 'Activo' && (
                              <Button size="sm" variant="outline"
                                onClick={() => setDeactivateTarget(s)}
                                className="bg-white/60 hover:bg-red-50 border-red-200 text-red-600 h-7 px-2">
                                <UserX className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Modal Crear ─────────────────────────────────────────────────────── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar nuevo socio</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2">
              <Label>Cédula *</Label>
              <Input value={createForm.cedula}
                onChange={e => setCreateForm(f => ({ ...f, cedula: e.target.value }))}
                placeholder="0912345678" className="mt-1" maxLength={13} />
            </div>
            <div>
              <Label>Nombres *</Label>
              <Input value={createForm.nombres}
                onChange={e => setCreateForm(f => ({ ...f, nombres: e.target.value }))}
                placeholder="Juan Carlos" className="mt-1" />
            </div>
            <div>
              <Label>Apellidos *</Label>
              <Input value={createForm.apellidos}
                onChange={e => setCreateForm(f => ({ ...f, apellidos: e.target.value }))}
                placeholder="Pérez Mora" className="mt-1" />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={createForm.telefono}
                onChange={e => setCreateForm(f => ({ ...f, telefono: e.target.value }))}
                placeholder="0991234567" className="mt-1" />
            </div>
            <div>
              <Label>Correo</Label>
              <Input value={createForm.correo} type="email"
                onChange={e => setCreateForm(f => ({ ...f, correo: e.target.value }))}
                placeholder="socio@ejemplo.com" className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Dirección</Label>
              <Input value={createForm.direccion}
                onChange={e => setCreateForm(f => ({ ...f, direccion: e.target.value }))}
                placeholder="Av. Principal 123" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? 'Guardando...' : 'Registrar socio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Modal Editar ────────────────────────────────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Editar socio — {editTarget?.cedula}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <Label>Nombres</Label>
              <Input value={editForm.nombres ?? ''}
                onChange={e => setEditForm(f => ({ ...f, nombres: e.target.value }))}
                className="mt-1" />
            </div>
            <div>
              <Label>Apellidos</Label>
              <Input value={editForm.apellidos ?? ''}
                onChange={e => setEditForm(f => ({ ...f, apellidos: e.target.value }))}
                className="mt-1" />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={editForm.telefono ?? ''}
                onChange={e => setEditForm(f => ({ ...f, telefono: e.target.value }))}
                className="mt-1" />
            </div>
            <div>
              <Label>Correo</Label>
              <Input value={editForm.correo ?? ''} type="email"
                onChange={e => setEditForm(f => ({ ...f, correo: e.target.value }))}
                className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Dirección</Label>
              <Input value={editForm.direccion ?? ''}
                onChange={e => setEditForm(f => ({ ...f, direccion: e.target.value }))}
                className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Estado</Label>
              <Select value={editForm.estado ?? 'Activo'}
                onValueChange={v => setEditForm(f => ({ ...f, estado: v }))}>
                <SelectTrigger className="mt-1 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleEdit} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Confirmar desactivar ─────────────────────────────────────────────── */}
      <AlertDialog open={!!deactivateTarget} onOpenChange={open => !open && setDeactivateTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desactivar socio</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Desactivar a <strong>{deactivateTarget?.nombres} {deactivateTarget?.apellidos}</strong> (cédula {deactivateTarget?.cedula})?
              El socio quedará inactivo pero sus datos se conservarán.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate}
              className="bg-red-600 hover:bg-red-700">
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
