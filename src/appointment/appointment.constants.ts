import { BranchDocument } from "src/branches/models/branch.schema";
import { ServiceDocument } from "src/services/models/service.schema";

export const AppointmentPopulate = [
    {
        path: 'service',
        model: ServiceDocument.name,
        populate: [
            {
                path: 'branches',
                model: BranchDocument.name,
            },
        ],
    },
];
