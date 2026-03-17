import { Head } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Shield, Key, Lock, Smartphone, Clock } from 'lucide-react'

export default function AdminSecuritySettings() {
    return (
        <>
            <Head title="Security Settings" />

            <div className="max-w-2xl mx-auto p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div>
                        <h1 className="text-2xl font-semibold text-white">
                            Security Settings
                        </h1>
                        <p className="text-zinc-400 mt-1">
                            Manage security preferences for the admin panel.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                                    <Key className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                                    <p className="text-zinc-400 text-sm">Require 2FA for all admin accounts</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                                    <Lock className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">Session Timeout</h3>
                                    <p className="text-zinc-400 text-sm">Auto-logout after inactivity</p>
                                </div>
                                <select className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2">
                                    <option>15 minutes</option>
                                    <option>30 minutes</option>
                                    <option>1 hour</option>
                                    <option>4 hours</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                                    <Smartphone className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">IP Whitelist</h3>
                                    <p className="text-zinc-400 text-sm">Restrict admin access to specific IPs</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">Login Attempt Limits</h3>
                                    <p className="text-zinc-400 text-sm">Max failed attempts before lockout</p>
                                </div>
                                <select className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2">
                                    <option>3 attempts</option>
                                    <option>5 attempts</option>
                                    <option>10 attempts</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    )
}
