// Variable Initialisation :
var cameraFeed = document.getElementById("cameraFeed");
var scanning_ = false;

// JS - Local functions :
	function start_scan(){
		cameraFeed.style.width = '100rem';
		cameraFeed.style.minWidth = '40rem';
		document.getElementById("scan-button").style.display = 'none';
		document.getElementById("stop-scan-button").style.display = 'flex';
		scanning_ = true;
		eel.beginQRScan()();
		// eel.print_()
	}
	function stop_scan(){
		scanning_ = false;
		document.getElementById("scan-button").style.display = 'flex';
		document.getElementById("stop-scan-button").style.display = 'none';

	}

    function setRegistrationEndsIn(deadline) {
        let date1 = new Date();
        let date2 = new Date(deadline);
    
        var millisec = date2.getTime() - date1.getTime();
        const timeRemaining = document.getElementById("timeRemaining");
        if(millisec<=0) {
            timeRemaining.innerHTML = `Time is up`;
            return;
        }
        let tmp = millisec;
        let hr = Math.floor(tmp / 1000 / 60 / 60);
        tmp -= hr * 1000 * 60 * 60;
        let min = Math.floor(tmp / 1000 / 60);
        tmp -= min * 1000 * 60;
        let sec = Math.floor(tmp/1000);
        timeRemaining.innerHTML = `${hr} : ${min} : ${sec}`;
        millisec-=1000;
        const countDownInterval = setInterval(()=> {
            console.log("yo")
            if(millisec<=0) {
                clearInterval(countDownInterval);
                timeRemaining.innerHTML = `Time is up`;
                return;
            }
            tmp = millisec;
            hr = Math.floor(tmp / 1000 / 60 / 60); tmp -= hr * 1000 * 60 * 60;
            min = Math.floor(tmp / 1000 / 60); tmp -= min * 1000 * 60;
            sec = Math.floor(tmp/1000);
            timeRemaining.innerHTML = `${hr} : ${min} : ${sec}`;
            millisec-=1000;
        }, 1000);
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