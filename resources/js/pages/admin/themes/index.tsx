import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Palette, Plus, Trash2 } from 'lucide-react';

interface Theme {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
}

interface Props {
    themes: Theme[];
    colors: Record<string, string>;
}

export default function ThemesIndex({ themes, colors }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

    const activateTheme = (id: string) => {
        router.post(`/secure-admin/themes/${id}/activate`);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Theme Management</h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Manage your application themes and color schemes
                        </p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Theme
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Theme</DialogTitle>
                                <DialogDescription>
                                    Create a custom theme with your preferred colors
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Theme Name</Label>
                                    <Input id="name" placeholder="My Custom Theme" />
                                </div>
                                <Button className="w-full" onClick={() => setIsCreateOpen(false)}>
                                    Create Theme
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {themes.map((theme) => (
                        <Card key={theme.id} className={theme.is_active ? 'border-indigo-500' : ''}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg">{theme.name}</CardTitle>
                                {theme.is_active && (
                                    <Badge variant="default" className="bg-indigo-500">
                                        Active
                                    </Badge>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 flex gap-2">
                                    <div
                                        className="h-8 w-8 rounded-full"
                                        style={{ backgroundColor: colors.primary }}
                                    />
                                    <div
                                        className="h-8 w-8 rounded-full"
                                        style={{ backgroundColor: colors.secondary }}
                                    />
                                    <div
                                        className="h-8 w-8 rounded-full"
                                        style={{ backgroundColor: colors.accent }}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => setSelectedTheme(theme)}
                                    >
                                        <Palette className="mr-2 h-4 w-4" />
                                        Customize
                                    </Button>
                                    {!theme.is_active && (
                                        <Button
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => activateTheme(theme.id)}
                                        >
                                            <Check className="mr-2 h-4 w-4" />
                                            Activate
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Access theme settings and customization options
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <Button
                            variant="outline"
                            className="h-20 flex-col gap-2"
                            onClick={() => router.get('/secure-admin/themes/settings')}
                        >
                            <Palette className="h-6 w-6" />
                            Theme Settings
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex-col gap-2"
                            onClick={() => router.get('/secure-admin/themes/colors')}
                        >
                            <Palette className="h-6 w-6" />
                            Color Customizer
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex-col gap-2"
                            onClick={() => router.get('/secure-admin/themes/landing')}
                        >
                            <Palette className="h-6 w-6" />
                            Landing Theme
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
