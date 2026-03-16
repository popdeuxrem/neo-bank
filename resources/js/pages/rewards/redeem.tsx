import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import UserLayout from '@/layouts/user-layout';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.07 } }
};

interface RewardItem {
    id: string;
    title: string;
    description: string;
    pointsRequired: number;
    value: string;
    valueAmount: number;
    type: 'cash' | 'fee_credit' | 'premium' | 'merchandise';
    category: string;
    image?: string;
    available: boolean;
}

const mockPointsBalance = 12500;

const rewardCatalog: RewardItem[] = [
    { 
        id: '1', 
        title: 'Cash Back', 
        description: 'Convert points to account balance', 
        pointsRequired: 1000, 
        value: '$10',
        valueAmount: 10,
        type: 'cash', 
        category: 'Cash',
        available: true 
    },
    { 
        id: '2', 
        title: '$25 Cash Back', 
        description: 'Convert points to account balance', 
        pointsRequired: 2500, 
        value: '$25',
        valueAmount: 25,
        type: 'cash', 
        category: 'Cash',
        available: true 
    },
    { 
        id: '3', 
        title: '$50 Cash Back', 
        description: 'Convert points to account balance', 
        pointsRequired: 5000, 
        value: '$50',
        valueAmount: 50,
        type: 'cash', 
        category: 'Cash',
        available: true 
    },
    { 
        id: '4', 
        title: 'Monthly Fee Waived', 
        description: 'Waive your monthly account fee', 
        pointsRequired: 1500, 
        value: '$15',
        valueAmount: 15,
        type: 'fee_credit', 
        category: 'Fee Credit',
        available: true 
    },
    { 
        id: '5', 
        title: 'Wire Transfer Fee Waived', 
        description: 'One free outgoing wire transfer', 
        pointsRequired: 2000, 
        value: '$25',
        valueAmount: 25,
        type: 'fee_credit', 
        category: 'Fee Credit',
        available: true 
    },
    { 
        id: '6', 
        title: 'Pro Membership (1 month)', 
        description: 'Upgrade to Pro tier for a month', 
        pointsRequired: 5000, 
        value: '$9.99',
        valueAmount: 9.99,
        type: 'premium', 
        category: 'Premium',
        available: true 
    },
    { 
        id: '7', 
        title: 'Pro Membership (3 months)', 
        description: 'Upgrade to Pro tier for 3 months', 
        pointsRequired: 12000, 
        value: '$29.97',
        valueAmount: 29.97,
        type: 'premium', 
        category: 'Premium',
        available: false 
    },
    { 
        id: '8', 
        title: 'Amazon Gift Card', 
        description: '$25 Amazon gift card', 
        pointsRequired: 3000, 
        value: '$25',
        valueAmount: 25,
        type: 'merchandise', 
        category: 'Gift Cards',
        available: true 
    },
    { 
        id: '9', 
        title: 'Apple Gift Card', 
        description: '$50 Apple gift card', 
        pointsRequired: 5500, 
        value: '$50',
        valueAmount: 50,
        type: 'merchandise', 
        category: 'Gift Cards',
        available: true 
    },
];

const categories = ['All', 'Cash', 'Fee Credit', 'Premium', 'Gift Cards'];

export default function RedeemPoints() {
    const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');

    const { data, setData, post, processing, reset, errors } = useForm({
        reward_id: '',
        points_used: 0,
        confirm: false,
    });

    const filteredRewards = activeCategory === 'All' 
        ? rewardCatalog 
        : rewardCatalog.filter(r => r.category === activeCategory);

    const handleSelectReward = (reward: RewardItem) => {
        if (reward.pointsRequired > mockPointsBalance) return;
        setSelectedReward(reward);
        setData({
            reward_id: reward.id,
            points_used: reward.pointsRequired,
            confirm: false,
        });
    };

    const handleConfirmRedemption = () => {
        setShowConfirmation(true);
    };

    const handleSubmitRedemption = () => {
        setShowConfirmation(false);
        setShowSuccess(true);
        
        setTimeout(() => {
            setShowSuccess(false);
            setSelectedReward(null);
            reset();
        }, 3000);
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'cash': return LucideIcons.DollarSign;
            case 'fee_credit': return LucideIcons.CreditCard;
            case 'premium': return LucideIcons.Star;
            case 'merchandise': return LucideIcons.Gift;
            default: return LucideIcons.Gift;
        }
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
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Redeem Points</h1>
                            <p className="mt-1 text-zinc-400">Exchange your points for rewards</p>
                        </div>
                        <div className="rounded-xl border border-amber-500/20 bg-amber-600/10 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <LucideIcons.Star className="h-5 w-5 text-amber-400" />
                                <span className="text-sm text-amber-300">Your Balance</span>
                            </div>
                            <div className="mt-1 flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">{mockPointsBalance.toLocaleString()}</span>
                                <span className="text-sm text-amber-300">pts</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {selectedReward && (
                    <motion.div 
                        variants={fadeUp}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="rounded-xl border border-indigo-500/20 bg-indigo-600/10 p-6"
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/20">
                                    {(() => {
                                        const Icon = getIconForType(selectedReward.type);
                                        return <Icon className="h-7 w-7 text-indigo-400" />;
                                    })()}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{selectedReward.title}</h3>
                                    <p className="text-sm text-zinc-400">{selectedReward.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-sm text-zinc-400">Points Required</p>
                                    <p className="text-xl font-bold text-amber-400">{selectedReward.pointsRequired.toLocaleString()} pts</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-zinc-400">You'll Receive</p>
                                    <p className="text-xl font-bold text-emerald-400">{selectedReward.value}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedReward(null)}
                                        className="border-white/10 text-zinc-300 hover:bg-white/10"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleConfirmRedemption}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium"
                                    >
                                        Confirm
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div variants={fadeUp}>
                    <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    activeCategory === category
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredRewards.map((reward) => {
                            const Icon = getIconForType(reward.type);
                            const canRedeem = reward.pointsRequired <= mockPointsBalance && reward.available;
                            
                            return (
                                <button
                                    key={reward.id}
                                    onClick={() => handleSelectReward(reward)}
                                    disabled={!canRedeem}
                                    className={`group relative rounded-xl border bg-zinc-900/50 p-5 text-left transition-all hover:bg-white/5 ${
                                        selectedReward?.id === reward.id
                                            ? 'border-indigo-500 bg-indigo-500/10'
                                            : canRedeem
                                                ? 'border-white/10'
                                                : 'cursor-not-allowed border-white/5 opacity-50'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
                                            <Icon className="h-6 w-6 text-amber-400" />
                                        </div>
                                        {!reward.available && (
                                            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="mt-4 font-semibold text-white">{reward.title}</h3>
                                    <p className="mt-1 text-sm text-zinc-400">{reward.description}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-lg font-bold text-amber-400">
                                            {reward.pointsRequired.toLocaleString()} pts
                                        </span>
                                        <span className="text-sm font-medium text-emerald-400">
                                            {reward.value}
                                        </span>
                                    </div>
                                    {canRedeem && (
                                        <div className="absolute inset-0 rounded-xl border-2 border-transparent transition-colors group-hover:border-indigo-500/50" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                    <DialogContent className="sm:max-w-md border-white/10 bg-zinc-900">
                        <DialogHeader>
                            <DialogTitle className="text-white">Confirm Redemption</DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                You are about to redeem your points for this reward.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedReward && (
                            <div className="space-y-4 py-4">
                                <div className="rounded-lg bg-white/5 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-400">Reward</span>
                                        <span className="font-medium text-white">{selectedReward.title}</span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-zinc-400">Points Used</span>
                                        <span className="font-medium text-amber-400">
                                            {selectedReward.pointsRequired.toLocaleString()} pts
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-zinc-400">You'll Receive</span>
                                        <span className="font-medium text-emerald-400">{selectedReward.value}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="confirm"
                                        checked={data.confirm}
                                        onChange={(e) => setData('confirm', e.target.checked)}
                                        className="h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500"
                                    />
                                    <Label htmlFor="confirm" className="text-sm text-zinc-300">
                                        I understand this redemption cannot be reversed
                                    </Label>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmation(false)}
                                className="border-white/10 text-zinc-300 hover:bg-white/10"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmitRedemption}
                                disabled={!data.confirm || processing}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium"
                            >
                                {processing ? 'Processing...' : 'Confirm Redemption'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                    <DialogContent className="sm:max-w-md border-white/10 bg-zinc-900">
                        <DialogHeader>
                            <DialogTitle className="text-white">Redemption Successful!</DialogTitle>
                        </DialogHeader>
                        <div className="py-6 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                                <LucideIcons.Check className="h-8 w-8 text-emerald-400" />
                            </div>
                            <p className="text-zinc-300">
                                Your points have been redeemed successfully. Your reward will be applied to your account shortly.
                            </p>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={() => setShowSuccess(false)}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
                            >
                                Done
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </motion.div>
        </UserLayout>
    );
}
