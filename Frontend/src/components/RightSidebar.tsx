import { useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Landmark,
  Building2,
  TrendingUp,
  Users,
  ShieldCheck,
  ChartLine,
  AlertTriangle,
  Factory,
  BarChart3,
  Globe,
  Activity,
  ExternalLink,
  ClipboardList,
  Gauge,
  type LucideIcon,
  Home,
  UserCog,
  History,
  CreditCard,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DASHBOARD_SIDEBAR_WIDTH } from '@/constants/layout';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';

interface SectionTheme {
  accent: string;
  accentBg: string;
  accentBorder: string;
  accentSoftBg: string;
  accentDot: string;
}

interface SidebarLink {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarSection {
  id: string;
  title: string;
  shortLabel: string;
  links: SidebarLink[];
  theme: SectionTheme;
}

// Sección de administración (solo para administradores)
const adminSection: SidebarSection = {
  id: 'administracion',
  title: 'Administración',
  shortLabel: 'ADM',
  theme: {
    accent: 'text-purple-600',
    accentBg: 'bg-purple-50',
    accentBorder: 'border-purple-200',
    accentSoftBg: 'bg-purple-100/70',
    accentDot: 'bg-purple-500',
  },
  links: [
    { label: 'Usuarios', path: '/usuarios', icon: Users },
    { label: 'Roles y Permisos', path: '/dashboard/admin/roles', icon: UserCog },
    { label: 'Suscripciones', path: '/dashboard/admin/suscripciones', icon: CreditCard },
    { label: 'Historial de Cambios', path: '/dashboard/admin/historial', icon: History },
  ],
};

const sidebarSections: SidebarSection[] = [
  {
    id: 'cooperativas',
    title: 'BI de cooperativas',
    shortLabel: 'BC',
    theme: {
      accent: 'text-emerald-600',
      accentBg: 'bg-emerald-50',
      accentBorder: 'border-emerald-200',
      accentSoftBg: 'bg-emerald-100/70',
      accentDot: 'bg-emerald-500',
    },
    links: [
      { label: 'Cooperativas', path: '/dashboard/bi/cooperativas', icon: Users },
    ],
  },
  {
    id: 'mercado-valores',
    title: 'BI de mercado de valores',
    shortLabel: 'MC',
    theme: {
      accent: 'text-indigo-600',
      accentBg: 'bg-indigo-50',
      accentBorder: 'border-indigo-200',
      accentSoftBg: 'bg-indigo-100/70',
      accentDot: 'bg-indigo-500',
    },
    links: [
      { label: 'Mercado local', path: '/dashboard/bi/mercado-local', icon: ChartLine },
      { label: 'Gestión de riesgo', path: '/dashboard/bi/gestion-riesgo', icon: AlertTriangle },
    ],
  },
  {
    id: 'companias-nacionales',
    title: 'BI de compañías a nivel nacional',
    shortLabel: 'CNN',
    theme: {
      accent: 'text-amber-600',
      accentBg: 'bg-amber-50',
      accentBorder: 'border-amber-200',
      accentSoftBg: 'bg-amber-100/70',
      accentDot: 'bg-amber-500',
    },
    links: [
      { label: 'Mapeo empresarial', path: '/dashboard/bi/mapa-empresarial', icon: Factory },
      { label: 'Comparativos', path: '/dashboard/bi/comparativos', icon: BarChart3 },
    ],
  },
  {
    id: 'gestion-macroeconomica',
    title: 'BI de Gestión macroeconómica',
    shortLabel: 'GM',
    theme: {
      accent: 'text-cyan-600',
      accentBg: 'bg-cyan-50',
      accentBorder: 'border-cyan-200',
      accentSoftBg: 'bg-cyan-100/70',
      accentDot: 'bg-cyan-500',
    },
    links: [
      { label: 'Indicadores país', path: '/dashboard/bi/indicadores-pais', icon: Globe },
      { label: 'Escenarios', path: '/dashboard/bi/escenarios', icon: Activity },
    ],
  },
  {
    id: 'tasas-interes',
    title: 'BI de Tasas de interés',
    shortLabel: 'TI',
    theme: {
      accent: 'text-rose-600',
      accentBg: 'bg-rose-50',
      accentBorder: 'border-rose-200',
      accentSoftBg: 'bg-rose-100/70',
      accentDot: 'bg-rose-500',
    },
    links: [
      { label: 'Curvas locales', path: '/dashboard/bi/curvas-locales', icon: TrendingUp },
      { label: 'Referencias externas', path: '/dashboard/bi/referencias-externas', icon: ExternalLink },
    ],
  },
  {
    id: 'presupuesto',
    title: 'Sistema de presupuesto',
    shortLabel: 'SP',
    theme: {
      accent: 'text-slate-700',
      accentBg: 'bg-slate-100',
      accentBorder: 'border-slate-300',
      accentSoftBg: 'bg-slate-200/80',
      accentDot: 'bg-slate-500',
    },
    links: [
      { label: 'Planeación', path: '/dashboard/presupuesto/planeacion', icon: ClipboardList },
      { label: 'Seguimiento', path: '/dashboard/presupuesto/seguimiento', icon: Gauge },
    ],
  },
];

interface RightSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const RightSidebar = ({ isOpen, onToggle }: RightSidebarProps) => {
  const location = useLocation();
  const { profile } = useAuth();
  const [allowedSections, setAllowedSections] = useState<SidebarSection[]>([]);
  const width = isOpen ? DASHBOARD_SIDEBAR_WIDTH.OPEN : DASHBOARD_SIDEBAR_WIDTH.COLLAPSED;
  const isAdmin = profile?.rol?.toLowerCase() === 'administrador';
  const isCooperativa = profile?.rol?.toLowerCase() === 'cooperativa';
  const isGerente = profile?.rol?.toLowerCase() === 'gerente';
  const canViewAllCooperativas = isAdmin || isGerente;
  
  // Cargar suscripción activa y filtrar secciones
  useEffect(() => {
    const loadSubscriptionAndFilterSections = async () => {
      // Si el rol es Cooperativa (y no es admin ni gerente), siempre mostrar la sección de Agencias
      if (isCooperativa && !canViewAllCooperativas && profile?.idCooperativa) {
        const agenciasSection: SidebarSection = {
          id: 'cooperativas',
          title: 'BI de cooperativas',
          shortLabel: 'BC',
          theme: {
            accent: 'text-emerald-600',
            accentBg: 'bg-emerald-50',
            accentBorder: 'border-emerald-200',
            accentSoftBg: 'bg-emerald-100/70',
            accentDot: 'bg-emerald-500',
          },
          links: [
            { label: 'Agencias', path: '/agencias', icon: Landmark },
          ],
        };
        setAllowedSections([agenciasSection]);
        return;
      }

      if (!profile?.idCooperativa) {
        // Si es admin, mostrar todas las secciones + admin
        if (isAdmin) {
          setAllowedSections([...sidebarSections, adminSection]);
        } else {
          setAllowedSections([]);
        }
        return;
      }

      try {
        const response = await apiService.getActiveSubscriptionByCooperativa(profile.idCooperativa);
        const hasActive = !!(response.isSuccess && response.data);

        // Filtrar secciones según suscripción
        // Professional: solo BI de cooperativas
        // Enterprise: todas las BI
        let filteredSections: SidebarSection[] = [];

        if (hasActive && response.data) {
          const planName = response.data.nombrePlan?.toLowerCase() || '';
          
          if (planName.includes('enterprise')) {
            // Enterprise: todas las BI
            filteredSections = [...sidebarSections];
          } else if (planName.includes('professional')) {
            // Professional: solo BI de cooperativas
            filteredSections = sidebarSections.filter(s => s.id === 'cooperativas');
          }
        }

        // Agregar sección de administración si es admin
        if (isAdmin) {
          filteredSections = [...filteredSections, adminSection];
        }

        setAllowedSections(filteredSections);
      } catch (error) {
        console.error('Error al cargar suscripción:', error);
        // Si hay error, mostrar todas las secciones si es admin
        const errorSections = [...sidebarSections];
        
        if (isAdmin) {
          setAllowedSections([...errorSections, adminSection]);
        } else {
          setAllowedSections(errorSections);
        }
      }
    };

    loadSubscriptionAndFilterSections();
  }, [profile?.idCooperativa, isAdmin, isCooperativa, canViewAllCooperativas]);

  // Detectar la sección activa basada en la ruta actual
  const getActiveSectionFromPath = () => {
    const currentPath = location.pathname;
    const sectionsToCheck = allowedSections.length > 0 ? allowedSections : sidebarSections;
    for (const section of sectionsToCheck) {
      if (section.links.some((link) => currentPath.startsWith(link.path))) {
        return section.id;
      }
    }
    return sectionsToCheck[0]?.id;
  };

  const [activeSectionId, setActiveSectionId] = useState<string | undefined>(() => {
    return getActiveSectionFromPath();
  });
  const [activeLinkPath, setActiveLinkPath] = useState(location.pathname);

  const activeSection = useMemo(
    () => {
      const sectionsToCheck = allowedSections.length > 0 ? allowedSections : sidebarSections;
      return sectionsToCheck.find((section) => section.id === activeSectionId) ?? sectionsToCheck[0];
    },
    [activeSectionId, allowedSections]
  );
  
  // Determinar si una sección está activa para el estilo
  const isSectionActive = (sectionId: string) => {
    return activeSectionId === sectionId;
  };

  // Sincronizar con la ruta actual
  useEffect(() => {
    const sectionId = getActiveSectionFromPath();
    setActiveSectionId(sectionId);
    setActiveLinkPath(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleSectionChange = (sectionId: string | undefined) => {
    // Si se recibe undefined, significa que se está colapsando la categoría actual
    if (!sectionId) {
      setActiveSectionId(undefined);
      return;
    }
    
    // Si está contraída y se hace clic en la categoría ya seleccionada, expandir
    if (!isOpen && sectionId === activeSectionId) {
      onToggle();
      return;
    }
    // Si está contraída y se selecciona otra categoría, expandir y cambiar
    if (!isOpen && sectionId !== activeSectionId) {
      setActiveSectionId(sectionId);
      onToggle();
      return;
    }
    // Si está desplegada, cambiar la categoría (si es la misma, colapsar)
    // El Accordion maneja el colapso automáticamente, así que solo necesitamos actualizar el estado
    if (sectionId === activeSectionId) {
      // Si es la misma sección, colapsar
      setActiveSectionId(undefined);
    } else {
      // Si es otra sección, cambiar
      setActiveSectionId(sectionId);
    }
  };

  const handleLinkNavigate = (sectionId: string, linkPath: string) => {
    setActiveSectionId(sectionId);
    setActiveLinkPath(linkPath);
  };

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-40 h-screen border-r border-gray-200 bg-white shadow-[0_0_30px_rgba(15,23,42,0.08)] transition-[width] duration-300 ease-in-out flex flex-col'
      )}
      style={{ width }}
    >
      {/* Header con botón Ana-OS */}
      {isOpen ? (
        <div className="flex h-16 items-center border-b border-gray-200 px-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-slate-900 shadow-sm transition hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
            aria-label="Panel Ana-OS"
          >
            <Home className="h-4 w-4" />
            <span className="text-sm font-semibold">Ana-OS</span>
          </Link>
        </div>
      ) : (
        <div className="flex h-16 items-center justify-center border-b border-gray-200 px-3">
          <Link
            to="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-slate-900 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
            aria-label="Panel Ana-OS"
          >
            <Home className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {isOpen ? (
          // Vista desplegada - Rediseñada
          <div className="px-4 py-4 space-y-3">
            {/* Botón de contraer arriba de cooperativas */}
            <div className="mb-2">
              <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
                aria-label="Esconder barra lateral"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Esconder barra</span>
              </button>
            </div>
            
            <Accordion
              type="single"
              collapsible
              value={activeSectionId}
              onValueChange={(value) => handleSectionChange(value)}
            >
              {(allowedSections.length > 0 ? allowedSections : sidebarSections).map((section) => {
                const isActive = isSectionActive(section.id);
                const hasActiveLink = section.links.some((link) => link.path === activeLinkPath);
                
                return (
                  <AccordionItem key={section.id} value={section.id} className="border-none">
                    <div
                      className={cn(
                        'rounded-xl border transition-all',
                        isActive || hasActiveLink
                          ? `${section.theme.accentBorder} ${section.theme.accentBg} shadow-md`
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      )}
                    >
                      <AccordionTrigger className="px-4 py-3 text-left hover:no-underline">
                        <div className="flex items-center gap-3 w-full">
                          <span
                            className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold uppercase tracking-wide shrink-0',
                              isActive || hasActiveLink
                                ? `${section.theme.accentBg} ${section.theme.accent}`
                                : 'bg-gray-100 text-gray-600'
                            )}
                          >
                            {section.shortLabel}
                          </span>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-semibold text-slate-800">{section.title}</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-0">
                        <div className="flex flex-col gap-2 mt-2">
                          {section.links.map((link) => {
                            const isLinkActive = activeLinkPath === link.path && activeSectionId === section.id;
                            return (
                              <Link
                                key={link.label}
                                to={link.path}
                                onClick={() => handleLinkNavigate(section.id, link.path)}
                                className={cn(
                                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                  isLinkActive
                                    ? `${section.theme.accentBg} ${section.theme.accent} shadow-sm ring-1 ${section.theme.accentBorder}`
                                    : 'text-slate-700 hover:bg-gray-50'
                                )}
                              >
                                <link.icon className={cn('h-4 w-4 shrink-0', isLinkActive ? section.theme.accent : 'text-gray-500')} />
                                <span>{link.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </div>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        ) : (
          // Vista contraída - Mejorada
          <div className="flex flex-col py-4 px-2">
            {/* Categorías con sus subcategorías visibles */}
            <div className="flex flex-col gap-2">
              {(allowedSections.length > 0 ? allowedSections : sidebarSections).map((section, index) => {
                const isFirstSection = index === 0;
                const isSectionActiveValue = isSectionActive(section.id);
                const sectionLinks = section.links;
                const hasActiveLink = sectionLinks.some((link) => link.path === activeLinkPath);
                
                return (
                  <div key={section.id} className="flex flex-col gap-1">
                    {/* Botón de expandir arriba de cooperativas (primera categoría) */}
                    {isFirstSection && (
                      <div className="mb-2">
                        <button
                          type="button"
                          onClick={onToggle}
                          className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white py-2 text-gray-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
                          aria-label="Expandir barra lateral"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    
                    {/* Botón de categoría */}
                    <button
                      type="button"
                      onClick={() => handleSectionChange(section.id)}
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl border text-[10px] font-bold uppercase tracking-[0.15em] transition-all',
                        isSectionActiveValue || hasActiveLink
                          ? `${section.theme.accentBorder} ${section.theme.accentBg} ${section.theme.accent} shadow-md`
                          : 'border-gray-200 bg-slate-50 text-gray-500 hover:border-gray-300 hover:bg-white'
                      )}
                      title={section.title}
                    >
                      {section.shortLabel}
                    </button>
                    
                    {/* Subcategorías debajo de la categoría seleccionada - solo visibles cuando está activa */}
                    {isSectionActiveValue && (
                      <div className="flex flex-col gap-1.5 mt-1.5 ml-0">
                        {sectionLinks.map((link) => {
                          const isLinkActive = activeLinkPath === link.path;
                          return (
                            <Link
                              key={link.label}
                              to={link.path}
                              onClick={() => handleLinkNavigate(section.id, link.path)}
                              className={cn(
                                'flex h-9 w-9 items-center justify-center rounded-lg border transition-all',
                                isLinkActive
                                  ? `${section.theme.accentBorder} ${section.theme.accentBg} ${section.theme.accent} shadow-sm ring-1`
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                              )}
                              title={link.label}
                            >
                              <link.icon className="h-4 w-4" aria-hidden="true" />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

