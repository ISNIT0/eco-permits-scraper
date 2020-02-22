import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { Profile } from 'src/models/Profile.model';

passport.serializeUser(function (user: Profile, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await Profile.findOneOrFail(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export function clearSessionOnError(err: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        next(err);
    } else if (err.name === 'EntityNotFound') {
        // When passport.deserialize fails, it throws this
        req.session.destroy(() => {
            // NOOP
        });
        req.logout();
        res.redirect(req.path);
    } else {
        res.sendStatus(500);
    }
}

export { passport };

export function protect(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
        res.send();
    } else if (!req.user) {
        res.status(400).send({ message: 'Not Logged In' });
    } else {
        next();
    }
}
