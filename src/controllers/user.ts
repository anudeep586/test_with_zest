import knex from "../database/db";
import { v4 as uuidv4 } from "uuid";
import jwt = require("jsonwebtoken");
import { Context } from "koa";
import bodyParser = require("koa-bodyparser");
import { addCourseService } from "../services/course";
import { Course } from "../Models/course";
import { Firebasefunc } from "./course";
const bcrypt = require("bcrypt")

const nodemailer = require("nodemailer");
let mailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "dontrevertback3@gmail.com",
        pass: "anfoagtpnzsycuyg"
    },
    tls: {
        ciphers: 'SSLv3'
    }
})
export const addUser = async (ctx: Context) => {
    try {
        const username = ctx.request.body.username;
        const password = ctx.request.body.password;
        const hash = await bcrypt.hash(password, 10);
        const email = ctx.request.body.email;
        const id = uuidv4();
        const created_at = new Date().toISOString()
        await knex("users").insert({ id: id, username: username, email: email, password: hash, verified: "False", created_at: created_at }).returning("*")
        const token = jwt.sign({ id: id, email: email}, "secret")
        let details = {
            from: "dontrevertback3@gmail.com",
            to: `${email}`,
            subject: "Thanks for joining us",
            html: `<h1>Email Confirmation</h1>
            <h2>Hello ${username}</h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            <a href=http://localhost:3006/verifying/${id}> Click here</a>
            </div>`,
        }
        await mailTransporter.sendMail(details, (err: any) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log("sucessfully send")
            }
        })
        ctx.body = { token: token }
    }
    catch (err) {
        ctx.status = 404;
        ctx.body = err
    }
}


export const loginUser = async (ctx: Context) => {
    try {
        const email = ctx.request.body.email;
        const password = ctx.request.body.password;
        const hash = await bcrypt.hash(password, 10);
        const result = await bcrypt.compare(password, hash);
        let message: any;
        if(result){
            const data = await knex("users").where({ email: email }).select("*")
            if (data) {
                const obj = {
                    id: data[0].id,
                    email: data[0].email,
                    password: data[0].password
                }
                const verifyData = await knex("users").where({ id: data[0].id }).returning("*")
                if (verifyData[0] === undefined) {
                    message = { msg: "please verify by the link you get in mail", token: "", check: false }
                } else {
                    const token = jwt.sign(obj, "secret")
    
                    message = { msg: "loggedin successfully", token: token, check: true }
                }
            }
        }
        else{
            message = { msg: "please signUp first", token: "", check: false }
        }
        ctx.body = message
    }
    catch (err) {
        ctx.status = 404;
        console.log(err)
        ctx.body = err
    }
}

export const getCourses = async (ctx: Context) => {
    try {
        const courses = await knex.select().from('coursedetails')
        ctx.body = courses
    }
    catch (err) {
        ctx.status = 404;
        ctx.body = err
    }
}

export const addCourse = async (ctx: Context) => {
    try {
        const userId= ctx.state?.userPayload?.id;
        const created_at = new Date().toISOString()
        const updated_at = new Date().toISOString()
        const imageUrl=await Firebasefunc(ctx.request.body?.imageUrl)
        const price=ctx.request.body?.price;
        const title=ctx.request.body?.title;
        const description=ctx.request.body?.description;
        const coupon=ctx.request.body?.coupon;
        const categories=ctx.request.body?.categories;
        const techStack=ctx.request.body?.techStack;
        const ratings=ctx.request.body?.ratings;
        const obj: Course = {
            id: uuidv4(),
            userId,
            price: price,
            title: title,
            imageUrl: imageUrl,
            description: description,
            coupon: coupon,
            categories: categories,
            techStack: techStack,
            ratings: ratings,
            created_at: created_at,
            updated_at: updated_at,

        }
        const data = await addCourseService(obj)
        ctx.body = data
    }
    catch (err) {
        console.log(err)
        ctx.status = 404;
        ctx.body = err
    }
}


// export const getCourseById = async (ctx: any) => {
//     try {
//         const data = await knex("coursedetails").where({ id: ctx.request.params.id }).select("*")
//         ctx.body = data
//     }
//     catch (err) {
//         ctx.status = 400
//         ctx.body = err
//     }
// }

export const getMyCourses = async (ctx: any) => {
    try {
        const userData: any = jwt.verify(ctx.header.token.split(" ")[1], "secret")
        const myCourseData = await knex("coursestage").where({ id: userData.id, stage: "BUYED" }).select("*");
        ctx.body = myCourseData;
    }
    catch (err) {
        ctx.status = 404
        ctx.body = err
    }
}
export const getCartCourses = async (ctx: any) => {
    try {
        const userData: any = jwt.verify(ctx.header.token.split(" ")[1], "secret")
        const myCourseData = await knex("coursestage").where({ userId: userData.id, stage: "CART" }).select("courseId");
        let arr: any[] = []
        myCourseData.find((item: any) => {
            arr.push(item.courseId)
        })
        const listOfCourses = await knex.select('*').from('coursedetails').havingIn('id', arr).groupBy('id');
        ctx.body = listOfCourses;
    }
    catch (err) {
        ctx.status = 404
        ctx.body = err
    }
}
export const addCourseStage = async (ctx: any) => {
    try {
        const courseId = ctx.request.params.id;
        const userData: any = jwt.verify(ctx.header.token.split(" ")[1], "secret")
        const myCourseData = await knex("coursestage").where({ userId: userData.id, courseId: courseId, stage: "CART" }).select("courseId");
        let data: any;
        if (myCourseData[0] === undefined) {
            data = await knex("coursestage").insert({ id: uuidv4(), courseId: courseId, userId: userData.id, stage: ctx.request.body.stage }).returning("*");

        }
        else {
            data = "already there"
        }
        ctx.body = data
    }
    catch (err) {
        ctx.status = 404
        ctx.body = err
    }
}


export const deleteCourseStage = async (ctx: any, next: any) => {
    try {
        const userdata: any = jwt.verify(ctx.header.token.split(" ")[1], "secret")
        const userId = userdata.id
        const data = await knex("coursestage").where({ courseId: ctx.request.params.id, userId: userId }).del().returning("*")
        await next()
    }
    catch (err) {
        ctx.status = 404
        ctx.body = err
    }
}

export const getPrice = async (ctx: any) => {
    const userData: any = jwt.verify(ctx.header.token.split(" ")[1], "secret")
    const myCourseData = await knex("coursestage").where({ userId: userData.id, stage: "CART" }).select("courseId");
    let arr: any[] = []
    myCourseData.find((item: any) => {
        arr.push(item.courseId)
    })
    const listOfCourses = await knex('coursedetails').havingIn('id', arr).groupBy('id').sum('price');
    let price = 0
    listOfCourses.forEach((each) => {
        price = price + parseInt(each.sum)
    })
    ctx.body = { price: price };
}


export const getCBSearch = async (ctx: any) => {
    try {
        const byName = ctx.request.params.byName;
        let data: any;
        if (byName == 'all') {
            data = await knex.select().from('coursedetails')
        }
        else {
            data = await knex('coursedetails').whereRaw(`LOWER(title) LIKE ?`, [`%${byName}%`])
        }
        ctx.body = data
    }
    catch (err) {
        ctx.status = 404
        ctx.body = "Not Found"
    }
}

export const addPromocodes = async (ctx: any) => {
    try {
        var date = new Date()
        const code = ctx.request.params.code;
        const data1 = await knex("promocodes").insert({ id: uuidv4(), code: code, created_At: date, expirydate: '60', percent: 17, upto: 300, min_order: 18000 })
    }
    catch (err) {

    }
}


export const getPromoCodeData = async (ctx: any) => {
    try {
        var date = new Date()
        const code = ctx.request.params.code;
        const order = ctx.request.params.order;
        let finl = {}
        const data = await knex("promocodes").where({ code: code }).select("*")
        if (data?.[0] === undefined) {
            console.log("inside", data)
            finl = {
                msg: "Invalid coupon",
                discountPrice: 0
            }
        }
        else {
            const expiry = date.getTime() - data[0].created_At.getTime();
            const days = ((expiry / 1000) / 60 / 24)
            if (days > data?.[0].expirydate) {
                finl = {
                    msg: "Expired",
                    discountPrice: 0
                }
            }
            else if (data?.[0].min_order > order) {
                finl = {
                    msg: `minimum order value is ${data[0].min_order}`,
                    discountPrice: 0
                }
            }
            else {
                const givingDiscount = (order * (data[0].percent) / 100)
                finl = {
                    msg: code + ` applied successfully and you get ${data[0].percent} percent discount on your order`,
                    discountPrice: givingDiscount
                }
            }
        }
        ctx.body = finl
    }
    catch (err) {
        ctx.status = 404
        console.log(err)
        ctx.body = "Not Found"
    }
}



export const validateUser = async (ctx: any) => {
    try {
        const userId = ctx.request.params.id;
        let message: any;
        const data = await knex("users").where({ id: userId }).select("*")
        if (data[0] === undefined) {
            ctx.status = 404
            message = { msg: "Un Authorized user" }
        } else {
            const verifyData = await knex("users").where({ id: userId }).update({ verified: true }).returning("*");
            const token = jwt.sign(data[0], "secret")
            message = { msg: "successfully verified", token: token }
        }
        console.log("283 cool")
        ctx.body = message
    }
    catch (err) {
        ctx.status = 404;
        console.log(err)
        ctx.body = "Not found"
    }
}


export const getWishlistById = async (ctx: any) => {
    try {
        const userdata: any = jwt.verify(ctx.header.token.split(" ")[1], "secret")
        const getData = await knex("coursedetails").join('wishlist', 'wishlist.courseId', 'coursedetails.id').select("*").where({ userId: userdata.id, courseId: ctx.request.params.id })
        let message: any;
        if (getData[0] === undefined) {
            message = { check: false }
        }
        else {
            message = { check: true }
        }
        ctx.body = message;
    }
    catch (err) {
        ctx.status = 404;
        ctx.body = err
    }
}


export const wishlists = async (ctx: any) => {
    try {
        const userdata: any = jwt.verify(ctx.header.token.split(" ")[1], "secret")
        const insertData = await knex("wishlist").insert({ id: uuidv4(), userId: userdata.id, courseId: ctx.request.params.id }).select("*");
        ctx.body = { check: true };
    }
    catch (err) {
        ctx.status = 404
        console.log(err)
        ctx.body = err
    }
}

export const deletewishlist = async (ctx: any) => {
    try {
        const userdata: any = jwt.verify(ctx.header.token.split(" ")[1], "secret")
        const del = await knex("wishlist").where({ userId: userdata.id, courseId: ctx.request.params.id }).del().returning("*");
        ctx.body = { check: false }
    }
    catch (err) {
        ctx.status = 404
        ctx.body = err
    }
}



export const getListOfWishlist = async (ctx: any) => {
    try {
        const userdata: any = jwt.verify(ctx.header.token.split(" ")[1], "secret")
        const getData = await knex("coursedetials").join('wishlist', 'wishlist.courseId', 'coursedetails.id').select("*").where({ userId: userdata.id })
        let message: any;
        if (getData[0] === undefined) {
            message = { check: false, data: [] }
        }
        else {
            message = { check: true, data: getData }
        }
        ctx.body = message;
    }
    catch (err) {
        ctx.status = 404;
        ctx.body = err
    }
}



export const getProfile = async (ctx: any) => {
    try {
        const userdata: any = jwt.verify(ctx.header.token.split(" ")[1], "secret")
        const profileData = await knex("users").where({ id: userdata.id }).select("*");
        ctx.body = profileData;
    }
    catch (err) {
        ctx.body = err;
        ctx.status = 404;
    }
}

export const chpasswordMail = async (ctx: any) => {
    try {
        const body = ctx.request.body;
        const userdata: any = jwt.verify(ctx.header.token.split(" ")[1], "secret")
        if (body.email === undefined) {
            const cPassword = await knex("users").where({ id: userdata.id }).update({ password: ctx.request.body.password, email: ctx.request.body.email, username: ctx.request.body.username }).returning("*");
            ctx.body = { message: "Changed successfully" }
        }
        else {
            ctx.body = { message: "verify your email" }
        }
    }
    catch (err) {
        ctx.body = err;
        ctx.status = 404;
    }
}


export const addAddressAndProfile = async (ctx: any) => {
    try {
        console.log("cool", ctx.header.token)
        const body = ctx.request.body;
        const userdata: any = jwt.verify(ctx.header.token.split(" ")[1], "secret");
        console.log(userdata, body)
        const data = await knex("users").where({ id: userdata.id }).update({ address: body.address, mobile: body.mobile, profilePhotoLink: body.profilePhotoLink, githubLink: body.githubLink, twitterLink: body.twitterLink }).returning("*");
        console.log(body, data)
        ctx.body = data;
    }
    catch (err) {
        ctx.body = err;
        ctx.status = 404;
    }
}


export const addLinks = async (ctx: any) => {
    try {
        const body = ctx.request.body;
        const userdata: any = jwt.verify(ctx.header.token.split(" ")[1], "secret");
        const data = await knex("users").where({ id: userdata.id }).update({ websiteLink: body.websiteLink, githubLink: body.githubLink, twitterLink: body.twitterLink, InstagramLink: body.InstagramLink, facebookLink: body.facebookLink }).returning("*");
        ctx.body = data;
    }
    catch (err) {
        ctx.body = err;
        ctx.status = 404
    }
}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM1NGEwYWUxLTRmMTItNGNhNS1hNWIyLWI5MjcwN2Y5NmU2MSIsImVtYWlsIjoiYW51ZGVlcDRuQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoicGFzc3dvcmQiLCJpYXQiOjE2NjA5MDQ5OTN9.YV954O_ZsSBwXIqRNnDukFA8wS7ZBX7iN8eDYL0d4Q8



export const getCourseDataFromFB = async (ctx: any) => {
    try {
        const courseData = await knex.select().from('courseDetails')
        ctx.body = courseData
    }
    catch (err) {
        ctx.status = 404;
        ctx.body = err
    }
}