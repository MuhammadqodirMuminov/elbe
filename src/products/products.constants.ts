import { UploadDocuemnt } from "src/upload/models/upload.schema";
import { LengthDocument } from "src/variants/models/length.schema";
import { SizeGuideDocument } from "src/variants/models/size-guide.schema";
import { SizesDocument } from "src/variants/models/sizes.schema";
import { VariantDocument } from "src/variants/models/variant.schema";

export const populatedCostants = [
    { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
    { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
    { path: 'image', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } },

    {
        path: 'variants',
        model: VariantDocument.name,
        populate: [
            {
                path: 'color',
                select: { _id: 1, title: 1, value: 1, value2: 1 },
            },
            {
                path: 'images',
                model: UploadDocuemnt.name,
                select: { _id: 1, url: 1 },
            },
            {
                path: 'length',
                model: LengthDocument.name,
            },
            {
                path: 'size',
                model: SizesDocument.name,
                populate: [
                    {
                        path: 'size_guide',
                        model: SizeGuideDocument.name,
                        populate: [
                            {
                                path: 'guide',
                                model: UploadDocuemnt.name,
                                select: { _id: 1, url: 1 },
                            },
                            {
                                path: 'length',
                                model: LengthDocument.name,
                            },
                        ],
                    },
                ],
            },
        ],
    },
];
