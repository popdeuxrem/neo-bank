import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Ledger\AccountController::index
* @see app/Http/Controllers/Ledger/AccountController.php:14
* @route '/api/ledger/accounts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/ledger/accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Ledger\AccountController::index
* @see app/Http/Controllers/Ledger/AccountController.php:14
* @route '/api/ledger/accounts'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ledger\AccountController::index
* @see app/Http/Controllers/Ledger/AccountController.php:14
* @route '/api/ledger/accounts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::index
* @see app/Http/Controllers/Ledger/AccountController.php:14
* @route '/api/ledger/accounts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::index
* @see app/Http/Controllers/Ledger/AccountController.php:14
* @route '/api/ledger/accounts'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::index
* @see app/Http/Controllers/Ledger/AccountController.php:14
* @route '/api/ledger/accounts'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::index
* @see app/Http/Controllers/Ledger/AccountController.php:14
* @route '/api/ledger/accounts'
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
* @see \App\Http\Controllers\Ledger\AccountController::store
* @see app/Http/Controllers/Ledger/AccountController.php:54
* @route '/api/ledger/accounts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/ledger/accounts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Ledger\AccountController::store
* @see app/Http/Controllers/Ledger/AccountController.php:54
* @route '/api/ledger/accounts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ledger\AccountController::store
* @see app/Http/Controllers/Ledger/AccountController.php:54
* @route '/api/ledger/accounts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::store
* @see app/Http/Controllers/Ledger/AccountController.php:54
* @route '/api/ledger/accounts'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::store
* @see app/Http/Controllers/Ledger/AccountController.php:54
* @route '/api/ledger/accounts'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Ledger\AccountController::show
* @see app/Http/Controllers/Ledger/AccountController.php:35
* @route '/api/ledger/accounts/{account}'
*/
export const show = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/ledger/accounts/{account}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Ledger\AccountController::show
* @see app/Http/Controllers/Ledger/AccountController.php:35
* @route '/api/ledger/accounts/{account}'
*/
show.url = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{account}', parsedArgs.account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ledger\AccountController::show
* @see app/Http/Controllers/Ledger/AccountController.php:35
* @route '/api/ledger/accounts/{account}'
*/
show.get = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::show
* @see app/Http/Controllers/Ledger/AccountController.php:35
* @route '/api/ledger/accounts/{account}'
*/
show.head = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::show
* @see app/Http/Controllers/Ledger/AccountController.php:35
* @route '/api/ledger/accounts/{account}'
*/
const showForm = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::show
* @see app/Http/Controllers/Ledger/AccountController.php:35
* @route '/api/ledger/accounts/{account}'
*/
showForm.get = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::show
* @see app/Http/Controllers/Ledger/AccountController.php:35
* @route '/api/ledger/accounts/{account}'
*/
showForm.head = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Ledger\AccountController::update
* @see app/Http/Controllers/Ledger/AccountController.php:71
* @route '/api/ledger/accounts/{account}'
*/
export const update = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/ledger/accounts/{account}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Ledger\AccountController::update
* @see app/Http/Controllers/Ledger/AccountController.php:71
* @route '/api/ledger/accounts/{account}'
*/
update.url = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{account}', parsedArgs.account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ledger\AccountController::update
* @see app/Http/Controllers/Ledger/AccountController.php:71
* @route '/api/ledger/accounts/{account}'
*/
update.put = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::update
* @see app/Http/Controllers/Ledger/AccountController.php:71
* @route '/api/ledger/accounts/{account}'
*/
update.patch = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::update
* @see app/Http/Controllers/Ledger/AccountController.php:71
* @route '/api/ledger/accounts/{account}'
*/
const updateForm = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::update
* @see app/Http/Controllers/Ledger/AccountController.php:71
* @route '/api/ledger/accounts/{account}'
*/
updateForm.put = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::update
* @see app/Http/Controllers/Ledger/AccountController.php:71
* @route '/api/ledger/accounts/{account}'
*/
updateForm.patch = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Ledger\AccountController::destroy
* @see app/Http/Controllers/Ledger/AccountController.php:89
* @route '/api/ledger/accounts/{account}'
*/
export const destroy = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/ledger/accounts/{account}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Ledger\AccountController::destroy
* @see app/Http/Controllers/Ledger/AccountController.php:89
* @route '/api/ledger/accounts/{account}'
*/
destroy.url = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{account}', parsedArgs.account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ledger\AccountController::destroy
* @see app/Http/Controllers/Ledger/AccountController.php:89
* @route '/api/ledger/accounts/{account}'
*/
destroy.delete = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::destroy
* @see app/Http/Controllers/Ledger/AccountController.php:89
* @route '/api/ledger/accounts/{account}'
*/
const destroyForm = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ledger\AccountController::destroy
* @see app/Http/Controllers/Ledger/AccountController.php:89
* @route '/api/ledger/accounts/{account}'
*/
destroyForm.delete = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const AccountController = { index, store, show, update, destroy }

export default AccountController