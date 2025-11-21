import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardNav } from '@/components/DashboardNav';
import { RightSidebar } from '@/components/RightSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DASHBOARD_SIDEBAR_WIDTH } from '@/constants/layout';

export default function Dashboard() {
  const { profile } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsSidebarOpen(window.innerWidth >= 1024);
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total Transactions', value: '1,234', change: '+12.5%' },
      { label: 'Active Accounts', value: '89', change: '+5.2%' },
      { label: 'Monthly Volume', value: '$2.4M', change: '+18.3%' },
      { label: 'Compliance Score', value: '98.5%', change: '+2.1%' },
    ],
    []
  );

  const sidebarOffset = isSidebarOpen ? DASHBOARD_SIDEBAR_WIDTH.OPEN : DASHBOARD_SIDEBAR_WIDTH.COLLAPSED;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed transition-[padding-left] duration-300 ease-in-out"
      style={{ 
        paddingLeft: `${sidebarOffset}px`,
        backgroundImage: 'url(/fondo.jpg)'
      }}
    >
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 min-h-screen">
        <div className="mb-8 bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 drop-shadow-md">
            Bienvenido, {profile ? `${profile.nombres} ${profile.apellidos}` : 'Usuario'}!
          </h1>
          <p className="text-gray-800 mt-2 drop-shadow-sm">Aquí puedes ver el estado de tus cuentas y transacciones.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={stat.label + index} className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-700 font-medium">{stat.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-sm text-green-700 mt-1 font-semibold">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Recent Activity</CardTitle>
              <CardDescription className="text-gray-700">Latest transactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-300/50 pb-3">
                    <div>
                      <p className="font-medium text-gray-900">Transaction #{1000 + i}</p>
                      <p className="text-sm text-gray-700">2 hours ago</p>
                    </div>
                    <span className="text-green-700 font-semibold">+$1,234</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-md border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Quick Actions</CardTitle>
              <CardDescription className="text-gray-700">Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-300/50 rounded-lg hover:bg-white/60 backdrop-blur-sm text-left transition-all">
                  <div className="font-medium text-gray-900">New Report</div>
                  <div className="text-sm text-gray-700">Generate report</div>
                </button>
                <button className="p-4 border border-gray-300/50 rounded-lg hover:bg-white/60 backdrop-blur-sm text-left transition-all">
                  <div className="font-medium text-gray-900">Export Data</div>
                  <div className="text-sm text-gray-700">Download CSV</div>
                </button>
                <button className="p-4 border border-gray-300/50 rounded-lg hover:bg-white/60 backdrop-blur-sm text-left transition-all">
                  <div className="font-medium text-gray-900">Settings</div>
                  <div className="text-sm text-gray-700">Configure system</div>
                </button>
                <button className="p-4 border border-gray-300/50 rounded-lg hover:bg-white/60 backdrop-blur-sm text-left transition-all">
                  <div className="font-medium text-gray-900">Support</div>
                  <div className="text-sm text-gray-700">Get help</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <RightSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((prev) => !prev)} />
    </div>
  );
}
