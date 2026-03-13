import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\HealthController::getStats
* @see app/Http/Controllers/Admin/HealthController.php:16
* @route '/admin/health'
*/
export const getStats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStats.url(options),
    method: 'get',
})

getStats.definition = {
    methods: ["get","head"],
    url: '/admin/health',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HealthController::getStats
* @see app/Http/Controllers/Admin/HealthController.php:16
* @route '/admin/health'
*/
getStats.url = (options?: RouteQueryOptions) => {
    return getStats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HealthController::getStats
* @see app/Http/Controllers/Admin/HealthController.php:16
* @route '/admin/health'
*/
getStats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\HealthController::getStats
* @see app/Http/Controllers/Admin/HealthController.php:16
* @route '/admin/health'
*/
getStats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getStats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\HealthController::getStats
* @see app/Http/Controllers/Admin/HealthController.php:16
* @route '/admin/health'
*/
const getStatsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getStats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\HealthController::getStats
* @see app/Http/Controllers/Admin/HealthController.php:16
* @route '/admin/health'
*/
getStatsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getStats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\HealthController::getStats
* @see app/Http/Controllers/Admin/HealthController.php:16
* @route '/admin/health'
*/
getStatsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getStats.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getStats.form = getStatsForm

/**
* @see \App\Http\Controllers\Admin\HealthController::restartQueue
* @see app/Http/Controllers/Admin/HealthController.php:210
* @route '/admin/health/restart-queue'
*/
export const restartQueue = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restartQueue.url(options),
    method: 'post',
})

restartQueue.definition = {
    methods: ["post"],
    url: '/admin/health/restart-queue',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\HealthController::restartQueue
* @see app/Http/Controllers/Admin/HealthController.php:210
* @route '/admin/health/restart-queue'
*/
restartQueue.url = (options?: RouteQueryOptions) => {
    return restartQueue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HealthController::restartQueue
* @see app/Http/Controllers/Admin/HealthController.php:210
* @route '/admin/health/restart-queue'
*/
restartQueue.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restartQueue.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\HealthController::restartQueue
* @see app/Http/Controllers/Admin/HealthController.php:210
* @route '/admin/health/restart-queue'
*/
const restartQueueForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restartQueue.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\HealthController::restartQueue
* @see app/Http/Controllers/Admin/HealthController.php:210
* @route '/admin/health/restart-queue'
*/
restartQueueForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restartQueue.url(options),
    method: 'post',
})

restartQueue.form = restartQueueForm

const HealthController = { getStats, restartQueue }

export default HealthController