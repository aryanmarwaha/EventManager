var eventName = "<EventName>";
// var eventId = "<EventName>";
var registrationEndsIn = "";
var confirmationCap = "--";
var confirmationCurr = "--";
var venueCap = "--";
var venueCurr = "--";

function setEventName(eventname) {
    eventName = eventname;
    document.getElementById("Event_name").innerHTML = eventname;
}

function setConfirmationContent(data1,data2) {
    confirmationCap = data1;
    confirmationCurr = data2;
    let statsCharts = document.getElementById("stats-charts");
    statsCharts.style.setProperty("--confirmations-val", (data1 / data2) * 100);
    statsCharts.style.setProperty("--confirmation-chart-content", "'" + `${data1} / ${data2}` + "'");
}

function setVenueContent(data1,data2) {
    venueCap = data1;
    venueCurr = data2;
    let statsCharts = document.getElementById("stats-charts");
    statsCharts.style.setProperty("--venue-capacity-val", (data1 / data2) * 100);
    statsCharts.style.setProperty("--venue-chart-content", "'" + `${data1} / ${data2}` + "'");
}


eel.expose(initializeMyAppUI);
function initializeMyAppUI(data) {
    console.log(data)
    setEventName(data.eventName);
    setRegistrationEndsIn(data.registrationEndTimeStamp);
    setConfirmationContent(data.confirmationCurr, data.confirmationCap);
    setVenueContent(data.venueCurr, data.venueCap);
}

document.addEventListener('DOMContentLoaded', eel.fetchScannerConfig())

eel.expose(closeEventScannerHelper)
function closeEventScannerHelper() {
    window.close()
}