// Variable Initialisation :
var cameraFeed = document.getElementById("cameraFeed");
var scanning_ = false;

// JS - Local functions :
	function start_scan(){
		cameraFeed.style.width = '100rem';
		cameraFeed.style.minWidth = '40rem';
		scanning_ = true;
		eel.scan_qr()();
		// eel.print_()
	}
	function stop_scan(){
		scanning_ = false;
	}

// eel - exposed functions
	eel.expose(stopped_scan);
	eel.expose(SetImage);

	function stopped_scan(){
		cameraFeed.style.width = '10rem';
		cameraFeed.style.minWidth = 'unset';
		cameraFeed.src = "./Static/scan_now_img.png";
	}
	function SetImage(frame){
		cameraFeed.src = frame;
		// eel.print_(scanning_)
		return scanning_;
	}