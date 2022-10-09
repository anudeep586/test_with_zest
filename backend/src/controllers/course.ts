import knex from "../database/db";
import { v4 as uuidv4 } from "uuid";
import jwt = require("jsonwebtoken");
import { Context } from "koa";
import { addCourseVideosByIdService, addRatingService, getAllCoursesService, getCourseByIdService } from "../services/course";
import { ExtraCourse } from "../Models/course";
import { storage } from '../firebase';
import { getDownloadURL, ref } from 'firebase/storage';

export const Firebasefunc = async (filepath: string) => {
    const fileref = ref(storage, filepath)

    const urls = await getDownloadURL(fileref)
    return urls
}
export const addCourseVideosById = async (ctx: any) => {
    try {
        const trailer = await Firebasefunc(ctx.request.body?.trailerUrl)
        const videoUrl = await Firebasefunc(ctx.request.body?.trailerUrl)
        const id = ctx.request.params?.id;
        const superSubTitle = ctx.request.body?.superSubTitle;
        const index = ctx.request.body?.index;
        const subIndex = ctx.request.body?.subIndex;
        const subTitle = ctx.request.body?.subTitle;
        const extrafileIndex = ctx.request.body?.extrafileIndex;
        const extraLinksIndex = ctx.request.body?.extraLinksIndex;
        let extrafileUrl:string;
        let extraLinksUrl:string;
        if(ctx.request.body?.extrafileUrl){
             extrafileUrl = await Firebasefunc(ctx.request.body?.extrafileUrl)
        }
        if(ctx.request.body?.extraLinksUrl){
             extraLinksUrl = await Firebasefunc(ctx.request.body?.extraLinksUrl)
        }
        const obj: ExtraCourse = {
            id: uuidv4(),
            courseId: id,
            trailerUrl: trailer,
            superSubTitle,
            index,
            subIndex,
            subTitle,
            videoUrl: videoUrl,
            extrafileIndex,
            extraLinksIndex,
            extrafileUrl,
            extraLinksUrl
        }
        const data = await addCourseVideosByIdService(obj)
        ctx.body = data
        ctx.status = 202
    }
    catch (err) {
        ctx.body = err
        ctx.status = 404
    }
}


export const getAllCourses=async(ctx:any)=>{
    try{
        const userData: any =ctx.state.userPayload.id;
        console.log(ctx.state.userPayload)
        const data=await getAllCoursesService(userData);
        ctx.body=data;
        ctx.status=200;
    }
    catch(err){
        ctx.body=err;
        ctx.status=404
    }
}


export const getCourseById=async(ctx:any)=>{
    try{
        const courseId:any=ctx.request.params.id;
        const data=await getCourseByIdService(courseId)
        ctx.body=data;
        ctx.status=202;
        
    }
    catch(err){
        console.log(err)
        ctx.body=err;
        ctx.status=404
    }
}

export const addRating=async(ctx:any)=>{
    try{
        const {id,rating}=ctx.request.params;
        const data=await addRatingService(id,rating)
    }
    catch(err){
        ctx.body=err;
        ctx.status=400
    }
}