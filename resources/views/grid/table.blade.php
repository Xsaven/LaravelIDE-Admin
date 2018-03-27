<div class="box">
    <div class="box-header">

        <h3 class="box-title"></h3>

        <div class="pull-right">
            {!! $grid->renderFilter() !!}
            {!! $grid->renderExportButton() !!}
            {!! $grid->renderCreateButton() !!}
        </div>

        <span>
            {!! $grid->renderHeaderTools() !!}
        </span>

    </div>
    <!-- /.box-header -->
    <div class="box-body table-responsive no-padding load ltable_border" style="border-width: 1px;">
        <table class="table table-hover">
            <thead class="ltable_header">
            <tr>
                @foreach($grid->columns() as $column)
                <th>{{$column->getLabel()}}{!! $column->sorter() !!}</th>
                @endforeach
            </tr>
            </thead>
            <tbody>
            @foreach($grid->rows() as $row)
            <tr  class="load_column" {!! $row->getRowAttributes() !!}>
                @foreach($grid->columnNames as $name)
                <td {!! $row->getColumnAttributes($name) !!}>
                    {!! $row->column($name) !!}
                </td>
                @endforeach
            </tr>
            @endforeach
            </tbody>
            {!! $grid->renderFooter() !!}

        </table>
    </div>
    <div class="box-footer clearfix">
        {!! $grid->paginator() !!}
    </div>
    <!-- /.box-body -->
</div>
