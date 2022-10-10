"use strict";

var rypto = require('crypto');

class PaytmChecksum {
    static iv: string;

	static encrypt(input:any, key:any) {
		var cipher = rypto.createCipheriv('AES-128-CBC', key, PaytmChecksum.iv );
		var encrypted = cipher.update(input, 'binary', 'base64');
		encrypted += cipher.final('base64');
		return encrypted;
	}
	static decrypt(encrypted:any, key:any) {
		var decipher = rypto.createDecipheriv('AES-128-CBC', key, PaytmChecksum.iv );
		var decrypted = decipher.update(encrypted, 'base64', 'binary');
		try {
			decrypted += decipher.final('binary');
		}
		catch (e) {
			console.log(e);
		}
		return decrypted;
	}
	static generateSignature(params:any, key:any) {
		if (typeof params !== "object" && typeof params !== "string") {
			var error = "string or object expected, " + (typeof params) + " given.";
			return Promise.reject(error);
		}
		if (typeof params !== "string"){
			params = PaytmChecksum.getStringByParams(params);
		}
		return PaytmChecksum.generateSignatureByString(params, key);
	}
	

	static verifySignature(params:any, key:any, checksum:any) {
		if (typeof params !== "object" && typeof params !== "string") {
		   	var error = "string or object expected, " + (typeof params) + " given.";
			return Promise.reject(error);
		}
		if(params.hasOwnProperty("CHECKSUMHASH")){
			delete params.CHECKSUMHASH
		}
		if (typeof params !== "string"){
			params = PaytmChecksum.getStringByParams(params);
		}
		return PaytmChecksum.verifySignatureByString(params, key, checksum);
	}

	static async generateSignatureByString(params:any, key:any) {
		var salt = await PaytmChecksum.generateRandomString(4);
		return PaytmChecksum.calculateChecksum(params, key, salt);
	}

	static verifySignatureByString(params:any, key:any, checksum:any) {		
		var paytm_hash = PaytmChecksum.decrypt(checksum, key);
		var salt = paytm_hash.substr(paytm_hash.length - 4);
		return (paytm_hash === PaytmChecksum.calculateHash(params, salt));
	}

	static generateRandomString(length:any) {
		return new Promise(function (resolve, reject) {
			rypto.randomBytes((length * 3.0) / 4.0, function (err:any, buf:any) {
				if (!err) {
					var salt = buf.toString("base64");
					resolve(salt);					
				}
				else {
					console.log("error occurred in generateRandomString: " + err);
					reject(err);
				}
			});
		});
	}

	static getStringByParams(params:any) {
		var data :any= {};
		Object.keys(params).sort().forEach(function(key:any,value:any) {
			data[key] = (params[key] !== null && params[key].toLowerCase() !== "null") ? params[key] : "";
		});
		return Object.values(data).join('|');
	}

	static calculateHash(params:any, salt:any) {		
		var finalString = params + "|" + salt;
		return rypto.createHash('sha256').update(finalString).digest('hex') + salt;
	}
	static calculateChecksum(params:any, key:any, salt:any) {		
		var hashString = PaytmChecksum.calculateHash(params, salt);
		return PaytmChecksum.encrypt(hashString,key);
	}
}
PaytmChecksum.iv = '@@@@&&&&####$$$$';
module.exports = PaytmChecksum;