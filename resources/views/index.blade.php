<!doctype html>
<html lang="{{config('app.locale')}}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ Admin::title() }}</title>
    {!! Admin::css() !!}
    <script>
        function LA() {}
        LA.token = "{{ csrf_token() }}";
                @php $routeCollection = Route::getRoutes(); $routes = []; foreach ($routeCollection as $value) { if(!empty($value->getName())) $routes[$value->getName()] = str_replace('?','',$value->uri()); } @endphp
        var routList = {!! json_encode($routes) !!};
        window.adminPrefix = '{{config('lia.route.prefix')}}';
    </script>
</head>
<body>
<nav id="menuContainer" role="navigation"></nav>
<div id="layoutContainer"></div>
</body>
<script src="{{asset('vendor/lia/lia.js')}}" type="text/javascript"></script>
{{--<script src="http://localhost:8081/lia.js" type="text/javascript"></script>--}}
{!! Admin::js() !!}
</html>