<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\ConversionItem
 *
 * @property int $id
 * @property int $conversion_id
 * @property int $product_id
 * @property int $quantity
 * @property float $product_cost
 * @property float $product_price
 * @property float $amount
 * @property int $type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|ConversionItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ConversionItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ConversionItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|ConversionItem whereConversionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConversionItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConversionItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConversionItem whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConversionItem whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConversionItem whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConversionItem whereUpdatedAt($value)
 *
 * @property-read \App\Models\Conversion $conversion
 * @property-read mixed $sale_unit
 * @property-read \App\Models\Product $product
 *
 * @mixin \Eloquent
 */
class ConversionItem extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'conversion_items';

    public const JSON_API_TYPE = 'conversion_items';

    protected $fillable = [
        'conversion_id',
        'product_id',
        'quantity',
        'product_cost',
        'product_price',
        'type',
    ];

    public static $rules = [
        'product_id' => 'required|exists:products,id',
        'quantity' => 'nullable|numeric',
        'product_cost' => 'nullable|numeric',
        'product_price' => 'nullable|numeric',
        'type' => 'required',
    ];

    public $casts = [
        'quantity' => 'double',
    ];

    public function prepareLinks(): array
    {
        return [];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'product_id' => $this->product_id,
            'quantity' => $this->quantity,
            'product_cost' => $this->product_cost,
            'product_price' => $this->product_price,
            'type' => $this->type,
        ];

        return $fields;
    }

    public function conversion(): BelongsTo
    {
        return $this->belongsTo(Conversion::class, 'conversion_id', 'id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
