// Muscles 💪
    const createNewEventButton = document.getElementById("createNewEvent");
    const overviewButton = document.getElementById("overviewButton");
    const runningButton = document.getElementById("runningButton");
    const upcommingButton = document.getElementById("upcommingButton");
    const historyButton = document.getElementById("historyButton");
    
    createNewEventButton.addEventListener("click", openScheduleNewEvent);
    document.getElementById("overlay").addEventListener("click", closeScheduleNewEvent);
    document.getElementById("close-scheduleEventContainer").addEventListener("click", closeScheduleNewEvent);
    document.getElementById("cancel-create-event-button").addEventListener("click", closeScheduleNewEvent);

    overviewButton.addEventListener("click", showOverview);
    runningButton.addEventListener("click", showRunning);
    upcommingButton.addEventListener("click", showUpComming);
    historyButton.addEventListener("click", showHistory);

    function openScheduleNewEvent() {
        document.getElementById("overlay").style.display = "flex";
        document.getElementById("scheduleEventContainer").style.display = "flex";
    }

    function closeScheduleNewEvent(forceClose = false) {
        if(!forceClose && !confirm("Are you sure you want to exit without completing task.")) return;
        showOverview();
        document.getElementById("overlay").style.display = "none";
        document.getElementById("scheduleEventContainer").style.display = "none";
    }



    function showOverview() {
        hideRunning();
        hideUpComming();
        hideHistory();
        clearInstanceDetailPanel();
        overviewButton.classList.add("active");
        setCurrentPage("overview");
    }

    function hideOverview() {
        overviewButton.classList.remove("active");
    }



    function showRunning() {
        hideOverview();
        hideUpComming();
        hideHistory();
        clearInstanceDetailPanel();
        runningButton.classList.add("active");
        setCurrentPage("running");
    }

    function hideRunning() {
        runningButton.classList.remove("active");
    }



    function showUpComming() {
        hideOverview();
        hideRunning();
        hideHistory();
        clearInstanceDetailPanel();
        upcommingButton.classList.add("active");
        setCurrentPage("upcoming");
    }

    function hideUpComming() {
        upcommingButton.classList.remove("active");
    }




    function showHistory() {
        hideOverview();
        hideRunning();
        hideUpComming();
        clearInstanceDetailPanel();
        historyButton.classList.add("active");
        setCurrentPage("history");
    }

    function hideHistory() {
        historyButton.classList.remove("active");
    }



    const instanceDetailDiv = document.getElementById('instance-detail-panel');
    const instanceDetailResizeButton = document.getElementById('instance-detail-panel-resize-button');
    const instance_table = document.getElementById('instance-table');
    instanceDetailResizeButton.addEventListener('mousedown', instanceDetailResizeButton_mouseDownHandler);

    function instanceDetailResizeButton_mouseDownHandler(event) {
        window.addEventListener('mousemove', instanceDetailResizeButton_moveHandler);
        window.addEventListener('mouseup', instanceDetailResizeButton_mouseUpHandler);

        function instanceDetailResizeButton_moveHandler(event) {
            let rectTable = instance_table.getBoundingClientRect();
            let rectDetail = instanceDetailDiv.getBoundingClientRect();

            let TableDiv_height =  event.clientY - instance_table.offsetTop;
            
            let detailDiv_height =  rectDetail.bottom - event.clientY;
            instance_table.style.height = TableDiv_height + 'px';
            instanceDetailDiv.style.height = detailDiv_height + 'px';
        }
        function instanceDetailResizeButton_mouseUpHandler(event) {
            window.removeEventListener('mousemove', instanceDetailResizeButton_moveHandler);
            window.removeEventListener('mouseup', instanceDetailResizeButton_mouseUpHandler);

        }
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// <div id="instance-table">
//    <div class="instance-table-row">
//        <input type="checkbox" style="visibility: hidden;">
//        <div class="instance-table-data">Event-Name</div>
//        <div class="instance-table-data">EventID</div>
//        <div class="instance-table-data">Status</div>
//        <div class="instance-table-data">datetime</div>
//        <div class="instance-table-data">Admin</div>
//        <div class="instance-table-data">Options</div>
//    </div>
// </div>


    // const instance_table = document.getElementById("instance_table"); (*already declared.)
    function clearInstanceTable() {
        while(instance_table.hasChildNodes()) {
            instance_table.removeChild(instance_table.firstChild);
        }
    }
    function setNoOfInstances(total='0') {
        let div = document.getElementById("instanceNo");
        div.innerText = "( " + total + " )"; 
    }
    function set_noEventsToShow() {
        clearInstanceTable();
        let newElement = document.createElement("div");
        newElement.className = "noEventsToShowFor";
        instance_table.appendChild(newElement);
        // clearInstanceDetails();
    }
    function returnHeaderRowOnly() {
        let headers = ["Event-Name", "Event-ID", "status", "start-datetime", "end-datetime", "admin", "options"]
        let data = document.createElement("input");
        data.setAttribute("type", "radio");
        data.setAttribute("name", "instance");
        data.style.visibility = "hidden";
        
        let newRow = document.createElement("div");
        newRow.className = "instance-table-row";
        newRow.appendChild(data);

        for(let i=0;i<headers.length;i++) {
            data = document.createElement("div");
            data.className = "instance-table-data";
            data.innerText = headers[i];
            newRow.appendChild(data);
        }
        return newRow;
    }
    function returnNewRowOnly(obj) {
        let newRow = document.createElement("div");
        newRow.className = "instance-table-row";
        
        // input
        let data = document.createElement("input");
        data.setAttribute("type", "radio");
        data.setAttribute("name", "instance");
        data.setAttribute("onclick", `(()=>{eel.requestInflateInstanceDetailPanel("${obj.eventID}");})()`);
        newRow.appendChild(data);
            // event-listener to 'click', inflateInstanceDetail-panel

        
        // event-name
        data = document.createElement("div");
        data.className = "instance-table-data";
        data.innerText = obj["eventName"];
        newRow.appendChild(data);
        
        // event-ID
        data = document.createElement("div");
        data.className = "instance-table-data";
        data.innerText = obj["eventID"];
        newRow.appendChild(data);

        // status
        data = document.createElement("div");
        data.className = "instance-table-data";
        data.innerText = obj["eventStatus"];
        newRow.appendChild(data);
        
        // start-datetime
        data = document.createElement("div");
        data.className = "instance-table-data";
        data.innerText = obj["startDatetime"];
        newRow.appendChild(data);
        
        // end-datetime
        data = document.createElement("div");
        data.className = "instance-table-data";
        data.innerText = obj["endDatetime"];
        newRow.appendChild(data);

        // admin
        data = document.createElement("div");
        data.className = "instance-table-data";
        data.innerText = obj["admin"];
        newRow.appendChild(data);

        // options
        data = document.createElement("div");
        data.className = "instance-table-data";
        let buttonDiv = document.createElement("div");
        buttonDiv.className = "instance-action-buttons";
        
        // if(obj["eventStatus"] == "pending") {
        //     let button = document.createElement("button");
        //     button.setAttribute("onclick", `(()=>{eel.registerParticipantsFromCSV("${obj.eventID}");})()`);
        //     button.innerText = "register participants";
        //     buttonDiv.appendChild(button);
        //     data.appendChild(buttonDiv);
        // }
        // else if(obj["eventStatus"] == "upcoming") {
        //     let button = document.createElement("button");
        //     button.setAttribute("onclick", `(()=>{eel.requestInflateInstanceDetailPanel("${obj.eventID}");})()`);
        //     button.innerText = "edit ✏️";
        //     buttonDiv.appendChild(button);
        //     data.appendChild(buttonDiv);

        //     button = document.createElement("button");
        //     button.setAttribute("onclick", `(()=>{endEvent('${obj.eventID}')})()`);
        //     button.innerText = "start session";
        //     buttonDiv.appendChild(button);
        //     data.appendChild(buttonDiv);
        // }
        // else if(obj["eventStatus"] == "live") {
        //     let button = document.createElement("button");
        //     button.setAttribute("onclick", `(()=>{resumeEvent('${obj.eventID}')})()`);
        //     button.innerText = "resume";
        //     buttonDiv.appendChild(button);
            
        //     button = document.createElement("button");
        //     button.setAttribute("onclick", `(()=>{endEvent('${obj.eventID}')})()`);
        //     button.innerText = "end session";
        //     buttonDiv.appendChild(button);
        //     data.appendChild(buttonDiv);
        // }
        // else if(obj["eventStatus"] == "ended") {
        //     let button = document.createElement("button");
        //     button.setAttribute("onclick", `(()=>{inflateInstanceDetailPanel("${obj.eventID}");})()`);
        //     button.innerText = "view details";
        //     buttonDiv.appendChild(button);
        //     data.appendChild(buttonDiv);
        // }
        // else {
        //     let button = document.createElement("div");
        //     button.innerText = "-- --";
        //     buttonDiv.appendChild(button);
        //     data.appendChild(buttonDiv);
        // }
            let button = document.createElement("button");
            button.setAttribute("onclick", `(()=>{eel.requestInflateInstanceDetailPanel("${obj.eventID}");})()`);
            button.innerText = "view details";
            buttonDiv.appendChild(button);
            data.appendChild(buttonDiv);
            newRow.appendChild(data);
            // selective-event-buttons-bassed on status:
                // if pending show : send mail to participants
                // if upcomming : show edit
                // if live : show start
                // if started : resume, end-session

        
        return newRow;
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Neurons⚡


const searchBox = document.getElementById("searchBox");
document.getElementById("create-event-button").addEventListener("click", createNewEvent);

document.getElementById("refreshEventListButton").addEventListener("click", (()=>refreshEventList(currentPage)));
document.getElementById("searchEventListButton").addEventListener("click", (()=>refreshEventList(currentPage)));

    function refreshEventList(currentPage) {
        let searchFilter = searchBox.value;
        if(searchFilter==null || searchFilter=='')
            eel.fetchEventData(currentPage);
        else eel.fetchEventData(currentPage, searchFilter);
    }
    
    eel.expose(listEventsInstanceList);
    function listEventsInstanceList(data) {
        if(data == null || data.length === 0) {
            set_noEventsToShow();
            setNoOfInstances(0);
        }
        else {
            clearInstanceTable();
            let headerRow = returnHeaderRowOnly();
            instance_table.appendChild(headerRow);
            
            for(let i=0;i<data.length;i++) {
                let newRow = returnNewRowOnly(data[i]);
                instance_table.appendChild(newRow);
            }
            setNoOfInstances(data.length);
        }
    }
    
    function createNewEvent() {
        let data = {
            eventName: document.getElementById("eventName").value || "",
            venueName: document.getElementById("venueName").value || "",
            venueCap: document.getElementById("venueCap").value || 90,
            summary: document.getElementById("summary").value || "",
            startDatetime: document.getElementById("startDatetime").value || "",
            endDatetime: document.getElementById("endDatetime").value || "",
            importCSVRoute: document.getElementById("importParticipantsCSVRoute")?.value.split('\\').pop() || "",
            exportCSVRoute: document.getElementById("exportParticipantsCSVRoute")?.value.split('\\').pop() || ""
        };
        console.log(data)
        // data["startDatetime"] = toString(data["startDatetime"]);
        // data["endDatetime"] = toString(data["endDatetime"]);
        
        closeScheduleNewEvent(true);
        eel.createAnEvent(data)();
    }

    eel.expose(setDashboardUserName);
    function setDashboardUserName(userName) {
        console.log(userName);
        document.getElementById("user-greeting").innerText = "Hi "+ userName + " ! ⭐⭐";
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// acknoledgement - Handlers
    // message: {
    // title : optional,
    // mood : optional (true)? success : warning,
    // body : text
    // }
    eel.expose(eventCreatedSuccess);
    eel.expose(eventCreatedFailed);

    function eventCreatedSuccess() {
        generatePopupMessage({
            title: "Success",
            mood: true,
            body: "New event added successfuly."
        })
    }
    function eventCreatedFailed() {
        generatePopupMessage({
            title: "failed",
            mood: false,
            body: "There was a problem while adding new event."
        })
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Spinal functions 🧠:
    let currentPage = "";
    function setCurrentPage(pageVal) {
        currentPage = pageVal;
        refreshEventList(currentPage);
    }
    // setCurrentPage("overview");
    // setCurrentPage("running");
    // setCurrentPage("upcomming");
    // setCurrentPage("history");


    document.addEventListener("DOMContentLoaded", ()=>{
        showOverview();
        eel.initializeDashboardWindow();
    });

    eel.expose(refreshEventListHelper)
    function refreshEventListHelper() {
        refreshEventList(currentPage)
    }

    eel.expose(closeDashboardHelper)
    function closeDashboardHelper() {
        window.close()
    }