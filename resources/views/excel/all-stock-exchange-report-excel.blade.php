<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>Stock Exchange report pdf</title>
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/favicon.ico') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Fonts -->
    <!-- General CSS Files -->
    <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" />
</head>

<body>
    <table width="100%" cellspacing="0" cellpadding="10" style="margin-top: 40px;">
        <thead>
            <tr style="background-color: dodgerblue;">
                <th style="width: 200%;">{{ __('messages.pdf.reference') }}</th>
                <th style="width: 200%;">{{ __('messages.pdf.warehouse') }}</th>
                <th style="width: 200%;">{{ __('messages.pdf.sale_reference') }}</th>
                <th style="width: 200%;">{{ __('messages.pdf.client') }}</th>
                <th style="width: 200%;">{{ __('messages.pdf.return_in_item') }}</th>
                <th style="width: 200%;">{{ __('messages.pdf.return_out_item') }}</th>
                <th style="width: 200%;">{{ __('messages.pdf.return_in_cost') }}</th>
                <th style="width: 300%;">{{ __('messages.pdf.return_out_cost') }}</th>
                <th style="width: 200%;">{{ __('messages.pdf.return_in_price') }}</th>
                <th style="width: 200%;">{{ __('messages.pdf.return_out_price') }}</th>
                <th style="width: 200%;">{{ __('messages.pdf.discount') }}</th>
                <th style="width: 200%;">{{ __('messages.pdf.sub_total') }}</th>
                <th style="width: 200%;">{{ __('messages.pdf.profit') }}</th>
            </tr>
        </thead>
        <tbody>
            @foreach($stockExchanges as $stockExchange)
            <tr align="center">
                <td>{{$stockExchange->reference_code}}</td>
                <td>{{$stockExchange->warehouse->name}}</td>
                <td>{{$stockExchange->sales->reference_code}}</td>
                <td>{{$stockExchange->sales->customer->name}}</td>
                <td>
                    @foreach($stockExchange->returnInItems as $index => $item)
                    {{$item->product->name}}
                    @if(!$loop->last || $loop->count > 1)
                    ,
                    @endif
                    @endforeach
                </td>
                <td>
                    @foreach($stockExchange->returnOutItems as $index => $item)
                    {{$item->product->name}}
                    @if(!$loop->last || $loop->count > 1)
                    ,
                    @endif
                    @endforeach
                </td>
                <td>
                    @php
                    $return_in_cost = 0;
                    foreach($stockExchange->returnInItems as $item) {
                    $return_in_cost += $item->product_cost ?? 0;
                    }
                    @endphp
                    {{ $return_in_cost }}
                </td>
                <td>
                    @php
                    $return_out_cost = 0;
                    foreach($stockExchange->returnOutItems as $item) {
                    $return_out_cost += $item->product_cost ?? 0;
                    }
                    @endphp
                    {{ $return_out_cost }}
                </td>
                <td>
                    @php
                    $return_in_price = 0;
                    foreach($stockExchange->returnInItems as $item) {
                    $return_in_price += $item->product_price ?? 0;
                    }
                    @endphp
                    {{ $return_in_price }}
                </td>
                <td>
                    @php
                    $return_out_price = 0;
                    foreach($stockExchange->returnOutItems as $item) {
                    $return_out_price += $item->product_price ?? 0;
                    }
                    @endphp
                    {{ $return_out_price }}
                </td>
                <td>{{$stockExchange->discount}}</td>
                <td>
                    {{ ($return_out_price -  $stockExchange->discount) - $return_in_price}}
                </td>
                <td>{{(($return_out_price -  $stockExchange->discount) - $return_out_cost) - ($return_in_price - $return_in_cost)}}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>