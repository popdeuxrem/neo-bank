import { Head, useForm, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { AlertTriangle, Lock, ArrowRight, Check, Copy } from 'lucide-react'

interface Props {
    currentPrefix: string
}

const RESERVED_WORDS = ['admin', 'api', 'login', 'logout', 'register', 'dashboard', 'app', 'assets', 'public', 'storage']

export default function AdminUrlSettings({ currentPrefix }: Props) {
    const [copied, setCopied] = useState(false)
    const adminPrefix = (usePage().props as any).adminPrefix

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        prefix: currentPrefix,
        current_prefix_confirm: '',
    })

    const isReservedWord = RESERVED_WORDS.includes(data.prefix.toLowerCase())
    const isValidLength = data.prefix.length >= 4 && data.prefix.length <= 30
    const isValidFormat = /^[a-z0-9\-]+$/.test(data.prefix)
    const canSubmit = isValidLength && isValidFormat && !isReservedWord && 
        data.current_prefix_confirm === currentPrefix && !processing

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        post(`/${adminPrefix}/settings/admin-url`, {
            preserveScroll: true,
        })
    }

    function copyNewUrl() {
        const newUrl = window.location.origin + '/' + data.prefix
        navigator.clipboard.writeText(newUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <>
            <Head title="Admin URL Settings" />

            <div className="max-w-2xl mx-auto p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div>
                        <h1 className="text-2xl font-semibold text-white">
                            Admin URL Settings
                        </h1>
                        <p className="text-zinc-400 mt-1">
                            Customize the URL prefix for accessing the admin panel.
                        </p>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                        <div className="flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-200">
                                <p className="font-medium mb-1">Changing this URL will immediately redirect you to the new address.</p>
                                <p>Bookmark the new URL before saving to avoid losing access.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                        <div className="mb-6">
                            <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                Current Admin URL
                            </label>
                            <div className="flex items-center gap-2 p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                                <Lock className="w-4 h-4 text-zinc-500" />
                                <span className="text-zinc-300 font-mono">
                                    {window.location.origin}/{currentPrefix}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                    New Prefix
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                                        {window.location.origin}/
                                    </span>
                                    <input
                                        type="text"
                                        value={data.prefix}
                                        onChange={e => setData('prefix', e.target.value)}
                                        className="w-full pl-[140px] pr-4 py-3 bg-zinc-950 border border-zinc-800 
                                            rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                        placeholder="secure-admin"
                                    />
                                </div>
                                <div className="mt-2 space-y-1">
                                    <div className={`text-xs flex items-center gap-1 ${
                                        isValidLength ? 'text-emerald-400' : 'text-zinc-500'
                                    }`}>
                                        {isValidLength ? <Check className="w-3 h-3" /> : <span className="w-3 h-3">○</span>}
                                        4-30 characters
                                    </div>
                                    <div className={`text-xs flex items-center gap-1 ${
                                        isValidFormat ? 'text-emerald-400' : 'text-zinc-500'
                                    }`}>
                                        {isValidFormat ? <Check className="w-3 h-3" /> : <span className="w-3 h-3">○</span>}
                                        Letters, numbers, and hyphens only
                                    </div>
                                    <div className={`text-xs flex items-center gap-1 ${
                                        !isReservedWord ? 'text-emerald-400' : 'text-amber-400'
                                    }`}>
                                        {isReservedWord ? <AlertTriangle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                        {isReservedWord ? 'Reserved word - cannot use' : 'Not a reserved word'}
                                    </div>
                                </div>
                                {errors.prefix && (
                                    <p className="text-rose-400 text-sm mt-2">{errors.prefix}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                    Confirm Current Prefix
                                </label>
                                <input
                                    type="text"
                                    value={data.current_prefix_confirm}
                                    onChange={e => setData('current_prefix_confirm', e.target.value)}
                                    placeholder={`Type "${currentPrefix}" to confirm`}
                                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 
                                        rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                />
                                {errors.current_prefix_confirm && (
                                    <p className="text-rose-400 text-sm mt-2">{errors.current_prefix_confirm}</p>
                                )}
                            </div>

                            {recentlySuccessful && (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-center gap-3">
                                    <Check className="w-5 h-5 text-emerald-400" />
                                    <div>
                                        <p className="text-emerald-300 font-medium">Admin URL updated!</p>
                                        <button
                                            type="button"
                                            onClick={copyNewUrl}
                                            className="text-emerald-400 text-sm underline flex items-center gap-1 mt-1"
                                        >
                                            {copied ? 'Copied!' : 'Copy new URL'}
                                            <Copy className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg
                                    bg-indigo-600 hover:bg-indigo-500 text-white font-medium
                                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Update Admin URL
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </>
    )
}
