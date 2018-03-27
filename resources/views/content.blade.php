<link rel="stylesheet" href="http://ide-admin.loc/vendor/lia/css/nprogress/nprogress.css">
<link rel="stylesheet" href="http://ide-admin.loc/vendor/lia/css/terminal/terminal.css">
<link rel="stylesheet" href="http://ide-admin.loc/vendor/lia/css/filemanager/filemanager.css">
<link rel="stylesheet" href="http://ide-admin.loc/vendor/lia/css/webix/contrast.css">
<link rel="stylesheet" href="http://ide-admin.loc/vendor/lia/css/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="http://ide-admin.loc/vendor/lia/css/layout.css">
<link rel="stylesheet" href="http://ide-admin.loc/vendor/lia/css/AdminLTE.min.css">
<link rel="stylesheet" href="http://ide-admin.loc/vendor/lia/css/goldenlayout/goldenlayout-base.css">
<link rel="stylesheet" href="http://ide-admin.loc/vendor/lia/css/goldenlayout/goldenlayout-dark-theme.css">


<div class="webix_view webix_header lheader" style="border-width: 1px;">
    <div class="webix_template">
        {{ $header or trans('admin.title') }}
        <small>{{ $description or trans('admin.description') }}</small>

        @if ($breadcrumb)
            <ol class="breadcrumb" style="margin-right: 30px; float: right;">
                <li><a href="{{ admin_url('/') }}"><i class="fa fa-dashboard"></i> Home</a></li>
                @foreach($breadcrumb as $item)
                    @if($loop->last)
                        <li class="active">
                            @if (array_has($item, 'icon'))
                                <i class="fa fa-{{ $item['icon'] }}"></i>
                            @endif
                            {{ $item['text'] }}
                        </li>
                    @else
                        <li>
                            <a href="{{ admin_url(array_get($item, 'url')) }}">
                                @if (array_has($item, 'icon'))
                                    <i class="fa fa-{{ $item['icon'] }}"></i>
                                @endif
                                {{ $item['text'] }}
                            </a>
                        </li>
                    @endif
                @endforeach
            </ol>
        @endif
    </div>
</div>


{{--<section class="content">--}}

    @include('lia::partials.error')
    @include('lia::partials.success')
    @include('lia::partials.exception')
    @include('lia::partials.toastr')

    {!! $content !!}

{{--</section>--}}

{!! Admin::script() !!}