import jwt = require("jsonwebtoken");
import knex from "../database/db";


export const verifyToken=async(ctx:any,next:any)=>{
    try{
        if (!ctx.header.token) {
            throw new Error('Token should not be empty')
        }
        const token = ctx.request.header.token.split(' ')[1]
        await jwt.verify(token, "secret",  (err: any, userObjdata: any) => {
            if (err) {
                throw new Error("Invalid Signature")
            }
            ctx.state.userPayload = userObjdata;
            
        })
        const data=await knex("users").where({id:ctx.state.userPayload?.id}).select("*")
        if(data.length>0){
            console.log(data,"cool")
        }
        else{
            throw new Error("Not valid User")
        }
        

    await next()
}
catch(err){
    console.log(err)
    ctx.body=err;
    ctx.status=404;
}
}