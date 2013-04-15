//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var FirstView = require('ui/common/FirstView');
		
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff'
	});
	
	var scrollView = Ti.UI.createScrollView({
		width : '100%',
		height : '100%'
	});
	
	var webView = Ti.UI.createWebView({
		anchorPoint : {x:0, y:0},
		url : 'http://gaussianos.com/video-los-azulejos-que-desaparecen-y-vuelven-a-aparecer/',
		height : Ti.Platform.displayCaps.platformHeight,
		top : 0,
		bottom : 0,
		width : '100%',
		willHandleTouches : true
	});
	
	webView.addEventListener('load', function (e) {
		var height = PixelsToDPUnits(webView.evalJS('document.body.parentNode.scrollHeight;')) * 0.656;
		console.log('Height de la página: ' + height);
		scrollView.contentHeight = height;
		webView.height = height;
	});

	
	var amount, pageOffset, topMatrix, residual, startY, startX, pageYOffset, dy, initialWebViewYOffset, lastWebViewYOffset, isFirst = true, lastY, curY, bucket, isAnimating = false, initialTime, finalTime, distance, direction;
	
	self.addEventListener('touchstart', function(e) {
		startX = e.x;
		startY = e.y;
		initialWebViewYOffset = webView.evalJS('window.pageYOffset;');
		console.log('Y inicial = ' + e.y +'Offset inicial de ' + initialWebViewYOffset);
		lastWebViewYOffset = 0;
		dy = pageYOffset;
		lastY = e.y;
		curY = e.y;
		bucket = 0;
		isAnimating = false;
		initialTime = new Date().getTime();
		distance = 0;
		direction = e.y;
		amount = 0;
		residual = 0;
		pageOffset = webView.evalJS('window.pageYOffset;');
	});	
	
	webView.addEventListener('touchmove', function(e) {
		if (isAnimating)
			return;
		isAnimating = true;
		console.log('dps = ' + (lastY - e.y));
		lastWebViewYOffset = DPUnitsToPixels(lastY - e.y);
		if (lastWebViewYOffset <= 0) {
			lastWebViewYOffset -= 1;
		} else {
			lastWebViewYOffset += 3;
		}
		amount += lastWebViewYOffset;
		lastY = e.y;
		var attempt = lastWebViewYOffset + residual;
		if (attempt > 0 && attempt < 1.1) {
			initialTime = new Date().getTime();
			distance = 0;
			residual += lastWebViewYOffset;
			isAnimating = false;
			return;
		}
		distance += lastWebViewYOffset + residual;
		var yShiftment= lastWebViewYOffset + residual;
		dy = startY - e.y;

		if (lastWebViewYOffset <= 0) {
			// Going down.
			console.log('Bajando' + yShiftment);
			webView.evalJS('window.scrollBy(0,' + (yShiftment) +');');
		} else {
			// Going up.
			console.log('Subiendo' + yShiftment);
			webView.evalJS('window.scrollBy(0,' + (yShiftment) +');');
		}
		var nextY = pageYOffset + startY - e.y;
		console.log('x = ' + e.x + ' y = ' + e.y + ' lastWebViewYOffset = ' + lastWebViewYOffset);
		residual = 0;
		isAnimating = false;
	});
	
	webView.addEventListener('touchcancel', function(e) {
		console.log('SE CANCELA EL EVENTO');
	});
	
	webView.addEventListener('touchend', function (e) {
		console.log('Termina el evento y final = ' + e.y);
		finalTime = new Date().getTime();
		var dTime = finalTime - initialTime;
		var velocity = distance / dTime;
		var aceleration = velocity / dTime;
		console.log('[Distancia recorrida]:' + distance);
		console.log('[Velocidad]:' + velocity);
		console.log('[Aceleración]: ' + aceleration);
		console.log('Diferencia en ventana: ' + (startY - e.y) +  ' Diferencia en px = ' + amount);
		//webView.evalJS('window.scrollBy(0,' + Math.abs(yShiftment | 0) +');');
	});
	
	function PixelsToDPUnits(ThePixels)
	{
	  return (ThePixels / (Titanium.Platform.displayCaps.dpi / 160));
	}
	 
	 
	function DPUnitsToPixels(TheDPUnits)
	{
	  return (TheDPUnits * (Titanium.Platform.displayCaps.dpi / 160));
	}
	
	scrollView.add(webView);
	self.add(scrollView);
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
