import { useState, useEffect } from 'react';
import { DashboardNav } from '@/components/DashboardNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService, UsuarioDTO, UsuarioUpdateDTO } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminDashboard() {
  const [users, setUsers] = useState<UsuarioDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getAllUsuarios();
      if (response.isSuccess && response.data) {
        setUsers(response.data);
      } else {
        setError(response.message || 'Error al cargar usuarios');
      }
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const updateData: UsuarioUpdateDTO = { rol: newRole };
      const response = await apiService.updateUsuario(userId, updateData);
      
      if (response.isSuccess) {
        setSuccess('Rol actualizado exitosamente');
        fetchUsers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Error al actualizar rol');
      }
    } catch (err) {
      setError('Error al actualizar rol');
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(/fondo.jpg)' }}
    >
      <DashboardNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <div className="mb-8 bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 drop-shadow-md">Admin Dashboard</h1>
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

        <Card className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Gestión de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-700">Cargando usuarios...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/60 backdrop-blur-sm">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Nombre</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Correo</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Rol</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Cargo</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300/50">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-700">
                          No se encontraron usuarios
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.idUsuario} className="hover:bg-white/30 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">{user.idUsuario}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{user.nombres} {user.apellidos}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{user.correo}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-blue-500/70 text-white rounded text-xs backdrop-blur-sm">
                              {user.rol}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{user.cargo || '-'}</td>
                          <td className="px-4 py-3 text-sm">
                            <Select
                              value={user.rol}
                              onValueChange={(value) => updateUserRole(user.idUsuario, value)}
                            >
                              <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Administrador">Administrador</SelectItem>
                                <SelectItem value="Gerente">Gerente</SelectItem>
                                <SelectItem value="UsuarioCooperativa">Usuario Cooperativa</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
