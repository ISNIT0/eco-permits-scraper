import { Router, Request, Response } from "express";
import expressAsyncHandler = require("express-async-handler");

const router = Router();

router.post(
    '/public',
    expressAsyncHandler(async function (req: Request, res: Response) {
        res.send('Public');
    })
);

export default router;