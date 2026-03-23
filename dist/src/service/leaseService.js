import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const getLeasesDB = async () => {
    try {
        const leases = await prisma.lease.findMany({
            include: {
                tenant: true
            }
        });
        return leases;
    }
    catch (error) {
        throw new Error("Error retrieving leases");
    }
};
export const getLeasePaymentsDB = async (id) => {
    try {
        const payments = await prisma.payment.findMany({
            where: { leaseId: Number(id) }
        });
        return payments;
    }
    catch (error) {
        throw new Error("Error retrieving lease payments");
    }
};
//# sourceMappingURL=leaseService.js.map