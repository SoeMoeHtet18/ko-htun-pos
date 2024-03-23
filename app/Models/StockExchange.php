<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\StockExchange
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon $date
 * @property int $warehouse_id
 * @property float|null $tax_rate
 * @property float|null $tax_amount
 * @property float|null $discount
 * @property float|null $shipping
 * @property float|null $grand_total
 * @property int|null $payment_type
 * @property int|null $payment_status
 * @property string|null $note
 * @property string|null $reference_code
 * @property int $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Warehouse $warehouse
 *
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange query()
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange whereDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange whereGrandTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange whereNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange wherePaymentStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange wherePaymentType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange whereReferenceCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange whereShipping($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange whereTaxRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchange whereWarehouseId($value)
 *
 * @mixin Eloquent
 */

class StockExchange extends BaseModel implements HasMedia, JsonResourceful
{
    use HasFactory, InteractsWithMedia, HasJsonResourcefulData;

    protected $table = 'stock_exchanges';

    public const JSON_API_TYPE = 'stock-exchanges';

    protected $fillable = [
        'date',
        'warehouse_id',
        'sales_id',
        'tax_rate',
        'tax_amount',
        'discount',
        'shipping',
        'grand_total',
        'payment_type',
        'note',
        'payment_status',
        'reference_code',
        'user_id',
    ];

    public static $rules = [
        'date' => 'date|required',
        'warehouse_id' => 'required|exists:warehouses,id',
        'sales_id' => 'required|exists:sales,id',
        'tax_rate' => 'nullable|numeric',
        'tax_amount' => 'nullable|numeric',
        'discount' => 'nullable|numeric',
        'shipping' => 'nullable|numeric',
        'grand_total' => 'nullable|numeric',
        'payment_type' => 'numeric|integer',
        'notes' => 'nullable',
        'payment_status' => 'integer|required',
        'reference_code' => 'nullable',
    ];

    public $casts = [
        'date' => 'date',
        'tax_rate' => 'double',
        'tax_amount' => 'double',
        'discount' => 'double',
        'shipping' => 'double',
        'grand_total' => 'double',
        'payment_status' => 'integer',
        'payment_type' => 'integer',
    ];

    // payment type
    const CASH = 1;

    const CHEQUE = 2;

    const BANK_TRANSFER = 3;

    const OTHER = 4;

    // payment status
    const PAID = 1;

    const UNPAID = 2;

    public function prepareLinks(): array
    {
        return [
            'self' => route('stock-exchanges.show', $this->id),
        ];
    }

    public function prepareAttributes(): array
    {
        $returnInItemNames = $this->returnInItems->map(function ($item) {
            return $item->product->name;
        })->toArray();

        $returnOutItemNames = $this->returnOutItems->map(function ($item) {
            return $item->product->name;
        })->toArray();

        $returnInItemNames = join(', ', $returnInItemNames);
        $returnOutItemNames = join(', ', $returnOutItemNames);

        $fields = [
            'id' => $this->id,
            'date' => $this->date,
            'warehouse_id' => $this->warehouse_id,
            'warehouse_name' => $this->warehouse->name,
            'tax_rate' => $this->tax_rate,
            'tax_amount' => $this->tax_amount,
            'discount' => $this->discount,
            'shipping' => $this->shipping,
            'grand_total' => $this->grand_total,
            'payment_type' => $this->payment_type,
            'note' => $this->note,
            'payment_status' => $this->payment_status,
            'reference_code' => $this->reference_code,
            'sales_id' => $this->sales_id,
            'sales_reference_code' => $this->sales->reference_code,
            'return_in_items_name' => $returnInItemNames,
            'return_out_items_name' => $returnOutItemNames,
            'return_in_items' => $this->returnInItems,
            'return_out_items' => $this->returnOutItems,
            'created_at' => $this->created_at,
            'customer_name' => $this->sales->customer->name,
        ];

        return $fields;
    }


    public function returnInItems()
    {
        return $this->hasMany(StockExchangeReturnInItem::class, 'stock_exchange_id', 'id');
    }

    public function returnOutItems()
    {
        return $this->hasMany(StockExchangeReturnOutItem::class, 'stock_exchange_id', 'id');
    }

    public function sales()
    {
        return $this->belongsTo(Sale::class, 'sales_id', 'id');
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'id');
    }
}
