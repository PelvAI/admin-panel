"use client";

import { Plus, MoreVertical, Play, Pause, Edit2, Trash2, Image as ImageIcon } from "lucide-react";

const campaigns = [
    { id: 1, name: "Promo Verano", type: "Banner Home", status: "Active", impressions: "12.5k", clicks: "450", ctr: "3.6%" },
    { id: 2, name: "Upgrade Premium", type: "Pop-up Post-Session", status: "Active", impressions: "8.2k", clicks: "890", ctr: "10.8%" },
    { id: 3, name: "Black Friday", type: "Banner Home", status: "Scheduled", impressions: "-", clicks: "-", ctr: "-" },
];

export default function AdsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-heading text-foreground">Publicidad Interna</h2>
                    <p className="text-muted-foreground">Gestiona campañas para usuarios gratuitos.</p>
                </div>
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nueva Campaña
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.map((ad) => (
                    <div key={ad.id} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="h-32 bg-muted flex items-center justify-center relative">
                            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
                                {ad.type}
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-foreground">{ad.name}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ad.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {ad.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                                <div className="p-2 bg-muted/30 rounded-lg">
                                    <p className="text-xs text-muted-foreground">Vistas</p>
                                    <p className="font-bold text-sm">{ad.impressions}</p>
                                </div>
                                <div className="p-2 bg-muted/30 rounded-lg">
                                    <p className="text-xs text-muted-foreground">Clicks</p>
                                    <p className="font-bold text-sm">{ad.clicks}</p>
                                </div>
                                <div className="p-2 bg-muted/30 rounded-lg">
                                    <p className="text-xs text-muted-foreground">CTR</p>
                                    <p className="font-bold text-sm text-green-600">{ad.ctr}</p>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button className="flex-1 py-1.5 text-xs font-medium border border-border rounded hover:bg-muted">Editar</button>
                                <button className="flex-1 py-1.5 text-xs font-medium border border-border rounded hover:bg-muted">Pausar</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
