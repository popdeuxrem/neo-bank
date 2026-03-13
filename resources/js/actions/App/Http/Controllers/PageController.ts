import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PageController::landing
* @see app/Http/Controllers/PageController.php:9
* @route '/'
*/
export const landing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: landing.url(options),
    method: 'get',
})

landing.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::landing
* @see app/Http/Controllers/PageController.php:9
* @route '/'
*/
landing.url = (options?: RouteQueryOptions) => {
    return landing.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::landing
* @see app/Http/Controllers/PageController.php:9
* @route '/'
*/
landing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: landing.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::landing
* @see app/Http/Controllers/PageController.php:9
* @route '/'
*/
landing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: landing.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PageController::landing
* @see app/Http/Controllers/PageController.php:9
* @route '/'
*/
const landingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: landing.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::landing
* @see app/Http/Controllers/PageController.php:9
* @route '/'
*/
landingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: landing.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::landing
* @see app/Http/Controllers/PageController.php:9
* @route '/'
*/
landingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: landing.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

landing.form = landingForm

/**
* @see \App\Http\Controllers\PageController::privacy
* @see app/Http/Controllers/PageController.php:14
* @route '/privacy'
*/
export const privacy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacy.url(options),
    method: 'get',
})

privacy.definition = {
    methods: ["get","head"],
    url: '/privacy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::privacy
* @see app/Http/Controllers/PageController.php:14
* @route '/privacy'
*/
privacy.url = (options?: RouteQueryOptions) => {
    return privacy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::privacy
* @see app/Http/Controllers/PageController.php:14
* @route '/privacy'
*/
privacy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::privacy
* @see app/Http/Controllers/PageController.php:14
* @route '/privacy'
*/
privacy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: privacy.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PageController::privacy
* @see app/Http/Controllers/PageController.php:14
* @route '/privacy'
*/
const privacyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: privacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::privacy
* @see app/Http/Controllers/PageController.php:14
* @route '/privacy'
*/
privacyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: privacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::privacy
* @see app/Http/Controllers/PageController.php:14
* @route '/privacy'
*/
privacyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: privacy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

privacy.form = privacyForm

/**
* @see \App\Http\Controllers\PageController::terms
* @see app/Http/Controllers/PageController.php:19
* @route '/terms'
*/
export const terms = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: terms.url(options),
    method: 'get',
})

terms.definition = {
    methods: ["get","head"],
    url: '/terms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::terms
* @see app/Http/Controllers/PageController.php:19
* @route '/terms'
*/
terms.url = (options?: RouteQueryOptions) => {
    return terms.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::terms
* @see app/Http/Controllers/PageController.php:19
* @route '/terms'
*/
terms.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: terms.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::terms
* @see app/Http/Controllers/PageController.php:19
* @route '/terms'
*/
terms.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: terms.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PageController::terms
* @see app/Http/Controllers/PageController.php:19
* @route '/terms'
*/
const termsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: terms.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::terms
* @see app/Http/Controllers/PageController.php:19
* @route '/terms'
*/
termsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: terms.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::terms
* @see app/Http/Controllers/PageController.php:19
* @route '/terms'
*/
termsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: terms.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

terms.form = termsForm

/**
* @see \App\Http\Controllers\PageController::riskDisclosures
* @see app/Http/Controllers/PageController.php:24
* @route '/risk-disclosures'
*/
export const riskDisclosures = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riskDisclosures.url(options),
    method: 'get',
})

riskDisclosures.definition = {
    methods: ["get","head"],
    url: '/risk-disclosures',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::riskDisclosures
* @see app/Http/Controllers/PageController.php:24
* @route '/risk-disclosures'
*/
riskDisclosures.url = (options?: RouteQueryOptions) => {
    return riskDisclosures.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::riskDisclosures
* @see app/Http/Controllers/PageController.php:24
* @route '/risk-disclosures'
*/
riskDisclosures.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riskDisclosures.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::riskDisclosures
* @see app/Http/Controllers/PageController.php:24
* @route '/risk-disclosures'
*/
riskDisclosures.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: riskDisclosures.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PageController::riskDisclosures
* @see app/Http/Controllers/PageController.php:24
* @route '/risk-disclosures'
*/
const riskDisclosuresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: riskDisclosures.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::riskDisclosures
* @see app/Http/Controllers/PageController.php:24
* @route '/risk-disclosures'
*/
riskDisclosuresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: riskDisclosures.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::riskDisclosures
* @see app/Http/Controllers/PageController.php:24
* @route '/risk-disclosures'
*/
riskDisclosuresForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: riskDisclosures.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

riskDisclosures.form = riskDisclosuresForm

/**
* @see \App\Http\Controllers\PageController::notFound
* @see app/Http/Controllers/PageController.php:29
* @route '/{fallbackPlaceholder}'
*/
export const notFound = (args: { fallbackPlaceholder: string | number } | [fallbackPlaceholder: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notFound.url(args, options),
    method: 'get',
})

notFound.definition = {
    methods: ["get","head"],
    url: '/{fallbackPlaceholder}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::notFound
* @see app/Http/Controllers/PageController.php:29
* @route '/{fallbackPlaceholder}'
*/
notFound.url = (args: { fallbackPlaceholder: string | number } | [fallbackPlaceholder: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fallbackPlaceholder: args }
    }

    if (Array.isArray(args)) {
        args = {
            fallbackPlaceholder: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fallbackPlaceholder: args.fallbackPlaceholder,
    }

    return notFound.definition.url
            .replace('{fallbackPlaceholder}', parsedArgs.fallbackPlaceholder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::notFound
* @see app/Http/Controllers/PageController.php:29
* @route '/{fallbackPlaceholder}'
*/
notFound.get = (args: { fallbackPlaceholder: string | number } | [fallbackPlaceholder: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notFound.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::notFound
* @see app/Http/Controllers/PageController.php:29
* @route '/{fallbackPlaceholder}'
*/
notFound.head = (args: { fallbackPlaceholder: string | number } | [fallbackPlaceholder: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: notFound.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PageController::notFound
* @see app/Http/Controllers/PageController.php:29
* @route '/{fallbackPlaceholder}'
*/
const notFoundForm = (args: { fallbackPlaceholder: string | number } | [fallbackPlaceholder: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: notFound.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::notFound
* @see app/Http/Controllers/PageController.php:29
* @route '/{fallbackPlaceholder}'
*/
notFoundForm.get = (args: { fallbackPlaceholder: string | number } | [fallbackPlaceholder: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: notFound.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PageController::notFound
* @see app/Http/Controllers/PageController.php:29
* @route '/{fallbackPlaceholder}'
*/
notFoundForm.head = (args: { fallbackPlaceholder: string | number } | [fallbackPlaceholder: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: notFound.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

notFound.form = notFoundForm

const PageController = { landing, privacy, terms, riskDisclosures, notFound }

export default PageController