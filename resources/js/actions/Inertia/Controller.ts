import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
const Controller42a740574ecbfbac32f8cc353fc32db9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

Controller42a740574ecbfbac32f8cc353fc32db9.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9.url = (options?: RouteQueryOptions) => {
    return Controller42a740574ecbfbac32f8cc353fc32db9.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
const Controller42a740574ecbfbac32f8cc353fc32db9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller42a740574ecbfbac32f8cc353fc32db9.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller42a740574ecbfbac32f8cc353fc32db9.form = Controller42a740574ecbfbac32f8cc353fc32db9Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/accounts'
*/
const Controller577f898b9efe99e2813f63fd231bd8c7 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller577f898b9efe99e2813f63fd231bd8c7.url(options),
    method: 'get',
})

Controller577f898b9efe99e2813f63fd231bd8c7.definition = {
    methods: ["get","head"],
    url: '/accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/accounts'
*/
Controller577f898b9efe99e2813f63fd231bd8c7.url = (options?: RouteQueryOptions) => {
    return Controller577f898b9efe99e2813f63fd231bd8c7.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/accounts'
*/
Controller577f898b9efe99e2813f63fd231bd8c7.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller577f898b9efe99e2813f63fd231bd8c7.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/accounts'
*/
Controller577f898b9efe99e2813f63fd231bd8c7.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller577f898b9efe99e2813f63fd231bd8c7.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/accounts'
*/
const Controller577f898b9efe99e2813f63fd231bd8c7Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller577f898b9efe99e2813f63fd231bd8c7.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/accounts'
*/
Controller577f898b9efe99e2813f63fd231bd8c7Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller577f898b9efe99e2813f63fd231bd8c7.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/accounts'
*/
Controller577f898b9efe99e2813f63fd231bd8c7Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller577f898b9efe99e2813f63fd231bd8c7.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller577f898b9efe99e2813f63fd231bd8c7.form = Controller577f898b9efe99e2813f63fd231bd8c7Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/transactions'
*/
const Controllere5aa2cad321b30063c3b415df5452200 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere5aa2cad321b30063c3b415df5452200.url(options),
    method: 'get',
})

Controllere5aa2cad321b30063c3b415df5452200.definition = {
    methods: ["get","head"],
    url: '/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/transactions'
*/
Controllere5aa2cad321b30063c3b415df5452200.url = (options?: RouteQueryOptions) => {
    return Controllere5aa2cad321b30063c3b415df5452200.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/transactions'
*/
Controllere5aa2cad321b30063c3b415df5452200.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere5aa2cad321b30063c3b415df5452200.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/transactions'
*/
Controllere5aa2cad321b30063c3b415df5452200.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllere5aa2cad321b30063c3b415df5452200.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/transactions'
*/
const Controllere5aa2cad321b30063c3b415df5452200Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere5aa2cad321b30063c3b415df5452200.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/transactions'
*/
Controllere5aa2cad321b30063c3b415df5452200Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere5aa2cad321b30063c3b415df5452200.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/transactions'
*/
Controllere5aa2cad321b30063c3b415df5452200Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere5aa2cad321b30063c3b415df5452200.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controllere5aa2cad321b30063c3b415df5452200.form = Controllere5aa2cad321b30063c3b415df5452200Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/ledger'
*/
const Controller82ab1171cebd2a35871fd91fed8a67c6 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller82ab1171cebd2a35871fd91fed8a67c6.url(options),
    method: 'get',
})

Controller82ab1171cebd2a35871fd91fed8a67c6.definition = {
    methods: ["get","head"],
    url: '/ledger',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/ledger'
*/
Controller82ab1171cebd2a35871fd91fed8a67c6.url = (options?: RouteQueryOptions) => {
    return Controller82ab1171cebd2a35871fd91fed8a67c6.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/ledger'
*/
Controller82ab1171cebd2a35871fd91fed8a67c6.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller82ab1171cebd2a35871fd91fed8a67c6.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/ledger'
*/
Controller82ab1171cebd2a35871fd91fed8a67c6.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller82ab1171cebd2a35871fd91fed8a67c6.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/ledger'
*/
const Controller82ab1171cebd2a35871fd91fed8a67c6Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller82ab1171cebd2a35871fd91fed8a67c6.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/ledger'
*/
Controller82ab1171cebd2a35871fd91fed8a67c6Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller82ab1171cebd2a35871fd91fed8a67c6.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/ledger'
*/
Controller82ab1171cebd2a35871fd91fed8a67c6Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller82ab1171cebd2a35871fd91fed8a67c6.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller82ab1171cebd2a35871fd91fed8a67c6.form = Controller82ab1171cebd2a35871fd91fed8a67c6Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/payments'
*/
const Controller3716bc4c1885b225d47f9da4a37440dd = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller3716bc4c1885b225d47f9da4a37440dd.url(options),
    method: 'get',
})

Controller3716bc4c1885b225d47f9da4a37440dd.definition = {
    methods: ["get","head"],
    url: '/payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/payments'
*/
Controller3716bc4c1885b225d47f9da4a37440dd.url = (options?: RouteQueryOptions) => {
    return Controller3716bc4c1885b225d47f9da4a37440dd.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/payments'
*/
Controller3716bc4c1885b225d47f9da4a37440dd.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller3716bc4c1885b225d47f9da4a37440dd.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/payments'
*/
Controller3716bc4c1885b225d47f9da4a37440dd.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller3716bc4c1885b225d47f9da4a37440dd.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/payments'
*/
const Controller3716bc4c1885b225d47f9da4a37440ddForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller3716bc4c1885b225d47f9da4a37440dd.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/payments'
*/
Controller3716bc4c1885b225d47f9da4a37440ddForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller3716bc4c1885b225d47f9da4a37440dd.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/payments'
*/
Controller3716bc4c1885b225d47f9da4a37440ddForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller3716bc4c1885b225d47f9da4a37440dd.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller3716bc4c1885b225d47f9da4a37440dd.form = Controller3716bc4c1885b225d47f9da4a37440ddForm
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
const Controllere19ee86e9cf603ce1a59a1ec5d21dec5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition = {
    methods: ["get","head"],
    url: '/settings/appearance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url = (options?: RouteQueryOptions) => {
    return Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
const Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controllere19ee86e9cf603ce1a59a1ec5d21dec5.form = Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form

const Controller = {
    '/dashboard': Controller42a740574ecbfbac32f8cc353fc32db9,
    '/accounts': Controller577f898b9efe99e2813f63fd231bd8c7,
    '/transactions': Controllere5aa2cad321b30063c3b415df5452200,
    '/ledger': Controller82ab1171cebd2a35871fd91fed8a67c6,
    '/payments': Controller3716bc4c1885b225d47f9da4a37440dd,
    '/settings/appearance': Controllere19ee86e9cf603ce1a59a1ec5d21dec5,
}

export default Controller