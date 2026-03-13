import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AccountStatementController::index
* @see app/Http/Controllers/AccountStatementController.php:18
* @route '/api/statements'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/statements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AccountStatementController::index
* @see app/Http/Controllers/AccountStatementController.php:18
* @route '/api/statements'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountStatementController::index
* @see app/Http/Controllers/AccountStatementController.php:18
* @route '/api/statements'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccountStatementController::index
* @see app/Http/Controllers/AccountStatementController.php:18
* @route '/api/statements'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AccountStatementController::index
* @see app/Http/Controllers/AccountStatementController.php:18
* @route '/api/statements'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccountStatementController::index
* @see app/Http/Controllers/AccountStatementController.php:18
* @route '/api/statements'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccountStatementController::index
* @see app/Http/Controllers/AccountStatementController.php:18
* @route '/api/statements'
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
* @see \App\Http\Controllers\AccountStatementController::store
* @see app/Http/Controllers/AccountStatementController.php:33
* @route '/api/statements'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/statements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AccountStatementController::store
* @see app/Http/Controllers/AccountStatementController.php:33
* @route '/api/statements'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountStatementController::store
* @see app/Http/Controllers/AccountStatementController.php:33
* @route '/api/statements'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccountStatementController::store
* @see app/Http/Controllers/AccountStatementController.php:33
* @route '/api/statements'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccountStatementController::store
* @see app/Http/Controllers/AccountStatementController.php:33
* @route '/api/statements'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AccountStatementController::download
* @see app/Http/Controllers/AccountStatementController.php:86
* @route '/api/statements/{statement}/download'
*/
export const download = (args: { statement: number | { id: number } } | [statement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/api/statements/{statement}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AccountStatementController::download
* @see app/Http/Controllers/AccountStatementController.php:86
* @route '/api/statements/{statement}/download'
*/
download.url = (args: { statement: number | { id: number } } | [statement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { statement: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { statement: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            statement: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        statement: typeof args.statement === 'object'
        ? args.statement.id
        : args.statement,
    }

    return download.definition.url
            .replace('{statement}', parsedArgs.statement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountStatementController::download
* @see app/Http/Controllers/AccountStatementController.php:86
* @route '/api/statements/{statement}/download'
*/
download.get = (args: { statement: number | { id: number } } | [statement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccountStatementController::download
* @see app/Http/Controllers/AccountStatementController.php:86
* @route '/api/statements/{statement}/download'
*/
download.head = (args: { statement: number | { id: number } } | [statement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AccountStatementController::download
* @see app/Http/Controllers/AccountStatementController.php:86
* @route '/api/statements/{statement}/download'
*/
const downloadForm = (args: { statement: number | { id: number } } | [statement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccountStatementController::download
* @see app/Http/Controllers/AccountStatementController.php:86
* @route '/api/statements/{statement}/download'
*/
downloadForm.get = (args: { statement: number | { id: number } } | [statement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccountStatementController::download
* @see app/Http/Controllers/AccountStatementController.php:86
* @route '/api/statements/{statement}/download'
*/
downloadForm.head = (args: { statement: number | { id: number } } | [statement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

const AccountStatementController = { index, store, download }

export default AccountStatementController