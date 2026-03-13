import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Ledger\LedgerController::chartOfAccounts
* @see app/Http/Controllers/Ledger/LedgerController.php:39
* @route '/ledger/chart'
*/
export const chartOfAccounts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: chartOfAccounts.url(options),
    method: 'get',
})

chartOfAccounts.definition = {
    methods: ["get","head"],
    url: '/ledger/chart',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Ledger\LedgerController::chartOfAccounts
* @see app/Http/Controllers/Ledger/LedgerController.php:39
* @route '/ledger/chart'
*/
chartOfAccounts.url = (options?: RouteQueryOptions) => {
    return chartOfAccounts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ledger\LedgerController::chartOfAccounts
* @see app/Http/Controllers/Ledger/LedgerController.php:39
* @route '/ledger/chart'
*/
chartOfAccounts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: chartOfAccounts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\LedgerController::chartOfAccounts
* @see app/Http/Controllers/Ledger/LedgerController.php:39
* @route '/ledger/chart'
*/
chartOfAccounts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: chartOfAccounts.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Ledger\LedgerController::chartOfAccounts
* @see app/Http/Controllers/Ledger/LedgerController.php:39
* @route '/ledger/chart'
*/
const chartOfAccountsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: chartOfAccounts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\LedgerController::chartOfAccounts
* @see app/Http/Controllers/Ledger/LedgerController.php:39
* @route '/ledger/chart'
*/
chartOfAccountsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: chartOfAccounts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\LedgerController::chartOfAccounts
* @see app/Http/Controllers/Ledger/LedgerController.php:39
* @route '/ledger/chart'
*/
chartOfAccountsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: chartOfAccounts.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

chartOfAccounts.form = chartOfAccountsForm

const LedgerController = { chartOfAccounts }

export default LedgerController