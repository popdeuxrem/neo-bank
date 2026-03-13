<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Pusher\Pusher;

class BroadcastServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        require base_path('routes/channels.php');

        // Configure Pusher/Reverb for broadcasting
        $this->app->singleton(Pusher::class, function ($app) {
            $config = $app['config']['broadcasting.connections.pusher'] ?? [
                'key' => env('PUSHER_APP_KEY', 'local'),
                'secret' => env('PUSHER_APP_SECRET', 'local'),
                'app_id' => env('PUSHER_APP_ID', 'local'),
                'options' => [
                    'cluster' => env('PUSHER_CLUSTER', 'mt1'),
                    'host' => env('PUSHER_HOST', '127.0.0.1'),
                    'port' => env('PUSHER_PORT', 443),
                    'scheme' => env('PUSHER_SCHEME', 'https'),
                    'useTLS' => env('PUSHER_USE_TLS', true),
                ],
            ];

            return new Pusher(
                $config['key'],
                $config['secret'],
                $config['app_id'],
                $config['options']
            );
        });
    }
}
