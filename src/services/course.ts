import knex from "../database/db";
import { v4 as uuidv4 } from "uuid";
import jwt = require("jsonwebtoken");
import { Context } from "koa";
import bodyParser = require("koa-bodyparser");
import { Course, ExtraCourse } from "../Models/course";



export const addCourseService = async (obj: any) => {
    const data = await knex("coursedetails").insert(obj).returning("*")
    if (data) {
        return data
    }
    else {
        throw new Error("something wrong happen")
    }
}

export const addCourseVideosByIdService = async (obj: ExtraCourse) => {
    const data = await knex("courseLinks").insert(obj).returning("*")
    if (data) {
        return data
    }
    else {
        throw new Error("something wrong happen")
    }
}


export const getAllCoursesService = async (userId: any) => {
    const data = await knex("coursedetails").select("*");
    if (data) {
        return data
    }
    else {
        throw new Error("something went wrong")
    }
}

export const getCourseByIdService = async (courseId: any) => {
    let obj:any={};

    const getData = await knex("coursedetails").join('courseLinks', 'courseLinks.courseId', 'coursedetails.id').select("*").where({ courseId: courseId })
    if(getData?.[0]!==undefined){
        obj.data=[]
        obj.course=[]
        obj?.data.push({
            userId:getData?.[0]?.userId,
            price:getData?.[0]?.price,
            title:getData?.[0]?.title,
            categories:getData?.[0]?.categories,
            description:getData?.[0]?.description,
            imageUrl:getData?.[0]?.imageUrl,
            ratings:getData?.[0]?.ratings,
            techStack:getData?.[0]?.techStack,
            created_at:getData?.[0]?.created_at,
            updated_at:getData?.[0]?.updated_at,
            courseId:getData?.[0]?.courseId
        })
        getData.map((course:any)=>{
            obj?.course.push({
                trailerUrl:course?.trailerUrl,
                superSubTitle:course?.superSubTitle,
                index:course?.index,
                subIndex:course?.subIndex,
                subTitle:course?.subTitle,
                videoUrl:course?.videoUrl,
                extrafileIndex:course?.extrafileIndex,
                extraLinksIndex:course?.extraLinksIndex,
                extrafileUrl:course?.extrafileUrl,
                extraLinksUrl:course?.extraLinksUrl
            })
        })
    }
    if (getData) {
        return obj
    }
    else {
        throw new Error("something went wrong")
    }
}


// (5*252 + 4*124 + 3*40 + 2*29 + 1*33) / (252+124+40+29+33) = 4.11 and change
export const addRatingService=async(id:string,rating:number)=>{
    // const data=await knex("ratings").
}
