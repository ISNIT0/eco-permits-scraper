import { Router, Request, Response } from "express";
import expressAsyncHandler = require("express-async-handler");
import { populateWasteExemptions } from "src/lib/wasteExemptions";
import { populateWaterQualityExemptions } from "src/lib/waterQualityExemptions";
import { populateWastePermits } from "src/lib/wastePermits";
import { Entry } from "src/models/Entry.model";
import { EntryType } from "src/lib";

import GeoJSON from 'geojson';

const router = Router();

router.get(
    '/triggerScrape',
    expressAsyncHandler(async function (req: Request, res: Response) {
        await Promise.all([
            populateWasteExemptions(),
            // populateWaterQualityExemptions(),
            // populateWastePermits(),
        ]);
        res.send({ ok: true });
    })
);

router.get(
    '/wasteExemptions',
    expressAsyncHandler(async function (req: Request, res: Response) {
        const { limit } = req.query;
        const wasteExemptions = await Entry.find({ where: { type: EntryType.WASTEEXEMPTION }, take: limit });

        const features = wasteExemptions.map<GeoJSON.Feature>((wasteExemption) => {
            return {
                type: 'Feature',
                geometry: wasteExemption.point,
                properties: {
                    summary: wasteExemption.summary,
                    description: wasteExemption.description,
                    itemUrl: wasteExemption.itemUrl,
                    imageUrl: wasteExemption.imageUrl,
                },
            };
        });

        const collection: GeoJSON.FeatureCollection = {
            type: 'FeatureCollection',
            features,
        };

        res.send(collection);
    })
);

router.get(
    '/wastePermits',
    expressAsyncHandler(async function (req: Request, res: Response) {
        const { limit } = req.query;
        const wastePermits = await Entry.find({ where: { type: EntryType.WASTEPERMIT }, take: limit });

        const features = wastePermits.map<GeoJSON.Feature>((wastePermit) => {
            return {
                type: 'Feature',
                geometry: wastePermit.point,
                properties: {
                    summary: wastePermit.summary,
                    description: wastePermit.description,
                    itemUrl: wastePermit.itemUrl,
                    imageUrl: wastePermit.imageUrl,
                },
            };
        });

        const collection: GeoJSON.FeatureCollection = {
            type: 'FeatureCollection',
            features,
        };

        res.send(collection);
    })
);

router.get(
    '/waterQualityExemptions',
    expressAsyncHandler(async function (req: Request, res: Response) {
        const { limit } = req.query;
        const waterQualityExemptions = await Entry.find({ where: { type: EntryType.WATERQUALITYEXEMPTION }, take: limit });

        const features = waterQualityExemptions.map<GeoJSON.Feature>((waterQualityExemption) => {
            return {
                type: 'Feature',
                geometry: waterQualityExemption.point,
                properties: {
                    summary: waterQualityExemption.summary,
                    description: waterQualityExemption.description,
                    itemUrl: waterQualityExemption.itemUrl,
                    imageUrl: waterQualityExemption.imageUrl,
                },
            };
        });

        const collection: GeoJSON.FeatureCollection = {
            type: 'FeatureCollection',
            features,
        };

        res.send(collection);
    })
);

export default router;