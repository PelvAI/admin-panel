"use client";

import { CreditCard, Check, Edit } from "lucide-react";

const plans = [
    {
        name: "Gratuito",
        price: "$0",
        period: "/mes",
        features: ["Acceso a ejercicios básicos", "1 Evaluación mensual", "Publicidad incluida"],
        activeUsers: 850,
        color: "bg-gray-100",
        textColor: "text-gray-900"
    },
    {
        name: "Premium Mensual",
        price: "$9.99",
        period: "/mes",
        features: ["Todo ilimitado", "Sin publicidad", "Soporte prioritario", "AI Coach avanzado"],
        activeUsers: 320,
        color: "bg-primary/10",
        textColor: "text-primary",
        highlight: true
    },
    {
        name: "Premium Anual",
        price: "$89.99",
        period: "/año",
        features: ["Ahorras 25%", "Todo ilimitado", "Sin publicidad", "AI Coach avanzado"],
        activeUsers: 64,
        color: "bg-orange-50",
        textColor: "text-orange-700"
    }
];

export default function SubscriptionsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-heading text-foreground">Suscripciones</h2>
                    <p className="text-muted-foreground">Gestiona los planes de precios y beneficios.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                    <div key={plan.name} className={`relative rounded-xl border ${plan.highlight ? 'border-primary shadow-md' : 'border-border shadow-sm'} bg-card p-6 flex flex-col`}>
                        {plan.highlight && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
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
                                    <Check className="h-4 w-4 text-green-500" />
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
                    </div>
                ))}
            </div>
        </div>
    );
}
