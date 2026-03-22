<?php

namespace App\Contracts\Banking;

use App\Models\Banking\DpsPlan;
use App\Models\Banking\DpsSubscription;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface DpsServiceInterface
{
    public function calculate(DpsPlan $plan, float $monthlyAmount, int $months): array;

    public function subscribe(User $user, DpsPlan $plan, array $data): DpsSubscription;

    public function getPaymentSchedule(DpsSubscription $dps): array;

    public function payInstallment(User $user, DpsSubscription $dps): void;

    public function close(User $user, DpsSubscription $dps): void;

    public function getActiveSubscriptions(User $user): Collection;

    public function getMaturedSubscriptions(): Collection;
}
