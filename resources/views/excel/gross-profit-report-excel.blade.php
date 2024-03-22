<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title> Sale report pdf</title>
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/favicon.ico') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Fonts -->
    <!-- General CSS Files -->
    <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" />
</head>

<body>
    <h3>Sale</h3>
    <table width="100%" cellspacing="0" cellpadding="10" style="margin-top: 20px;">
        <thead>
            <tr style="background-color: dodgerblue;">
                <th style="width: 200%">{{ __('messages.pdf.product_code') }}</th>
                <th style="width: 300%">{{ __('messages.pdf.product_name') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.qty') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.cost') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.price') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.profit') }}</th>
            </tr>
        </thead>
        <tbody>
            @php
            $saleTotalQty = 0;
            $saleTotalCost = 0;
            $saleTotalPrice = 0;
            @endphp
            @foreach($data['sales'] as $sale)
            <tr align="center">
                <td>{{ $sale->code }}</td>
                <td>{{ $sale->name }}</td>
                <td>
                    @php
                    $qty = $sale->saleItems->count();
                    $saleTotalQty += $qty;
                    echo $qty;
                    @endphp
                </td>
                <td style="float: left">
                    @php
                    $item_cost = 0;
                    foreach($sale->saleItems as $item) {
                        $item_cost += $item->product_cost;
                    }
                    $saleTotalCost += $item_cost;
                    echo $item_cost;
                    @endphp
                </td>
                <td style="float: left">
                    @php
                    $item_price = 0;
                    foreach($sale->saleItems as $item) {
                        $item_price += $item->product_price;
                    }
                    $saleTotalPrice += $item_price;
                    echo $item_price;
                    @endphp
                </td>
                <td style="float: left">{{ $item_price - $item_cost }}</td>
            </tr>
            @endforeach
            <tr>
                <td colspan="2">Total</td>
                <td>{{ $saleTotalQty }}</td>
                <td>{{ $saleTotalCost }}</td>
                <td>{{ $saleTotalPrice }}</td>
                @php
                $saleProfit = $saleTotalPrice - $saleTotalCost ;
                @endphp
                <td>{{ $saleProfit }}</td>
            </tr>
        </tbody>
    </table>
    
    <h3>Stock Exchange</h3>
    <table width="100%" cellspacing="0" cellpadding="10" style="margin-top: 20px;">
        <thead>
            <tr style="background-color: dodgerblue;">
                <th style="width: 200%">{{ __('messages.pdf.return_in_item') }}</th>
                <th style="width: 300%">{{ __('messages.pdf.return_out_item') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.return_in_cost') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.return_in_price') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.return_out_cost') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.return_out_price') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.profit') }}</th>
            </tr>
        </thead>
        <tbody>
            @php
            $returnInTotalCost = 0;
            $returnInTotalPrice = 0;
            $returnOutTotalCost = 0;
            $returnOutTotalPrice = 0;
            @endphp
            @foreach($data['stockExchanges'] as $stockExchange)
            <tr align="center">
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
                    $returnInTotalCost += $return_in_cost;
                    @endphp
                    {{ $return_in_cost }}
                </td>
                <td>
                    @php
                    $return_in_price = 0;
                    foreach($stockExchange->returnInItems as $item) {
                    $return_in_price += $item->product_price ?? 0;
                    }
                    $returnInTotalPrice += $return_in_price;
                    @endphp
                    {{ $return_in_price }}
                </td>
                <td>
                    @php
                    $return_out_cost = 0;
                    foreach($stockExchange->returnOutItems as $item) {
                    $return_out_cost += $item->product_cost ?? 0;
                    }
                    $returnOutTotalCost += $return_out_cost;
                    @endphp
                    {{ $return_out_cost }}
                </td>
                <td>
                    @php
                    $return_out_price = 0;
                    foreach($stockExchange->returnOutItems as $item) {
                    $return_out_price += $item->product_price ?? 0;
                    }
                    $returnOutTotalPrice += $return_out_price;
                    @endphp
                    {{ $return_out_price }}
                </td>
                <td>{{($return_out_price - $return_out_cost) - ($return_in_price - $return_in_cost)}}</td>
            </tr>
            @endforeach
            <tr>
                <td colspan="2">Total</td>
                <td>{{ $returnInTotalCost }}</td>
                <td>{{ $returnInTotalPrice }}</td>
                <td>{{ $returnOutTotalCost }}</td>
                <td>{{ $returnOutTotalPrice }}</td>
                @php
                $stockExchangeProfit = ($returnOutTotalPrice - $returnOutTotalCost) - ($returnInTotalPrice - $returnInTotalCost);
                @endphp
                <td>{{ $stockExchangeProfit }}</td>
            </tr>
        </tbody>
    </table>
    
    <h3>Sale Return</h3>
    <table width="100%" cellspacing="0" cellpadding="10" style="margin-top: 20px;">
        <thead>
            <tr style="background-color: dodgerblue;">
                <th style="width: 200%">{{ __('messages.pdf.product_code') }}</th>
                <th style="width: 300%">{{ __('messages.pdf.product_name') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.qty') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.cost') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.price') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.loss') }}</th>
            </tr>
        </thead>
        <tbody>
            @php
            $saleReturnTotalQty = 0;
            $saleReturnTotalCost = 0;
            $saleReturnTotalPrice = 0;
            @endphp
            @foreach($data['saleReturns'] as $saleReturn)
            <tr align="center">
                <td>{{ $saleReturn->code }}</td>
                <td>{{ $saleReturn->name }}</td>
                <td>
                    @php
                    $qty = $saleReturn->saleReturnItems->count();
                    $saleReturnTotalQty += $qty;
                    echo $qty;
                    @endphp
                </td>
                <td style="float: left">
                    @php
                    $item_cost = 0;
                    foreach($saleReturn->saleReturnItems as $item) {
                        $item_cost += $item->product_cost;
                    }
                    $saleReturnTotalCost += $item_cost;
                    echo $item_cost;
                    @endphp
                </td>
                <td style="float: left">
                    @php
                    $item_price = 0;
                    foreach($saleReturn->saleReturnItems as $item) {
                        $item_price += $item->product_price;
                    }
                    $saleReturnTotalPrice += $item_price;
                    echo $item_price;
                    @endphp
                </td>
                <td style="float: left">{{ $item_price - $item_cost }}</td>
            </tr>
            @endforeach
            <tr>
                <td colspan="2">Total</td>
                <td>{{ $saleReturnTotalQty }}</td>
                <td>{{ $saleReturnTotalCost }}</td>
                <td>{{ $saleReturnTotalPrice }}</td>
                @php
                $saleReturnLoss = $saleReturnTotalPrice - $saleReturnTotalCost;
                @endphp
                <td>{{ $saleReturnLoss }}</td>
            </tr>
        </tbody>
    </table>
    
    <h3>Profit Calculation</h3>
    <table width="100%" cellspacing="0" cellpadding="10" style="margin-top: 20px;">
        <thead>
            <tr style="background-color: dodgerblue;">
                <th style="width: 300%">{{ __('messages.pdf.type') }}</th>
                <th style="width: 500%">{{ __('messages.pdf.total_amount') }}</th>
            </tr>
        </thead>
        <tbody>
            <tr align="center">
                <td>Sale Profit</td>
                <td>{{ $saleProfit }}</td>
            </tr>
            <tr align="center">
                <td>Stock Exchange Profit</td>
                <td>{{ $stockExchangeProfit }}</td>
            </tr>
            <tr align="center">
                <td>Sub Profit</td>
                @php
                $subProfit = $saleProfit + $stockExchangeProfit;
                @endphp
                <td>{{ $subProfit }}</td>
            </tr>
            <tr align="center">
                <td>Sale Return Loss</td>
                <td>{{ $saleReturnLoss }}</td>
            </tr>
            <tr align="center">
                <td>Total Profit</td>
                <td>{{ $subProfit - $saleReturnLoss }}</td>
            </tr>
        </tbody>
    </table>
</body>

</html>
