<!doctype html>
<html lang="{{ config('app.locale') }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon" href="{{asset('vendor/lia/favicon.ico')}}" type="image/x-icon">
    <title>{{ Admin::title() }}</title>
    {!! Admin::css() !!}
    {!! Admin::script() !!}
</head>
<body>
<nav id="menuContainer" role="navigation"></nav>
<div id="layoutContainer"></div>
</body>
{!! Admin::js() !!}
<script src="{{asset('vendor/lia/bootstrap3-editable/js/bootstrap-editable.min.js')}}"></script>
<script>
    $.fn.editable.defaults.params = function (params) {params._token = LA.token;params._editable = 1;params._method = 'PUT';return params;};
    $.noConflict();
</script>
<script src="{{asset('vendor/lia/vs/loader.js')}}"></script>
<script src="{{asset('vendor/lia/vs.init.js')}}"></script>
<script src="{{asset('vendor/lia/vs.init.js')}}"></script>
</html>