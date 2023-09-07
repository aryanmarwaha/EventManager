// Event-Listeners -- charts-options
var manual_button = document.getElementById('manual-button');
var charts_button = document.getElementById('charts-button');
var history_button = document.getElementById('history-button');



// manual_button.addEventListener("click",trig_manual_button());
charts_button.addEventListener("click",trig_charts_button);
history_button.addEventListener("click",trig_history_button);

// Event-Listeners -- stats-bar



// JS - Local functions :
function trig_charts_button(){
	let stats_chartsDiv = document.getElementById('stats-charts');
	let past_commitsDiv = document.getElementById('Past-commits');
	let user_dataDiv = document.getElementById('User-data');

	history_button.style.color = 'inherit';
	charts_button.style.color = 'aquamarine';

	// Div-display --handling
	stats_chartsDiv.style.display = 'flex';
	past_commitsDiv.style.display = 'none';
	user_dataDiv.style.display = 'none';

}
function trig_history_button(){
	let stats_chartsDiv = document.getElementById('stats-charts');
	let past_commitsDiv = document.getElementById('Past-commits');
	let user_dataDiv = document.getElementById('User-data');
	
	history_button.style.color = 'aquamarine';
	charts_button.style.color = 'inherit';

	// Div-display --handling
	stats_chartsDiv.style.display = 'none';
	past_commitsDiv.style.display = 'flex';
	user_dataDiv.style.display = 'none';
}

eel.expose(render_userdata);
function render_userdata(user_data){

	let stats_chartsDiv = document.getElementById('stats-charts');
	let past_commitsDiv = document.getElementById('Past-commits');
	let user_dataDiv = document.getElementById('User-data');
	
	history_button.style.color = 'inherit';
	charts_button.style.color = 'inherit';

	// Div-display --handling
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
	setTimeout(trig_history_button, (30*1000));
}