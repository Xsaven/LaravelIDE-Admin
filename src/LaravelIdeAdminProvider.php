<?php

namespace Lia;

use Illuminate\Support\ServiceProvider;
use Lia\Addons\Reporter\Reporter;

class LaravelIdeAdminProvider extends ServiceProvider
{
    /**
     * @var array
     */
    protected $commands = [
        'Lia\Console\MakeCommand',
        'Lia\Console\InstallCommand',
        'Lia\Console\UninstallCommand',
        'Lia\Console\ImportCommand',
    ];

    /**
     * The application's route middleware.
     *
     * @var array
     */
    protected $routeMiddleware = [
        'admin.auth'       => \Lia\Middleware\Authenticate::class,
        'admin.log'        => \Lia\Middleware\LogOperation::class,
        'admin.permission' => \Lia\Middleware\Permission::class,
        'admin.bootstrap'  => \Lia\Middleware\Bootstrap::class,
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'admin' => [
            'admin.auth',
            'admin.log',
            'admin.bootstrap',
            'admin.permission',
        ],
    ];

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->mergeConfigFrom( __DIR__ . '/../config/lia.php', 'lia' );
        $this->loadTranslationsFrom( __DIR__ . '/../lang', 'lia' );

        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'lia');

        if (file_exists($routes = admin_path('routes.php'))) {
            $this->loadRoutesFrom($routes);
        }

        if ($this->app->runningInConsole()) {
            $this->publishes([__DIR__.'/../config' => config_path()], 'lia-config');
            $this->publishes([__DIR__.'/../resources/lang' => resource_path('lang')], 'lia-lang');
            $this->publishes([__DIR__.'/../database/migrations' => database_path('migrations')], 'lia-migrations');
            $this->publishes([__DIR__.'/../resources/assets' => public_path('vendor')], 'lia-assets');
        }

        \Lia\Addons\Reporter\Reporter::report();
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->loadAdminAuthConfig();

        $this->registerRouteMiddleware();

        $this->commands($this->commands);
    }

    /**
     * Setup auth configuration.
     *
     * @return void
     */
    protected function loadAdminAuthConfig()
    {
        config(array_dot(config('lia.auth', []), 'auth.'));
    }

    /**
     * Register the route middleware.
     *
     * @return void
     */
    protected function registerRouteMiddleware()
    {
        // register route middleware.
        foreach ($this->routeMiddleware as $key => $middleware) {
            app('router')->aliasMiddleware($key, $middleware);
        }

        // register middleware group.
        foreach ($this->middlewareGroups as $key => $middleware) {
            app('router')->middlewareGroup($key, $middleware);
        }
    }
}
