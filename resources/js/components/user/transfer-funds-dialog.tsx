'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Wallet, 
  Building2,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TransferFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Account {
  id: number;
  uuid: string;
  name: string;
  account_number: string;
  accountType?: {
    name: string;
    slug: string;
  };
  balance?: {
    balance: number;
    available_balance: number;
  };
}

interface ValidationResult {
  valid: boolean;
  availableBalance: number;
  error?: string;
}

const slideIn = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

export function TransferFundsDialog({ open, onOpenChange }: TransferFundsDialogProps) {
  const [step, setStep] = useState(1);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [validatingBalance, setValidatingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<{
    transactionNumber: string;
    amount: number;
  } | null>(null);

  const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
    from_account_id: '' as string | number,
    to_account_id: '' as string | number,
    amount: '',
    description: '',
  });

  const fetchAccounts = useCallback(async () => {
    setLoadingAccounts(true);
    try {
      const response = await fetch('/api/accounts?status=active', {
        headers: {
          'Accept': 'application/json',
        },
      });
      const result = await response.json();
      if (result.data) {
        setAccounts(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchAccounts();
      reset();
      setStep(1);
      setIsComplete(false);
      setLastTransaction(null);
      setBalanceError(null);
    }
  }, [open, fetchAccounts, reset]);

  const validateBalance = useCallback(async (amount: string, fromAccountId: string | number): Promise<ValidationResult> => {
    if (!amount || !fromAccountId) {
      return { valid: false, availableBalance: 0 };
    }

    setValidatingBalance(true);
    setBalanceError(null);

    try {
      const account = accounts.find(acc => acc.id === Number(fromAccountId));
      if (!account) {
        return { valid: false, availableBalance: 0, error: 'Account not found' };
      }

      const amountInCents = Math.round(parseFloat(amount) * 100);
      const availableBalance = account.balance?.available_balance || 0;

      if (amountInCents > availableBalance) {
        return {
          valid: false,
          availableBalance,
          error: `Insufficient funds. Available: $${(availableBalance / 100).toFixed(2)}`
        };
      }

      return { valid: true, availableBalance };
    } catch (error) {
      return { valid: false, availableBalance: 0, error: 'Failed to validate balance' };
    } finally {
      setValidatingBalance(false);
    }
  }, [accounts]);

  const handleAmountChange = useCallback((value: string) => {
    setData('amount', value);
    clearErrors('amount');
    setBalanceError(null);
  }, [setData, clearErrors]);

  const handleFromAccountChange = useCallback((value: string) => {
    setData('from_account_id', value);
    setData('to_account_id', '');
    clearErrors('from_account_id');
    setBalanceError(null);
  }, [setData, clearErrors]);

  const handleToAccountChange = useCallback((value: string) => {
    setData('to_account_id', value);
    clearErrors('to_account_id');
  }, [setData, clearErrors]);

  const canProceedToStep2 = data.from_account_id && data.to_account_id && data.amount;
  
  const canProceedToStep3 = useCallback(async () => {
    const validation = await validateBalance(data.amount, data.from_account_id);
    if (!validation.valid) {
      setBalanceError(validation.error || 'Invalid amount');
      return false;
    }
    setStep(3);
  }, [data.amount, data.from_account_id, validateBalance]);

  const handleSubmit = async () => {
    clearErrors();
    
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          from_account_id: data.from_account_id,
          to_account_id: data.to_account_id,
          amount: parseFloat(data.amount).toFixed(2),
          description: data.description || 'Transfer',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, messages]) => {
            setError(key, Array.isArray(messages) ? messages[0] : messages);
          });
        } else if (result.message) {
          setBalanceError(result.message);
          toast.error(result.message);
        }
        return;
      }

      setLastTransaction({
        transactionNumber: result.data.transaction_number,
        amount: result.data.amount,
      });
      setIsComplete(true);
      toast.success('Transfer completed successfully!');
    } catch (error) {
      console.error('Transfer failed:', error);
      setBalanceError('Transfer failed. Please try again.');
    }
  };

  const resetForm = () => {
    reset();
    setStep(1);
    setIsComplete(false);
    setLastTransaction(null);
    setBalanceError(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return '';
    return `****${accountNumber.slice(-4)}`;
  };

  const selectedFromAccount = accounts.find(acc => acc.id === Number(data.from_account_id));
  const selectedToAccount = accounts.find(acc => acc.id === Number(data.to_account_id));
  const availableBalance = selectedFromAccount?.balance?.available_balance || 0;

  const getStepStatus = (stepNum: number) => {
    if (isComplete) return 'complete';
    if (stepNum < step) return 'complete';
    if (stepNum === step) return 'active';
    return 'pending';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Transfer Funds
          </DialogTitle>
          <DialogDescription>
            Transfer money between your accounts securely.
          </DialogDescription>
        </DialogHeader>

        {!isComplete && (
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`h-2 w-12 rounded-full transition-colors ${
                    getStepStatus(s) === 'complete'
                      ? 'bg-green-500'
                      : getStepStatus(s) === 'active'
                      ? 'bg-blue-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        <div className="min-h-[320px]">
          {isComplete ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20"
              >
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </motion.div>
              <h3 className="mb-2 text-xl font-bold">Transfer Complete!</h3>
              <p className="mb-2 text-sm text-muted-foreground">
                Your transfer of {formatCurrency(parseFloat(data.amount) || 0)} has been processed.
              </p>
              <p className="mb-6 text-xs text-muted-foreground font-mono">
                {lastTransaction?.transactionNumber}
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={resetForm}>
                  Transfer More
                </Button>
                <Button onClick={() => onOpenChange(false)}>
                  Done
                </Button>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" {...slideIn} className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="fromAccount">From Account</Label>
                      <Select
                        value={String(data.from_account_id)}
                        onValueChange={handleFromAccountChange}
                        disabled={loadingAccounts}
                      >
                        <SelectTrigger id="fromAccount" className={errors.from_account_id ? 'border-red-500' : ''}>
                          <SelectValue placeholder={loadingAccounts ? 'Loading accounts...' : 'Select source account'} />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={String(account.id)}>
                              <div className="flex items-center justify-between w-full">
                                <span className="flex items-center gap-2">
                                  <Wallet className="h-4 w-4" />
                                  {account.name}
                                </span>
                                <span className="text-muted-foreground text-sm ml-4">
                                  {formatCurrency((account.balance?.available_balance || 0) / 100)}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.from_account_id && (
                        <p className="text-sm text-red-500 mt-1">{errors.from_account_id}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="toAccount">To Account</Label>
                      <Select
                        value={String(data.to_account_id)}
                        onValueChange={handleToAccountChange}
                        disabled={!data.from_account_id}
                      >
                        <SelectTrigger id="toAccount" className={errors.to_account_id ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select destination account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter(acc => acc.id !== Number(data.from_account_id))
                            .map((account) => (
                              <SelectItem key={account.id} value={String(account.id)}>
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4" />
                                  {account.name}
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {errors.to_account_id && (
                        <p className="text-sm text-red-500 mt-1">{errors.to_account_id}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      if (!data.from_account_id) {
                        setError('from_account_id', 'Please select a source account');
                      } else if (!data.to_account_id) {
                        setError('to_account_id', 'Please select a destination account');
                      } else {
                        clearErrors();
                        setStep(2);
                      }
                    }}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" {...slideIn} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" onClick={() => setStep(1)}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Select amount</span>
                  </div>

                  <Alert variant="default" className="bg-muted">
                    <Wallet className="h-4 w-4" />
                    <AlertDescription className="flex justify-between items-center">
                      <span>Available Balance:</span>
                      <span className="font-semibold">{formatCurrency(availableBalance / 100)}</span>
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={data.amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="0.00"
                        className={`pl-8 text-xl font-bold ${errors.amount ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
                    )}
                    {balanceError && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{balanceError}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="What's this transfer for?"
                    />
                  </div>

                  {data.amount && selectedFromAccount && (
                    <Alert variant="default" className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                      <AlertDescription className="flex justify-between items-center text-blue-700 dark:text-blue-300">
                        <span>After transfer:</span>
                        <span className="font-semibold">
                          {formatCurrency((availableBalance / 100) - parseFloat(data.amount || '0'))}
                        </span>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    className="w-full"
                    onClick={canProceedToStep3}
                    disabled={!data.amount || validatingBalance}
                  >
                    {validatingBalance ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        Review Transfer <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" {...slideIn} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" onClick={() => setStep(2)}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Review & Confirm</span>
                  </div>

                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">From</span>
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedFromAccount?.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">To</span>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedToAccount?.name}</span>
                      </div>
                    </div>
                    <div className="border-t pt-3 flex items-center justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="text-2xl font-bold">
                        {formatCurrency(parseFloat(data.amount || '0'))}
                      </span>
                    </div>
                    {data.description && (
                      <div className="border-t pt-3">
                        <span className="text-muted-foreground text-sm">Description</span>
                        <p className="font-medium">{data.description}</p>
                      </div>
                    )}
                  </div>

                  {balanceError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{balanceError}</AlertDescription>
                    </Alert>
                  )}

                  <Alert variant="default" className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm">
                      Please review the details carefully. This action cannot be undone.
                    </AlertDescription>
                  </Alert>

                  <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Transfer...
                      </>
                    ) : (
                      <>
                        Confirm & Transfer {formatCurrency(parseFloat(data.amount || '0'))}
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          {isComplete && (
            <Button variant="ghost" onClick={resetForm}>
              Transfer More
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
