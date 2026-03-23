type TenantBody = {
    cognitoId: string;
    name: string;
    email: string;
    phoneNumber: string;
};
type SettingsBody = {
    name: string;
    email: string;
    phoneNumber: string;
};
export declare const getManagerDB: (cognitoId: string) => Promise<any>;
export declare const createManagerDB: (data: TenantBody) => Promise<any>;
export declare const updateManagerDB: (cognitoId: string, data: SettingsBody) => Promise<any>;
export declare const getManagerPropertiesDB: (managerId: string) => Promise<any[]>;
export {};
//# sourceMappingURL=managerService.d.ts.map