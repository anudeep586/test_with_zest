export interface Course{
    id:string,
    userId:string,
    coupon:string,
    price:string,
    categories:string,
    description:string,
    imageUrl:string,
    techStack:string,
    created_at:string,
    title:string,
    updated_at:string,
    ratings:number
}


export interface ExtraCourse{
    id:string,
    courseId:string,
    trailerUrl:string,
    superSubTitle:string,
    index:number,
    subIndex:number,
    subTitle:string,
    videoUrl:string
    extrafileIndex:number,
    extraLinksIndex:number,
    extrafileUrl:string,
    extraLinksUrl:string,
}

export interface Ratings{
    id:string,
    courseId:string,
    userId:string,
    oneStar:number,
    twoStar:number,
    threeStar:number,
    fourStar:number,
    fiveStar:number
}

export interface Comments{
    id:string,
    courseId:string,
    userId:string,
    comment:string
    parent_comment_id:string,
    created_at:string,
    updated_at:string,
    deleted_at:string
}
export interface Wishlist{
    id:string,
    userId:string,
    courseId:string
}

export interface Users{
    id:string,
    username:string,
    email:string,
    password:string,
    mobile:string,
    address:string,
    profilePhotoLink:string,
    websiteLink:string,
    githubLink:string,
    twitterLink:string,
    verified:boolean,
    created_at:string,
    updated_at:string,
    type:string,
}

export interface Promocodes{
    id:string,
    courseId:string,
    code:string,
    created_at:string,
    expiryDate:string,
    percent:number,
    upto:number,
    min_order:number
}

export interface CourseStage{
    id:string,
    userId:string,
    courseId:string,
    stage:string
}

export interface Payment{
    payment_id:string,
    userId:string,
    amount:number,
    discount:number,
    payment_date:string,
    updated_date:string
}