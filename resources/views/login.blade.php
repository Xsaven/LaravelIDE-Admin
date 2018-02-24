<!doctype html>
<html lang="{{ config('app.locale') }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ Admin::title() }} | {{ trans('admin.login') }}</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    {!! Admin::css() !!}
</head>
<body class="lm_goldenlayout lm_item"></body>
{!! Admin::js() !!}
<script>
    webix.debug = false;
    var form = {
        view:"form", borderless:true, id: "adminAuthForm",
        elements: [
            { view:"text", label:'{{ trans('admin.username') }}', placeholder: "{{ trans('admin.username') }}", value: "{{ old('username') }}", name:"username" },
            { view:"text", label:'{{ trans('admin.password') }}', placeholder: "{{ trans('admin.password') }}", value: "", name:"password", type: "password" },
            { view:"button", value: "{{ trans('admin.login') }}", click:function(){
                if (this.getParentView().validate()){
                    var userData = $$('adminAuthForm').getValues();
                    userData._token = '{{ csrf_token() }}';
                    var $result = webix.ajax().post('{{ admin_base_path('auth/login') }}', userData).then(function (result) {
                        var data = result.json();
                        if(data.redirect !== undefined) location = '/'+data.redirect;
                        else webix.message({ type:"error", text:"Form data is invalid" });
                    }).fail(function (xhr) {
                        var response = JSON.parse(xhr.response);
                        webix.message({type: 'error', text: response.username});
                    });
                }
                else
                    webix.message({ type:"error", text:"Form data is invalid" });
            }, hotkey: "enter"}
        ], rules:{ "username":webix.rules.isNotEmpty, "password":webix.rules.isNotEmpty }
    };
    webix.ui({
        view:"window", head:"<a href=\"{{ admin_base_path('/') }}\"><b>{{config('lia.name')}}</b></a>",
        width: 400, height: 250, position:function(state){ state.left = (state.maxWidth/2)-200; state.top = 20; }, body:form
    }).show();
</script>
</html>
