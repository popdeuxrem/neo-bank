import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\OversightController::index
* @see app/Http/Controllers/Admin/OversightController.php:19
* @route '/admin/oversight'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/oversight',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OversightController::index
* @see app/Http/Controllers/Admin/OversightController.php:19
* @route '/admin/oversight'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OversightController::index
* @see app/Http/Controllers/Admin/OversightController.php:19
* @route '/admin/oversight'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::index
* @see app/Http/Controllers/Admin/OversightController.php:19
* @route '/admin/oversight'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::index
* @see app/Http/Controllers/Admin/OversightController.php:19
* @route '/admin/oversight'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::index
* @see app/Http/Controllers/Admin/OversightController.php:19
* @route '/admin/oversight'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::index
* @see app/Http/Controllers/Admin/OversightController.php:19
* @route '/admin/oversight'
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
* @see \App\Http\Controllers\Admin\OversightController::approveKYC
* @see app/Http/Controllers/Admin/OversightController.php:89
* @route '/admin/oversight/kyc/{document}/approve'
*/
export const approveKYC = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveKYC.url(args, options),
    method: 'post',
})

approveKYC.definition = {
    methods: ["post"],
    url: '/admin/oversight/kyc/{document}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\OversightController::approveKYC
* @see app/Http/Controllers/Admin/OversightController.php:89
* @route '/admin/oversight/kyc/{document}/approve'
*/
approveKYC.url = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { document: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            document: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        document: typeof args.document === 'object'
        ? args.document.id
        : args.document,
    }

    return approveKYC.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OversightController::approveKYC
* @see app/Http/Controllers/Admin/OversightController.php:89
* @route '/admin/oversight/kyc/{document}/approve'
*/
approveKYC.post = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveKYC.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::approveKYC
* @see app/Http/Controllers/Admin/OversightController.php:89
* @route '/admin/oversight/kyc/{document}/approve'
*/
const approveKYCForm = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approveKYC.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::approveKYC
* @see app/Http/Controllers/Admin/OversightController.php:89
* @route '/admin/oversight/kyc/{document}/approve'
*/
approveKYCForm.post = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approveKYC.url(args, options),
    method: 'post',
})

approveKYC.form = approveKYCForm

/**
* @see \App\Http\Controllers\Admin\OversightController::rejectKYC
* @see app/Http/Controllers/Admin/OversightController.php:117
* @route '/admin/oversight/kyc/{document}/reject'
*/
export const rejectKYC = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejectKYC.url(args, options),
    method: 'post',
})

rejectKYC.definition = {
    methods: ["post"],
    url: '/admin/oversight/kyc/{document}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\OversightController::rejectKYC
* @see app/Http/Controllers/Admin/OversightController.php:117
* @route '/admin/oversight/kyc/{document}/reject'
*/
rejectKYC.url = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { document: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            document: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        document: typeof args.document === 'object'
        ? args.document.id
        : args.document,
    }

    return rejectKYC.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OversightController::rejectKYC
* @see app/Http/Controllers/Admin/OversightController.php:117
* @route '/admin/oversight/kyc/{document}/reject'
*/
rejectKYC.post = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejectKYC.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::rejectKYC
* @see app/Http/Controllers/Admin/OversightController.php:117
* @route '/admin/oversight/kyc/{document}/reject'
*/
const rejectKYCForm = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rejectKYC.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::rejectKYC
* @see app/Http/Controllers/Admin/OversightController.php:117
* @route '/admin/oversight/kyc/{document}/reject'
*/
rejectKYCForm.post = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rejectKYC.url(args, options),
    method: 'post',
})

rejectKYC.form = rejectKYCForm

/**
* @see \App\Http\Controllers\Admin\OversightController::resolveFraud
* @see app/Http/Controllers/Admin/OversightController.php:136
* @route '/admin/oversight/fraud/{transaction}/resolve'
*/
export const resolveFraud = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolveFraud.url(args, options),
    method: 'post',
})

resolveFraud.definition = {
    methods: ["post"],
    url: '/admin/oversight/fraud/{transaction}/resolve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\OversightController::resolveFraud
* @see app/Http/Controllers/Admin/OversightController.php:136
* @route '/admin/oversight/fraud/{transaction}/resolve'
*/
resolveFraud.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return resolveFraud.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OversightController::resolveFraud
* @see app/Http/Controllers/Admin/OversightController.php:136
* @route '/admin/oversight/fraud/{transaction}/resolve'
*/
resolveFraud.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolveFraud.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::resolveFraud
* @see app/Http/Controllers/Admin/OversightController.php:136
* @route '/admin/oversight/fraud/{transaction}/resolve'
*/
const resolveFraudForm = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolveFraud.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::resolveFraud
* @see app/Http/Controllers/Admin/OversightController.php:136
* @route '/admin/oversight/fraud/{transaction}/resolve'
*/
resolveFraudForm.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolveFraud.url(args, options),
    method: 'post',
})

resolveFraud.form = resolveFraudForm

/**
* @see \App\Http\Controllers\Admin\OversightController::blockUser
* @see app/Http/Controllers/Admin/OversightController.php:185
* @route '/admin/oversight/user/{user}/block'
*/
export const blockUser = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: blockUser.url(args, options),
    method: 'post',
})

blockUser.definition = {
    methods: ["post"],
    url: '/admin/oversight/user/{user}/block',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\OversightController::blockUser
* @see app/Http/Controllers/Admin/OversightController.php:185
* @route '/admin/oversight/user/{user}/block'
*/
blockUser.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return blockUser.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OversightController::blockUser
* @see app/Http/Controllers/Admin/OversightController.php:185
* @route '/admin/oversight/user/{user}/block'
*/
blockUser.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: blockUser.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::blockUser
* @see app/Http/Controllers/Admin/OversightController.php:185
* @route '/admin/oversight/user/{user}/block'
*/
const blockUserForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: blockUser.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::blockUser
* @see app/Http/Controllers/Admin/OversightController.php:185
* @route '/admin/oversight/user/{user}/block'
*/
blockUserForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: blockUser.url(args, options),
    method: 'post',
})

blockUser.form = blockUserForm

/**
* @see \App\Http\Controllers\Admin\OversightController::updates
* @see app/Http/Controllers/Admin/OversightController.php:198
* @route '/admin/oversight/updates'
*/
export const updates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: updates.url(options),
    method: 'get',
})

updates.definition = {
    methods: ["get","head"],
    url: '/admin/oversight/updates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OversightController::updates
* @see app/Http/Controllers/Admin/OversightController.php:198
* @route '/admin/oversight/updates'
*/
updates.url = (options?: RouteQueryOptions) => {
    return updates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OversightController::updates
* @see app/Http/Controllers/Admin/OversightController.php:198
* @route '/admin/oversight/updates'
*/
updates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: updates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::updates
* @see app/Http/Controllers/Admin/OversightController.php:198
* @route '/admin/oversight/updates'
*/
updates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: updates.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::updates
* @see app/Http/Controllers/Admin/OversightController.php:198
* @route '/admin/oversight/updates'
*/
const updatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: updates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::updates
* @see app/Http/Controllers/Admin/OversightController.php:198
* @route '/admin/oversight/updates'
*/
updatesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: updates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OversightController::updates
* @see app/Http/Controllers/Admin/OversightController.php:198
* @route '/admin/oversight/updates'
*/
updatesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: updates.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

updates.form = updatesForm

const OversightController = { index, approveKYC, rejectKYC, resolveFraud, blockUser, updates }

export default OversightController