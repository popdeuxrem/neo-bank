import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Camera, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserLayout from '@/layouts/user-layout';
import { toast } from 'sonner';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Profile() {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        phoneVerified: true,
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States',
        dob: '1990-01-15',
        occupation: 'Software Engineer',
    });

    const handleSave = async () => {
        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        setSaved(true);
        toast.success('Profile updated successfully');
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <UserLayout>
            <div className="space-y-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                    <p className="text-sm text-zinc-400">Manage your personal information</p>
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl"
                >
                    <div className="mb-6 flex items-center gap-6">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <User className="h-10 w-10 text-indigo-400" />
                            </div>
                            <button className="absolute bottom-0 right-0 rounded-full bg-indigo-500 p-2 text-white hover:bg-indigo-600">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">{profile.name}</h2>
                            <p className="text-sm text-zinc-400">PRO Member</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                    <Input
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="border-white/10 bg-zinc-800 pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                    <Input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="border-white/10 bg-zinc-800 pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                    <Input
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="border-white/10 bg-zinc-800 pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Date of Birth</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                    <Input
                                        type="date"
                                        value={profile.dob}
                                        onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                        className="border-white/10 bg-zinc-800 pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400">Street Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                <Input
                                    value={profile.address}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    className="border-white/10 bg-zinc-800 pl-10"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label className="text-zinc-400">City</Label>
                                <Input
                                    value={profile.city}
                                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                    className="border-white/10 bg-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400">State</Label>
                                <Input
                                    value={profile.state}
                                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                                    className="border-white/10 bg-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400">ZIP Code</Label>
                                <Input
                                    value={profile.zip}
                                    onChange={(e) => setProfile({ ...profile, zip: e.target.value })}
                                    className="border-white/10 bg-zinc-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400">Occupation</Label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                <Input
                                    value={profile.occupation}
                                    onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                                    className="border-white/10 bg-zinc-800 pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
                        <p className="text-sm text-zinc-500">
                            Last updated: March 10, 2026
                        </p>
                        <Button 
                            className="bg-indigo-500 hover:bg-indigo-600"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                'Saving...'
                            ) : saved ? (
                                <>
                                    <Check className="mr-2 h-4 w-4" /> Saved
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>

                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6">
                    <h3 className="font-semibold text-rose-400">Danger Zone</h3>
                    <p className="mt-1 text-sm text-zinc-400">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="outline" className="mt-4 border-rose-500/50 text-rose-400 hover:bg-rose-500/20">
                        Delete Account
                    </Button>
                </div>
            </div>
        </UserLayout>
    );
}
