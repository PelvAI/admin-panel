import { Users, Activity, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

/**
 * Las 4 tarjetas KPI tenían cada una un color de ícono distinto (verde,
 * azul, morado, naranja) sin ningún criterio — con el único propósito de
 * "que se vean distintas". El manual es explícito: Sage es el color de
 * "ciencia, datos" — exactamente lo que son estas cuatro tarjetas. Un
 * solo tono consistente en vez de arcoíris.
 */
const stats = [
  {
    label: "MRR (Ingresos Recurrentes)",
    value: "$12,450",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Usuarios Activos (MAU)",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Tasa de Churn",
    value: "2.4%",
    change: "-0.5%",
    trend: "down", // Good for churn
    icon: Activity,
  },
  {
    label: "NPS (Satisfacción)",
    value: "72",
    change: "+4",
    trend: "up",
    icon: TrendingUp,
  },
];

const alerts: { id: number; type: "warning" | "info"; message: string; time: string }[] = [
  { id: 1, type: "warning", message: "Tasa de rebote alta en onboarding (15%)", time: "Hace 2h" },
  { id: 2, type: "info", message: "Nuevo pico de tráfico detectado", time: "Hace 4h" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="CEO Dashboard"
        description="Visión general de salud del negocio y métricas clave."
        action={
          <select className="bg-white border border-border rounded-lg px-3 py-2 text-sm">
            <option>Últimos 30 días</option>
            <option>Este Trimestre</option>
            <option>Este Año</option>
          </select>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className="p-2.5 rounded-full bg-success-wash">
                <stat.icon className="h-5 w-5 text-success" />
              </div>
            </div>
            <div className="flex items-end justify-between pt-4">
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' || (stat.label.includes('Churn') && stat.trend === 'down') ? 'text-success' : 'text-danger'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4 ml-1" /> : <ArrowDownRight className="h-4 w-4 ml-1" />}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart Area */}
        <Card className="col-span-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-heading">Crecimiento de Ingresos</h3>
            <button className="text-sm text-primary font-medium hover:underline">Ver reporte completo</button>
          </div>
          <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground">Gráfico de Ingresos vs Costos (Placeholder)</p>
          </div>
        </Card>

        {/* Alerts & Activity */}
        <div className="col-span-3 space-y-6">
          {/* Critical Alerts */}
          <Card className="border-warning/20 bg-warning-wash">
            <h3 className="text-lg font-bold font-heading text-gold-ink mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Atención Requerida
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 bg-card p-3 rounded-lg border border-border shadow-sm">
                  <div className={`h-2 w-2 mt-2 rounded-full shrink-0 ${alert.type === "warning" ? "bg-warning" : "bg-info"}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Signups */}
          <Card>
            <h3 className="text-lg font-bold font-heading mb-4">Nuevos Usuarios</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-identity-wash flex items-center justify-center text-identity font-bold text-sm">
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
          </Card>
        </div>
      </div>
    </div>
  );
}
