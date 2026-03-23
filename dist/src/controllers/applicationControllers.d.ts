import type { NextFunction, Request, Response } from "express";
export declare const getApplicationsList: (req: Request<{}, {}, {}, {
    userId: string;
    userType: string;
}>, res: Response) => Promise<void>;
export declare const createApplication: (req: Request, res: Response) => Promise<void>;
export declare const updateApplication: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=applicationControllers.d.ts.map