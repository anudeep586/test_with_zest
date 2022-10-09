const https = require('https');

const PaytmChecksum = require("../PaytmCheckSum");

export const check=()=>{


var paytmParams :any= {};
paytmParams["MID"]        = "TxofrV91480825339362";
paytmParams["ORDER_ID"]   = "ORDERID_98765";
paytmParams["TOKEN"]      = "eyJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..xxxxxxxxxxx.9iHTtWbCZ0I6qbn2sUnyz5siw1fqbmtEnFMFE7nSIX-yrwCkiGfAC6QmPr9q-tw8LMPOh5-3UXRbpeVZEupQd3wNyaArWybRX2HAxJDRD8mxJ_wxzJM6GZ1ov4O3EIsx2Y_Zr0aHCd3VbnTjRUnlVdxXJPFG8QZs0b_2TVdoAX3_QjZS8_dwcmIWoH8ebDzOIs7MJacETfMtyFGAo8Xc0LjznToUWvTsTbIXQoF1yB0.1fZFAYJVsY61BTv2htLcXQ8800";
paytmParams["TXN_AMOUNT"] = "1.00";

/*
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
PaytmChecksum.generateSignature(paytmParams, "BIMEw1ig2bTm%rZd").then(function(checksum:any){

    paytmParams["CHECKSUM"] = checksum;

    var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        hostname: 'securegw.paytm.in',

        /* for Production */
        // hostname: 'securegw.paytm.in',

        port: 443,
        path: '/order/preAuth',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    var response = "";
    var post_req = https.request(options, function(post_res:any) {
        post_res.on('data', function (chunk:any) {
            response += chunk;
        });

        post_res.on('end', function(){
            console.log('Response: ', response);
        });
    });
    console.log(post_req,post_data)
    post_req.write(post_data);
    post_req.end();
});



}

check()