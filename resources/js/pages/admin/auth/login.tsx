import { Head, useForm } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import * as LucideIcons from 'lucide-react'

const Shield = LucideIcons.Shield
const Mail = LucideIcons.Mail
const Lock = LucideIcons.Lock
const Eye = LucideIcons.Eye
const EyeOff = LucideIcons.EyeOff
const AlertCircle = LucideIcons.AlertCircle
const ChevronRight = LucideIcons.ChevronRight
const Activity = LucideIcons.Activity
const Server = LucideIcons.Server
const Database = LucideIcons.Database

interface Props {
    adminPrefix: string
    appName: string
    errors?: Record<string, string>
}

export default function AdminLogin({ adminPrefix, appName, errors }: Props) {
    const [showPassword, setShowPassword] = useState(false)
    const [loginAttempts, setLoginAttempts] = useState(0)
    const [currentTime, setCurrentTime] = useState(new Date())

    const { data, setData, post, processing } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (errors?.email) setLoginAttempts(p => p + 1)
    }, [errors])

    function submit(e: React.FormEvent) {
        e.preventDefault()
        post(`/${adminPrefix}/login`)
    }

    return (
        <>
            <Head title={`${appName} — Admin Portal`} />

            <div className="min-h-screen flex bg-zinc-950">

                <motion.div
                    className="hidden lg:flex lg:w-1/2 xl:w-3/5
                                flex-col relative overflow-hidden
                                bg-gradient-to-br from-zinc-950
                                via-indigo-950 to-zinc-900"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
                >
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96
                            rounded-full bg-indigo-600/10 blur-3xl
                            animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-80 h-80
                            rounded-full bg-violet-600/10 blur-3xl
                            animate-pulse [animation-delay:1s]" />
                        <div className="absolute top-3/4 left-1/3 w-64 h-64
                            rounded-full bg-cyan-600/5 blur-3xl
                            animate-pulse [animation-delay:2s]" />
                    </div>

                    <div className="absolute inset-0 opacity-5"
                         style={{
                            backgroundImage:
                                'linear-gradient(rgba(99,102,241,0.3) 1px,' +
                                'transparent 1px),' +
                                'linear-gradient(90deg,' +
                                'rgba(99,102,241,0.3) 1px,transparent 1px)',
                            backgroundSize: '40px 40px',
                         }} />

                    <div className="relative z-10 flex flex-col h-full p-12">

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600
                                    rounded-xl flex items-center
                                    justify-center">
                                    <span className="text-white font-bold
                                        text-lg">M</span>
                                </div>
                                <div>
                                    <div className="text-white font-semibold
                                        text-lg leading-none">
                                        Magnetiq
                                    </div>
                                    <div className="text-indigo-400 text-xs
                                        font-medium tracking-widest uppercase">
                                        Admin Portal
                                    </div>
                                </div>
                            </div>
                            <div className="text-zinc-500 text-sm font-mono">
                                {currentTime.toLocaleTimeString()}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col
                            justify-center max-w-md">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                <div className="text-indigo-400 text-sm
                                    font-medium tracking-widest uppercase
                                    mb-4">
                                    Secure Administration
                                </div>
                                <h1 className="text-4xl xl:text-5xl
                                    font-semibold text-white
                                    tracking-tight leading-tight mb-6">
                                    Command Center
                                    <span className="text-indigo-400">.</span>
                                </h1>
                                <p className="text-zinc-400 text-lg
                                    leading-relaxed mb-10">
                                    Full visibility and control over every
                                    transaction, user, and system in the
                                    Magnetiq banking platform.
                                </p>

                                <div className="space-y-3">
                                    {[
                                        {
                                            icon: Activity,
                                            label: 'System Status',
                                            value: 'All systems operational',
                                            color: 'text-emerald-400',
                                            dot: 'bg-emerald-400',
                                        },
                                        {
                                            icon: Server,
                                            label: 'Infrastructure',
                                            value: 'Laravel Cloud — Healthy',
                                            color: 'text-indigo-400',
                                            dot: 'bg-indigo-400',
                                        },
                                        {
                                            icon: Database,
                                            label: 'Database',
                                            value: 'PostgreSQL 15 — Connected',
                                            color: 'text-cyan-400',
                                            dot: 'bg-cyan-400',
                                        },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={item.label}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.5 + i * 0.1
                                            }}
                                            className="flex items-center gap-4
                                                p-4 rounded-xl
                                                bg-white/5
                                                border border-white/8
                                                backdrop-blur-sm"
                                        >
                                            <div className="w-8 h-8
                                                rounded-lg bg-white/10
                                                flex items-center
                                                justify-center flex-shrink-0">
                                                <item.icon
                                                    className={`w-4 h-4 ${item.color}`}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-zinc-500
                                                    text-xs">{item.label}</div>
                                                <div className="text-zinc-300
                                                    text-sm font-medium">
                                                    {item.value}
                                                </div>
                                            </div>
                                            <div className={`w-2 h-2
                                                rounded-full ${item.dot}
                                                animate-pulse flex-shrink-0`} />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <div className="flex items-center gap-2
                            text-zinc-600 text-xs">
                            <Shield className="w-3 h-3" />
                            <span>
                                This is a restricted area. Unauthorized access
                                is prohibited and monitored.
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="flex-1 flex items-center justify-center
                                p-6 sm:p-12 bg-zinc-950"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-full max-w-md">

                        <div className="flex lg:hidden items-center
                            gap-3 mb-10">
                            <div className="w-10 h-10 bg-indigo-600
                                rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold
                                    text-lg">M</span>
                            </div>
                            <div>
                                <div className="text-white font-semibold
                                    text-lg">Magnetiq</div>
                                <div className="text-indigo-400 text-xs
                                    tracking-widest uppercase">
                                    Admin Portal
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-2xl
                                        bg-indigo-600/20
                                        border border-indigo-500/30
                                        flex items-center justify-center">
                                        <Lock
                                            className="w-6 h-6
                                            text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-semibold
                                            text-white">Admin Sign In</h2>
                                        <p className="text-zinc-500 text-sm">
                                            Authenticate to continue
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2
                                    px-3 py-2 rounded-lg
                                    bg-emerald-500/10
                                    border border-emerald-500/20
                                    text-emerald-400 text-xs">
                                    <Shield className="w-3 h-3" />
                                    <span>
                                        256-bit encrypted connection
                                    </span>
                                    <span className="ml-auto font-mono">
                                        TLS 1.3
                                    </span>
                                </div>
                            </div>

                            <AnimatePresence>
                                {errors?.email && (
                                    <motion.div
                                        initial={{ opacity: 0,
                                            height: 0, y: -10 }}
                                        animate={{ opacity: 1,
                                            height: 'auto', y: 0 }}
                                        exit={{ opacity: 0,
                                            height: 0, y: -10 }}
                                        className="mb-6 overflow-hidden"
                                    >
                                        <motion.div
                                            animate={loginAttempts > 1
                                                ? {
                                                    x: [0,-6,6,-4,4,-2,2,0]
                                                  }
                                                : {}
                                            }
                                            transition={{ duration: 0.4 }}
                                            className="flex items-start
                                                gap-3 p-4 rounded-xl
                                                bg-rose-500/10
                                                border border-rose-500/30"
                                        >
                                            <AlertCircle
                                                className="w-4 h-4
                                                text-rose-400 mt-0.5
                                                flex-shrink-0" />
                                            <div>
                                                <p className="text-rose-300
                                                    text-sm font-medium">
                                                    Authentication failed
                                                </p>
                                                <p className="text-rose-400/80
                                                    text-xs mt-0.5">
                                                    {errors.email}
                                                </p>
                                                {loginAttempts >= 3 && (
                                                    <p className="text-rose-400/60
                                                        text-xs mt-1">
                                                        {5 - loginAttempts}
                                                        {' '}attempts remaining
                                                        before lockout
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={submit} className="space-y-5">

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium
                                        text-zinc-300">
                                        Admin Email
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3.5
                                            top-1/2 -translate-y-1/2
                                            w-4 h-4 text-zinc-500
                                            pointer-events-none" />
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e =>
                                                setData('email',
                                                    e.target.value)}
                                            placeholder="admin@magnetiq.bank"
                                            autoComplete="email"
                                            autoFocus
                                            className="w-full pl-10 pr-4
                                                py-3 rounded-xl
                                                bg-white/5
                                                border border-white/10
                                                text-white
                                                placeholder-zinc-600
                                                focus:outline-none
                                                focus:border-indigo-500
                                                focus:ring-1
                                                focus:ring-indigo-500
                                                transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium
                                        text-zinc-300">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-3.5
                                            top-1/2 -translate-y-1/2
                                            w-4 h-4 text-zinc-500
                                            pointer-events-none" />
                                        <input
                                            type={showPassword
                                                ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={e =>
                                                setData('password',
                                                    e.target.value)}
                                            placeholder="••••••••••••"
                                            autoComplete="current-password"
                                            className="w-full pl-10 pr-12
                                                py-3 rounded-xl
                                                bg-white/5
                                                border border-white/10
                                                text-white
                                                placeholder-zinc-600
                                                focus:outline-none
                                                focus:border-indigo-500
                                                focus:ring-1
                                                focus:ring-indigo-500
                                                transition-all text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(p => !p)}
                                            className="absolute right-3.5
                                                top-1/2 -translate-y-1/2
                                                text-zinc-500
                                                hover:text-zinc-300
                                                transition-colors"
                                        >
                                            {showPassword
                                                ? <EyeOff className="w-4 h-4"/>
                                                : <Eye className="w-4 h-4" />
                                            }
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={data.remember}
                                        onChange={e =>
                                            setData('remember',
                                                e.target.checked)}
                                        className="w-4 h-4 rounded
                                            border-zinc-600
                                            bg-zinc-800
                                            text-indigo-600
                                            focus:ring-indigo-500
                                            focus:ring-offset-zinc-950"
                                    />
                                    <label htmlFor="remember"
                                        className="text-sm text-zinc-400">
                                        Keep me signed in for 8 hours
                                    </label>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={processing}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center
                                        justify-center gap-2 py-3.5
                                        rounded-xl font-medium text-sm
                                        bg-indigo-600 hover:bg-indigo-500
                                        text-white transition-all
                                        disabled:opacity-60
                                        disabled:cursor-not-allowed
                                        shadow-lg shadow-indigo-600/25"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4
                                                border-2 border-white/30
                                                border-t-white rounded-full
                                                animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Access Admin Panel
                                            <ChevronRight className="w-4 h-4"/>
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <div className="mt-8 pt-6
                                border-t border-white/5">
                                <p className="text-center text-zinc-600
                                    text-xs leading-relaxed">
                                    This portal is for authorised Magnetiq
                                    personnel only.
                                    <br />
                                    All access attempts are logged and monitored.
                                </p>
                                <div className="flex items-center
                                    justify-center gap-4 mt-4">
                                    <div className="flex items-center
                                        gap-1 text-zinc-700 text-xs">
                                        <Shield className="w-3 h-3" />
                                        <span>SOC 2</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full
                                        bg-zinc-700" />
                                    <div className="text-zinc-700 text-xs">
                                        ISO 27001
                                    </div>
                                    <div className="w-1 h-1 rounded-full
                                        bg-zinc-700" />
                                    <div className="text-zinc-700 text-xs">
                                        PCI DSS
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </>
    )
}
