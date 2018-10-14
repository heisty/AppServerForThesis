// const twilio = require('twilio');
// const accountSid = 'AC1e6d52189c3717665e3d1dae9c884a1b';
// const authToken = 'b603fffc647755cb52f6cbc1798b97f9'; 
// const client = new twilio(accountSid, authToken);

// exports.verify = function(req,res,next){
// 	let {
// 		recipient,messages
// 	} = req.body;

// 	client.messages.create({
//         body: 'Your verification code is ',
//         to: '+639773910140',  // Text this number
//         from: '+15005550006' // From a valid Twilio number
//     }).then((message) => console.log(message.body)).catch((error)=>{
//     	console.log(error)
//     });

//     res.json("Ok?")

	
// }

  var TeleSignSDK = require('telesignsdk');

  const customerId = "94705F20-420C-4E90-AC0B-B02D9E5D1A57";
  const apiKey = "jMDYAZ91qXIUXt6ZPEywX1tJVKFWIwv0DidxYT1Wr9mOuQXzIAD6b7SXPCKeoOKcDWwsXii7PFfUlpbvaAbdxw==";
  const rest_endpoint = "https://rest-api.telesign.com";
  const timeout = 10*1000; // 10 secs

  const client = new TeleSignSDK( customerId,
      apiKey,
      rest_endpoint,
      timeout // optional
      // userAgent
  );


  exports.verify = function(req,res,next){


  var xhr = new XMLHttpRequest(),
    body = JSON.stringify({"content": "Hello", "to": ["639773910140"]});
xhr.open("POST",'https://platform.clickatell.com/messages',true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Authorization", "yGx8rtgQQfi1Vp3HJf1awg==");
xhr.onreadystatechange = function(){
    if (xhr.readyState == 4 && xhr.status == 200) {
        console.log('success');
    }};
xhr.send(body);
                     

}

