import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, RefreshCw } from 'lucide-react';

interface Props {
    colors: Record<string, string>;
    presets: Array<{ name: string; primary: string; secondary: string }>;
}

export default function ThemeColors({ colors, presets }: Props) {
    const [currentColors, setCurrentColors] = useState(colors);
    const [saving, setSaving] = useState(false);

    const handleColorChange = (key: string, value: string) => {
        setCurrentColors((prev) => ({ ...prev, [key]: value }));
    };

    const saveColors = () => {
        setSaving(true);
        router.post(
            '/secure-admin/themes/colors',
            { colors: currentColors },
            {
                onFinish: () => setSaving(false),
            }
        );
    };

    const applyPreset = (preset: { primary: string; secondary: string }) => {
        setCurrentColors((prev) => ({
            ...prev,
            primary: preset.primary,
            secondary: preset.secondary,
        }));
    };

    const colorFields = [
        { key: 'primary', label: 'Primary Color' },
        { key: 'secondary', label: 'Secondary Color' },
        { key: 'accent', label: 'Accent Color' },
        { key: 'success', label: 'Success Color' },
        { key: 'warning', label: 'Warning Color' },
        { key: 'danger', label: 'Danger Color' },
        { key: 'info', label: 'Info Color' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Color Customizer</h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Customize the color scheme for your application
                        </p>
                    </div>
                    <Button onClick={saveColors} disabled={saving}>
                        {saving ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Check className="mr-2 h-4 w-4" />
                        )}
                        Save Changes
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Custom Colors</CardTitle>
                            <CardDescription>
                                Manually adjust each color value
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {colorFields.map((field) => (
                                <div key={field.key} className="flex items-center justify-between">
                                    <Label htmlFor={field.key} className="w-32">
                                        {field.label}
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="color"
                                            id={field.key}
                                            value={currentColors[field.key]}
                                            onChange={(e) => handleColorChange(field.key, e.target.value)}
                                            className="h-10 w-20 cursor-pointer"
                                        />
                                        <Input
                                            type="text"
                                            value={currentColors[field.key]}
                                            onChange={(e) => handleColorChange(field.key, e.target.value)}
                                            className="w-28 font-mono"
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Color Presets</CardTitle>
                            <CardDescription>
                                Quick-start color combinations
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {presets.map((preset) => (
                                <div
                                    key={preset.name}
                                    className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                                    onClick={() => applyPreset(preset)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-8 w-8 rounded-full"
                                            style={{ backgroundColor: preset.primary }}
                                        />
                                        <div
                                            className="h-8 w-8 rounded-full"
                                            style={{ backgroundColor: preset.secondary }}
                                        />
                                        <span className="font-medium">{preset.name}</span>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        Apply
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                        <CardDescription>
                            See how your colors will look
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg p-6" style={{ backgroundColor: '#f8fafc' }}>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <Button style={{ backgroundColor: currentColors.primary }}>
                                        Primary Button
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        style={{ backgroundColor: currentColors.secondary }}
                                    >
                                        Secondary
                                    </Button>
                                    <Button
                                        variant="outline"
                                        style={{ borderColor: currentColors.accent, color: currentColors.accent }}
                                    >
                                        Accent
                                    </Button>
                                </div>
                                <div className="flex gap-4">
                                    <span
                                        className="rounded-full px-3 py-1 text-sm text-white"
                                        style={{ backgroundColor: currentColors.success }}
                                    >
                                        Success
                                    </span>
                                    <span
                                        className="rounded-full px-3 py-1 text-sm text-white"
                                        style={{ backgroundColor: currentColors.warning }}
                                    >
                                        Warning
                                    </span>
                                    <span
                                        className="rounded-full px-3 py-1 text-sm text-white"
                                        style={{ backgroundColor: currentColors.danger }}
                                    >
                                        Danger
                                    </span>
                                    <span
                                        className="rounded-full px-3 py-1 text-sm text-white"
                                        style={{ backgroundColor: currentColors.info }}
                                    >
                                        Info
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
