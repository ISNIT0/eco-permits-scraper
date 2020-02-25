// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path="./types.d.ts" />

import 'reflect-metadata';
import express, { Request, Response } from 'express';
import logger from 'morgan';

import * as bodyParser from 'body-parser';

import cors from 'cors';

import router from './routes';
import publicRouter from './routes/public';
import { expressSmsAuth } from 'express-sms-auth';

import session from 'express-session';
import connectRedis = require('connect-redis');
import { redisClient } from './util/redis';

import { createConnection } from './db';
import { Profile } from './models/Profile.model';
import { config } from './config';
import { passport, clearSessionOnError } from './util/auth';

const app = express();

app.use(logger('tiny'));

app.use(
    cors({
        allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
        origin: [
            'http://localhost:3000',
            'http://localhost:8080',
        ],
        credentials: true,
    })
);

// app.set('trust proxy', 1);

app.use(function (req, res, next) {
    if (req.headers['x-arr-ssl'] && !req.headers['x-forwarded-proto']) {
        req.headers['x-forwarded-proto'] = 'https';
    }
    return next();
});

const RedisStore = connectRedis(session);

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret',
    resave: true,
    proxy: true,
    cookie: {
        // secure: config.app.env === Env.Production,
        // maxAge: 5184000000, // 2 months
    },
}));

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(clearSessionOnError); // for passport deserialization failures

app.use('/', expressSmsAuth(
    async function (verification: unknown, req: Request, res: Response) {
        const { phone } = req.body;
        const profile = await Profile.findOneOrFail({ phoneNumber: phone });
        console.log(profile);
        req.login(profile, (err: unknown) => {
            if (err) {
                console.error(`Failed to log user in:`, err);
                res.status(500).send({ error: true });
            } else {
                res.send({ profile });
            }
        });
    },
    {
        twilioSid: config.twilio.SID,
        twilioToken: config.twilio.TOKEN,
        twilioServiceId: config.twilio.SERVICE_ID
    },
    ['+447123123123', '+447321321321']
));

app.use(publicRouter);

app.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(403).send(`Not Authed`);
    }
});

app.get('/logout', (req, res) => {
    req.logout();
    res.send({});
});

app.use(express.static('public'));

app.use('/', router)

    ; (async () => {
        const port = process.env.PORT || 12180;
        await createConnection();
        app.listen(port);
        console.log(`listening on\n>http://localhost:${port}`, port);
    })().catch(e => console.error(e.stack));
