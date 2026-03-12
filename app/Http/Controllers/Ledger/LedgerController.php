<?php

namespace App\Http\Controllers\Ledger;

use App\Http\Controllers\Controller;
use App\Models\Ledger\Account;
use App\Models\Ledger\AccountType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LedgerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AccountType::with('accounts');

        $accountTypes = $query->get()->map(fn ($type) => [
            'id' => $type->id,
            'name' => $type->name,
            'slug' => $type->slug,
            'nature' => $type->nature,
            'description' => $type->description,
            'accounts' => $type->accounts->map(fn ($account) => [
                'id' => $account->id,
                'uuid' => $account->uuid,
                'account_number' => $account->account_number,
                'name' => $account->name,
                'balance' => $account->getCurrentBalance(),
                'is_active' => $account->is_active,
            ]),
        ]);

        return Inertia::render('ledger', [
            'accountTypes' => $accountTypes,
        ]);
    }

    public function chartOfAccounts(Request $request): Response
    {
        $accounts = Account::with(['accountType', 'balance', 'parent'])
            ->orderBy('account_number')
            ->get()
            ->groupBy('account_type_id');

        return Inertia::render('ledger', [
            'accounts' => $accounts,
        ]);
    }
}
