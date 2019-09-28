import examplesRouter from './api/controllers/examples/router';
import userRouter from './api/controllers/users/userRouter';
import authRouter from './api/controllers/auth/authRouter';
import Auth from './api/middlewares/auth';
import paymentRouter from './api/controllers/paymentCard/paymentRouter';
import scheduleRouter from './api/controllers/schedules/scheduleRouter';
import sessionRouter from './api/controllers/sessions/sessionRouter';
import cors from 'cors';


export default function routes(app) {
  app.use(cors(function(req, cb) {
    // var whitelist = ['https://x-tutor.herokuapp.com','http://localhost:3001']
    const corsOptions = {
      // origin: 'http://localhost:3000',
      origin: 'https://x-tutor.herokuapp.com',

      method: "GET, PUT, POST, DELETE, PATCH, OPTIONS",
      credentials: true
    }
    cb(null, corsOptions)
  }));
  app.use((req, res, next)=>{
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, GET, PUT, DELETE, OPTIONS"
    );

    // res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
  app.use('/api/v1/examples', examplesRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/cards', Auth.validateToken, paymentRouter);
  app.use('/api/v1/schedules', Auth.validateToken, scheduleRouter);
  app.use('/api/v1/sessions', Auth.validateToken, sessionRouter);
}
