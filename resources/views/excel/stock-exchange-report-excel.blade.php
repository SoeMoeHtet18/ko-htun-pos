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
                <th style="width: 200%;">{{ __('messages.pdf.return_in') }}</th>
                <th style="width: 200%;">{{ __('messages.pdf.return_out') }}</th>
                <th style="width: 200%;">{{ __('messages.pdf.total') }}</th>
                <th style="width: 300%;">{{ __('messages.pdf.payment_status') }}</th>
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
                    @if(!$loop->last)
                    {{$item->product->name}},
                    @else
                    {{$item->product->name}}
                    @endif
                    @endif
                    @endforeach
                </td>
                <td>
                    @foreach($stockExchange->returnOutItems as $index => $item)
                    {{$item->product->name}}
                    @if(!$loop->last || $loop->count > 1)
                    @if(!$loop->last)
                    {{$item->product->name}},
                    @else
                    {{$item->product->name}}
                    @endif
                    @endif
                    @endforeach
                </td>
                <td style="float: left">{{number_format($stockExchange->grand_total, 2)}}</td>
                @if($stockExchange->payment_status == \App\Models\StockExchange::PAID)
                <td>paid</td>
                @elseif($stockExchange->payment_status == \App\Models\StockExchange::UNPAID)
                <td>unpaid</td>
                @endif
            </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>