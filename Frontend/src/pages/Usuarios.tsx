import { useState, useEffect } from 'react';
import { apiService, UsuarioDTO, UsuarioUpdateDTO, UsuarioCreateDTO } from '@/services/api';
import { Button } from '@/components/ui/button';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardNav } from '@/components/DashboardNav';
import { RightSidebar } from '@/components/RightSidebar';
import { DASHBOARD_SIDEBAR_WIDTH } from '@/constants/layout';

export default function Usuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<UsuarioDTO | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Estados para crear usuario
  const [newUsuario, setNewUsuario] = useState<UsuarioCreateDTO>({
    nombres: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    rol: 'UsuarioCooperativa',
    idCooperativa: undefined,
    cargo: '',
    celular: '',
  });

  // Estados para editar usuario
  const [editUsuario, setEditUsuario] = useState<UsuarioUpdateDTO>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth >= 1024);
    }
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getAllUsuarios();
      if (response.isSuccess && response.data) {
        setUsuarios(response.data);
      } else {
        setError(response.message || 'Error al cargar usuarios');
      }
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newUsuario.nombres || !newUsuario.apellidos || !newUsuario.correo || !newUsuario.contrasena) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const response = await apiService.register(newUsuario);
      if (response.isSuccess) {
        setSuccess('Usuario creado exitosamente');
        setIsCreateDialogOpen(false);
        setNewUsuario({
          nombres: '',
          apellidos: '',
          correo: '',
          contrasena: '',
          rol: 'UsuarioCooperativa',
          idCooperativa: undefined,
          cargo: '',
          celular: '',
        });
        loadUsuarios();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Error al crear usuario');
      }
    } catch (err) {
      setError('Error al crear usuario');
    }
  };

  const handleEdit = (usuario: UsuarioDTO) => {
    setSelectedUsuario(usuario);
    setEditUsuario({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      rol: usuario.rol,
      cargo: usuario.cargo || '',
      celular: usuario.celular || '',
      idCooperativa: usuario.idCooperativa,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedUsuario) return;

    try {
      const response = await apiService.updateUsuario(selectedUsuario.idUsuario, editUsuario);
      if (response.isSuccess) {
        setSuccess('Usuario actualizado exitosamente');
        setIsEditDialogOpen(false);
        setSelectedUsuario(null);
        loadUsuarios();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Error al actualizar usuario');
      }
    } catch (err) {
      setError('Error al actualizar usuario');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiService.deleteUsuario(id);
      if (response.isSuccess) {
        setSuccess('Usuario eliminado exitosamente');
        loadUsuarios();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Error al eliminar usuario');
      }
    } catch (err) {
      setError('Error al eliminar usuario');
    }
  };

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sidebarOffset = isSidebarOpen ? DASHBOARD_SIDEBAR_WIDTH.OPEN : DASHBOARD_SIDEBAR_WIDTH.COLLAPSED;

  if (loading) {
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
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600">Cargando usuarios...</p>
          </div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 drop-shadow-md mb-2">Gestión de Usuarios</h1>
              <p className="text-gray-800 drop-shadow-sm">Administra los usuarios del sistema</p>
            </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Completa los datos para crear un nuevo usuario
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombres">Nombres *</Label>
                  <Input
                    id="nombres"
                    value={newUsuario.nombres}
                    onChange={(e) => setNewUsuario({ ...newUsuario, nombres: e.target.value })}
                    placeholder="Juan"
                  />
                </div>
                <div>
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    value={newUsuario.apellidos}
                    onChange={(e) => setNewUsuario({ ...newUsuario, apellidos: e.target.value })}
                    placeholder="Pérez"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="correo">Correo Electrónico *</Label>
                <Input
                  id="correo"
                  type="email"
                  value={newUsuario.correo}
                  onChange={(e) => setNewUsuario({ ...newUsuario, correo: e.target.value })}
                  placeholder="juan@ejemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="contrasena">Contraseña *</Label>
                <Input
                  id="contrasena"
                  type="password"
                  value={newUsuario.contrasena}
                  onChange={(e) => setNewUsuario({ ...newUsuario, contrasena: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <Label htmlFor="rol">Rol</Label>
                <Input
                  id="rol"
                  value={newUsuario.rol}
                  onChange={(e) => setNewUsuario({ ...newUsuario, rol: e.target.value })}
                  placeholder="Usuario"
                />
              </div>
              <div>
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  value={newUsuario.cargo}
                  onChange={(e) => setNewUsuario({ ...newUsuario, cargo: e.target.value })}
                  placeholder="Gerente"
                />
              </div>
              <div>
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  value={newUsuario.celular}
                  onChange={(e) => setNewUsuario({ ...newUsuario, celular: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Crear Usuario</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Filtros de búsqueda */}
        <div className="mb-6 bg-white/50 backdrop-blur-md rounded-xl p-6 border border-white/40 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar usuarios por nombre, apellido, correo o rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 border-gray-300"
            />
          </div>
        </div>

        {/* Listado de usuarios */}
        <div className="bg-white/50 backdrop-blur-md rounded-xl border border-white/40 shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombres</TableHead>
              <TableHead>Apellidos</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Celular</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.idUsuario}>
                  <TableCell>{usuario.idUsuario}</TableCell>
                  <TableCell>{usuario.nombres}</TableCell>
                  <TableCell>{usuario.apellidos}</TableCell>
                  <TableCell>{usuario.correo}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {usuario.rol}
                    </span>
                  </TableCell>
                  <TableCell>{usuario.cargo || '-'}</TableCell>
                  <TableCell>{usuario.celular || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(usuario)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará el usuario{' '}
                              <strong>{usuario.nombres} {usuario.apellidos}</strong>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(usuario.idUsuario)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>

        {/* Dialog de edición */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Modifica los datos del usuario
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-nombres">Nombres</Label>
                  <Input
                    id="edit-nombres"
                    value={editUsuario.nombres || ''}
                    onChange={(e) => setEditUsuario({ ...editUsuario, nombres: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-apellidos">Apellidos</Label>
                  <Input
                    id="edit-apellidos"
                    value={editUsuario.apellidos || ''}
                    onChange={(e) => setEditUsuario({ ...editUsuario, apellidos: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-rol">Rol</Label>
                <Input
                  id="edit-rol"
                  value={editUsuario.rol || ''}
                  onChange={(e) => setEditUsuario({ ...editUsuario, rol: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-cargo">Cargo</Label>
                <Input
                  id="edit-cargo"
                  value={editUsuario.cargo || ''}
                  onChange={(e) => setEditUsuario({ ...editUsuario, cargo: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-celular">Celular</Label>
                <Input
                  id="edit-celular"
                  value={editUsuario.celular || ''}
                  onChange={(e) => setEditUsuario({ ...editUsuario, celular: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-contrasena">Nueva Contraseña (opcional)</Label>
                <Input
                  id="edit-contrasena"
                  type="password"
                  value={editUsuario.contrasena || ''}
                  onChange={(e) => setEditUsuario({ ...editUsuario, contrasena: e.target.value })}
                  placeholder="Dejar vacío para no cambiar"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <RightSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((prev) => !prev)} />
    </div>
  );
}

