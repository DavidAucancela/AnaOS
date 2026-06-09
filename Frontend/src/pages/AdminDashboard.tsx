import { useState, useEffect } from 'react';
import { DashboardNav } from '@/components/DashboardNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { apiService, UsuarioDTO, UsuarioUpdateDTO, AdminAnalytics } from '@/services/api';
import { Building2, Users, CreditCard, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [users, setUsers] = useState<UsuarioDTO[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    apiService.getAdminAnalytics()
      .then(res => { if (res.isSuccess && res.data) setAnalytics(res.data); })
      .finally(() => setLoadingAnalytics(false));

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setError('');
    try {
      const response = await apiService.getAllUsuarios();
      if (response.isSuccess && response.data) {
        setUsers(response.data);
      } else {
        setError(response.message || 'Error al cargar usuarios');
      }
    } catch {
      setError('Error al cargar usuarios');
    } finally {
      setLoadingUsers(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const response = await apiService.updateUsuario(userId, { rol: newRole } as UsuarioUpdateDTO);
      if (response.isSuccess) {
        setSuccess('Rol actualizado exitosamente');
        fetchUsers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Error al actualizar rol');
      }
    } catch {
      setError('Error al actualizar rol');
    }
  };

  const statCards = [
    {
      label: 'Cooperativas',
      value: analytics?.totalCooperativas ?? '-',
      icon: Building2,
      description: 'registradas en la plataforma',
    },
    {
      label: 'Suscripciones activas',
      value: analytics?.suscripcionesActivas ?? '-',
      icon: CreditCard,
      description: 'planes vigentes',
    },
    {
      label: 'Ingresos estimados',
      value: analytics ? `$${analytics.ingresosEstimadosMensual.toFixed(0)}` : '-',
      icon: TrendingUp,
      description: 'por mes (USD)',
    },
    {
      label: 'Usuarios totales',
      value: analytics?.totalUsuarios ?? '-',
      icon: Users,
      description: 'en cooperativas',
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(/fondo.jpg)' }}
    >
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <div className="mb-8 bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 drop-shadow-md">Panel de Administración</h1>
          <p className="text-gray-700 mt-1">Visión global de la plataforma AnaOS</p>
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

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardDescription className="text-gray-700 font-medium">{stat.label}</CardDescription>
                <stat.icon className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                {loadingAnalytics ? (
                  <div className="h-8 bg-gray-200/60 rounded w-1/2 animate-pulse" />
                ) : (
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                )}
                <p className="text-sm text-gray-600 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          {/* Gráfico nuevas cooperativas */}
          <Card className="lg:col-span-2 bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Nuevas cooperativas</CardTitle>
              <CardDescription className="text-gray-700">Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAnalytics ? (
                <div className="h-48 bg-gray-200/40 rounded animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics?.nuevasPorMes ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Distribución por plan */}
          <Card className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Distribución de planes</CardTitle>
              <CardDescription className="text-gray-700">Suscripciones activas</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAnalytics ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-8 bg-gray-200/60 rounded animate-pulse" />
                  ))}
                </div>
              ) : analytics?.distribucionPlanes.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">Sin suscripciones activas</p>
              ) : (
                <div className="space-y-3">
                  {analytics?.distribucionPlanes.map(({ plan, cantidad }) => (
                    <div key={plan} className="flex items-center justify-between">
                      <span className="text-gray-700 text-sm">{plan}</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {cantidad}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gestión de usuarios */}
        <Card className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Gestión de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
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
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Cambiar rol</th>
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
