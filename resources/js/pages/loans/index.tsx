import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Banknote, 
    ArrowLeft, 
    Shield,
    Clock,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    FileText,
    Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } }
};

interface LoanPlan {
    id: number;
    name: string;
    interest_rate: number;
    min_amount: number;
    max_amount: number;
    duration_options: number[];
    processing_fee: number;
    late_payment_fee: number;
    description: string;
    example: {
        emi: number;
        totalPayment: number;
        totalInterest: number;
    };
}

interface User {
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface Account {
    id: number;
    name: string;
    balance: number;
    currency: string;
}

interface Eligibility {
    eligible: boolean;
    maxAmount: number;
    reasons: string[];
}

interface PageProps {
    plans: LoanPlan[];
    user: User;
    accounts: Account[];
    eligibility: Eligibility;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export default function LoansIndex({ plans, user, accounts, eligibility }: PageProps) {
    const [selectedPlan, setSelectedPlan] = useState<LoanPlan | null>(plans[0] || null);
    const [amount, setAmount] = useState(plans[0]?.min_amount || 1000);
    const [duration, setDuration] = useState(plans[0]?.duration_options[0] || 12);
    const [step, setStep] = useState(1);

    const { data, setData, post, processing } = useForm({
        plan_id: plans[0]?.id || '',
        amount: plans[0]?.min_amount || 1000,
        duration_months: plans[0]?.duration_options[0] || 12,
        purpose: '',
        account_id: accounts[0]?.id || '',
        employment_type: '',
        monthly_income: 0,
        documents: [] as File[],
    });

    const calculateEmi = () => {
        if (!selectedPlan || !amount || !duration) return null;
        const principal = amount;
        const monthlyRate = selectedPlan.interest_rate / 12 / 100;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, duration) / (Math.pow(1 + monthlyRate, duration) - 1);
        const totalPayment = emi * duration;
        const totalInterest = totalPayment - principal;
        return {
            emi: isNaN(emi) ? principal / duration : emi,
            totalPayment: isNaN(totalPayment) ? principal : totalPayment,
            totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
        };
    };

    const emiCalc = calculateEmi();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 4) {
            setStep(step + 1);
            return;
        }
        if (selectedPlan) {
            setData('plan_id', selectedPlan.id);
            setData('amount', amount);
            setData('duration_months', duration);
        }
        post('/loans/apply');
    };

    return (
        <UserLayout>
            <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={stagger}
                className="space-y-6"
            >
                <motion.div variants={fadeUp}>
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Loans</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Apply for personal or business loans</p>
                        </div>
                    </div>
                </motion.div>

                {!eligibility.eligible && (
                    <motion.div variants={fadeUp}>
                        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-amber-800 dark:text-amber-200">Not Eligible</h3>
                                        <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-300">
                                            {eligibility.reasons.map((reason, i) => (
                                                <li key={i}>• {reason}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {eligibility.eligible && (
                    <motion.div variants={fadeUp}>
                        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4 mb-6">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                <span className="font-medium text-emerald-700 dark:text-emerald-300">
                                    You're eligible for up to {formatCurrency(eligibility.maxAmount)}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div variants={fadeUp} className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Loan Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {plans.map((plan) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => {
                                                setSelectedPlan(plan);
                                                setAmount(plan.min_amount);
                                                setDuration(plan.duration_options[0]);
                                            }}
                                            className={`w-full text-left p-4 rounded-lg border transition-all ${
                                                selectedPlan?.id === plan.id
                                                    ? 'border-indigo-500 bg-indigo-500/5'
                                                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-medium">{plan.name}</h3>
                                                <Badge className="bg-indigo-100 text-indigo-700">
                                                    {plan.interest_rate}% APR
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-zinc-500 mb-3">{plan.description}</p>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-zinc-400">Min</p>
                                                    <p className="font-medium">{formatCurrency(plan.min_amount)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-zinc-400">Max</p>
                                                    <p className="font-medium">{formatCurrency(plan.max_amount)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-zinc-400">Processing</p>
                                                    <p className="font-medium">{plan.processing_fee}%</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {selectedPlan && eligibility.eligible && (
                                    <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t pt-6">
                                        <h3 className="font-medium">Apply for {selectedPlan.name}</h3>
                                        
                                        {step === 1 && (
                                            <div className="space-y-4">
                                                <div>
                                                    <Label>Loan Amount</Label>
                                                    <Input
                                                        type="number"
                                                        value={amount}
                                                        onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                                                        min={selectedPlan.min_amount}
                                                        max={selectedPlan.max_amount}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Duration (Months)</Label>
                                                    <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {selectedPlan.duration_options.map((opt) => (
                                                                <SelectItem key={opt} value={opt.toString()}>
                                                                    {opt} months
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                {emiCalc && (
                                                    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-4">
                                                        <div className="flex justify-between mb-2">
                                                            <span className="text-zinc-500">Monthly EMI</span>
                                                            <span className="font-bold">{formatCurrency(emiCalc.emi)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-zinc-500">Total Interest</span>
                                                            <span>{formatCurrency(emiCalc.totalInterest)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-zinc-500">Total Payment</span>
                                                            <span>{formatCurrency(emiCalc.totalPayment)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {step === 2 && (
                                            <div className="space-y-4">
                                                <div>
                                                    <Label>Purpose of Loan</Label>
                                                    <select
                                                        className="w-full h-10 rounded-md border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2"
                                                        value={data.purpose}
                                                        onChange={(e) => setData('purpose', e.target.value)}
                                                    >
                                                        <option value="">Select purpose</option>
                                                        <option value="personal">Personal</option>
                                                        <option value="home">Home Improvement</option>
                                                        <option value="business">Business</option>
                                                        <option value="education">Education</option>
                                                        <option value="medical">Medical</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <Label>Disbursement Account</Label>
                                                    <select
                                                        className="w-full h-10 rounded-md border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2"
                                                        value={data.account_id}
                                                        onChange={(e) => setData('account_id', e.target.value)}
                                                    >
                                                        {accounts.map((account) => (
                                                            <option key={account.id} value={account.id}>
                                                                {account.name} - {formatCurrency(account.balance)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {step === 3 && (
                                            <div className="space-y-4">
                                                <div>
                                                    <Label>Employment Type</Label>
                                                    <select
                                                        className="w-full h-10 rounded-md border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2"
                                                        value={data.employment_type}
                                                        onChange={(e) => setData('employment_type', e.target.value)}
                                                    >
                                                        <option value="">Select type</option>
                                                        <option value="salaried">Salaried</option>
                                                        <option value="self-employed">Self-Employed</option>
                                                        <option value="business">Business Owner</option>
                                                        <option value="retired">Retired</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <Label>Monthly Income</Label>
                                                    <Input
                                                        type="number"
                                                        value={data.monthly_income}
                                                        onChange={(e) => setData('monthly_income', parseInt(e.target.value) || 0)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Documents (Optional)</Label>
                                                    <div className="mt-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                                        <Upload className="w-6 h-6 mx-auto text-zinc-400" />
                                                        <p className="text-sm text-zinc-500 mt-1">Upload supporting documents</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {step === 4 && (
                                            <div className="space-y-4">
                                                <h4 className="font-medium">Review Application</h4>
                                                <div className="rounded-lg border p-4 space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500">Loan Amount</span>
                                                        <span>{formatCurrency(amount)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500">Duration</span>
                                                        <span>{duration} months</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500">Interest Rate</span>
                                                        <span>{selectedPlan.interest_rate}% APR</span>
                                                    </div>
                                                    <div className="flex justify-between font-medium border-t pt-2">
                                                        <span>Monthly EMI</span>
                                                        <span>{formatCurrency(emiCalc?.emi || 0)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-3">
                                            {step > 1 && (
                                                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                                                    Back
                                                </Button>
                                            )}
                                            <Button type="submit" className="flex-1" disabled={processing}>
                                                {processing ? 'Submitting...' : step === 4 ? 'Submit Application' : 'Continue'}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Quick EMI Calculator</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Amount</Label>
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div>
                                    <Label>Months</Label>
                                    <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[6, 12, 18, 24, 36, 48, 60].map((opt) => (
                                                <SelectItem key={opt} value={opt.toString()}>
                                                    {opt} months
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {emiCalc && (
                                    <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-4 text-center">
                                        <p className="text-sm text-zinc-500">Monthly Payment</p>
                                        <p className="text-2xl font-bold text-indigo-600">{formatCurrency(emiCalc.emi)}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </UserLayout>
    );
}
