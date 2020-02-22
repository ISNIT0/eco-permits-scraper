import { Router, Request, Response } from 'express';

import asyncHandler from 'express-async-handler';
import { makeValidateBody } from 'express-class-validator';
import { IsPhoneNumber, Length, IsEmail, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { Profile } from 'src/models/Profile.model';

const router = Router();

router.get(
    '/me',
    asyncHandler(async function (req: Request, res: Response) {
        res.send(req.user);
    })
);

class CreateUpdateUserBody {
    @Length(3) name: string;
    @IsEmail() email: string;
    @IsPhoneNumber('ZZ') phoneNumber: string
    @IsOptional() @Length(3) address: string
    @IsOptional() @IsBoolean() isContractor: boolean;
    @IsOptional() @IsBoolean() isAdmin: boolean;
    @IsOptional() @IsArray() supervisorIds: string[];
}

router.put(
    '/me',
    makeValidateBody(CreateUpdateUserBody),
    asyncHandler(async function (req: Request, res: Response) {
        const record = await Profile.findOne(req.params.id);
        const body = req.body;
        Object.assign(record, body);
        res.send(await record.save());
    })
);

export default router;