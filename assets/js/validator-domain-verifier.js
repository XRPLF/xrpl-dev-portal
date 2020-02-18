
const codec = require('ripple-binary-codec');
const addressCodec = require('ripple-address-codec');
const keyCodec = require('ripple-keypairs')
const TOML_PATH = "/.well-known/xrp-ledger.toml";



//Get the domain and public key from the manifest
function parseManifest(manhex){
    
    //TODO: throw errors when manifest is malformed or keys are not present
    let man = codec.decode(manhex);
    let buff = new Buffer(man['PublicKey'], 'hex').toJSON().data  

    let domain = hex_to_ascii(man['Domain']);
    let publicKey = addressCodec.encodeNodePublic(buff);
    let publicKeyHex = man['PublicKey'];
    
    let message = "[domain-attestation-blob:mayurbhandary.com:"+publicKey+"]";
    let attestation = "A59AB577E14A7BEC053752FBFE78C3DED6DCEC81A7C41DF1931BC61742BB4FAEAA0D4F1C1EAE5BC74F6D68A3B26C8A223EA2492A5BD18D51F8AC7F4A97DFBE0C";

    var verify = keyCodec.verify(ascii_to_hexa(message),attestation,publicKeyHex)

    //TODO: Go to the domain, check that this public key is there, and check the attestation. 
    console.log(domain);
    console.log(publicKey);
    console.log(verify);

}

function hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }

 function ascii_to_hexa(str)
  {
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	return arr1.join('');
   }

//message: [domain-attestation-blob:mayurbhandary.com]


//TODO: Obtain manifest through form submission 
//attestation="A59AB577E14A7BEC053752FBFE78C3DED6DCEC81A7C41DF1931BC61742BB4FAEAA0D4F1C1EAE5BC74F6D68A3B26C8A223EA2492A5BD18D51F8AC7F4A97DFBE0C"
//manifest: 24000000017121EDFCADB465692E663A6081B8AE60A5CAA7FC9519B6140B9C9FFDE313A7044CEDC3732103A951D1D042B128BC3253E261719277CBEE7966207C55299DDF9DE08ACCF81C67764730450221009AB0D13B5F333BFA75098F5E8C81638E133D9585973E56E22C9202D4F13E12FE02207B48B2C49B734D78E23AD0C51C98E21F78813D711E465C88A4FBEA37263552A477116D617975726268616E646172792E636F6D7012401EB58B0BACE2E8BBE07D9A2A0FA82BAB21B236DE23FB81F44816921730300038598F4144B85A72206065F1F05563A84997F15A345058CCB07B3D63702F2D760C'

parseManifest('24000000017121EDFCADB465692E663A6081B8AE60A5CAA7FC9519B6140B9C9FFDE313A7044CEDC3732103A951D1D042B128BC3253E261719277CBEE7966207C55299DDF9DE08ACCF81C67764730450221009AB0D13B5F333BFA75098F5E8C81638E133D9585973E56E22C9202D4F13E12FE02207B48B2C49B734D78E23AD0C51C98E21F78813D711E465C88A4FBEA37263552A477116D617975726268616E646172792E636F6D7012401EB58B0BACE2E8BBE07D9A2A0FA82BAB21B236DE23FB81F44816921730300038598F4144B85A72206065F1F05563A84997F15A345058CCB07B3D63702F2D760C');

