const port = '3000';
const express = require('express');
const app = express();
let onlineUsers = [];
const fs = require("fs");
const server = require('http').createServer(app);
const io = require('socket.io')(server, {  cors: {    origin: "*",    methods: ["GET", "POST"]  }});
server.listen(port, () => {
    console.log('Listening on :', port);
});
var roomNumber1 ='cbc';
var roomNumber2 = 'abc';
var stream1 = io.of('/' + roomNumber1)
var stream2 = io.of('/' + roomNumber2)
const online = io.of('/online')
 const user1 = io.of('/user1')
 const user2 = io.of('/user2')


 online.on('connection', function(socket){


onlineUsers.push(socket);  
    var ids = [];
    for (var s of onlineUsers) { ids.push(s.id); }
   socket.emit('online', onlineUsers.length);

console.log('online users: ' + onlineUsers.length)
// assign user identity
if(onlineUsers.length == 1){
    
    
    socket.emit('code', roomNumber1)
    socket.emit('whoami', 'user1');
    var fileuser1 = `<html>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.1/socket.io.js"
    integrity="sha512-vGcPDqyonHb0c11UofnOKdSAt5zYRpKI4ow+v6hat4i96b7nHSn8PQyk0sT5L9RECyksp+SztCPP6bqeeGaRKg=="
    crossorigin="anonymous"></script>
    
  
    <video height='200'  width = "300" id='other-user-disp' autoplay ></video>
    <img height='200'  width = "300"id='image'></img>
    </html>
    <script>
    document.getElementById("other-user-disp");
 const video = document.querySelector('video')
  navigator.mediaDevices.getUserMedia({video: { width: 150, height:130} }).then((stream) => video.srcObject = stream);
    var socket = io.connect('https://yourdomain/` + roomNumber2 + `');

    function frame() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const data = canvas.toDataURL('image/png');
        
    
        socket.emit('img', data);
    }
    
    
    
    
    socket.on('out-img', (data) => {
       
        document.getElementById('image').src = data;
    });
    
    
    function refreshData()
    { x = 0.13;  
    
    
    frame();
 setTimeout(refreshData, x*1000
    );
    }
    refreshData(); 




  
    </script>
    `
    socket.emit('very-large-packet-for-user1', fileuser1)
}

if(onlineUsers.length == 2){
// assign rooms n stuff

socket.emit('ready','ready');

console.log(roomNumber2);
socket.emit('whoami', 'user2');
var fileuser2 =`<html>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.1/socket.io.js"
integrity="sha512-vGcPDqyonHb0c11UofnOKdSAt5zYRpKI4ow+v6hat4i96b7nHSn8PQyk0sT5L9RECyksp+SztCPP6bqeeGaRKg=="
crossorigin="anonymous"></script>

<div id="banner">
<video height='200'  width = "300" id='other-user-disp' autoplay ></video>

<img height='200'  width = "300"id='image'></img>

</html>
<script>
document.getElementById("other-user-disp");;
const video = document.querySelector('video')
navigator.mediaDevices.getUserMedia( {video: { width: 150, height:130} }).then((stream) => video.srcObject = stream);
var socket = io.connect('https://yourdomain/` + roomNumber1 + `');
function frame() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const data = canvas.toDataURL('image/png');
    

    socket.emit('img', data);
}




socket.on('out-img', (data) => {
    
    document.getElementById('image').src = data;
});


function refreshData()
{ x = 0.13;  


frame();


setTimeout(refreshData, x*1000
);
}
refreshData(); 
</script>
`
    socket.emit('very-large-packet-for-user2', fileuser2)

    
    stream1.on('connection', socket => {
        console.log('user 1 connected')
            socket.on('img', (data) => {
   
            stream2.emit('out-img', data)
            
          });
    });
   
   stream2.on('connection', socket => {
       console.log('user 2 connected')
     socket.on('img', (data) => {
   
            stream1.emit('out-img', data)
            
        });
    });
   stream1.on('disconnect', () =>{
     onlineUsers.splice(onlineUsers.indexOf(socket), 1);
   
    })
    }


//send file to client


    socket.on("disconnect", () => {
        onlineUsers.splice(onlineUsers.indexOf(socket), 1);
    });

 })


 app.get('/', function(req,res){
        res.send('stream server - no information to display')
    })




