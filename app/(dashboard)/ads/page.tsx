"use client";

import { Plus, MoreVertical, Play, Pause, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";

const campaigns = [
    { id: 1, name: "Promo Verano", type: "Banner Home", status: "Active", impressions: "12.5k", clicks: "450", ctr: "3.6%" },
    { id: 2, name: "Upgrade Premium", type: "Pop-up Post-Session", status: "Active", impressions: "8.2k", clicks: "890", ctr: "10.8%" },
    { id: 3, name: "Black Friday", type: "Banner Home", status: "Scheduled", impressions: "-", clicks: "-", ctr: "-" },
];

export default function AdsPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Publicidad Interna"
                description="Gestiona campañas para usuarios gratuitos."
                action={
                    <Button>
                        <Plus className="h-4 w-4" />
                        Nueva Campaña
                    </Button>
                }
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.map((ad) => (
                    <Card key={ad.id} padding="none" className="overflow-hidden">
                        <div className="h-32 bg-muted flex items-center justify-center relative">
                            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
                                {ad.type}
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold font-heading text-foreground">{ad.name}</h3>
                                <StatusPill tone={ad.status === 'Active' ? 'success' : 'warning'}>
                                    {ad.status}
                                </StatusPill>
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
                                    <p className="font-bold text-sm text-success">{ad.ctr}</p>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button className="flex-1 py-1.5 text-xs font-medium border border-border rounded hover:bg-muted">Editar</button>
                                <button className="flex-1 py-1.5 text-xs font-medium border border-border rounded hover:bg-muted">Pausar</button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
