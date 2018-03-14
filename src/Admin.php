<?php

namespace Lia;

use Illuminate\Database\Eloquent\Model as EloquentModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Route;
use InvalidArgumentException;
use Lia\Addons\TranslationManager\Models\Translation;

/**
 * Class Admin.
 */
class Admin
{

    /**
     * @var array
     */
    public static $script = [];

    /**
     * @var array
     */
    public static $css = [];

    /**
     * @var array
     */
    public static $js = [];

    /**
     * @var array
     */
    public static $extensions = [];

    /**
     * @param $model
     *
     * @return mixed
     */
    public function getModel($model)
    {
        if ($model instanceof EloquentModel) {
            return $model;
        }

        if (is_string($model) && class_exists($model)) {
            return $this->getModel(new $model());
        }

        throw new InvalidArgumentException("$model is not a valid model");
    }

    /**
     * Add css or get all css.
     *
     * @param null $css
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View|void
     */
    public static function css($css = null)
    {
        if (!is_null($css)) {
            self::$css = array_merge(self::$css, (array) $css);

            return;
        }

        return view('lia::partials.css', ['css' => array_unique(static::$css)]);
    }

    /**
     * Add js or get all js.
     *
     * @param null $js
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View|void
     */
    public static function js($js = null)
    {
        if (!is_null($js)) {
            self::$js = array_merge(self::$js, (array) $js);

            return;
        }

        return view('lia::partials.js', ['js' => array_unique(static::$js)]);
    }

    /**
     * @param string $script
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View|void
     */
    public static function script($script = '')
    {
        if (!empty($script)) {
            self::$script = array_merge(self::$script, (array) $script);

            return;
        }

        return view('lia::partials.script', ['script' => array_unique(self::$script)]);
    }

    /**
     * Get admin title.
     *
     * @return Config
     */
    public function title()
    {
        return config('lia.title');
    }

    /**
     * Get current login user.
     *
     * @return mixed
     */
    public function user()
    {
        return Auth::guard('admin')->user();
    }

    public function adminVariables(){
        $routeCollection = \Route::getRoutes(); $routes = []; foreach ($routeCollection as $value) { if(!empty($value->getName())) $routes[$value->getName()] = str_replace('?','',$value->uri()); }
        $routes = json_encode($routes);
        $prefix = config('lia.route.prefix');
        $admin = json_encode($this->user()->toArray());
        $csrf_token = csrf_token();
        $adminLang = json_encode(trans('admin'));
        $adminCfg = json_encode(config('lia'));
        $locales = array_values(array_unique(array_merge([config('app.locale')], Translation::groupBy('locale')->pluck('locale')->toArray())));
        $locales = json_encode($locales);
        $defaultLocale = config('app.locale');

        $script = <<<EOT
                
        function LA() {}
        LA.token = "{$csrf_token}";
        var routList = {$routes};
        window.admin = {$admin};
        window.__ = {$adminLang};
        window.cfg = {$adminCfg};
        window.adminPrefix = '{$prefix}';
        window.locales = '{$locales}';
        window.defaultLocale = '{$defaultLocale}';
EOT;

        $this->script($script);
    }

    /**
     * Register the auth routes.
     *
     * @return void
     */
    public function registerAuthRoutes()
    {
        $attributes = [
            'prefix'     => config('lia.route.prefix'),
            'namespace'  => 'Lia\Controllers',
            'middleware' => config('lia.route.middleware'),
        ];

        Route::group($attributes, function ($router) {
            $router->get('/', 'LiaController@index')->name('admin.index');
            $router->get('auth/login', 'AuthController@getLogin')->name('admin.login.index');
            $router->post('auth/login', 'AuthController@postLogin')->name('admin.login.post');
            $router->get('auth/logout', 'AuthController@getLogout')->name('admin.login.logout');
        });
    }

    /**
     * Extend a extension.
     *
     * @param string $name
     * @param string $class
     *
     * @return void
     */
    public static function extend($name, $class)
    {
        static::$extensions[$name] = $class;
    }
}
