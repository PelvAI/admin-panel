import { Users, Activity, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  {
    label: "MRR (Ingresos Recurrentes)",
    value: "$12,450",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    label: "Usuarios Activos (MAU)",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    label: "Tasa de Churn",
    value: "2.4%",
    change: "-0.5%",
    trend: "down", // Good for churn
    icon: Activity,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    label: "NPS (Satisfacción)",
    value: "72",
    change: "+4",
    trend: "up",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
];

const alerts = [
  { id: 1, type: "warning", message: "Tasa de rebote alta en onboarding (15%)", time: "Hace 2h" },
  { id: 2, type: "info", message: "Nuevo pico de tráfico detectado", time: "Hace 4h" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading text-foreground">CEO Dashboard</h2>
          <p className="text-muted-foreground">Visión general de salud del negocio y métricas clave.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-border rounded-lg px-3 py-2 text-sm">
            <option>Últimos 30 días</option>
            <option>Este Trimestre</option>
            <option>Este Año</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className={`p-2.5 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-end justify-between pt-4">
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' || (stat.label.includes('Churn') && stat.trend === 'down') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4 ml-1" /> : <ArrowDownRight className="h-4 w-4 ml-1" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart Area */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-heading">Crecimiento de Ingresos</h3>
            <button className="text-sm text-primary font-medium hover:underline">Ver reporte completo</button>
          </div>
          <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground">Gráfico de Ingresos vs Costos (Placeholder)</p>
          </div>
        </div>

        {/* Alerts & Activity */}
        <div className="col-span-3 space-y-6">
          {/* Critical Alerts */}
          <div className="rounded-xl border border-red-100 bg-red-50/50 p-6 shadow-sm">
            <h3 className="text-lg font-bold font-heading text-red-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Atención Requerida
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                  <div className="h-2 w-2 mt-2 rounded-full bg-red-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Signups */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold font-heading mb-4">Nuevos Usuarios</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-500 font-bold text-sm">
                    U{i}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Usuario Nuevo {i}</p>
                    <p className="text-xs text-muted-foreground">Plan Gratuito</p>
                  </div>
                  <div className="text-xs text-muted-foreground">Hace 1h</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
