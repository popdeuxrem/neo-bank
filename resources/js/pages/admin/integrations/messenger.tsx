import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, ExternalLink } from 'lucide-react';

export default function MessengerIntegration() {
    const [config, setConfig] = useState({
        enabled: false,
        pageId: '',
        language: 'en_US',
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
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Messenger Integration</h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Add Facebook Messenger chat to your website
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>
                            Enter your Facebook Page ID to enable Messenger chat
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <p className="font-medium">Enable Messenger</p>
                                <p className="text-sm text-slate-500">Show Messenger chat on website</p>
                            </div>
                            <Switch
                                checked={config.enabled}
                                onCheckedChange={(checked: boolean) => setConfig({ ...config, enabled: checked })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pageId">Facebook Page ID</Label>
                            <Input
                                id="pageId"
                                placeholder="1234567890"
                                value={config.pageId}
                                onChange={(e) => setConfig({ ...config, pageId: e.target.value })}
                            />
                            <p className="text-sm text-slate-500">
                                Find this in your Facebook Page Settings
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Input
                                id="language"
                                placeholder="en_US"
                                value={config.language}
                                onChange={(e) => setConfig({ ...config, language: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button onClick={handleSave} disabled={saving}>
                                <Save className="mr-2 h-4 w-4" />
                                {saving ? 'Saving...' : 'Save Configuration'}
                            </Button>
                            <Button variant="outline" asChild>
                                <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Facebook Business
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
