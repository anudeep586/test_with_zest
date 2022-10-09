import * as Koa from 'koa';
import * as Router from 'koa-router'
import logger=require('koa-logger');
import bodyparser=require('koa-bodyparser')
import { addAddressAndProfile, addCourse, addCourseStage, addLinks, addUser, deleteCourseStage, deletewishlist, getCartCourses, getCBSearch, getCourseDataFromFB, getCourses, getListOfWishlist, getMyCourses, getPrice, getProfile, getPromoCodeData, getWishlistById, loginUser, validateUser, wishlists } from './controllers/user';
import cors = require("@koa/cors");
import { verifyToken } from './middleware/verifyToken';
import cluster = require('cluster');
import os = require('os');
import { storage } from './firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { getPaymentPayTm, getPaymnet, verifyPayment } from './controllers/payment';
import { addCourseVideosById, addRating, getAllCourses, getCourseById } from './controllers/course';
import { createContext } from 'vm';
const serverless = require("serverless-http");

const hostname='0.0.0.0'

const port=process.env.PORT || 8080

const app=new Koa();
const router=new Router();
const numsCpu=os.cpus.length
app.use(cors())
app.use(logger());
app.use(bodyparser());

router.get('/',async (ctx)=>{
    ctx.body='Welcome to Simppwey';
});
router.get('/verifyuser/:id',validateUser)
router.post('/user',addUser)
router.post('/login',loginUser)
router.post('/course',verifyToken,addCourse)
router.post('/course/:id',verifyToken,addCourseVideosById)
router.get('/courses',verifyToken,getAllCourses)
router.get('/course/:id',getCourseById)
router.get('/ratings/:id/:rating',addRating)
router.get('/hosted',(ctx:any)=>{
   ctx.body="Hello creatures"
})










router.get('/price',getPrice)
router.get('/promocode/:code/:order',getPromoCodeData)
router.get('/mycourses',getMyCourses)
router.get('/cartcourses',verifyToken,getCartCourses)
router.post('/coursestage/:id',addCourseStage)
router.delete('/coursestage/:id',verifyToken,deleteCourseStage,getCartCourses)
router.get('/search/:byName',getCBSearch)
router.get('/wishlists/:id',getWishlistById)
router.post('/wishlists/:id',wishlists)
router.delete('/wishlists/:id',deletewishlist)
router.get('/wishlist',getListOfWishlist)
router.post('/additional',addAddressAndProfile)
router.post('/addlinks',addLinks)
router.get('/getprofile',getProfile)
router.get('/getCourseData',getCourseDataFromFB)
router.post('/api/payment/orders',getPaymnet)
router.post("/api/payment/verify",verifyPayment)
router.post("/api/payment",getPaymentPayTm)

app.use(router.routes());
app.listen(port);
module.exports = app;
module.exports.handler = serverless(app);
console.log(` My koa server is up and listening on port ${port} and ${hostname}`)
// const func=async()=>{
//     const fileref=ref(storage,'files/BMW.jpg003ee286-8fab-4d56-a182-76e16582f726')

//     const urls=await getDownloadURL(fileref)
//     console.log(urls)
// }
// func()
//https://firebasestorage.googleapis.com/v0/b/simppwey.appspot.com/o/files%2FBMW.jpg003ee286-8fab-4d56-a182-76e16582f726?alt=media&token=f2b3ef4e-7692-4aba-b820-b0621fb816b0
//rzp_test_ce7UGB23OimLkP
//DSTAbPSLEIke3xw1OffMrMBz


//qysLrZ83650109333534--mid
//C_CLgvqdwWWPWx3K-mkey
//WEBSTAGING-website


//0a01d8b0-424d-488d-83f0-efb6e11f4b3a
//https://firebasestorage.googleapis.com/v0/b/simppwey.appspot.com/o/files%2FBMW.jpg003ee286-8fab-4d56-a182-76e16582f726?alt=media&token=f2b3ef4e-7692-4aba-b820-b0621fb816b0   

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhOGQxMWJjLTJmNzEtNGVkNC1hNDQyLWFkZmI1MjA5M2FkMCIsImVtYWlsIjoibGFrYW5hdmFyYXB1Lm1hbmlrYW50YUB6b3BzbWFydC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRWNVFJVWlmOXU2c3ZmMGhwTVlmMkouckZPWDZNd3ZUc29STVFzbUMxbnBhS1VqRjVoWUNUSyIsImlhdCI6MTY2NDUyMjE5NX0.kX_Z-Vjw4xnqjQHOXL5xnTh70B4gnTU1jWph-h0yPtU