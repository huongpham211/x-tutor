import './common/env';
import Server from './common/server';
import routes from './routes';

import mongoose from 'mongoose';
const dbUrl = 'mongodb://admin:admin1234@ds251362.mlab.com:51362/x-tutor';
const dbUrl2 = 'mongodb://admin:admin123456789@ds345587.mlab.com:45587/xtutor'
mongoose.connect(dbUrl,
    {useNewUrlParser: true}, 
    function(err){
      if(err) console.log(err);
      else console.log("DB connect success")
})


export default new Server()
  .router(routes)
  .listen(process.env.PORT);
