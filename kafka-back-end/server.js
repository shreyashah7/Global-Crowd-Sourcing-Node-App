var connection = new require('./kafka/Connection');
var api = require('./services/api');
var topic_name = 'request_topic';
var consumer = connection.getConsumer(topic_name);
var producer = connection.getProducer();

consumer.on('message', function (message) {
	var data = JSON.parse(message.value);
	api.handle_request(data.data, function (err, res) {
		var payloads = [
			{
				topic: data.replyTo,
				messages: JSON.stringify({
					correlationId: data.correlationId,
					data: res
				}),
				partition: 0
			}
		];
		producer.send(payloads, function (err, data) {
			console.log("Producer Data : ",data);
		});
		return;
	});
});