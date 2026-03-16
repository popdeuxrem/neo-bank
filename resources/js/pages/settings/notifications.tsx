import { motion } from 'framer-motion';
import { Bell, Mail, Smartphone, AlertTriangle, Shield, Settings, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layouts/user-layout';

interface NotificationSetting {
    id: string;
    label: string;
    description: string;
    email: boolean;
    push: boolean;
    sms: boolean;
}

const initialSettings: NotificationSetting[] = [
    {
        id: 'transactions',
        label: 'Transaction Alerts',
        description: 'Get notified about incoming and outgoing transactions',
        email: true,
        push: true,
        sms: false,
    },
    {
        id: 'login',
        label: 'Login Alerts',
        description: 'Security alerts for new device logins',
        email: true,
        push: true,
        sms: true,
    },
    {
        id: 'payments',
        label: 'Payment Reminders',
        description: 'Reminders for scheduled payments and bills',
        email: true,
        push: true,
        sms: false,
    },
    {
        id: 'kyc',
        label: 'KYC Updates',
        description: 'Verification status and document requests',
        email: true,
        push: true,
        sms: false,
    },
    {
        id: 'promotions',
        label: 'Promotions & Offers',
        description: 'Special offers and promotional content',
        email: false,
        push: true,
        sms: false,
    },
    {
        id: 'security',
        label: 'Security Alerts',
        description: 'Important security notifications',
        email: true,
        push: true,
        sms: true,
    },
    {
        id: 'maintenance',
        label: 'System Maintenance',
        description: 'Scheduled maintenance notifications',
        email: true,
        push: false,
        sms: false,
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Notifications() {
    const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings);
    const [saving, setSaving] = useState<string | null>(null);

    const handleToggle = async (settingId: string, channel: 'email' | 'push' | 'sms') => {
        setSaving(settingId);
        
        setSettings(prev => prev.map(setting => {
            if (setting.id === settingId) {
                return { ...setting, [channel]: !setting[channel] };
            }

            return setting;
        }));

        await new Promise(resolve => setTimeout(resolve, 500));
        setSaving(null);
        toast.success('Notification preference updated');
    };

    return (
        <UserLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Notification Preferences</h1>
                    <p className="text-sm text-zinc-400">Choose how you want to be notified</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-4 flex items-center gap-2">
                        <Bell className="h-5 w-5 text-indigo-400" />
                        <h2 className="text-lg font-semibold text-white">Notification Channels</h2>
                    </div>
                    
                    <div className="mb-6 overflow-x-auto">
                        <table className="w-full min-w-[500px]">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="pb-3 text-left text-sm font-medium text-zinc-400">Notification Type</th>
                                    <th className="pb-3 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <Mail className="h-4 w-4 text-zinc-400" />
                                            <span className="text-xs text-zinc-500">Email</span>
                                        </div>
                                    </th>
                                    <th className="pb-3 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <Bell className="h-4 w-4 text-zinc-400" />
                                            <span className="text-xs text-zinc-500">Push</span>
                                        </div>
                                    </th>
                                    <th className="pb-3 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <Smartphone className="h-4 w-4 text-zinc-400" />
                                            <span className="text-xs text-zinc-500">SMS</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {settings.map((setting, index) => (
                                    <motion.tr
                                        key={setting.id}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeUp}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-white/5"
                                    >
                                        <td className="py-4 pr-4">
                                            <div>
                                                <p className="font-medium text-white">{setting.label}</p>
                                                <p className="text-xs text-zinc-500">{setting.description}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 text-center">
                                            <button
                                                onClick={() => handleToggle(setting.id, 'email')}
                                                disabled={saving === setting.id}
                                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                                    setting.email ? 'bg-indigo-500' : 'bg-zinc-600'
                                                } ${saving === setting.id ? 'opacity-50' : ''}`}
                                            >
                                                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                                    setting.email ? 'translate-x-5' : 'translate-x-0'
                                                }`} />
                                            </button>
                                        </td>
                                        <td className="py-4 text-center">
                                            <button
                                                onClick={() => handleToggle(setting.id, 'push')}
                                                disabled={saving === setting.id}
                                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                                    setting.push ? 'bg-indigo-500' : 'bg-zinc-600'
                                                } ${saving === setting.id ? 'opacity-50' : ''}`}
                                            >
                                                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                                    setting.push ? 'translate-x-5' : 'translate-x-0'
                                                }`} />
                                            </button>
                                        </td>
                                        <td className="py-4 text-center">
                                            <button
                                                onClick={() => handleToggle(setting.id, 'sms')}
                                                disabled={saving === setting.id}
                                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                                    setting.sms ? 'bg-indigo-500' : 'bg-zinc-600'
                                                } ${saving === setting.id ? 'opacity-50' : ''}`}
                                            >
                                                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                                    setting.sms ? 'translate-x-5' : 'translate-x-0'
                                                }`} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="h-6 w-6 text-amber-400" />
                        <div>
                            <h3 className="font-semibold text-amber-400">Important Security Notice</h3>
                            <p className="mt-1 text-sm text-zinc-400">
                                Some notifications like security alerts and login alerts cannot be disabled for your protection.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" className="border-white/10">
                        Reset to Defaults
                    </Button>
                    <Button className="bg-indigo-500 hover:bg-indigo-600">
                        <CheckCircle className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>
        </UserLayout>
    );
}
