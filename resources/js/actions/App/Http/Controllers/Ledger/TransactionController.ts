import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Ledger\TransactionController::index
* @see app/Http/Controllers/Ledger/TransactionController.php:21
* @route '/api/ledger/transactions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/ledger/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Ledger\TransactionController::index
* @see app/Http/Controllers/Ledger/TransactionController.php:21
* @route '/api/ledger/transactions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ledger\TransactionController::index
* @see app/Http/Controllers/Ledger/TransactionController.php:21
* @route '/api/ledger/transactions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::index
* @see app/Http/Controllers/Ledger/TransactionController.php:21
* @route '/api/ledger/transactions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::index
* @see app/Http/Controllers/Ledger/TransactionController.php:21
* @route '/api/ledger/transactions'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::index
* @see app/Http/Controllers/Ledger/TransactionController.php:21
* @route '/api/ledger/transactions'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::index
* @see app/Http/Controllers/Ledger/TransactionController.php:21
* @route '/api/ledger/transactions'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Ledger\TransactionController::store
* @see app/Http/Controllers/Ledger/TransactionController.php:85
* @route '/api/ledger/transactions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/ledger/transactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Ledger\TransactionController::store
* @see app/Http/Controllers/Ledger/TransactionController.php:85
* @route '/api/ledger/transactions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ledger\TransactionController::store
* @see app/Http/Controllers/Ledger/TransactionController.php:85
* @route '/api/ledger/transactions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::store
* @see app/Http/Controllers/Ledger/TransactionController.php:85
* @route '/api/ledger/transactions'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::store
* @see app/Http/Controllers/Ledger/TransactionController.php:85
* @route '/api/ledger/transactions'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Ledger\TransactionController::show
* @see app/Http/Controllers/Ledger/TransactionController.php:55
* @route '/api/ledger/transactions/{transaction}'
*/
export const show = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/ledger/transactions/{transaction}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Ledger\TransactionController::show
* @see app/Http/Controllers/Ledger/TransactionController.php:55
* @route '/api/ledger/transactions/{transaction}'
*/
show.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ledger\TransactionController::show
* @see app/Http/Controllers/Ledger/TransactionController.php:55
* @route '/api/ledger/transactions/{transaction}'
*/
show.get = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::show
* @see app/Http/Controllers/Ledger/TransactionController.php:55
* @route '/api/ledger/transactions/{transaction}'
*/
show.head = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::show
* @see app/Http/Controllers/Ledger/TransactionController.php:55
* @route '/api/ledger/transactions/{transaction}'
*/
const showForm = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::show
* @see app/Http/Controllers/Ledger/TransactionController.php:55
* @route '/api/ledger/transactions/{transaction}'
*/
showForm.get = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::show
* @see app/Http/Controllers/Ledger/TransactionController.php:55
* @route '/api/ledger/transactions/{transaction}'
*/
showForm.head = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Ledger\TransactionController::update
* @see app/Http/Controllers/Ledger/TransactionController.php:0
* @route '/api/ledger/transactions/{transaction}'
*/
export const update = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/ledger/transactions/{transaction}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Ledger\TransactionController::update
* @see app/Http/Controllers/Ledger/TransactionController.php:0
* @route '/api/ledger/transactions/{transaction}'
*/
update.url = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

    if (Array.isArray(args)) {
        args = {
            transaction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transaction: args.transaction,
    }

    return update.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ledger\TransactionController::update
* @see app/Http/Controllers/Ledger/TransactionController.php:0
* @route '/api/ledger/transactions/{transaction}'
*/
update.put = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::update
* @see app/Http/Controllers/Ledger/TransactionController.php:0
* @route '/api/ledger/transactions/{transaction}'
*/
update.patch = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::update
* @see app/Http/Controllers/Ledger/TransactionController.php:0
* @route '/api/ledger/transactions/{transaction}'
*/
const updateForm = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::update
* @see app/Http/Controllers/Ledger/TransactionController.php:0
* @route '/api/ledger/transactions/{transaction}'
*/
updateForm.put = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::update
* @see app/Http/Controllers/Ledger/TransactionController.php:0
* @route '/api/ledger/transactions/{transaction}'
*/
updateForm.patch = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Ledger\TransactionController::destroy
* @see app/Http/Controllers/Ledger/TransactionController.php:0
* @route '/api/ledger/transactions/{transaction}'
*/
export const destroy = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/ledger/transactions/{transaction}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Ledger\TransactionController::destroy
* @see app/Http/Controllers/Ledger/TransactionController.php:0
* @route '/api/ledger/transactions/{transaction}'
*/
destroy.url = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

    if (Array.isArray(args)) {
        args = {
            transaction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transaction: args.transaction,
    }

    return destroy.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ledger\TransactionController::destroy
* @see app/Http/Controllers/Ledger/TransactionController.php:0
* @route '/api/ledger/transactions/{transaction}'
*/
destroy.delete = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::destroy
* @see app/Http/Controllers/Ledger/TransactionController.php:0
* @route '/api/ledger/transactions/{transaction}'
*/
const destroyForm = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::destroy
* @see app/Http/Controllers/Ledger/TransactionController.php:0
* @route '/api/ledger/transactions/{transaction}'
*/
destroyForm.delete = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\Ledger\TransactionController::reverse
* @see app/Http/Controllers/Ledger/TransactionController.php:117
* @route '/api/ledger/transactions/{transaction}/reverse'
*/
export const reverse = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

reverse.definition = {
    methods: ["post"],
    url: '/api/ledger/transactions/{transaction}/reverse',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Ledger\TransactionController::reverse
* @see app/Http/Controllers/Ledger/TransactionController.php:117
* @route '/api/ledger/transactions/{transaction}/reverse'
*/
reverse.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return reverse.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ledger\TransactionController::reverse
* @see app/Http/Controllers/Ledger/TransactionController.php:117
* @route '/api/ledger/transactions/{transaction}/reverse'
*/
reverse.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::reverse
* @see app/Http/Controllers/Ledger/TransactionController.php:117
* @route '/api/ledger/transactions/{transaction}/reverse'
*/
const reverseForm = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::reverse
* @see app/Http/Controllers/Ledger/TransactionController.php:117
* @route '/api/ledger/transactions/{transaction}/reverse'
*/
reverseForm.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

reverse.form = reverseForm

/**
* @see \App\Http\Controllers\Ledger\TransactionController::flag
* @see app/Http/Controllers/Ledger/TransactionController.php:141
* @route '/api/ledger/transactions/{transaction}/flag'
*/
export const flag = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flag.url(args, options),
    method: 'post',
})

flag.definition = {
    methods: ["post"],
    url: '/api/ledger/transactions/{transaction}/flag',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Ledger\TransactionController::flag
* @see app/Http/Controllers/Ledger/TransactionController.php:141
* @route '/api/ledger/transactions/{transaction}/flag'
*/
flag.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return flag.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ledger\TransactionController::flag
* @see app/Http/Controllers/Ledger/TransactionController.php:141
* @route '/api/ledger/transactions/{transaction}/flag'
*/
flag.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flag.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::flag
* @see app/Http/Controllers/Ledger/TransactionController.php:141
* @route '/api/ledger/transactions/{transaction}/flag'
*/
const flagForm = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: flag.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ledger\TransactionController::flag
* @see app/Http/Controllers/Ledger/TransactionController.php:141
* @route '/api/ledger/transactions/{transaction}/flag'
*/
flagForm.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: flag.url(args, options),
    method: 'post',
})

flag.form = flagForm

const TransactionController = { index, store, show, update, destroy, reverse, flag }

export default TransactionController