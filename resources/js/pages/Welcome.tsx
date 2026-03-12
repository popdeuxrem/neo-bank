import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle2,
    Menu,
    X,
    Building2,
    Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const MotionCard = motion(Card);

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const personas = [
    {
        name: 'Cody Fishers',
        role: 'Product Designer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        skills: ['UI/UX Design', 'Figma', 'Prototyping', 'User Research'],
        painPoints: [
            'Complex design systems',
            'Handoff issues with developers',
            'Keeping up with trends',
        ],
        needs: [
            'Streamlined workflow',
            'Better collaboration tools',
            'Design system automation',
        ],
    },
    {
        name: 'Jane Grace',
        role: 'Senior Developer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
        skills: ['React', 'TypeScript', 'Node.js', 'System Architecture'],
        painPoints: [
            'Technical debt',
            'Slow build times',
            'Documentation gaps',
        ],
        needs: [
            'Clean code refactoring',
            'Automated testing',
            'Better documentation tools',
        ],
    },
];

export default function Welcome() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const form = useForm({
        name: '',
        phone: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/leads', {
            onSuccess: () => {
                setFormSubmitted(true);
                setTimeout(() => {
                    setFormSubmitted(false);
                    form.reset();
                }, 3000);
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#0F1115] text-white">
            <Head title="Magnetiq Bank - Let's have a magnetic cooperation" />

            {/* Navigation */}
            <nav className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-[#0F1115]/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA]">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold">Magnetiq</span>
                    </div>

                    <div className="hidden items-center gap-8 md:flex">
                        <a
                            href="#about"
                            className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                            About the bank
                        </a>
                        <a
                            href="#personas"
                            className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                            Solutions
                        </a>
                        <a
                            href="#contact"
                            className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                            Contact
                        </a>
                        <Button
                            asChild
                            className="bg-black text-white hover:bg-gray-800"
                        >
                            <a href="/login">Internet Bank</a>
                        </Button>
                    </div>

                    <button
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="border-t border-white/10 bg-[#0F1115] px-6 py-4 md:hidden">
                        <div className="flex flex-col gap-4">
                            <a href="#about" className="text-sm text-gray-400">
                                About the bank
                            </a>
                            <a
                                href="#personas"
                                className="text-sm text-gray-400"
                            >
                                Solutions
                            </a>
                            <a
                                href="#contact"
                                className="text-sm text-gray-400"
                            >
                                Contact
                            </a>
                            <Button asChild className="bg-black text-white">
                                <a href="/login">Internet Bank</a>
                            </Button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#8B5CF6]/20 via-[#0F1115] to-[#0F1115]" />
                <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#8B5CF6]/10 blur-3xl" />
                <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-[#A78BFA]/10 blur-3xl" />

                <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
                    {/* Hero Content */}
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="space-y-8"
                    >
                        <motion.div
                            variants={fadeInUp}
                            className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-4 py-1.5 text-sm text-[#A78BFA]"
                        >
                            <Star className="h-4 w-4" />
                            <span>Future of Banking</span>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-5xl leading-tight font-bold lg:text-7xl"
                        >
                            Let's have a{' '}
                            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">
                                magnetic
                            </span>{' '}
                            cooperation
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="max-w-xl text-lg text-gray-400"
                        >
                            Experience banking that attracts your financial
                            goals. Seamless, secure, and designed to keep you
                            moving forward.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-wrap gap-4"
                        >
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="gap-2 bg-black text-white hover:bg-gray-800">
                                        Leave a request
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Get Started</DialogTitle>
                                        <DialogDescription>
                                            Leave your details and we'll contact
                                            you shortly.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="Your name"
                                                value={form.data.name}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                className="border-gray-700 bg-gray-800 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                placeholder="+1 (555) 000-0000"
                                                value={form.data.phone}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'phone',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                className="border-gray-700 bg-gray-800 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={form.data.email}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                className="border-gray-700 bg-gray-800 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">
                                                Message
                                            </Label>
                                            <Textarea
                                                id="message"
                                                placeholder="How can we help you?"
                                                value={form.data.message}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'message',
                                                        e.target.value,
                                                    )
                                                }
                                                className="border-gray-700 bg-gray-800 text-white"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full bg-black text-white hover:bg-gray-800"
                                            disabled={form.processing}
                                        >
                                            {form.processing
                                                ? 'Sending...'
                                                : 'Submit Request'}
                                        </Button>
                                        {formSubmitted && (
                                            <p className="text-center text-sm text-green-400">
                                                Thank you! We'll be in touch
                                                soon.
                                            </p>
                                        )}
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant="outline"
                                className="border-gray-700 text-white hover:bg-gray-800 hover:text-white"
                            >
                                <a href="/login">Internet Bank</a>
                            </Button>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className="flex items-center gap-6 text-sm text-gray-500"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-[#8B5CF6]" />
                                <span>Secure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-[#8B5CF6]" />
                                <span>Fast</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-[#8B5CF6]" />
                                <span>24/7 Support</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Hero Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/20 to-[#A78BFA]/20 blur-3xl" />
                        <div className="relative mx-auto w-full max-w-md">
                            <div className="relative aspect-square rounded-3xl border border-white/10 bg-gradient-to-br from-[#1F2937] to-[#0F1115] p-8">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-[#8B5CF6]/20 via-transparent to-transparent" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400">
                                                Total Balance
                                            </p>
                                            <p className="text-3xl font-bold text-white">
                                                $124,500.00
                                            </p>
                                        </div>
                                        <div className="rounded-full bg-[#8B5CF6]/20 p-3">
                                            <Building2 className="h-6 w-6 text-[#8B5CF6]" />
                                        </div>
                                    </div>
                                    <div className="h-32 rounded-xl bg-gradient-to-t from-[#8B5CF6]/10 to-transparent p-4">
                                        <div className="flex h-full items-end gap-2">
                                            {[40, 65, 45, 80, 55, 70, 90].map(
                                                (height, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex-1 rounded-t bg-gradient-to-t from-[#8B5CF6] to-[#A78BFA]"
                                                        style={{
                                                            height: `${height}%`,
                                                        }}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">
                                            Income
                                        </span>
                                        <span className="text-green-400">
                                            +$12,450
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* User Personas Section */}
            <section id="personas" className="py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="mb-16 text-center"
                    >
                        <motion.h2
                            variants={fadeInUp}
                            className="mb-4 text-4xl font-bold"
                        >
                            Tailored for{' '}
                            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">
                                Your Needs
                            </span>
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="mx-auto max-w-2xl text-gray-400"
                        >
                            We understand different users have unique
                            requirements. Here's how Magnetiq Bank serves our
                            diverse community.
                        </motion.p>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {personas.map((persona, index) => (
                            <MotionCard
                                key={persona.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                className="border border-[#8B5CF6]/20 bg-[#1F2937]/50 backdrop-blur"
                            >
                                <CardContent className="p-8">
                                    <div className="mb-6 flex items-start gap-4">
                                        <img
                                            src={persona.avatar}
                                            alt={persona.name}
                                            className="h-20 w-20 rounded-full object-cover ring-2 ring-[#8B5CF6]/50"
                                        />
                                        <div>
                                            <h3 className="text-xl font-bold">
                                                {persona.name}
                                            </h3>
                                            <p className="text-[#A78BFA]">
                                                {persona.role}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="mb-2 text-sm font-semibold text-gray-400">
                                                Skills
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {persona.skills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="rounded-full bg-[#8B5CF6]/10 px-3 py-1 text-sm text-[#A78BFA]"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="mb-2 text-sm font-semibold text-gray-400">
                                                Pain Points
                                            </h4>
                                            <ul className="space-y-1">
                                                {persona.painPoints.map(
                                                    (point) => (
                                                        <li
                                                            key={point}
                                                            className="flex items-center gap-2 text-sm text-gray-300"
                                                        >
                                                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                                            {point}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="mb-2 text-sm font-semibold text-gray-400">
                                                Needs
                                            </h4>
                                            <ul className="space-y-1">
                                                {persona.needs.map((need) => (
                                                    <li
                                                        key={need}
                                                        className="flex items-center gap-2 text-sm text-gray-300"
                                                    >
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
                                                        {need}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </MotionCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="contact" className="py-24">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-3xl border border-[#8B5CF6]/20 bg-gradient-to-br from-[#1F2937] to-[#0F1115] p-12"
                    >
                        <h2 className="mb-4 text-3xl font-bold">
                            Ready to experience magnetic banking?
                        </h2>
                        <p className="mb-8 text-gray-400">
                            Join thousands of satisfied customers who have
                            transformed their financial journey.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="gap-2 bg-[#8B5CF6] text-white hover:bg-[#7C3AED]">
                                        Leave a request
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Get Started</DialogTitle>
                                        <DialogDescription>
                                            Leave your details and we'll contact
                                            you shortly.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="name2">Name</Label>
                                            <Input
                                                id="name2"
                                                placeholder="Your name"
                                                value={form.data.name}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                className="border-gray-700 bg-gray-800 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone2">
                                                Phone
                                            </Label>
                                            <Input
                                                id="phone2"
                                                placeholder="+1 (555) 000-0000"
                                                value={form.data.phone}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'phone',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                className="border-gray-700 bg-gray-800 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email2">
                                                Email
                                            </Label>
                                            <Input
                                                id="email2"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={form.data.email}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                className="border-gray-700 bg-gray-800 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message2">
                                                Message
                                            </Label>
                                            <Textarea
                                                id="message2"
                                                placeholder="How can we help you?"
                                                value={form.data.message}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'message',
                                                        e.target.value,
                                                    )
                                                }
                                                className="border-gray-700 bg-gray-800 text-white"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full bg-black text-white hover:bg-gray-800"
                                            disabled={form.processing}
                                        >
                                            {form.processing
                                                ? 'Sending...'
                                                : 'Submit Request'}
                                        </Button>
                                        {formSubmitted && (
                                            <p className="text-center text-sm text-green-400">
                                                Thank you! We'll be in touch
                                                soon.
                                            </p>
                                        )}
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Button
                                asChild
                                variant="outline"
                                className="border-gray-700 text-white hover:bg-gray-800 hover:text-white"
                            >
                                <a href="/login">Internet Bank Login</a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-[#0F1115] py-12">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA]">
                                <Building2 className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold">Magnetiq</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            © 2026 Magnetiq Bank. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm text-gray-400">
                            <a href="#about" className="hover:text-white">
                                About
                            </a>
                            <a href="#contact" className="hover:text-white">
                                Contact
                            </a>
                            <a href="/login" className="hover:text-white">
                                Internet Bank
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
