var PaytmChecksum = require("../PaytmCheckSum");
const Razorpay = require("razorpay")
const crypto = require("crypto")
import { v4 as uuidv4 } from "uuid";


export const getPaymnet = async (ctx: any) => {
    try {
        const instance = new Razorpay({
            key_id: "rzp_live_zCrgCaskGkFYAt",
            key_secret: "oMytlITmjGztutdYYJuDhvZ4"
        })
        const options = {
            amount: ctx.request.body.amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        }
        await instance.orders.create(options, (error: any, order: any) => {
            if (error) {
                ctx.body = { message: "something went wrong" }
            }
            else {
                console.log(order)
                ctx.body = { data: order }
            }
        })
    }
    catch (err) {
        ctx.status = 500
        ctx.body = err
    }
}



export const verifyPayment = (ctx: any) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = ctx.request.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", "oMytlITmjGztutdYYJuDhvZ4")
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            console.log("cool")
            ctx.body = { message: "Payment verified successfully" }
        } else {
            console.log("cool1")
            ctx.body = { message: "Invalid signature sent!" }
        }
    }
    catch (err) {
        ctx.status = 500
        ctx.body = { message: "Internal Server Error!" }
        console.log(err);
    }

}



export const getPaymentPayTm = async (ctx: any) => {
    var paytmParams: any = {};
    let payU:any;
    paytmParams['MID'] = 'TxofrV91480825339362',
    paytmParams['WEBSITE'] = 'DEFAULT',
    paytmParams['CHANNEL_ID'] = 'WEB',
    paytmParams['INDUSTRY_TYPE_ID'] = 'Retail',
    paytmParams['ORDER_ID'] = uuidv4(),
    paytmParams['CUST_ID'] = 'CUST0001',
    paytmParams['TXN_AMOUNT'] = '1',
    paytmParams['CALLBACK_URL'] = 'http://localhost:8080/api/callback',
    paytmParams['EMAIL'] = "anudeep4n@gmail.com",
    paytmParams['MOBILE_NO'] = '9390616131'
    var paytmChecksum =await PaytmChecksum.generateSignature(paytmParams, "BIMEw1ig2bTm%rZd");
    console.log(paytmChecksum)
    // paytmChecksum.then(function (checksum: any) {
    //     payU = {
    //         ...paytmParams,
    //         "CHECKSUMHASH": checksum
    //     }
    // }).catch(function (error: any) {
    //     console.log(error);
    // });
    paytmParams["CHECKSUMHASH"]=paytmChecksum
    ctx.body = paytmParams;
}