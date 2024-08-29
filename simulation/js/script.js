var simstatus = 0;
var rotstatus = 1;
//comments section
var commenttext = "Some Text";
var commentloc = 0;
//computing section
var trans = new point(255, 190);
var a = new point(0, 0, "A");
var b = new point(0, 0, "B");
var c = new point(0, 0, "C");
var l = 40;
var lC = 60;
var theta = 0;
//var BOQ = 55; // all angles to be defined either in degrees only or radians only throughout the program and convert as and when required
//var AQO = 90; // All angles in Degrees. (mention the specification in the script like here)
//graphics section
var canvas;
var ctx;
//timing section
var simTimeId = setInterval("", "1000");
var pauseTime = setInterval("", "1000");
var time = 0;
//point tracing section
var ptx = [];
var pty = [];
var elx = [];
var ely = [];
//click status of legend and quick reference
var legendCS = false;
var quickrefCS = false;
//temporary or dummy variables
var temp = 0;
var count = 0;
var trace = false;
const rotationButton = document.getElementById('rotationbutton');
/*

// for trials during development
function trythis()
{ 		alert();}
*/

//change simulation specific css content. e.g. padding on top of variable to adjust appearance in variables window
function editcss() {
  $(".variable").css("padding-top", "40px");
  $(".usercheck").css("top", "-=10px");
  $(".usercheck").css("left", "38px");
  $(".usercheck").css("width", "150px");
  $("#resetparams").css("left", "12px");
  $("#resetparams").css("height", "-=4px");
  $("#resetparams").css("font-size", "-=4px");
  //$('#legend').css("width",document.getElementById('legendimg').width+"px");
  //$('#quickref').css("height",document.getElementById('quickrefimg').height+"px");
}

//start of simulation here; starts the timer with increments of 0.1 seconds
function startsim() {
  simTimeId = setInterval("time=time+0.1; varupdate(); ", "100");
}

// switches state of simulation between 0:Playing & 1:Paused
function simstate() {
  var imgfilename = document.getElementById("playpausebutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename == "bluepausedull") {
    document.getElementById("playpausebutton").src = "images/blueplaydull.svg";
    clearInterval(simTimeId);
    simstatus = 1;
    $("#thetaspinner").spinner("value", theta); //to set simulation parameters on pause
    pauseTime = setInterval("varupdate();", "100");
    document.querySelector(".playPause").textContent = "Play";
    rotationButton.classList.add('disabled');
  rotationButton.onclick = tracePlot; // Re-enable the function
  console.log("disable")
  }
  if (imgfilename == "blueplaydull") {
    time = 0;
    clearInterval(pauseTime);
    document.getElementById("playpausebutton").src = "images/bluepausedull.svg";
    simTimeId = setInterval("time=time+0.1; varupdate(); ", "100");
    simstatus = 0;
    document.querySelector(".playPause").textContent = "Pause";
    rotationButton.classList.remove('disabled');
  rotationButton.onclick = null; // Disable the function
  console.log("enable");
  trace = false;
  }
}


function tracePlot() {
  trace = !trace;

  // console.log(1);
  // if (document.getElementById("trace").checked == true) {
  //   document.getElementById("trace").checked = false;
  //   pointtrace(ptx, pty, ctx, "blue", 2);
  // } else {
  //   document.getElementById("trace").checked = true;
  //   ptx = [];
  //   pty = [];
  // }
}

// switches state of rotation between 1:CounterClockWise & -1:Clockwise
function rotstate() {
  var imgfilename = document.getElementById("rotationbutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename == "bluecwdull") {
    document.getElementById("rotationbutton").src = "images/blueccwdull.svg";
    rotstatus = -1;
  }
  if (imgfilename == "blueccwdull") {
    document.getElementById("rotationbutton").src = "images/bluecwdull.svg";
    rotstatus = 1;
  }
}
/*
//Displaying Equations for Quick Reference
function showEquations()
{
	if(quickrefCS)
	{
		$('#quickreficon').css('border', 'double');
		$('#quickref').css('width', '0px');
		$('#quickref').css('left', '600px');
		$('#quickref').css('border', '0px');
		quickrefCS=false;	
		
	}
	else
	{
		$('#quickreficon').css('border', 'inset red');
		$('#quickref').css('width', document.getElementById('quickrefimg').width+"px");
		$('#quickref').css("left", 599-document.getElementById('quickrefimg').width+"px");
		$('#quickref').css('border', 'solid 1px');
		quickrefCS=true;	
	}
}

//Displaying Legend
function showLegend()
{
	if(legendCS)
	{
		$('#legendicon').css('border', 'double');
		$('#legend').css('height', '0px');
		$('#legend').css('border', '0px');
		legendCS=false;	
	}
	else
	{
		$('#legendicon').css('border', 'inset red');
		$('#legend').css("height", document.getElementById('legendimg').height+"px");
		$('#legend').css('border', 'solid 1px');
		legendCS=true;	
	}
}
*/
//Initialise system parameters here
function varinit() {
  varchange();
  //Variable AB slider and number input types
  $("#ABslider").slider("value", 106);
  $("#ABspinner").spinner("value", 106);
  //Variable AC slider and number input types
  $("#ACslider").slider("value", 66);
  $("#ACspinner").spinner("value", 66);
  //Variable alpha slider and number input types
  $("#thetaslider").slider("value", 90);
  $("#thetaspinner").spinner("value", 90);
}

// Initialise and Monitor variable containing user inputs of system parameters.
//change #id and repeat block for new variable. Make sure new <div> with appropriate #id is included in the markup
function varchange() {
  //Variable AB slider and number input types
  $("#ABslider").slider({ max: 150, min: 50, step: 10 }); // slider initialisation : jQuery widget
  $("#ABspinner").spinner({ max: 150, min: 50, step: 5 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#ABslider").on("slide", function (e, ui) {
    $("#ABspinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
    count = 0;
  });
  $("#ABspinner").on("spin", function (e, ui) {
    $("#ABslider").slider("value", ui.value);
    ptx = [];
    pty = [];
    count = 0;
  });
  $("#ABspinner").on("change", function () {
    count = 0;
    varchange();
  });

  //Variable AC slider and number input types
  $("#ACslider").slider({ max: 150, min: 50, step: 5 }); // slider initialisation : jQuery widget
  $("#ACspinner").spinner({ max: 150, min: 50, step: 5 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#ACslider").on("slide", function (e, ui) {
    $("#ACspinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
    count = 0;
  });
  $("#ACspinner").on("spin", function (e, ui) {
    $("#ACslider").slider("value", ui.value);
    ptx = [];
    pty = [];
    count = 0;
  });
  $("#ACspinner").on("change", function () {
    count = 0;
    varchange();
  });

  //Variable theta slider and number input types
  $("#thetaslider").slider({ max: 360, min: 0, step: 5 }); // slider initialisation : jQuery widget
  $("#thetaspinner").spinner({ max: 360, min: 0, step: 5 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#thetaslider").on("slide", function (e, ui) {
    $("#thetaspinner").spinner("value", ui.value);
  });
  $("#thetaspinner").on("spin", function (e, ui) {
    $("#thetaslider").slider("value", ui.value);
    trace = false;

  });
  $("#thetaspinner").on("change", function () {
    trace = false;
    
    varchange();
  });

  varupdate();
}

//Computing of various system parameters
function varupdate() {
  $("#ABslider").slider("value", $("#ABspinner").spinner("value")); //updating slider location with change in spinner(debug)
  $("#ACslider").slider("value", $("#ACspinner").spinner("value"));
  $("#thetaslider").slider("value", $("#thetaspinner").spinner("value"));

  l = $("#ABspinner").spinner("value");
  lC = $("#ACspinner").spinner("value");

  if (!simstatus) {
    printcomment("Pause animation to view dimensions", 1);
    printcomment("", 2);
    theta += rotstatus * 6;
    theta = theta % 360;
    $("#thetaslider").slider("disable");
    $("#thetaspinner").spinner("disable");
    
  }

  if (simstatus) {
    $("#thetaslider").slider("enable");
    $("#thetaspinner").spinner("enable");
    theta = $("#thetaspinner").spinner("value");
    temp = Math.abs(lC - l);
    ptx = [];
    pty = [];
    printcomment("", 1);
    printcomment("<center>BC=" + temp + "<br>AC=" + lC + "</center>", 2);
  }

  a.xcoord = -l * Math.cos(rad(theta));
  a.ycoord = 0;
  b.xcoord = 0;
  b.ycoord = l * Math.sin(rad(theta));
  c.xcoord = a.xcoord + lC * Math.cos(rad(theta));
  c.ycoord = a.ycoord + lC * Math.sin(rad(theta));
  draw();
}

//Simulation graphics
function draw() {
  canvas = document.getElementById("simscreen");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 550, 400); //clears the complete canvas#simscreen everytime

  a = pointtrans(a, trans);
  b = pointtrans(b, trans);
  c = pointtrans(c, trans);

  ptx.push(c.xcoord);
  pty.push(c.ycoord);

  drawguides(ctx, trans.xcoord, trans.ycoord, 380, 350);

  drawrect(a, 50, 20, 5, ctx, "#000000", "#CC3300", 3);
  drawrect(b, 20, 50, 5, ctx, "#000000", "#CC3300", 3);

  pointjoin(a, b, ctx, "black", 5);
  pointjoin(a, c, ctx, "black", 5);

  pointdisp(a, ctx, "", "#000000", "#CCCC33", "#000");
  pointdisp(b, ctx, "", "#000000", "#CCCC33", "#000");
  pointdisp(c, ctx, "", "#000000", "#CCCC33", "#000");

  if (trace) {
    pointtrace(ptx, pty, ctx, "blue", 2);
    //pointdisp(c,ctx,2,true,1);
  } else {
    pointtrace(ptx, pty, ctx, "black", 1);
    console.log("not blue"

    )
    ptx = [];
    pty = [];
  }
  drawdimensions(ctx);
}


//drawing the guides
function drawguides(context, cenx, ceny, hwid, vwid, ht, vt, lwidth, scolor) {
  if (!scolor) scolor = "#949494";
  if (!lwidth) lwidth = 4;
  if (!ht) ht = 20;
  if (!vt) vt = 20;

  context.beginPath();
  context.moveTo(cenx - hwid / 2, ceny - vt / 2);
  context.lineTo(cenx - ht / 2, ceny - vt / 2);
  context.lineTo(cenx - ht / 2, ceny - vwid / 2);
  context.lineTo(cenx + ht / 2, ceny - vwid / 2);
  context.lineTo(cenx + ht / 2, ceny - vt / 2);
  context.lineTo(cenx + hwid / 2, ceny - vt / 2);
  context.lineTo(cenx + hwid / 2, ceny + vt / 2);
  context.lineTo(cenx + ht / 2, ceny + vt / 2);
  context.lineTo(cenx + ht / 2, ceny + vwid / 2);
  context.lineTo(cenx - ht / 2, ceny + vwid / 2);
  context.lineTo(cenx - ht / 2, ceny + vt / 2);
  context.lineTo(cenx - hwid / 2, ceny + vt / 2);
  context.lineTo(cenx - hwid / 2, ceny - vt / 2);
  context.closePath();
  context.lineWidth = lwidth;
  context.strokeStyle = scolor;
  context.lineJoin = "round";
  context.stroke();
}

function drawdimensions(context) {
  if (simstatus) {
    if (count < 1) {
      elx = [];
      ely = [];
      for (temp = 0; temp <= 360; temp++) {
        c.xcoord = -1 * l * Math.cos(rad(temp)) + lC * Math.cos(rad(temp));
        c.ycoord = lC * Math.sin(rad(temp));
        pointtrans(c, trans);
        elx.push(c.xcoord);
        ely.push(c.ycoord);
      }
      count++;
    }
    pointtrace(elx, ely, context, "black", 2);
    context.beginPath();
    context.strokeStyle = "#000";
    context.lineWidth = 1;
    context.moveTo(trans.xcoord, trans.ycoord - lC);
    context.lineTo(trans.xcoord - 230, trans.ycoord - lC);
    context.moveTo(trans.xcoord - 230, trans.ycoord + lC);
    context.lineTo(trans.xcoord, trans.ycoord + lC);
    context.moveTo(trans.xcoord - Math.abs(lC - l), trans.ycoord);
    context.lineTo(trans.xcoord - Math.abs(lC - l), trans.ycoord + 205);
    context.moveTo(trans.xcoord + Math.abs(lC - l), trans.ycoord + 205);
    context.lineTo(trans.xcoord + Math.abs(lC - l), trans.ycoord);
    context.closePath();
    context.stroke();
    context.beginPath();
    context.strokeStyle = "#000";
    context.lineWidth = 2;
    context.moveTo(trans.xcoord - 220, trans.ycoord + lC);
    context.lineTo(trans.xcoord - 220, trans.ycoord - lC);
    context.moveTo(trans.xcoord + Math.abs(lC - l), trans.ycoord + 200);
    context.lineTo(trans.xcoord - Math.abs(lC - l), trans.ycoord + 200);
    context.closePath();
    context.stroke();

    drawArrow(
      trans.xcoord - 220,
      trans.ycoord + lC,
      context,
      270,
      15,
      30,
      "",
      "",
      "#000"
    );
    drawArrow(
      trans.xcoord - 220,
      trans.ycoord - lC,
      context,
      90,
      15,
      30,
      "",
      "",
      "#000"
    );
    drawArrow(
      trans.xcoord + Math.abs(lC - l),
      trans.ycoord + 200,
      context,
      180,
      15,
      30,
      "",
      "",
      "#000"
    );
    drawArrow(
      trans.xcoord - Math.abs(lC - l),
      trans.ycoord + 200,
      context,
      0,
      15,
      30,
      "",
      "",
      "#000"
    );

    context.save();
    context.lineWidth = 1;
    context.textAlign = "center";
    context.font = "12px Arial";
    context.strokeText("2 x BC", trans.xcoord, trans.ycoord + 195);
    context.translate(trans.xcoord - 225, trans.ycoord);
    context.rotate(-Math.PI / 2);
    context.textAlign = "center";
    context.font = "12px Arial";
    context.strokeText("2 x AC", 0, 0);
    context.restore();
  }
}

//populating array for drawing ellipse
function popellipse() {}

// prints comments passed as 'commenttext' in location specified by 'commentloc' in the comments box;
// 0 : Single comment box, 1 : Left comment box, 2 : Right comment box
function printcomment(commenttext, commentloc) {
  if (commentloc == 0) {
    document.getElementById("commentboxright").style.visibility = "hidden";
    document.getElementById("commentboxleft").style.width = "570px";
    document.getElementById("commentboxleft").innerHTML = commenttext;
  } else if (commentloc == 1) {
    document.getElementById("commentboxright").style.visibility = "visible";
    document.getElementById("commentboxleft").style.width = "285px";
    document.getElementById("commentboxleft").innerHTML = commenttext;
  } else if (commentloc == 2) {
    document.getElementById("commentboxright").style.visibility = "visible";
    document.getElementById("commentboxleft").style.width = "285px";
    document.getElementById("commentboxright").innerHTML = commenttext;
  } else {
    document.getElementById("commentboxright").style.visibility = "hidden";
    document.getElementById("commentboxleft").style.width = "570px";
    document.getElementById("commentboxleft").innerHTML =
      "<center>please report this issue to adityaraman@gmail.com</center>";
    // ignore use of deprecated tag <center> . Code is executed only if printcomment function receives inappropriate commentloc value
  }
}
