import { ProductDocument } from "src/products/models/product.schema";
import { UploadDocuemnt } from "src/upload/models/upload.schema";
import { ColorDocument } from "src/variants/models/color.schema";
import { LengthDocument } from "src/variants/models/length.schema";
import { SizesDocument } from "src/variants/models/sizes.schema";
import { VariantDocument } from "src/variants/models/variant.schema";
import { CartItemsDocument } from "./models/car-item.schema";

export const PopulateCartConstants = [
    {
        path: 'user',
        select: { _id: 1, firstname: 1, lastname: 1, email: 1 },
    },
    {
        path: 'items',
        model: CartItemsDocument.name,
        select: { cart_id: 0 },
        populate: [
            {
                path: 'variant_id',
                model: VariantDocument.name,
                populate: [
                    {
                        path: 'images',
                        model: UploadDocuemnt.name,
                        select: { _id: 1, url: 1 },
                    },
                    { path: 'color', model: ColorDocument.name },
                    { path: 'size', model: SizesDocument.name },
                    { path: 'length', model: LengthDocument.name },
                    {
                        path: 'productId',
                        model: ProductDocument.name,
                        select: { _id: 1, name: 1, image: 1, description: 1, price: 1 },
                        populate: [
                            {
                                path: 'image',
                                model: UploadDocuemnt.name,
                                select: { _id: 1, url: 1 },
                            },
                        ],
                    },
                ],
            },
        ],
    },
];
