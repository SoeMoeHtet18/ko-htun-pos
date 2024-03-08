<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * Class Conversion
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon $date
 * @property string|null $reference_code
 * @property int $warehouse_id
 * @property int $total_stock_in_products
 * @property int $total_stock_out_products
 * @property int $remark
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection|\Spatie\MediaLibrary\MediaCollections\Models\Media[] $media
 *  * @property-read \App\Models\Warehouse $warehouse
 * @property-read int|null $media_count
 *  * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\ConversionItem[] $conversionItems
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Conversion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Conversion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Conversion query()
 * @method static \Illuminate\Database\Eloquent\Builder|Conversion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Conversion whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Conversion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Conversion whereReferenceCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Conversion whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Conversion whereWarehouseId($value)
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ConversionItem> $conversionItems
 * @property-read int|null \App\Models\ConversionItem whereType($value) $conversion_items_count
 * @property-read \App\Models\Warehouse $warehouse
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Conversion whereTotalProducts($value)
 *
 * @mixin \Eloquent
 */
class Conversion extends BaseModel implements HasMedia, JsonResourceful
{
    use HasFactory, InteractsWithMedia, HasJsonResourcefulData;

    protected $table = 'conversions';

    public const JSON_API_TYPE = 'conversions';

    protected $fillable = [
        'reference_code',
        'date',
        'warehouse_id',
        'total_stock_in_products',
        'total_stock_out_products',
        'remark'
    ];

    public static $rules = [
        'reference_code' => 'nullable',
        'date' => 'date|required',
        'warehouse_id' => 'required|exists:warehouses,id',
        'total_stock_in_products' => 'required',
        'total_stock_out_products' => 'required',
        'remark' => 'nullable'
    ];

    public $casts = [
        'date' => 'date',
    ];

    public function prepareLinks(): array
    {
        return [
            'self' => route('conversions.show', $this->id),
        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'reference_code' => $this->reference_code,
            'date' => $this->date,
            'warehouse_id' => $this->warehouse_id,
            'warehouse_name' => $this->warehouse->name,
            'total_stock_in_products' => $this->total_stock_in_products,
            'total_stock_out_products' => $this->total_stock_out_products,
            'remark' => $this->remark,
            'created_at' => $this->created_at,
            'conversion_items' => $this->conversionItems,
        ];

        return $fields;
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'id');
    }

    public function conversionItems(): HasMany
    {
        return $this->hasMany(ConversionItem::class, 'conversion_id', 'id');
    }
}
