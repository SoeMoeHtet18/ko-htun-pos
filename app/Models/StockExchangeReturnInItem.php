<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\StockExchangeReturnInItem
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
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnInItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnInItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnInItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnInItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnInItem whereStockExchangeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnInItem whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnInItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnInItem whereProductCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockExchangeReturnInItem whereProductPrice($value)
 *
 * @mixin \Eloquent
 */

class StockExchangeReturnInItem extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'stock_exchange_return_in_items';

    public const JSON_API_TYPE = 'stock_exchange_return_in_items';

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
            'product_name' => $this->product ? $this->product->name : null,
            'product_cost' => $this->product_cost,
            'product_price' => $this->product_price,
        ];

        return $fields;
    }

    public function prepareLinks(): array
    {
        return [];
    }

    public function stockExchanges(): BelongsTo
    {
        return $this->belongsTo(StockExchange::class, 'id', 'stock_exchange_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
