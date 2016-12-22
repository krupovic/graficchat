$(function() {
    $("#chatControls").hide();
    $("#pseudoSet").click(function() {setPseudo()});
    $("#send").click(function() {sentMessage();});
		// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}

});
var socket = io.connect();
var sessionId = socket.io.engine.id;
//alert(sessionId);

socket.on('message', function(data) {
    addMessage(data['message'], data['pseudo']);
});

socket.on('users', function(data) {
    let html = "";
	data.forEach(function(value, index){
		if (value.sessid == sessionId) html+="<h4 id="+ value.sessid+">ME</h4>";
		else html+="<h4 id="+ value.sessid+">"+value.name+"</h4>";});
	$("#whoisonline").html(html);
	console.log(data);// addMessage(data['message'], data['pseudo']);
});

socket.on('connect', function() {
	console.log('connected');
	$("#chatEntries").append('<h3>Добро пожаловать в чат, пожалуйста, представтесь!</h3>');
	sessionId = socket.io.engine.id;
   

});

function addMessage(msg, pseudo) {
    $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
}

function sentMessage() {
    if ($('#messageInput').val() != "") 
    {
        socket.emit('message', $('#messageInput').val());
        addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
        $('#messageInput').val('');
    }
}

function setPseudo() {
    if ($("#pseudoInput").val() != "")
    {
        socket.emit('setPseudo', $("#pseudoInput").val());
        $('#chatControls').show();
        $('#pseudoInput').hide();
        $('#pseudoSet').hide();
    }
}


