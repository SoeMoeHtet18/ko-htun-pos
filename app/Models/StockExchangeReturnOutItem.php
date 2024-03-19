<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\StockExchangeReturnOutItem
 *
 * @property int $id
 * @property int $stock_exchange_id
 * @property int $product_id
 * @property float|null $product_cost
 * @property float|null $product_price
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Product $product
 * @property-read \App\Models\StockExchange $stockExchange
 *
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnOutItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnOutItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnOutItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnOutItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnOutItem whereStockExchangeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnOutItem whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnOutItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnOutItem whereProductCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnOutItem whereProductPrice($value)
 *
 * @mixin \Eloquent
 */

class StockExchangeReturnOutItem extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $fillable = [
        'stock_exchange_id',
        'product_id',
        'product_cost',
        'product_price'
    ];

    public function prepareAttributes(): array
    {
        $fields = [
            'stock_exchange_id' => $this->stock_exchange_id,
            'product_id' => $this->product_id,
            'product_name' => $this->product->name,
            'product_cost' => $this->product_cost,
            'product_price' => $this->product_price,
        ];

        return $fields;
    }

    public function prepareLinks(): array
    {
        return [];
    }

    public function stockExchanges()
    {
        return $this->belongsTo(StockExchange::class, 'id', 'stock_exchange_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
