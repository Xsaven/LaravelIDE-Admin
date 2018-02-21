<?php

namespace Lia;

use Illuminate\Support\ServiceProvider;

class LaravelIdeAdminProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->mergeConfigFrom( __DIR__ . '/../config/lia.php', 'lia' );
        $this->loadTranslationsFrom( __DIR__ . '/../lang', 'lia' );

        $this->publishes([
            __DIR__ . '/../lang' => resource_path('lang/lia')
        ], 'lang');
        //echo trans('lia::system.welcome');
        echo config('lia.title');
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
