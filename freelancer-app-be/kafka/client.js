var rpc = new (require('./kafkarpc'))();
var kafka = require('kafka-node');
var KeyedMessage = kafka.KeyedMessage;

//make request to kafka
function make_request(queue_name, key, msg_payload, callback){
	var keyedMessage = new KeyedMessage(key, msg_payload);
	rpc.makeRequest(queue_name, keyedMessage, function(err, response){
		if(err)
			console.error(err);
		else{
			//console.log("response", response);
			callback(null, response);
		}
	});
}

exports.make_request = make_request;