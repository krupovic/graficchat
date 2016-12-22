// -----------
// Setup
// -----------


// The faster the user moves their mouse
// the larger the circle will be
// We dont want it to be larger/smaller than this
tool.maxDistance = 2;
tool.maxDistance = 80;

// Each user has a unique session ID
// We'll use this to keep track of paths
//var sessionId = socket.io.engine.id;
//alert(sessionId);
// Returns an object specifying a semi-random color
function randomColor() {
  
  return {
    hue: Math.random() * 360,
    saturation: 0.8,
    brightness: 0.8,
    alpha: 0.5
  };

}

// An object to keep track of each users paths
// We'll use session ID's as keys
paths = {};

// -----------
// User Events
// -----------


// The user started a path
function onMouseDown(event) {
  
  // Create the new path
  color = randomColor();

  startPath( event.point, color, sessionId );

  // Inform the backend
  emit("startPath", {point: event.point, color: color}, sessionId);
  
}

function onMouseDrag(event) {

  var step        = event.delta / 2;
  step.angle     += 90; 
  var top         = event.middlePoint + step;
  var bottom      = event.middlePoint - step;

  continuePath( top, bottom, sessionId );

  // Inform the backend
  emit("continuePath", {top: top, bottom: bottom}, sessionId);

}

function onMouseUp(event) {

  endPath(event.point, sessionId);

  // Inform the backend
  emit("endPath", {point: event.point}, sessionId);

}






// -----------------
// Drawing functions
// Use to draw multiple users paths
// -----------------


function startPath( point, color, sessionId ) {
  paths[sessionId] = new Path();
  paths[sessionId].fillColor = color;
  paths[sessionId].add(point);
  console.log(paths[sessionId]);
}

function continuePath(top, bottom, sessionId) {
  var path = paths[sessionId];
  console.log(top);
  path.add(top);
  path.insert(0, bottom);
//  console.log("Path continued: "+paths[sessionId]);
 // console.log(JSON.stringify(path));
}

function endPath(point, sessionId) {

  var path = paths[sessionId];

  path.add(point);
  path.closed = true;
  path.smooth();
  //console.log("Path ended") ;
 // console.log("testpath" + JSON.stringify(testpath));
 console.log("path" +path);
  delete paths[sessionId]

}



// -----------------
// Emit
// Use to inform the server of user events
// -----------------


function emit(eventName, data) {

  socket.emit(eventName, data, sessionId);

}







// -----------------
// On
// Draw other users paths
// -----------------



socket.on( 'startPath', function( data, sessionId ) {
  point = new Point(data.point[1],data.point[2]);
  startPath(data.point, data.color, sessionId);
  console.log("start path received from server" + data.color);
 
})


socket.on( 'continuePath', function( data, sessionId ) {

bottom = new Point(data.bottom[1],data.bottom[2]);
  continuePath(data.top, data.bottom, sessionId);
  view.draw();


  
})


socket.on( 'endPath', function( data, sessionId ) {
  point = new Point(data.point[1],data.point[2]);
  endPath(data.point, sessionId);
  view.draw();
})