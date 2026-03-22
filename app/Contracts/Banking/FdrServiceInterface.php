<?php

namespace App\Contracts\Banking;

use App\Models\Banking\FdrPlan;
use App\Models\Banking\FdrSubscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

interface FdrServiceInterface
{
    public function calculate(FdrPlan $plan, float $principal, int $months): array;

    public function open(User $user, FdrPlan $plan, array $data): FdrSubscription;

    public function calculateEarlyWithdrawal(FdrSubscription $fdr, ?Carbon $withdrawalDate = null): array;

    public function withdrawEarly(User $user, FdrSubscription $fdr): float;

    public function mature(FdrSubscription $fdr): void;

    public function renew(FdrSubscription $fdr, FdrPlan $newPlan): FdrSubscription;

    public function getActiveSubscriptions(User $user): Collection;

    public function getMaturedSubscriptions(): Collection;
}
