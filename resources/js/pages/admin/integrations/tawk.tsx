import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, ExternalLink } from 'lucide-react';

export default function TawkIntegration() {
    const [config, setConfig] = useState({
        enabled: false,
        propertyId: '',
        widgetId: '',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1000);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tawk.to Chat</h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Integrate Tawk.to live chat on your website
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>
                            Enter your Tawk.to credentials
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <p className="font-medium">Enable Tawk.to</p>
                                <p className="text-sm text-slate-500">Show chat widget on website</p>
                            </div>
                            <Switch
                                checked={config.enabled}
                                onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="propertyId">Property ID</Label>
                            <Input
                                id="propertyId"
                                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                value={config.propertyId}
                                onChange={(e) => setConfig({ ...config, propertyId: e.target.value })}
                            />
                            <p className="text-sm text-slate-500">
                                Found in Tawk.to dashboard → Administration → Properties
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="widgetId">Widget ID</Label>
                            <Input
                                id="widgetId"
                                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                value={config.widgetId}
                                onChange={(e) => setConfig({ ...config, widgetId: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button onClick={handleSave} disabled={saving}>
                                <Save className="mr-2 h-4 w-4" />
                                {saving ? 'Saving...' : 'Save Configuration'}
                            </Button>
                            <Button variant="outline" asChild>
                                <a href="https://www.tawk.to" target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Tawk.to Dashboard
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
