// Event-Listeners -- charts-options
var manual_button = document.getElementById('manual-button');
var charts_button = document.getElementById('charts-button');
var history_button = document.getElementById('history-button');



manual_button.addEventListener("click",trig_manual_button);
charts_button.addEventListener("click",trig_charts_button);
history_button.addEventListener("click",trig_history_button);

// Event-Listeners -- stats-bar



// JS - Local functions :
function trig_manual_button(){
	let stats_manualDiv = document.getElementById('manual-panel');
	let stats_chartsDiv = document.getElementById('stats-charts');
	let past_commitsDiv = document.getElementById('Past-commits');
	let user_dataDiv = document.getElementById('User-data');

	manual_button.style.color = 'aquamarine';
	history_button.style.color = 'inherit';
	charts_button.style.color = 'inherit';

	// Div-display --handling
    stats_manualDiv.style.display = 'flex';
	stats_chartsDiv.style.display = 'none';
	past_commitsDiv.style.display = 'none';
	user_dataDiv.style.display = 'none';

    // set-stats-header-title
    document.getElementById("stats-header-title").innerHTML = "Walkin's";

}
function trig_charts_button(){
	let stats_manualDiv = document.getElementById('manual-panel');
	let stats_chartsDiv = document.getElementById('stats-charts');
	let past_commitsDiv = document.getElementById('Past-commits');
	let user_dataDiv = document.getElementById('User-data');

	manual_button.style.color = 'inherit';
	charts_button.style.color = 'aquamarine';
	history_button.style.color = 'inherit';

	// Div-display --handling
    stats_manualDiv.style.display = 'none';
	stats_chartsDiv.style.display = 'flex';
	past_commitsDiv.style.display = 'none';
	user_dataDiv.style.display = 'none';

    // set-stats-header-title
    document.getElementById("stats-header-title").innerHTML = "Statistics";

}
function trig_history_button(){
	let stats_manualDiv = document.getElementById('manual-panel');
	let stats_chartsDiv = document.getElementById('stats-charts');
	let past_commitsDiv = document.getElementById('Past-commits');
	let user_dataDiv = document.getElementById('User-data');
	
	manual_button.style.color = 'inherit';
	charts_button.style.color = 'inherit';
	history_button.style.color = 'aquamarine';

	// Div-display --handling
    stats_manualDiv.style.display = 'none';
	stats_chartsDiv.style.display = 'none';
	past_commitsDiv.style.display = 'flex';
	user_dataDiv.style.display = 'none';

    // set-stats-header-title
    document.getElementById("stats-header-title").innerHTML = "History";
    eel.fetchAttendees()
}




// important --routes

eel.expose(reRenderPastCommits);
function reRenderPastCommits(data) {
    console.log(data);
    let pastCommitContainer = document.getElementById("Past-commits");
    pastCommitContainer.innerHTML = "";
    
    for(let i=0;i<data.length;i++) {
        // console.log("hey hey")
        timeStamp = new Date(data[i].timeStamp)
        const shortDate = timeStamp.toLocaleDateString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric'});
        const shortTime = timeStamp.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});

        let newCommit = document.createElement("div");
        newCommit.classList.add("commit-container");
        newCommit.setAttribute("value", data[i].value);
        let childEle1 = document.createElement("div");
        let childEle2 = document.createElement("div");
        childEle1.innerText = data[i].participantName;
        childEle2.innerText = `Datetime: ${" "+shortDate+" "+shortTime}`;
        newCommit.appendChild(childEle1);
        newCommit.appendChild(childEle2);

        pastCommitContainer.appendChild(newCommit);
    }
}


eel.expose(render_userdata);
function render_userdata(user_data) {

	let stats_manualDiv = document.getElementById('manual-panel');
	let stats_chartsDiv = document.getElementById('stats-charts');
	let past_commitsDiv = document.getElementById('Past-commits');
	let user_dataDiv = document.getElementById('User-data');
	
	manual_button.style.color = 'inherit';
	charts_button.style.color = 'inherit';
	history_button.style.color = 'inherit';

	// Div-display --handling
    stats_manualDiv.style.display = 'none';
	stats_chartsDiv.style.display = 'none';
	past_commitsDiv.style.display = 'none';

	// Displaying User-data
	document.querySelector("#User-img img").src = user_data["img-src"]? user_data : "../Static/user_img_success.svg";
	document.getElementById("User-name").innerHTML = user_data["name"]? user_data["name"] : "<username>";
	document.getElementById("User-group-type").innerHTML = user_data["role"]? user_data['role'] : "participant";
	document.getElementById("ticket").value = user_data["ticket"];
	document.getElementById("email").value = user_data["email"];
	document.getElementById("phone").value = user_data["phone"];

	user_dataDiv.style.display = 'flex';
    playSound();
	// Resetting user_div
	setTimeout(trig_history_button, (15*1000));
}

eel.expose(re_render_chartData);
function re_render_chartData(data) {
    setConfirmationContent(data["confirmationCurr"], data["confirmationCap"]);
    setVenueContent(data["venueCurr"], data["venueCap"]);
}


let manualBar = document.querySelector("#manual-panel > form > button").addEventListener("click", (event)=>{
    event.preventDefault()
    let name = document.getElementById("walkin-username");
    let email = document.getElementById("walkin-useremail");
    let phone = document.getElementById("walkin-phone");
    eel.registerWalkin(name.value, email.value, phone.value);
    name.value = "";
    email.value = "";
    phone.value = "";
})











function playSound() {
    const snd = new Audio(`data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=`);
    snd.play();
}