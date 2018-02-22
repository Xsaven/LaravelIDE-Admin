<p align="center"><h1>Laravel-IDE Admin Manager.</h1></p>

Requirements
------------
 - PHP >= 7.1.0
 - Laravel >= 5.5.0
 - Fileinfo PHP Extension


Installation
------------
> This package requires PHP 7.1+ and Laravel 5.5

First, install laravel 5.5, and make sure that the database connection settings are correct.

```
composer require encore/laravel-ide-admin
```

Then run these commands to publish assets and config：
```
php artisan vendor:publish --provider="Lia\LaravelIdeAdminProvider"
```
After run command you can find config file in `config/lie.php`, in this file you can change the install directory,db connection or table names.

At last run following command to finish install. 
```
php artisan lie:install
```

Open `http://localhost/admin/` in browser,use username `admin` and password `admin` to login.

Configurations
------------
The file `config/lie.php` contains an array of configurations, you can find the default configurations in there.

Exception reporter
------------
Open `app/Exceptions/Handler.php`, call `Reporter::report()` inside `report` method:
```php
<?php

namespace App\Exceptions;

use Lia\Addons\Reporter\Reporter;
use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    ...

    public function report(Exception $exception)
    {
        if ($this->shouldReport($exception)) {
            Reporter::report($exception);
        }

//        parent::report($exception);
    }
    
    ...

}
```
 

Other
------------
`LaravelIDE-Admin` based on following plugins or services:

+ [Laravel](https://laravel.com/)
+ [Webix](https://webix.com/)
+ [font-awesome](http://fontawesome.io)

License
------------
`LaravelIDE-Admin` is licensed under [The MIT License (MIT)](LICENSE).