import { Router, Request, Response } from "express";
import expressAsyncHandler = require("express-async-handler");
import { populateWasteExemptions } from "src/lib/wasteExemptions";
import { populateWaterQualityExemptions } from "src/lib/waterQualityExemptions";
import { populateWastePermits } from "src/lib/wastePermits";

const router = Router();

router.get(
    '/triggerScrape',
    expressAsyncHandler(async function (req: Request, res: Response) {
        await Promise.all([
            populateWasteExemptions(),
            populateWaterQualityExemptions(),
            populateWastePermits(),
        ]);
        res.send({ ok: true });
    })
);

export default router;