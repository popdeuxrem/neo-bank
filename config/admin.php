<?php

return [
    /*
    |------------------------------------------------------------------
    | Admin Panel URL Prefix
    |------------------------------------------------------------------
    | This value controls the URL prefix for the admin panel.
    | Change ADMIN_URL_PREFIX in your .env to customise.
    | Default: "admin"
    |
    | Example: setting it to "control-tower" makes the admin
    | accessible at /control-tower instead of /admin
    |------------------------------------------------------------------
    */
    'prefix' => env('ADMIN_URL_PREFIX', 'secure-admin'),

    /*
    |------------------------------------------------------------------
    | Admin Login Route Name
    |------------------------------------------------------------------
    */
    'login_route' => 'admin.login',

    /*
    |------------------------------------------------------------------
    | Admin Guard
    |------------------------------------------------------------------
    */
    'guard' => 'web',

    /*
    |------------------------------------------------------------------
    | Allowed IPs (empty = all IPs allowed)
    |------------------------------------------------------------------
    */
    'allowed_ips' => array_filter(
        explode(',', env('ADMIN_ALLOWED_IPS', ''))
    ),

    /*
    |------------------------------------------------------------------
    | Session key used for admin impersonation
    |------------------------------------------------------------------
    */
    'impersonation_session_key' => 'magnetiq_admin_origin_id',
];
