import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';

const Icons = {
    ArrowLeft: LucideIcons.ArrowLeft,
    Banknote: LucideIcons.Banknote,
    FileText: LucideIcons.FileText,
    User: LucideIcons.User,
    Briefcase: LucideIcons.Briefcase,
    CreditCard: LucideIcons.CreditCard,
    Upload: LucideIcons.Upload,
    CheckCircle: LucideIcons.CheckCircle,
    ChevronRight: LucideIcons.ChevronRight,
    ChevronLeft: LucideIcons.ChevronLeft,
    Shield: LucideIcons.Shield,
    AlertCircle: LucideIcons.AlertCircle,
} as const;

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
    description: string;
}

interface Account {
    id: number;
    name: string;
    balance: number;
}

interface PageProps {
    plans: LoanPlan[];
    accounts: Account[];
    eligibility: {
        eligible: boolean;
        maxAmount: number;
        reasons: string[];
    };
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const STEPS = [
    { id: 1, title: 'Loan Details', icon: Icons.Banknote },
    { id: 2, title: 'Purpose & Disbursement', icon: Icons.CreditCard },
    { id: 3, title: 'Employment Info', icon: Icons.Briefcase },
    { id: 4, title: 'Review & Submit', icon: Icons.CheckCircle },
];

export default function LoansApply({ plans, accounts, eligibility }: PageProps) {
    const [step, setStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState<LoanPlan | null>(plans[0] || null);
    const [amount, setAmount] = useState(plans[0]?.min_amount || 1000);
    const [duration, setDuration] = useState(plans[0]?.duration_options[0] || 12);

    const { data, setData, post, processing } = useForm({
        plan_id: plans[0]?.id || '',
        amount: plans[0]?.min_amount || 1000,
        duration_months: plans[0]?.duration_options[0] || 12,
        purpose: '',
        account_id: accounts[0]?.id || '',
        employment_type: '',
        monthly_income: 0,
        employer_name: '',
        years_employed: 0,
    });

    const calculateEmi = () => {
        if (!selectedPlan || !amount || !duration) return null;
        const principal = amount;
        const monthlyRate = selectedPlan.interest_rate / 12 / 100;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, duration) / (Math.pow(1 + monthlyRate, duration) - 1);
        const totalPayment = emi * duration;
        const totalInterest = totalPayment - principal;
        const processingFee = (amount * selectedPlan.processing_fee) / 100;
        
        return {
            emi: isNaN(emi) ? principal / duration : emi,
            totalPayment: isNaN(totalPayment) ? principal : totalPayment,
            totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
            processingFee: isNaN(processingFee) ? 0 : processingFee,
        };
    };

    const emiCalc = calculateEmi();

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            if (selectedPlan) {
                setData('plan_id', selectedPlan.id.toString());
                setData('amount', amount);
                setData('duration_months', duration);
            }
            post('/loans/apply');
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
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
                        <Link href="/loans">
                            <Button variant="ghost" size="icon">
                                <Icons.ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Apply for Loan</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Complete the application process</p>
                        </div>
                    </div>
                </motion.div>

                {!eligibility.eligible && (
                    <motion.div variants={fadeUp}>
                        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <Icons.AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
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

                <motion.div variants={fadeUp}>
                    <div className="flex items-center justify-between mb-6">
                        {STEPS.map((s, idx) => (
                            <div key={s.id} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                    step >= s.id 
                                        ? 'bg-indigo-500 border-indigo-500 text-white' 
                                        : 'border-zinc-300 dark:border-zinc-600 text-zinc-400'
                                }`}>
                                    {step > s.id ? (
                                        <Icons.CheckCircle className="w-5 h-5" />
                                    ) : (
                                        <s.icon className="w-5 h-5" />
                                    )}
                                </div>
                                <span className={`ml-2 text-sm hidden md:inline ${
                                    step >= s.id ? 'text-white' : 'text-zinc-400'
                                }`}>
                                    {s.title}
                                </span>
                                {idx < STEPS.length - 1 && (
                                    <div className={`w-12 md:w-24 h-0.5 mx-2 ${
                                        step > s.id ? 'bg-indigo-500' : 'bg-zinc-300 dark:bg-zinc-600'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div variants={fadeUp} className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>{STEPS[step - 1].title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <div>
                                            <Label>Select Loan Product</Label>
                                            <div className="grid gap-3 mt-2">
                                                {plans.map((plan) => (
                                                    <button
                                                        key={plan.id}
                                                        onClick={() => {
                                                            setSelectedPlan(plan);
                                                            setAmount(plan.min_amount);
                                                            setDuration(plan.duration_options[0]);
                                                        }}
                                                        className={`p-4 rounded-lg border text-left transition-all ${
                                                            selectedPlan?.id === plan.id
                                                                ? 'border-indigo-500 bg-indigo-500/5'
                                                                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-medium">{plan.name}</h4>
                                                                <p className="text-sm text-zinc-500">{plan.description}</p>
                                                            </div>
                                                            <Badge className="bg-indigo-100 text-indigo-700">
                                                                {plan.interest_rate}% APR
                                                            </Badge>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedPlan && (
                                            <>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div>
                                                        <Label>Loan Amount</Label>
                                                        <Input
                                                            type="number"
                                                            value={amount}
                                                            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                                                            min={selectedPlan.min_amount}
                                                            max={selectedPlan.max_amount}
                                                        />
                                                        <p className="text-xs text-zinc-500 mt-1">
                                                            Min: {formatCurrency(selectedPlan.min_amount)} - Max: {formatCurrency(selectedPlan.max_amount)}
                                                        </p>
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
                                                </div>

                                                {emiCalc && (
                                                    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-4 space-y-3">
                                                        <div className="flex justify-between">
                                                            <span className="text-zinc-500">Monthly EMI</span>
                                                            <span className="font-bold text-indigo-600">{formatCurrency(emiCalc.emi)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-zinc-500">Processing Fee</span>
                                                            <span>{formatCurrency(emiCalc.processingFee)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-zinc-500">Total Interest</span>
                                                            <span>{formatCurrency(emiCalc.totalInterest)}</span>
                                                        </div>
                                                        <div className="flex justify-between font-medium border-t pt-2">
                                                            <span>Total Payment</span>
                                                            <span>{formatCurrency(emiCalc.totalPayment + emiCalc.processingFee)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div>
                                            <Label>Purpose of Loan</Label>
                                            <Select value={data.purpose} onValueChange={(v) => setData('purpose', v)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select purpose" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="personal">Personal Expenses</SelectItem>
                                                    <SelectItem value="home">Home Improvement</SelectItem>
                                                    <SelectItem value="business">Business</SelectItem>
                                                    <SelectItem value="education">Education</SelectItem>
                                                    <SelectItem value="medical">Medical</SelectItem>
                                                    <SelectItem value="travel">Travel</SelectItem>
                                                    <SelectItem value="debt">Debt Consolidation</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Disbursement Account</Label>
                                            <Select value={data.account_id} onValueChange={(v) => setData('account_id', v)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select account" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {accounts.map((account) => (
                                                        <SelectItem key={account.id} value={account.id.toString()}>
                                                            {account.name} - {formatCurrency(account.balance)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-zinc-500 mt-1">
                                                Loan amount will be credited to this account
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div>
                                            <Label>Employment Type</Label>
                                            <Select value={data.employment_type} onValueChange={(v) => setData('employment_type', v)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="salaried">Salaried Employee</SelectItem>
                                                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                                                    <SelectItem value="business">Business Owner</SelectItem>
                                                    <SelectItem value="retired">Retired</SelectItem>
                                                    <SelectItem value="student">Student</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <Label>Monthly Income</Label>
                                                <Input
                                                    type="number"
                                                    value={data.monthly_income}
                                                    onChange={(e) => setData('monthly_income', parseInt(e.target.value) || 0)}
                                                    placeholder="Your monthly income"
                                                />
                                            </div>
                                            <div>
                                                <Label>Years at Current Employment</Label>
                                                <Input
                                                    type="number"
                                                    value={data.years_employed}
                                                    onChange={(e) => setData('years_employed', parseInt(e.target.value) || 0)}
                                                    placeholder="Years employed"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Employer/Business Name (Optional)</Label>
                                            <Input
                                                value={data.employer_name}
                                                onChange={(e) => setData('employer_name', e.target.value)}
                                                placeholder="Your employer or business name"
                                            />
                                        </div>

                                        <div>
                                            <Label>Supporting Documents (Optional)</Label>
                                            <div className="mt-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                                <Icons.Upload className="w-8 h-8 mx-auto text-zinc-400" />
                                                <p className="text-sm text-zinc-500 mt-2">Click to upload or drag and drop</p>
                                                <p className="text-xs text-zinc-400">PDF, PNG, JPG up to 10MB</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 4 && selectedPlan && (
                                    <div className="space-y-6">
                                        <div className="rounded-lg border p-4 space-y-4">
                                            <h4 className="font-medium">Loan Summary</h4>
                                            
                                            <div className="grid gap-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-500">Loan Product</span>
                                                    <span>{selectedPlan.name}</span>
                                                </div>
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
                                                {emiCalc && (
                                                    <>
                                                        <div className="flex justify-between">
                                                            <span className="text-zinc-500">Processing Fee</span>
                                                            <span>{formatCurrency(emiCalc.processingFee)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-zinc-500">Total Interest</span>
                                                            <span>{formatCurrency(emiCalc.totalInterest)}</span>
                                                        </div>
                                                        <div className="flex justify-between font-bold border-t pt-3">
                                                            <span>Monthly EMI</span>
                                                            <span className="text-indigo-600">{formatCurrency(emiCalc.emi)}</span>
                                                        </div>
                                                        <div className="flex justify-between font-bold">
                                                            <span>Total Payment</span>
                                                            <span>{formatCurrency(emiCalc.totalPayment + emiCalc.processingFee)}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="rounded-lg border p-4 space-y-3">
                                            <h4 className="font-medium">Additional Details</h4>
                                            <div className="grid gap-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-500">Purpose</span>
                                                    <span className="capitalize">{data.purpose || 'Not specified'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-500">Employment</span>
                                                    <span className="capitalize">{data.employment_type || 'Not specified'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-500">Monthly Income</span>
                                                    <span>{data.monthly_income ? formatCurrency(data.monthly_income) : 'Not specified'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                                            <Icons.Shield className="w-5 h-5 text-indigo-500 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-indigo-800 dark:text-indigo-200">Secure Application</h4>
                                                <p className="text-sm text-indigo-600 dark:text-indigo-300">
                                                    Your information is encrypted and secure. We will never share your data with third parties.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 mt-6 pt-4 border-t">
                                    {step > 1 && (
                                        <Button variant="outline" onClick={handleBack}>
                                            <Icons.ChevronLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>
                                    )}
                                    <Button 
                                        className="flex-1" 
                                        onClick={handleNext}
                                        disabled={processing || (step === 2 && !data.purpose) || (step === 3 && !data.employment_type)}
                                    >
                                        {processing ? 'Submitting...' : step === 4 ? 'Submit Application' : 'Continue'}
                                        {step < 4 && <Icons.ChevronRight className="w-4 h-4 ml-2" />}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeUp} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Loan Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Amount</span>
                                    <span className="font-medium">{formatCurrency(amount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Duration</span>
                                    <span>{duration} months</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Interest Rate</span>
                                    <span>{selectedPlan?.interest_rate || 0}% APR</span>
                                </div>
                                {emiCalc && (
                                    <>
                                        <div className="border-t pt-4">
                                            <div className="text-center">
                                                <p className="text-sm text-zinc-500">Monthly EMI</p>
                                                <p className="text-2xl font-bold text-indigo-600">{formatCurrency(emiCalc.emi)}</p>
                                            </div>
                                        </div>
                                        <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-3 text-xs space-y-1">
                                            <div className="flex justify-between">
                                                <span>Total Interest</span>
                                                <span>{formatCurrency(emiCalc.totalInterest)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Processing Fee</span>
                                                <span>{formatCurrency(emiCalc.processingFee)}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <Icons.AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-amber-800 dark:text-amber-200">Important</h4>
                                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                            Please ensure all information is accurate. Providing false information may result in loan rejection.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </UserLayout>
    );
}
