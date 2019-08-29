import * as jwt from 'jsonwebtoken';
import config from '../../config';
import { type } from 'os';

class AuthMiddleware {
    validateToken(req, res, next) {
        // console.log(req.headers)

        /** Fomat of token:
         * Authorization: Bearer <token>
        */
        const bearerHeader = req.headers['authorization'];
        if(typeof bearerHeader !== "undefined") {
            /** split at the space and get token from array*/
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];

            /** set the token */
            req.token = bearerToken;

            jwt.verify(req.token, config.JWT_SECRET, (err, authData) => {
                if(err) {
                    res.status(403).json({
                        success: false, 
                        message: 'Failed to authenticate token! Authorization header is corrupted'
                    })
                } else {
                    /** Let's pass back the decoded token to the request object*/
                    req.decoded = authData; 
                    //console.log(req.decoded)
                    next()
                }
            })
        } else {
            res.status(404).json({success: false, msg: 'Authenticate token is not supplied'})
        }

    }
}


export default new AuthMiddleware()