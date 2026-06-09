import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, CooperativaAnalytics } from '@/services/api';
import { DashboardNav } from '@/components/DashboardNav';
import { RightSidebar } from '@/components/RightSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, CreditCard, Wallet, CalendarDays, UserCheck } from 'lucide-react';
import { DASHBOARD_SIDEBAR_WIDTH } from '@/constants/layout';

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [analytics, setAnalytics] = useState<CooperativaAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsSidebarOpen(window.innerWidth >= 1024);
  }, []);

  useEffect(() => {
    apiService.getCooperativaAnalytics()
      .then(res => { if (res.isSuccess && res.data) setAnalytics(res.data); })
      .finally(() => setLoadingAnalytics(false));
  }, []);

  const sidebarOffset = isSidebarOpen ? DASHBOARD_SIDEBAR_WIDTH.OPEN : DASHBOARD_SIDEBAR_WIDTH.COLLAPSED;

  const stats = [
    {
      label: 'Agencias',
      value: analytics?.agencias ?? '-',
      icon: Building2,
      description: 'sucursales activas',
    },
    {
      label: 'Cuentas activas',
      value: analytics?.cuentas.activas ?? '-',
      icon: Wallet,
      description: `${analytics?.cuentas.total ?? 0} total`,
    },
    {
      label: 'Usuarios',
      value: analytics?.usuarios ?? '-',
      icon: Users,
      description: 'de tu cooperativa',
    },
    {
      label: 'Socios activos',
      value: analytics?.socios?.activos ?? '-',
      icon: UserCheck,
      description: `${analytics?.socios?.total ?? 0} total`,
    },
    {
      label: 'Plan',
      value: analytics?.suscripcion?.plan ?? 'Sin plan',
      icon: CreditCard,
      description: analytics?.suscripcion
        ? `${analytics.suscripcion.diasRestantes} días restantes`
        : 'Activa tu suscripción',
    },
  ];

  const quickActions = [
    { label: 'Socios', description: 'Gestionar socios', path: '/socios' },
    { label: 'Agencias', description: 'Gestionar sucursales', path: '/agencias' },
    { label: 'Usuarios', description: 'Administrar usuarios', path: '/usuarios' },
    { label: 'Suscripción', description: 'Ver mi plan', path: '/payment' },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed transition-[padding-left] duration-300 ease-in-out"
      style={{ paddingLeft: `${sidebarOffset}px`, backgroundImage: 'url(/fondo.jpg)' }}
    >
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        {/* Bienvenida */}
        <div className="mb-8 bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 drop-shadow-md">
            Bienvenido, {profile ? `${profile.nombres} ${profile.apellidos}` : 'Usuario'}!
          </h1>
          <p className="text-gray-800 mt-1 drop-shadow-sm">
            Panel de control de tu cooperativa
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => (
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Estado de suscripción */}
          <Card className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                Suscripción
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAnalytics ? (
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200/60 rounded w-1/3 animate-pulse" />
                  <div className="h-4 bg-gray-200/60 rounded w-1/2 animate-pulse" />
                </div>
              ) : analytics?.suscripcion ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Plan</span>
                    <span className="font-semibold text-gray-900">{analytics.suscripcion.plan}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Estado</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activa</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Vence</span>
                    <span className="font-medium text-gray-900">
                      {new Date(analytics.suscripcion.fechaFin).toLocaleDateString('es-EC')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Días restantes</span>
                    <span className={`font-semibold ${analytics.suscripcion.diasRestantes < 15 ? 'text-red-600' : 'text-gray-900'}`}>
                      {analytics.suscripcion.diasRestantes}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-3">No tienes una suscripción activa</p>
                  <Button size="sm" onClick={() => navigate('/payment')}>
                    Ver planes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Acciones rápidas</CardTitle>
              <CardDescription className="text-gray-700">Accede a las secciones principales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {quickActions.map(({ label, description, path }) => (
                  <Button
                    key={label}
                    variant="outline"
                    className="h-auto p-4 flex items-center justify-between bg-white/40 hover:bg-white/70 border-white/50"
                    onClick={() => navigate(path)}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{label}</div>
                      <div className="text-xs text-gray-600 font-normal">{description}</div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <RightSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((prev) => !prev)} />
    </div>
  );
}
