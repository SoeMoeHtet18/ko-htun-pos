<?php

namespace App\Exports;

use App\Models\Customer;
use App\Models\Sale;
use App\Models\StockExchange;
use App\Models\StockExchangeReturnInItem;
use App\Models\StockExchangeReturnOutItem;
use App\Models\Warehouse;
use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Database\Eloquent\Builder;

class StockExchangeReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $search = request()->get('search') ?? '';

        $customer = (Customer::where('name', 'LIKE', "%$search%")->get()->count() != 0);
        $warehouse = (Warehouse::where('name', 'LIKE', "%$search%")->get()->count() != 0);
        $sales = (Sale::where('reference_code', 'LIKE', "%$search%")->get()->count() != 0);
        $returnInItem = StockExchangeReturnInItem::whereHas('product', function (Builder $q) use ($search) {
            $q->where('name', 'LIKE', "%$search%");
        })->exists();
        $returnOutItem = StockExchangeReturnOutItem::whereHas('product', function (Builder $q) use ($search) {
            $q->where('name', 'LIKE', "%$search%");
        })->exists();

        $stockExchanges = StockExchange::query();

        if ($warehouse || $sales || $customer || $returnInItem || $returnOutItem) {
            $stockExchanges->whereHas('warehouse', function (Builder $q) use ($search, $warehouse) {
                if ($warehouse) {
                    $q->where('name', 'LIKE', "%$search%");
                }
            })->whereHas('sales', function (Builder $q) use ($search, $sales, $customer) {
                if ($sales) {
                    $q->where('reference_code', 'LIKE', "%$search%");
                }
                if ($customer) {
                    $q->whereHas('customer', function (Builder $q) use ($search) {
                        $q->where('name', 'LIKE', "%$search%");
                    });
                }
            })->whereHas('returnInItems.product', function (Builder $q) use ($search, $returnInItem) {
                if ($returnInItem) {
                    $q->where('name', 'LIKE', "%$search%")
                        ->orWhere('code', 'LIKE', "%$search%");
                }
            })->whereHas('returnOutItems.product', function (Builder $q) use ($search, $returnOutItem) {
                if ($returnOutItem) {
                    $q->where('name', 'LIKE', "%$search%")
                        ->orWhere('code', 'LIKE', "%$search%");
                }
            });
        }

        if ($search !== '') {
            $stockExchanges->orWhere('reference_code', 'LIKE', "%$search%");
        }

        $startDate = request()->get('start_date');
        $endDate = request()->get('start_date');

        if ($startDate != 'null' && $endDate != 'null' && $startDate && $endDate) {
            $stockExchanges = $stockExchanges
                ->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
        }

        $stockExchanges = $stockExchanges->get();

        return view('excel.all-stock-exchange-report-excel', ['stockExchanges' => $stockExchanges]);
    }
}
