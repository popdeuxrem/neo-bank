'use client';

import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Lock,
    Unlock,
    Eye,
    EyeOff,
    RotateCcw,
    AlertTriangle,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { MagnetiqCard } from '@/components/fintech/MagnetiqCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/lib/toast';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Cards',
        href: '/cards',
    },
];

interface Card {
    id: number;
    uuid: string;
    type: string;
    brand: string;
    last_four: string;
    status: 'active' | 'frozen' | 'cancelled';
    cardholder_name: string;
    expiry: string;
    frozen_at: string | null;
    created_at: string;
}

interface CardsPageProps {
    cards: Card[];
}

export default function Cards({ cards: initialCards }: CardsPageProps) {
    const [cards, setCards] = useState<Card[]>(initialCards);
    const [revealedData, setRevealedData] = useState<
        Record<number, { card_number: string; cvv: string }>
    >({});
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [revealingCardId, setRevealingCardId] = useState<number | null>(null);

    const passwordForm = useForm({
        password: '',
    });

    const pinForm = useForm({
        current_pin: '',
        new_pin: '',
    });

    const showToast = (
        type: 'success' | 'error' | 'warning' | 'info',
        title: string,
        description?: string,
    ) => {
        toast(type, title, { description });
    };

    const handleToggleFreeze = async (cardId: number) => {
        try {
            const response = await fetch(`/api/cards/${cardId}/toggle-freeze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to toggle freeze');
            }

            const data = await response.json();

            setCards((prev) =>
                prev.map((card) =>
                    card.id === cardId
                        ? {
                              ...card,
                              status: data.card.status,
                              frozen_at: data.card.frozen_at,
                          }
                        : card,
                ),
            );

            showToast(
                data.card.status === 'frozen' ? 'warning' : 'success',
                data.message,
            );
        } catch (error) {
            showToast(
                'error',
                'Error',
                error instanceof Error
                    ? error.message
                    : 'Failed to toggle freeze',
            );
        }
    };

    const handleRevealRequest = (cardId: number) => {
        setSelectedCardId(cardId);
        setRevealingCardId(cardId);
        setShowPasswordModal(true);
    };

    const handlePasswordSubmit = async () => {
        if (!selectedCardId) return;

        try {
            const response = await fetch(
                `/api/cards/${selectedCardId}/reveal`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        password: passwordForm.data.password,
                    }),
                },
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Invalid password');
            }

            const { token } = await response.json();

            const tokenResponse = await fetch(`/api/cards/reveal/${token}`);
            if (!tokenResponse.ok) {
                throw new Error('Failed to retrieve card data');
            }

            const cardData = await tokenResponse.json();

            setRevealedData((prev) => ({
                ...prev,
                [selectedCardId]: cardData.card,
            }));

            setShowPasswordModal(false);
            passwordForm.reset();

            showToast(
                'success',
                'Card details revealed',
                'Data will be visible for 30 seconds',
            );
        } catch (error) {
            showToast(
                'error',
                'Error',
                error instanceof Error
                    ? error.message
                    : 'Failed to reveal card details',
            );
        } finally {
            setRevealingCardId(null);
            setSelectedCardId(null);
        }
    };

    const handlePinReset = (cardId: number) => {
        setSelectedCardId(cardId);
        setShowPinModal(true);
    };

    const handlePinSubmit = async () => {
        if (!selectedCardId) return;

        try {
            const response = await fetch(
                `/api/cards/${selectedCardId}/update-pin`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        current_pin: pinForm.data.current_pin,
                        new_pin: pinForm.data.new_pin,
                    }),
                },
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update PIN');
            }

            showToast('success', 'PIN updated successfully');

            setShowPinModal(false);
            pinForm.reset();
            setSelectedCardId(null);
        } catch (error) {
            showToast(
                'error',
                'Error',
                error instanceof Error ? error.message : 'Failed to update PIN',
            );
        }
    };

    const hideRevealedData = (cardId: number) => {
        setRevealedData((prev) => {
            const newData = { ...prev };
            delete newData[cardId];
            return newData;
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cards - Magnetiq" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Your Cards</h1>
                </div>

                {cards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 rounded-full bg-muted p-4">
                            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold">
                            No cards yet
                        </h3>
                        <p className="max-w-sm text-muted-foreground">
                            Your virtual cards will appear here once
                            they&apos;re issued.
                        </p>
                    </div>
                ) : (
                    <div
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        data-tour="cards"
                    >
                        {cards.map((card) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-xl bg-card p-6 shadow-lg"
                            >
                                <div className="mb-6 flex justify-center">
                                    <MagnetiqCard
                                        cardholderName={card.cardholder_name}
                                        lastFour={card.last_four}
                                        expiry={card.expiry}
                                        brand={card.brand}
                                        status={card.status}
                                        cvv={revealedData[card.id]?.cvv}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm text-muted-foreground">
                                                Status
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {card.status === 'frozen' ? (
                                                    <Lock className="h-4 w-4 text-red-500" />
                                                ) : card.status === 'active' ? (
                                                    <Unlock className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <AlertTriangle className="h-4 w-4 text-gray-500" />
                                                )}
                                                <span className="font-medium capitalize">
                                                    {card.status}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-sm text-muted-foreground uppercase">
                                            {card.brand}
                                        </span>
                                    </div>

                                    {card.status === 'active' &&
                                        revealedData[card.id] && (
                                            <div className="rounded-lg bg-muted p-3">
                                                <div className="mb-1 text-sm text-muted-foreground">
                                                    Card Number
                                                </div>
                                                <div className="font-mono text-sm">
                                                    {
                                                        revealedData[card.id]
                                                            .card_number
                                                    }
                                                </div>
                                            </div>
                                        )}

                                    <div className="flex flex-wrap gap-2">
                                        {card.status !== 'cancelled' && (
                                            <>
                                                <Button
                                                    variant={
                                                        card.status === 'frozen'
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        handleToggleFreeze(
                                                            card.id,
                                                        )
                                                    }
                                                    className={
                                                        card.status === 'frozen'
                                                            ? 'bg-green-600 hover:bg-green-700'
                                                            : ''
                                                    }
                                                >
                                                    {card.status ===
                                                    'frozen' ? (
                                                        <>
                                                            <Unlock className="mr-2 h-4 w-4" />
                                                            Unfreeze
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock className="mr-2 h-4 w-4" />
                                                            Freeze
                                                        </>
                                                    )}
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        revealedData[card.id]
                                                            ? hideRevealedData(
                                                                  card.id,
                                                              )
                                                            : handleRevealRequest(
                                                                  card.id,
                                                              )
                                                    }
                                                    disabled={
                                                        revealingCardId ===
                                                        card.id
                                                    }
                                                >
                                                    {revealedData[card.id] ? (
                                                        <>
                                                            <EyeOff className="mr-2 h-4 w-4" />
                                                            Hide
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Show Details
                                                        </>
                                                    )}
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handlePinReset(card.id)
                                                    }
                                                >
                                                    <RotateCcw className="mr-2 h-4 w-4" />
                                                    Reset PIN
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Password Modal for Reveal */}
            <Dialog
                open={showPasswordModal}
                onOpenChange={setShowPasswordModal}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Verify Your Identity</DialogTitle>
                        <DialogDescription>
                            Enter your account password to reveal card details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={passwordForm.data.password}
                            onChange={(e) =>
                                passwordForm.setData('password', e.target.value)
                            }
                            placeholder="Enter your password"
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowPasswordModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePasswordSubmit}
                            disabled={!passwordForm.data.password}
                        >
                            Verify
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* PIN Reset Modal */}
            <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Card PIN</DialogTitle>
                        <DialogDescription>
                            Enter your current 4-digit PIN and choose a new one.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="current_pin">Current PIN</Label>
                            <Input
                                id="current_pin"
                                type="password"
                                maxLength={4}
                                value={pinForm.data.current_pin}
                                onChange={(e) =>
                                    pinForm.setData(
                                        'current_pin',
                                        e.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 4),
                                    )
                                }
                                placeholder="4 digits"
                                className="mt-2 font-mono"
                            />
                        </div>
                        <div>
                            <Label htmlFor="new_pin">New PIN</Label>
                            <Input
                                id="new_pin"
                                type="password"
                                maxLength={4}
                                value={pinForm.data.new_pin}
                                onChange={(e) =>
                                    pinForm.setData(
                                        'new_pin',
                                        e.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 4),
                                    )
                                }
                                placeholder="4 digits"
                                className="mt-2 font-mono"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowPinModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePinSubmit}
                            disabled={
                                pinForm.data.current_pin.length !== 4 ||
                                pinForm.data.new_pin.length !== 4
                            }
                        >
                            Update PIN
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
