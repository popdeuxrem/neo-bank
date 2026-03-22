import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';

interface LandingConfig {
    hero_enabled: boolean;
    features_enabled: boolean;
    pricing_enabled: boolean;
    testimonials_enabled: boolean;
    cta_enabled: boolean;
}

interface Props {
    landing: LandingConfig;
}

export default function ThemeLanding({ landing }: Props) {
    const [config, setConfig] = useState(landing);
    const [saving, setSaving] = useState(false);

    const toggleConfig = (key: keyof LandingConfig) => {
        setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const saveConfig = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1000);
    };

    const sections = [
        { key: 'hero_enabled', label: 'Hero Section', description: 'Main landing page hero with headline and CTA' },
        { key: 'features_enabled', label: 'Features Section', description: 'Product features and benefits' },
        { key: 'pricing_enabled', label: 'Pricing Section', description: 'Pricing plans and tiers' },
        { key: 'testimonials_enabled', label: 'Testimonials Section', description: 'Customer testimonials and reviews' },
        { key: 'cta_enabled', label: 'Call-to-Action Section', description: 'Final CTA for conversions' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Landing Page Theme</h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Configure which sections are displayed on your landing page
                        </p>
                    </div>
                    <Button onClick={saveConfig} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Section Visibility</CardTitle>
                        <CardDescription>
                            Toggle visibility of each landing page section
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {sections.map((section) => (
                            <div
                                key={section.key}
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <div>
                                    <p className="font-medium">{section.label}</p>
                                    <p className="text-sm text-slate-500">{section.description}</p>
                                </div>
                                <Switch
                                    checked={config[section.key]}
                                    onCheckedChange={() => toggleConfig(section.key)}
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                        <CardDescription>
                            Visual preview of enabled sections
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border bg-slate-50 p-8 dark:bg-slate-900">
                            <div className="space-y-4">
                                {config.hero_enabled && (
                                    <div className="rounded bg-indigo-600 p-4 text-center text-white">
                                        Hero Section
                                    </div>
                                )}
                                {config.features_enabled && (
                                    <div className="rounded bg-slate-200 p-4 text-center dark:bg-slate-800">
                                        Features Section
                                    </div>
                                )}
                                {config.pricing_enabled && (
                                    <div className="rounded bg-slate-200 p-4 text-center dark:bg-slate-800">
                                        Pricing Section
                                    </div>
                                )}
                                {config.testimonials_enabled && (
                                    <div className="rounded bg-slate-200 p-4 text-center dark:bg-slate-800">
                                        Testimonials Section
                                    </div>
                                )}
                                {config.cta_enabled && (
                                    <div className="rounded bg-indigo-600 p-4 text-center text-white">
                                        CTA Section
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
