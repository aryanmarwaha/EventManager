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
}




// important --routes

eel.expose(reRenderPastCommits);
function reRenderPastCommits(data) {
    console.log(data);
    let pastCommitContainer = document.getElementById("Past-commits");
    pastCommitContainer.innerHTML = "";
    for(let i=0;i<data.length;i++) {
        // console.log("hey hey")
        let newCommit = document.createElement("div");
        newCommit.classList.add("commit-container");
        newCommit.setAttribute("value", data[i].value);
        let childEle1 = document.createElement("div");
        let childEle2 = document.createElement("div");
        childEle1.innerText = data[i].participantName;
        childEle2.innerText = `Date-time : ${data[i].timeStamp}`;
        newCommit.appendChild(childEle1);
        newCommit.appendChild(childEle2);

        pastCommitContainer.appendChild(newCommit);
    }
}


eel.expose(render_userdata);
function render_userdata(user_data){

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
	document.querySelector("#User-img img").src = user_data["img-src"];
	document.getElementById("User-name").innerHTML = user_data["name"];
	document.getElementById("User-group-type").innerHTML = user_data["role"];
	document.getElementById("ticket").value = user_data["ticket"];
	document.getElementById("email").value = user_data["email"];
	document.getElementById("phone").value = user_data["phone"];

	user_dataDiv.style.display = 'flex';


	// Resetting user_div
	setTimeout(trig_history_button, (15*1000));
}