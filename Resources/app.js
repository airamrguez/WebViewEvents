require('ti.viewshadow');
var leftMenu	= Ti.UI.createWindow({
	backgroundColor: 'red',
	top:   0,
	left:  0,
	width: 150,
	zIndex: 1
});
var data = [{title:"Row 1"},{title:"Row 2"},{title:"Row 3"},{title:"Row 4"}];
var tableView	= Ti.UI.createTableView({ data: data });
leftMenu.add(tableView);
leftMenu.open();

// Facebook like menu window
var rightMenu	= Ti.UI.createWindow({
	backgroundColor: 'red',
	top:   0,
	right:  0,
	width: 150,
	zIndex: 1
});
var data = [{title:"Row 1"},{title:"Row 2"},{title:"Row 3"},{title:"Row 4"}];
var tableView	= Ti.UI.createTableView({ data: data });
rightMenu.add(tableView);
rightMenu.open();

// animations
var animateLeft	= Ti.UI.createAnimation({
	left: 150,
	curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT,
	duration: 500
});

var bounce1 = Ti.UI.createAnimation({
	left : 145,
	curve : Ti.UI.iOS.ANIMATION_CURVE_EASE_IN,
	duration: 300
});

var animateRight	= Ti.UI.createAnimation({
	left: 0,
	curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT,
	duration: 500
});
var animateNegativeLeft = Ti.UI.createAnimation({
				left: -150,
				curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT,
				duration: 500
});


var win = Titanium.UI.createWindow({
	width : Ti.Platform.displayCaps.platformWidth + 10,
	left: 0,
	borderRadius:20,
	zIndex: 90
});

var container = Ti.UI.createView({
	width : Ti.UI.FILL,
	height : Ti.UI.FILL,
		shadow:{
        shadowRadius:5,
        shadowOpacity:1,
        shadowOffset:{x:0, y:0},
        shadowColor:'blue'
    },
    zIndex : 5
});
var win1 = Titanium.UI.createWindow({
    backgroundColor: 'white',
    title: 'Facebook menu',
    left: 0,
	zIndex: 10
});



var nav = Titanium.UI.iPhone.createNavigationGroup({
   window: win1,
   left: 0,
   width: Ti.Platform.displayCaps.platformWidth
});
var button = Ti.UI.createButton({
	title: 'm',
	left: 10,
	width: 30,
	height: 30,
	top: 10,
		shadow:{
        shadowRadius:5,
        shadowOpacity:1,
        shadowOffset:{x:0, y:0},
        shadowColor:'black'
    }
});
var button2 = Ti.UI.createButton({
	title: 'm',
	right: 10,
	width: 30,
	height: 30,
	top: 10
});


	var webView = Ti.UI.createWebView({
		left : 0,
		//backgroundColor : 'green',
		url : 'http://www.appcelerator.com',
		height : Ti.Platform.displayCaps.platformHeight,
		top : 0,
		bottom : 0,
		width : '100%',
		//willHandleTouches : false,
		zIndex : 14
	});
	//container.add(webView);
	win1.add(webView);
	
	
	
	function PixelsToDPUnits(ThePixels)
	{
	  return (ThePixels / (Titanium.Platform.displayCaps.dpi / 160));
	}

var touchStartX = 0;
var touchStarted = false;
win1.addEventListener('touchstart',function(e){
	touchStartX = parseInt(e.x,10);
});

	Ti.App.addEventListener('touchStart', function(e) {
		 win1.fireEvent('touchstart', e);	
	});




win1.addEventListener('touchend',function(e){
	touchStarted = false;
	if( win.left < 0 ){
		if( win.left <= -140 ){
			win.animate(animateNegativeLeft);
			isToggled = true;
		} else {
			win.animate(animateRight);
			isToggled = false;
		}
	} else {
		if( win.left >= 140 ){
			win.animate(animateLeft);
			animateLeft.addEventListener('complete',function t1(e) {
				animateLeft.removeEventListener('complete', t1);
				win.animate(bounce1);
				bounce1.addEventListener('complete', function t2(e1) {
					bounce1.removeEventListener('complete', t2);
					win.animate(animateLeft);
				});
			});
			isToggled = true;
		} else {
			win.animate(animateRight);		
			isToggled = false;
		}
	}
	webView.applyProperties({enabled : true, touchEnabled: true});
});
win1.addEventListener('touchmove',function(e){
	var x = parseInt(webView.convertPointToView({x: e.x, y : e.y }, leftMenu).x, 10);
	var newLeft = x - touchStartX;
	if( touchStarted ){
		if( newLeft <= 150 && newLeft >= -150)
		win.left	= newLeft;
	}
	// Minimum movement is 30
	if( newLeft > 30 || newLeft < -30 ){
		touchStarted = true;
	}
});
nav.add(button);
nav.add(button2);
win.add(nav);
win.open();


var isToggled = false;
button.addEventListener('click',function(e){
	if( !isToggled ){
		win.animate(animateLeft);
		isToggled = true;
	} else {
		win.animate(animateRight);
		isToggled = false;
	}
});

button2.addEventListener('click',function(e){
	if( !isToggled ){
		win.animate(animateNegativeLeft);
		isToggled = true;
	} else {
		win.animate(animateRight);
		isToggled = false;
	}
});