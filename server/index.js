const express=require('express');
const app=express();
const cors=require('cors');
const dotenv =require('dotenv');
const DBconnect=require('./config/connectDB.js');
const authRoutes=require('./routes/authRoutes.js');
const matchRoutes=require('./routes/matchRoutes.js');
const confessRoutes=require('./routes/confessionRoute.js');
const rantRoutes=require('./routes/rantRoutes.js')
dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/',authRoutes);
app.use('/match',matchRoutes);
app.use('/confess',confessRoutes);
app.use('/rant',rantRoutes);
DBconnect();
app.listen(process.env.PORT||5000,()=>{
  console.log(`Sever is listening on ${process.env.PORT}`||'5000');
})
