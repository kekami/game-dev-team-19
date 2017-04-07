var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#9ea7b8";
ctx.fillRect(0, 0, c.width, c.height);
ctx.font = "30px Arial";
ctx.fillText("This is a canvas",10,50);