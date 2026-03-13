import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, Users, TrendingUp, Shield, Award } from 'lucide-react';
import { Container, Section } from '@/components/core';
import { Footer } from '@/components/footer/Footer';
import { Navbar } from '@/components/navigation/Navbar';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

const stats = [
    { value: '32K+', label: 'Issued Cards', icon: CreditCard },
    { value: '5%', label: 'Cashback', icon: TrendingUp },
    { value: '20%', label: 'Fixed Deposit', icon: Shield },
    { value: '10K+', label: 'Happy Customers', icon: Users },
];

function CreditCard({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
    );
}

export default function About() {
    return (
        <>
            <Head>
                <title>About Us - Neo Bank</title>
                <meta name="description" content="Learn about Neo Bank - your trusted partner for modern banking services." />
            </Head>

            <Navbar />

            <main>
                {/* Hero */}
                <section className="relative overflow-hidden bg-[oklch(0.145_0_0)] pt-32 pb-20">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)]" />
                    </div>
                    <Container>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={stagger}
                            className="mx-auto max-w-3xl text-center"
                        >
                            <motion.h1 variants={fadeUp} className="font-hero text-5xl font-bold tracking-tight text-zinc-50 md:text-6xl">
                                About Neo Bank
                            </motion.h1>
                            <motion.p variants={fadeUp} className="mt-6 text-xl text-zinc-400">
                                We're on a mission to help more people save and achieve financial freedom.
                            </motion.p>
                        </motion.div>
                    </Container>
                </section>

                {/* Mission Section */}
                <Section spacing="lg">
                    <Container>
                        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                    We're always Here To Help With What's Next
                                </h2>
                                <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-300">
                                    <p>We're on a mission to help more people save.</p>
                                    <p>Better Money Habits® has resources to help you navigate a changing world.</p>
                                    <p>We're confident our accounts are tailored to a range of goals, and our savings tools could make the journey even easier.</p>
                                </div>
                                <div className="mt-8">
                                    <a
                                        href="/register"
                                        className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25"
                                    >
                                        Get Started
                                    </a>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative"
                            >
                                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                                    <div className="flex h-full items-center justify-center">
                                        <Shield className="h-24 w-24 text-indigo-500" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </Container>
                </Section>

                {/* Stats */}
                <Section spacing="lg" className="bg-zinc-900">
                    <Container>
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-center"
                                    >
                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                                            <Icon className="h-6 w-6 text-indigo-400" />
                                        </div>
                                        <p className="text-3xl font-bold text-zinc-50">{stat.value}</p>
                                        <p className="text-sm text-zinc-400">{stat.label}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </Container>
                </Section>

                {/* Values */}
                <Section spacing="lg">
                    <Container>
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                Why Choose Neo Bank
                            </h2>
                            <p className="mt-4 text-zinc-500">
                                We're committed to providing the best banking experience
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            {[
                                {
                                    icon: Shield,
                                    title: 'Secure Banking',
                                    description: 'Bank-grade security with 256-bit encryption, biometric authentication, and real-time fraud monitoring.',
                                },
                                {
                                    icon: TrendingUp,
                                    title: 'Competitive Rates',
                                    description: 'Earn up to 5% cashback and 20% fixed deposit rates. Your money works harder with us.',
                                },
                                {
                                    icon: Globe,
                                    title: 'Global Access',
                                    description: 'Access your accounts from anywhere in the world. We have offices in UK, Canada, USA and more.',
                                },
                            ].map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                                    >
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                                            <Icon className="h-6 w-6 text-indigo-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-zinc-500">{item.description}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </Container>
                </Section>

                {/* Contact Info */}
                <Section spacing="lg" className="bg-zinc-900">
                    <Container>
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-zinc-50">
                                    Get in Touch
                                </h2>
                                <p className="mt-4 text-zinc-400">
                                    Have questions? We'd love to hear from you.
                                </p>
                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                                            <MapPin className="h-5 w-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-zinc-50">Head Office</p>
                                            <p className="text-sm text-zinc-400">7609 Milligan Ln, Clinton, Maryland 20735, USA</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                                            <Phone className="h-5 w-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-zinc-50">Phone</p>
                                            <p className="text-sm text-zinc-400">+1 (555) 123-4567</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                                            <Mail className="h-5 w-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-zinc-50">Email</p>
                                            <p className="text-sm text-zinc-400">info@neobank.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                                <h3 className="text-xl font-semibold text-zinc-50">Send us a message</h3>
                                <form className="mt-6 space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-50 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Your Email"
                                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-50 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            rows={4}
                                            placeholder="Your Message"
                                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-50 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white transition-all hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </Container>
                </Section>
            </main>

            <Footer />
        </>
    );
}
