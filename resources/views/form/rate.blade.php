<div class="{{$viewClass['form-group']}} {!! !$errors->has($errorKey) ? '' : 'has-error' !!}">

    <label for="{{$id}}" class="{{$viewClass['label']}} control-label">{{$label}}</label>

    <div class="{{$viewClass['field']}}">

        @include('lia::form.error')

        <div class="input-group" style="width: 150px">
            <span class="input-group-addon">%</span>
            <input type="text" id="{{$id}}" name="{{$name}}" value="{{ old($column, $value) }}" class="form-control" placeholder="0" style="" {!! $attributes !!} />
        </div>

        @include('lia::form.help-block')

    </div>
</div>
