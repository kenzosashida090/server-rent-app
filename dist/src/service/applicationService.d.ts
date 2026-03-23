import { ApplicationStatus } from "@prisma/client";
export declare const listApplicationsDB: (userId: string, userType: string) => Promise<any[]>;
export declare const createApplicationDB: (body: {
    applicationDate: any;
    status: any;
    propertyId: any;
    tenantCognitoId: any;
    name: any;
    email: any;
    phoneNumber: any;
    message: any;
}) => Promise<any>;
export declare const updatingApplicationStatusDB: (id: string, status: ApplicationStatus) => Promise<any>;
//# sourceMappingURL=applicationService.d.ts.map