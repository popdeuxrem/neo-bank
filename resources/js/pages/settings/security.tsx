import { motion } from 'framer-motion';
import { 
    Shield, 
    Key, 
    Smartphone, 
    Monitor, 
    Globe, 
    Clock, 
    Trash2, 
    CheckCircle,
    AlertTriangle,
    Copy,
    RefreshCw
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserLayout from '@/layouts/user-layout';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const sessions = [
    { id: '1', device: 'MacBook Pro', browser: 'Chrome', location: 'New York, US', lastActive: '2 hours ago', current: true },
    { id: '2', device: 'iPhone 14 Pro', browser: 'Safari', location: 'New York, US', lastActive: '1 day ago', current: false },
    { id: '3', device: 'Windows PC', browser: 'Firefox', location: 'Brooklyn, US', lastActive: '3 days ago', current: false },
];

const loginHistory = [
    { id: '1', device: 'MacBook Pro', browser: 'Chrome', location: 'New York, US', ip: '192.168.1.1', time: '2 hours ago', success: true },
    { id: '2', device: 'iPhone 14 Pro', browser: 'Safari', location: 'New York, US', ip: '192.168.1.1', time: '1 day ago', success: true },
    { id: '3', device: 'Windows PC', browser: 'Firefox', location: 'Brooklyn, US', ip: '192.168.1.45', time: '3 days ago', success: true },
    { id: '4', device: 'Unknown', browser: 'Chrome', location: 'Moscow, RU', ip: '185.143.xxx.xxx', time: '5 days ago', success: false },
    { id: '5', device: 'MacBook Pro', browser: 'Chrome', location: 'New York, US', ip: '192.168.1.1', time: '1 week ago', success: true },
];

const backupCodes = [
    'ABCD-1234', 'EFGH-5678', 'IJKL-9012', 'MNOP-3456',
    'QRST-7890', 'UVWX-1234', 'YZAB-5678', 'CDEF-9012',
];

export default function Security() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [show2FASetup, setShow2FASetup] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [showBackupCodes, setShowBackupCodes] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const handlePasswordChange = async () => {
        if (passwordData.new !== passwordData.confirm) {
            toast.error('Passwords do not match');

            return;
        }

        setSavingPassword(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSavingPassword(false);
        setPasswordData({ current: '', new: '', confirm: '' });
        toast.success('Password updated successfully');
    };

    const handleEnable2FA = async () => {
        if (verificationCode.length !== 6) {
            toast.error('Please enter a valid 6-digit code');

            return;
        }

        setTwoFactorEnabled(true);
        setShow2FASetup(false);
        toast.success('Two-factor authentication enabled');
    };

    const copyBackupCodes = () => {
        navigator.clipboard.writeText(backupCodes.join('\n'));
        toast.success('Backup codes copied');
    };

    return (
        <UserLayout>
            <div className="space-y-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-bold text-white">Security Settings</h1>
                    <p className="text-sm text-zinc-400">Manage your account security</p>
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl"
                >
                    <h2 className="mb-4 text-lg font-semibold text-white">Change Password</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Current Password</Label>
                            <Input
                                type="password"
                                value={passwordData.current}
                                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                className="border-white/10 bg-zinc-800"
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-zinc-400">New Password</Label>
                                <Input
                                    type="password"
                                    value={passwordData.new}
                                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                    className="border-white/10 bg-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Confirm New Password</Label>
                                <Input
                                    type="password"
                                    value={passwordData.confirm}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                    className="border-white/10 bg-zinc-800"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                                <div className={`h-1.5 w-8 rounded-full ${passwordData.new.length >= 8 ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                                <div className={`h-1.5 w-8 rounded-full ${passwordData.new.match(/[A-Z]/) ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                                <div className={`h-1.5 w-8 rounded-full ${passwordData.new.match(/[0-9]/) ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                                <div className={`h-1.5 w-8 rounded-full ${passwordData.new.match(/[^A-Za-z0-9]/) ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                            </div>
                            <Button 
                                className="bg-indigo-500 hover:bg-indigo-600"
                                onClick={handlePasswordChange}
                                disabled={savingPassword || !passwordData.current || !passwordData.new}
                            >
                                {savingPassword ? 'Saving...' : 'Update Password'}
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
                                <Shield className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Two-Factor Authentication</h2>
                                <p className="text-sm text-zinc-400">Add an extra layer of security to your account</p>
                            </div>
                        </div>
                        <Badge className={twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'}>
                            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                    </div>

                    {!show2FASetup ? (
                        <div className="mt-6">
                            {!twoFactorEnabled ? (
                                <Button className="bg-indigo-500 hover:bg-indigo-600" onClick={() => setShow2FASetup(true)}>
                                    <Key className="mr-2 h-4 w-4" /> Enable 2FA
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    <div className="rounded-lg bg-emerald-500/10 p-4">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                                            <span className="text-emerald-400">Your account is protected with 2FA</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="border-white/10" onClick={() => setShowBackupCodes(true)}>
                                            <Copy className="mr-2 h-4 w-4" /> View Backup Codes
                                        </Button>
                                        <Button variant="outline" className="border-white/10 text-rose-400 hover:bg-rose-500/10" onClick={() => setTwoFactorEnabled(false)}>
                                            Disable 2FA
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-6 space-y-4">
                            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                                <p className="text-sm text-zinc-400 mb-2">Scan this QR code with your authenticator app</p>
                                <div className="h-32 w-32 rounded-lg bg-white/10 flex items-center justify-center">
                                    <Smartphone className="h-8 w-8 text-zinc-500" />
                                </div>
                            </div>
                            <div>
                                <Label className="text-zinc-400">Enter 6-digit code</Label>
                                <Input
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    className="border-white/10 bg-zinc-800 text-center text-2xl tracking-widest"
                                    maxLength={6}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button className="bg-indigo-500 hover:bg-indigo-600" onClick={handleEnable2FA}>
                                    Verify & Enable
                                </Button>
                                <Button variant="ghost" onClick={() => setShow2FASetup(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {showBackupCodes && (
                        <div className="mt-6 rounded-lg border border-white/10 bg-zinc-800/50 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-white">Backup Codes</h3>
                                <Button variant="ghost" size="sm" onClick={copyBackupCodes}>
                                    <Copy className="mr-2 h-4 w-4" /> Copy All
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {backupCodes.map((code) => (
                                    <code key={code} className="font-mono text-sm text-zinc-400 bg-white/5 px-2 py-1 rounded">
                                        {code}
                                    </code>
                                ))}
                            </div>
                            <p className="mt-4 text-xs text-zinc-500">
                                Store these codes in a safe place. You can use them to access your account if you lose your phone.
                            </p>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                                <Monitor className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Active Sessions</h2>
                                <p className="text-sm text-zinc-400">Devices currently logged into your account</p>
                            </div>
                        </div>
                        <Button variant="outline" className="border-white/10 text-rose-400 hover:bg-rose-500/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Revoke All
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {sessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                                        <Monitor className="h-5 w-5 text-zinc-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">
                                            {session.device}
                                            {session.current && <Badge className="ml-2 bg-emerald-500/20 text-emerald-400">Current</Badge>}
                                        </p>
                                        <p className="text-xs text-zinc-500">{session.browser} • {session.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-zinc-500">{session.lastActive}</span>
                                    {!session.current && (
                                        <Button variant="ghost" size="sm" className="text-rose-400 hover:bg-rose-500/10">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                            <Clock className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Login History</h2>
                            <p className="text-sm text-zinc-400">Recent login activity on your account</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {loginHistory.map((login) => (
                            <div key={login.id} className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                        login.success ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                                    }`}>
                                        {login.success ? (
                                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                                        ) : (
                                            <AlertTriangle className="h-5 w-5 text-rose-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{login.device}</p>
                                        <p className="text-xs text-zinc-500">{login.browser} • {login.location} • {login.ip}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-zinc-500">{login.time}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </UserLayout>
    );
}
