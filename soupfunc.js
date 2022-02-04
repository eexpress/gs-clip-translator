const Lang = imports.lang;
const Soup = imports.gi.Soup;

let _session = new Soup.SessionAsync();
//----------------------------------------------------------
//~ https://gist.github.com/krakensden/1686d5a7b444ea69e9d1
function GET(url, callback) {
	let request = Soup.Message.new('GET', url);

	_session.queue_message(request, Lang.bind(this,
		function(session, message) {
			callback(message.status_code, request.response_body.data);
		}
	));
}
//~ GET("http://krakensden.com/",function(status_code, body) { log('request done, body: ' + body);});
//----------------------------------------------------------
//~ https://gist.github.com/krakensden/eb218a3358f2c2db6f44
function POSTJSON(url, params, callback) {
	log('post started');
	let request = Soup.Message.new('POST', url);
	log('req created');
	let _params = JSON.stringify(params)
	log('params created');

	request.set_request('application/json',	Soup.MemoryUse.COPY, _params, _params.length);

	_session.queue_message(request, Lang.bind(this, function(session, message) {
		callback(message.status_code, request.response_body.data);
	}));
	log('message qd');
}
//~ POSTJSON('http://example.org/create', {'foo': 'bar'}, function(code, data) { log('post done'); log(code); log(data); Mainloop.quit(true); });
//----------------------------------------------------------
//~ https://gist.github.com/krakensden/601b069ac3045f469aa2
function POST(url, params, callback) {
	let request = Soup.Message.new('POST', url);
	let _params = Soup.form_encode_hash(params);

	request.set_request('application/x-www-form-urlencoded', Soup.MemoryUse.COPY, _params, _params.length);

	_session.queue_message(request, Lang.bind(this, function(session, message) {
		callback(message.status_code, request.response_body.data);
	}));
}
//~ POST('http://example.org/create', {'foo': 'bar'}, function(code, data) { log('post done'); log(code); log(data); Mainloop.quit(true); });
//----------------------------------------------------------
//~ from Just P
const Soup = imports.gi.Soup;

let session = new Soup.Session();
let message = Soup.Message.new('POST', 'https://example.com/');
var params = 'param1=param1value&param2=param2value';
message.set_request('application/x-www-form-urlencoded', Soup.MemoryUse.COPY, params);

if (session.send_message(message) === Soup.Status.OK) {
    let response = message.response_body.data;
    log(`Response: ${response}`);
} else {
    log('Oh! Boy!');
}
