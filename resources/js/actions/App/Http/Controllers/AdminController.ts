import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::auditLogs
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/audit-logs'
*/
export const auditLogs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: auditLogs.url(options),
    method: 'get',
})

auditLogs.definition = {
    methods: ["get","head"],
    url: '/admin/audit-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::auditLogs
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/audit-logs'
*/
auditLogs.url = (options?: RouteQueryOptions) => {
    return auditLogs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::auditLogs
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/audit-logs'
*/
auditLogs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: auditLogs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::auditLogs
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/audit-logs'
*/
auditLogs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: auditLogs.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::auditLogs
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/audit-logs'
*/
const auditLogsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: auditLogs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::auditLogs
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/audit-logs'
*/
auditLogsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: auditLogs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::auditLogs
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/audit-logs'
*/
auditLogsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: auditLogs.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

auditLogs.form = auditLogsForm

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/users'
*/
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/users'
*/
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/users'
*/
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/users'
*/
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/users'
*/
const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/users'
*/
usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/users'
*/
usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

users.form = usersForm

const AdminController = { auditLogs, users }

export default AdminController