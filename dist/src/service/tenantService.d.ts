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
export declare const getTenantService: (cognitoId: string) => Promise<any>;
export declare const createTenantService: (data: TenantBody) => Promise<any>;
export declare const updateTenantService: (cognitoId: string, data: SettingsBody) => Promise<any>;
export declare const getTenantPropertiesDB: (tenantId: string) => Promise<any[]>;
export declare const addFavoritePropertyDB: (data: any) => Promise<any>;
export declare const removeFavoritePropertyDB: (data: any) => Promise<any>;
export {};
//# sourceMappingURL=tenantService.d.ts.map