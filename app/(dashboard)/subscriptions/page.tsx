"use client";

import { CreditCard, Check, Edit } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Gratuito",
        price: "$0",
        period: "/mes",
        features: ["Acceso a ejercicios básicos", "1 Evaluación mensual", "Publicidad incluida"],
        activeUsers: 850,
        textColor: "text-foreground"
    },
    {
        name: "Premium Mensual",
        price: "$9.99",
        period: "/mes",
        features: ["Todo ilimitado", "Sin publicidad", "Soporte prioritario", "AI Coach avanzado"],
        activeUsers: 320,
        textColor: "text-primary",
        highlight: true
    },
    {
        name: "Premium Anual",
        price: "$89.99",
        period: "/año",
        features: ["Ahorras 25%", "Todo ilimitado", "Sin publicidad", "AI Coach avanzado"],
        activeUsers: 64,
        textColor: "text-warning"
    }
];

export default function SubscriptionsPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Suscripciones"
                description="Gestiona los planes de precios y beneficios."
            />

            <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                    <Card
                        key={plan.name}
                        className={cn("relative flex flex-col", plan.highlight && "border-primary shadow-md")}
                    >
                        {plan.highlight && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                                Más Popular
                            </div>
                        )}

                        <div className="mb-4">
                            <h3 className="text-lg font-bold font-heading">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className={`text-3xl font-bold ${plan.textColor}`}>{plan.price}</span>
                                <span className="text-sm text-muted-foreground">{plan.period}</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-3 mb-6">
                            {plan.features.map((feat, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                    <Check className="h-4 w-4 text-success" />
                                    {feat}
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-4 border-t border-border">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-muted-foreground">Usuarios Activos</span>
                                <span className="font-bold">{plan.activeUsers}</span>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 py-2 border border-input rounded-lg hover:bg-muted transition-colors font-medium text-sm">
                                <Edit className="h-4 w-4" />
                                Editar Plan
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
