import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ApiController::accounts
* @see app/Http/Controllers/Api/ApiController.php:17
* @route '/api/v1/accounts'
*/
export const accounts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accounts.url(options),
    method: 'get',
})

accounts.definition = {
    methods: ["get","head"],
    url: '/api/v1/accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ApiController::accounts
* @see app/Http/Controllers/Api/ApiController.php:17
* @route '/api/v1/accounts'
*/
accounts.url = (options?: RouteQueryOptions) => {
    return accounts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiController::accounts
* @see app/Http/Controllers/Api/ApiController.php:17
* @route '/api/v1/accounts'
*/
accounts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accounts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::accounts
* @see app/Http/Controllers/Api/ApiController.php:17
* @route '/api/v1/accounts'
*/
accounts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: accounts.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ApiController::accounts
* @see app/Http/Controllers/Api/ApiController.php:17
* @route '/api/v1/accounts'
*/
const accountsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: accounts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::accounts
* @see app/Http/Controllers/Api/ApiController.php:17
* @route '/api/v1/accounts'
*/
accountsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: accounts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::accounts
* @see app/Http/Controllers/Api/ApiController.php:17
* @route '/api/v1/accounts'
*/
accountsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: accounts.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

accounts.form = accountsForm

/**
* @see \App\Http\Controllers\Api\ApiController::showAccount
* @see app/Http/Controllers/Api/ApiController.php:34
* @route '/api/v1/accounts/{account}'
*/
export const showAccount = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showAccount.url(args, options),
    method: 'get',
})

showAccount.definition = {
    methods: ["get","head"],
    url: '/api/v1/accounts/{account}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ApiController::showAccount
* @see app/Http/Controllers/Api/ApiController.php:34
* @route '/api/v1/accounts/{account}'
*/
showAccount.url = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { account: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { account: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            account: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        account: typeof args.account === 'object'
        ? args.account.id
        : args.account,
    }

    return showAccount.definition.url
            .replace('{account}', parsedArgs.account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiController::showAccount
* @see app/Http/Controllers/Api/ApiController.php:34
* @route '/api/v1/accounts/{account}'
*/
showAccount.get = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showAccount.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::showAccount
* @see app/Http/Controllers/Api/ApiController.php:34
* @route '/api/v1/accounts/{account}'
*/
showAccount.head = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showAccount.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ApiController::showAccount
* @see app/Http/Controllers/Api/ApiController.php:34
* @route '/api/v1/accounts/{account}'
*/
const showAccountForm = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showAccount.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::showAccount
* @see app/Http/Controllers/Api/ApiController.php:34
* @route '/api/v1/accounts/{account}'
*/
showAccountForm.get = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showAccount.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::showAccount
* @see app/Http/Controllers/Api/ApiController.php:34
* @route '/api/v1/accounts/{account}'
*/
showAccountForm.head = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showAccount.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showAccount.form = showAccountForm

/**
* @see \App\Http\Controllers\Api\ApiController::transactions
* @see app/Http/Controllers/Api/ApiController.php:41
* @route '/api/v1/transactions'
*/
export const transactions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})

transactions.definition = {
    methods: ["get","head"],
    url: '/api/v1/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ApiController::transactions
* @see app/Http/Controllers/Api/ApiController.php:41
* @route '/api/v1/transactions'
*/
transactions.url = (options?: RouteQueryOptions) => {
    return transactions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiController::transactions
* @see app/Http/Controllers/Api/ApiController.php:41
* @route '/api/v1/transactions'
*/
transactions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::transactions
* @see app/Http/Controllers/Api/ApiController.php:41
* @route '/api/v1/transactions'
*/
transactions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transactions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ApiController::transactions
* @see app/Http/Controllers/Api/ApiController.php:41
* @route '/api/v1/transactions'
*/
const transactionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: transactions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::transactions
* @see app/Http/Controllers/Api/ApiController.php:41
* @route '/api/v1/transactions'
*/
transactionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: transactions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::transactions
* @see app/Http/Controllers/Api/ApiController.php:41
* @route '/api/v1/transactions'
*/
transactionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: transactions.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

transactions.form = transactionsForm

/**
* @see \App\Http\Controllers\Api\ApiController::showTransaction
* @see app/Http/Controllers/Api/ApiController.php:66
* @route '/api/v1/transactions/{transaction}'
*/
export const showTransaction = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showTransaction.url(args, options),
    method: 'get',
})

showTransaction.definition = {
    methods: ["get","head"],
    url: '/api/v1/transactions/{transaction}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ApiController::showTransaction
* @see app/Http/Controllers/Api/ApiController.php:66
* @route '/api/v1/transactions/{transaction}'
*/
showTransaction.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transaction: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transaction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transaction: typeof args.transaction === 'object'
        ? args.transaction.id
        : args.transaction,
    }

    return showTransaction.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiController::showTransaction
* @see app/Http/Controllers/Api/ApiController.php:66
* @route '/api/v1/transactions/{transaction}'
*/
showTransaction.get = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showTransaction.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::showTransaction
* @see app/Http/Controllers/Api/ApiController.php:66
* @route '/api/v1/transactions/{transaction}'
*/
showTransaction.head = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showTransaction.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ApiController::showTransaction
* @see app/Http/Controllers/Api/ApiController.php:66
* @route '/api/v1/transactions/{transaction}'
*/
const showTransactionForm = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showTransaction.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::showTransaction
* @see app/Http/Controllers/Api/ApiController.php:66
* @route '/api/v1/transactions/{transaction}'
*/
showTransactionForm.get = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showTransaction.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::showTransaction
* @see app/Http/Controllers/Api/ApiController.php:66
* @route '/api/v1/transactions/{transaction}'
*/
showTransactionForm.head = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showTransaction.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showTransaction.form = showTransactionForm

/**
* @see \App\Http\Controllers\Api\ApiController::payments
* @see app/Http/Controllers/Api/ApiController.php:73
* @route '/api/v1/payments'
*/
export const payments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})

payments.definition = {
    methods: ["get","head"],
    url: '/api/v1/payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ApiController::payments
* @see app/Http/Controllers/Api/ApiController.php:73
* @route '/api/v1/payments'
*/
payments.url = (options?: RouteQueryOptions) => {
    return payments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiController::payments
* @see app/Http/Controllers/Api/ApiController.php:73
* @route '/api/v1/payments'
*/
payments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::payments
* @see app/Http/Controllers/Api/ApiController.php:73
* @route '/api/v1/payments'
*/
payments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payments.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ApiController::payments
* @see app/Http/Controllers/Api/ApiController.php:73
* @route '/api/v1/payments'
*/
const paymentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payments.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::payments
* @see app/Http/Controllers/Api/ApiController.php:73
* @route '/api/v1/payments'
*/
paymentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payments.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::payments
* @see app/Http/Controllers/Api/ApiController.php:73
* @route '/api/v1/payments'
*/
paymentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payments.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

payments.form = paymentsForm

/**
* @see \App\Http\Controllers\Api\ApiController::showPayment
* @see app/Http/Controllers/Api/ApiController.php:94
* @route '/api/v1/payments/{payment}'
*/
export const showPayment = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPayment.url(args, options),
    method: 'get',
})

showPayment.definition = {
    methods: ["get","head"],
    url: '/api/v1/payments/{payment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ApiController::showPayment
* @see app/Http/Controllers/Api/ApiController.php:94
* @route '/api/v1/payments/{payment}'
*/
showPayment.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: typeof args.payment === 'object'
        ? args.payment.id
        : args.payment,
    }

    return showPayment.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiController::showPayment
* @see app/Http/Controllers/Api/ApiController.php:94
* @route '/api/v1/payments/{payment}'
*/
showPayment.get = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPayment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::showPayment
* @see app/Http/Controllers/Api/ApiController.php:94
* @route '/api/v1/payments/{payment}'
*/
showPayment.head = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showPayment.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ApiController::showPayment
* @see app/Http/Controllers/Api/ApiController.php:94
* @route '/api/v1/payments/{payment}'
*/
const showPaymentForm = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPayment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::showPayment
* @see app/Http/Controllers/Api/ApiController.php:94
* @route '/api/v1/payments/{payment}'
*/
showPaymentForm.get = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPayment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::showPayment
* @see app/Http/Controllers/Api/ApiController.php:94
* @route '/api/v1/payments/{payment}'
*/
showPaymentForm.head = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPayment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showPayment.form = showPaymentForm

/**
* @see \App\Http\Controllers\Api\ApiController::stats
* @see app/Http/Controllers/Api/ApiController.php:101
* @route '/api/v1/stats'
*/
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/api/v1/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ApiController::stats
* @see app/Http/Controllers/Api/ApiController.php:101
* @route '/api/v1/stats'
*/
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiController::stats
* @see app/Http/Controllers/Api/ApiController.php:101
* @route '/api/v1/stats'
*/
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::stats
* @see app/Http/Controllers/Api/ApiController.php:101
* @route '/api/v1/stats'
*/
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ApiController::stats
* @see app/Http/Controllers/Api/ApiController.php:101
* @route '/api/v1/stats'
*/
const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::stats
* @see app/Http/Controllers/Api/ApiController.php:101
* @route '/api/v1/stats'
*/
statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ApiController::stats
* @see app/Http/Controllers/Api/ApiController.php:101
* @route '/api/v1/stats'
*/
statsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

stats.form = statsForm

const ApiController = { accounts, showAccount, transactions, showTransaction, payments, showPayment, stats }

export default ApiController