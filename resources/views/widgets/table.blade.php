<div class="load ltable_border" style="border-width: 1px;">
    <table {!! $attributes !!}>
        <thead class="ltable_header">
        <tr>
            @foreach($headers as $header)
                <th {!!$loop->last ? 'style="border-right: none"':''!!}>{{ $header }}</th>
            @endforeach
        </tr>
        </thead>
        <tbody>
        @foreach($rows as $row)
            <tr class="load_column">
                @foreach($row as $item)
                    <td {!!$loop->last ? 'style="border-right: none"':''!!}>{!! $item !!}</td>
                @endforeach
            </tr>
        @endforeach
        </tbody>
    </table>
</div>






























