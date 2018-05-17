const MENUS = ["mainScreen", "printerSelect", "printerOptions"];

function alertBox (info) {
    document.getElementById("alertBox").innerHTML = info;
    document.getElementById("alertBox").style.visibility = "visible";
    setTimeout(function(){document.getElementById("alertBox").style.visibility = "hidden";},3000);
}

function setColor(type) {
	switch(type) {
	case 0:
		$.get( "/rainbow", function( data ) {
			setActive(0);
		});
		break;
	case 1:
		$.get( "/white", function( data ) {
			setActive(1);
		});
		break;
	case 2:
		$.get( "/bucky", function( data ) {
			setActive(2);
		});
		break;
	case 3:
		$.get( "/active", function( data ) {
			setActive(3);
		});
		break;
	}
}

var defaultColor = "white";
var activeColor = "grey";
function setActive(id) {
	// set all off
	document.getElementById("button0").style.background = defaultColor;
	document.getElementById("button1").style.background = defaultColor;
	document.getElementById("button2").style.background = defaultColor;
	document.getElementById("button3").style.background = defaultColor;
	
	document.getElementById("button" + id).style.background = activeColor;
}

function updatePrinters() {
	changeMenu(1);
	printerList = document.getElementById("printerList");
	printerList.innerHTML = ""; // clear from previous query 
	$.get("/printerList", function( data ) {
		for (var i = 0; i < data.list.length; i++) {
			printerList.innerHTML += "<div class='printerItem' onclick=printerSettings('"+data.list[i]+"')>" + data.list[i] + "</div>";
		}
	});
}

function printerSettings(name) {
	changeMenu(2);
}

function changeMenu(index) {
	for (var i = 0; i < MENUS.length; i++) {
		document.getElementById(MENUS[i]).style.visibility = "hidden";
	}

	document.getElementById(MENUS[index]).style.visibility = "visible";
}