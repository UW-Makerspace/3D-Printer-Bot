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

var nameList = [];
function updatePrinters() {
	changeMenu(1);
	printerList = document.getElementById("printerList");
	nameList = [];
	printerList.innerHTML = ""; // clear from previous query 
	$.get("/printerList", function( data ) {
		for (var i = 0; i < data.list.length; i++) {
			nameList.push(data.list[i]); // this is because two word names string parsing got janky
			printerList.innerHTML += "<div class='printerItem' onclick=printerSettings(\"" + i + "\")>" + data.list[i] + "</div>";
		}
	});
}

var currentName;
function printerSettings(nameIndex) {
	$.post("/printerInfo", {"name" : nameList[nameIndex]} ,function( data ) {
		if (data.active) {
			changeMenu(2);
			document.getElementById("printerOptionName").innerHTML = nameList[nameIndex];
			currentName = nameList[nameIndex];
		} else {
			alertBox( nameList[nameIndex] + " is inactive");
		}
	});	
}

function setWorkingStatus(status) {
	$.post("/setStatus", {"name" : currentName, "status" : status}, function( data ) {
		changeMenu(1);
		alertBox(status + " status Set");
	});	
}

function changeMenu(index) {
	for (var i = 0; i < MENUS.length; i++) {
		document.getElementById(MENUS[i]).style.display = "none";
	}

	document.getElementById(MENUS[index]).style.display = "block";
}
