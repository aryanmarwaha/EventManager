
const instanceDetailPanel = document.getElementById("instance-detail-panel");


function showTakeActionInstanceFlashMessage() {
    document.querySelector("#instance-detail-panel > .instance-panel-main").style.maxHeight = "calc(100% - 8rem)";
    document.querySelector("#instance-flash-message").style.display = "flex";
}
function hideTakeActionInstanceFlashMessage() {
    document.querySelector("#instance-detail-panel > .instance-panel-main").style.maxHeight = "calc(100% - 4rem)";
    document.querySelector("#instance-flash-message").style.display = "none";
}



// Instance-option-button-onclick listeners:
    function showEventDetails(){
        hideEventControls();
        hideRegistrationList();
        hideParticipationList();
        document.getElementById("instance-event-detail-button").classList.add("active");
        document.getElementById("instanceDetailGrid").style.display = "grid";
    }
    function hideEventDetails(){
        document.getElementById("instance-event-detail-button").classList.remove("active");
        document.getElementById("instanceDetailGrid").style.display = "none";
    }
    
    function showEventControls(){
        hideEventDetails();
        hideRegistrationList();
        hideParticipationList();
        document.getElementById("instance-event-control-button").classList.add("active");
        document.getElementById("instanceControlDiv").style.display = "flex";
        // work starting from here ::::::::::::::::::::
    }
    function hideEventControls(){
        document.getElementById("instanceControlDiv").style.display = "none";
        document.getElementById("instance-event-control-button").classList.remove("active");
    }

    function showRegistrationList(){
        hideEventDetails();
        hideEventControls();
        hideParticipationList();
        document.getElementById("instance-registration-list-button").classList.add("active");
        document.getElementById("instance-registration-participation-listDiv").style.display = "flex";
        localStorage.setItem("registered_participantDiv", "registered");
        localStorage.setItem("__page", 1);
        let searchBox_ = document.querySelector(".search-box-container > .search-box > input");
        eel.requestRegistered_Participants(localStorage.getItem("registered_participantDiv"), localStorage.getItem("eventID"), parseInt(localStorage.getItem("__page")), searchBox_.value);
    }
    function hideRegistrationList(){
        document.getElementById("instance-registration-participation-listDiv").style.display = "none";
        document.getElementById("instance-registration-list-button").classList.remove("active");
    }

    function showParticipationList(){
        hideEventDetails();
        hideEventControls();
        hideRegistrationList();
        document.getElementById("instance-participation-list-button").classList.add("active");
        document.getElementById("instance-registration-participation-listDiv").style.display = "flex";
        localStorage.setItem("registered_participantDiv", "participants");
        localStorage.setItem("__page", 1);
        let searchBox_ = document.querySelector(".search-box-container > .search-box > input");
        eel.requestRegistered_Participants(localStorage.getItem("registered_participantDiv"), localStorage.getItem("eventID"), parseInt(localStorage.getItem("__page")), searchBox_.value);
    }
    function hideParticipationList(){
        document.getElementById("instance-registration-participation-listDiv").style.display = "none";
        document.getElementById("instance-participation-list-button").classList.remove("active");
    }


function updateEventDetails() {
    if(localStorage.getItem("eventID")==null) return;
    let data = {
        eventID: localStorage.getItem("eventID"),
        eventName: localStorage.getItem("eventName"),
        startDatetime: localStorage.getItem("startDatetime"),
        endDatetime: localStorage.getItem("endDatetime"),
        summary: localStorage.getItem("summary"),
        venueName: localStorage.getItem("venueName"),
        venueCap: parseInt(localStorage.getItem("venueCap")),
        venueCurr: parseInt(localStorage.getItem("venueCurr")),
        registeredCap: parseInt(localStorage.getItem("registeredCap")),
        registeredCurr: parseInt(localStorage.getItem("registeredCurr")),
        importCSVRoute: localStorage.getItem("importCSVRoute"),
        exportCSVRoute: localStorage.getItem("exportCSVRoute")
    };
    eel.updateEventDetails(data);
    eel.requestInflateInstanceDetailPanel(localStorage.getItem("eventID") || "");
}

eel.expose(inflateInstanceDetailPanel);
function inflateInstanceDetailPanel(data) {
    resetInstanceDetailPanel();
    instanceDetailPanel.style.height = "100%";
    
    //set instance-detail-header
    document.querySelector("#instance-details > header").innerText = "id-" + data["eventID"] + " (" +data["eventName"]+")";
    document.getElementById("instance-details").style.display = "flex";

    // setting instance-buttons
        let controlButton = document.getElementById("instance-event-detail-button");
        controlButton.className = "able active";
        controlButton.addEventListener("click", ()=>showEventDetails());
        controlButton = document.getElementById("instance-event-control-button");
        controlButton.className = "able";
        controlButton.addEventListener("click", ()=>showEventControls());
        controlButton = document.getElementById("instance-registration-list-button");
        if(data["eventStatus"] === "upcoming" || data["eventStatus"] === "live" || data["eventStatus"] === "ended") {
            controlButton.className = "able";
            controlButton.addEventListener("click", ()=>showRegistrationList());
        }
        controlButton = document.getElementById("instance-participation-list-button");
        if(data["eventStatus"] === "live" || data["eventStatus"] === "ended") {
            controlButton.className = "able";
            controlButton.addEventListener("click", ()=>showParticipationList());
        }
    // setting event-control-buttons:
        let generateAndSendTicketsButton = document.getElementById("generateAndSendTicketsButton");
        let startSessionButton = document.getElementById("startSessionButton");
        let resumeSessionButton = document.getElementById("resumeSessionButton");
        let endSessionButton = document.getElementById("endSessionButton");
        let exportEventDetailsButton = document.getElementById("exportEventDetailsButton");
        let exportRegistrationListButton= document.getElementById("exportRegistrationListButton");
        let exportParticipationListButton= document.getElementById("exportParticipationListButton");
        let updateEventDetailButton = document.getElementById("updateEventDetailButton");
        let deleteEventButton = document.getElementById("deleteEventButton");

        generateAndSendTicketsButton.addEventListener("click", ()=>eel.registerParticipantsFromCSV(data["eventID"]));
        startSessionButton.addEventListener("click", ()=>{eel.startEventScanner(localStorage.getItem("eventID"))});
        resumeSessionButton.addEventListener("click", ()=>{eel.resumeEventScanner(localStorage.getItem("eventID"))});
        endSessionButton.addEventListener("click", ()=>{eel.endEvent(localStorage.getItem("eventID"))});
        exportEventDetailsButton.addEventListener("click", ()=>{})
        exportRegistrationListButton.addEventListener("click", ()=>{})
        exportParticipationListButton.addEventListener("click", ()=>{})
        updateEventDetailButton.addEventListener("click", showEventDetails);
        deleteEventButton.addEventListener("click", ()=>{eel.deleteEvent(data["eventID"]); clearInstanceDetailPanel();});

        if(data["eventStatus"] == "pending") {
            generateAndSendTicketsButton.style.display = "flex";
            exportEventDetailsButton.style.display = "flex";
            updateEventDetailButton.style.display = "flex";
            deleteEventButton.style.display = "flex";
        }
        if(data["eventStatus"] == "upcoming") {
            startSessionButton.style.display = "flex";
            exportEventDetailsButton.style.display = "flex";
            exportRegistrationListButton.style.display = "flex";
            updateEventDetailButton.style.display = "flex";
            deleteEventButton.style.display = "flex";
        }
        if(data["eventStatus"] == "live") {
            resumeSessionButton.style.display = "flex";
            endSessionButton.style.display = "flex";
            exportEventDetailsButton.style.display = "flex";
            exportRegistrationListButton.style.display = "flex";
            updateEventDetailButton.style.display = "flex";
            deleteEventButton.style.display = "flex";
        }
        if(data["eventStatus"] == "ended") {
            exportEventDetailsButton.style.display = "flex";
            exportRegistrationListButton.style.display = "flex";
            exportParticipationListButton.style.display = "flex";
            deleteEventButton.style.display = "flex";
        }

    let columnDivs = document.querySelectorAll("#instanceDetailGrid .column");
    let columnIndex = 0;
    let columnNo = columnDivs.length;
    
    for(let key in data) {
        console.log(key);
        localStorage.setItem(key, data[key]);

        let data_block = document.createElement("div");
        data_block.className = "data-block";
            let data_block_key = document.createElement("div");
            data_block_key.innerText = key + ": ";

            // Make it editable if:
            let editable = false;
            if(key!=="Generating Qrcodes 🔴..." && key !== "eventID" && key !== "admin" && key !== "eventStatus" && key!=="venueCurr" && key!=="registeredCurr" && !(data["eventStatus"]!=="pending" && key==="importCSVRoute")) {
                editable = true;
                let editableButton = document.createElement("i");
                editableButton.className = "fa-solid fa-pen-to-square";
                editableButton.addEventListener("click", ()=> {
                    if(inputBox.disabled) {
                        inputBox.disabled = false;
                        inputBox.style.borderBottom = "1px solid #2987d6";
                        showTakeActionInstanceFlashMessage();
                        inputBox.focus();
                        // setTimeout(()=>, 1000);
                    }
                    else inputBox.disabled = true, inputBox.style.borderBottom = "";
                });
                data_block_key.appendChild(editableButton);
            }

        data_block.appendChild(data_block_key);

        // input || textarea

        let inputBox;
        if(key === "summary") {
            inputBox = document.createElement("textarea");
            inputBox.innerText = data[key];
        }
        else {
            inputBox = document.createElement("input");
            inputBox.value = data[key];
            if(key === "startDatetime" || key === "endDatetime") inputBox.type = "datetime-local";
            // else if(key === "importCSVRoute" || key === "exportCSVRoute") inputBox.type = "file";
        }
        inputBox.disabled = true;
        // onchange-logic:
        inputBox.setAttribute("onchange", `((value)=>localStorage.setItem("${key}", value))(this.value)`);

        data_block.appendChild(inputBox);


        // alternatively adding to 3 columns:
        columnDivs[columnIndex].appendChild(data_block);
        columnIndex = (columnIndex+1)%columnNo;

    }
}




function resetInstanceDetailPanel() {
    instanceDetailPanel.style.height = "1.4rem";
    document.querySelector("#instance-detail-panel > #instance-details").remove();
    document.querySelector("#instance-detail-panel > .instance-panel-main").remove();
    
    // creating instance_details:
    let instance_details = document.createElement("div");
    instance_details.style.display = "none";
    instance_details.id = "instance-details";

        let header = document.createElement("header");
        header.innerText = "Select an instance";
        instance_details.appendChild(header);

        let instanceFlashMessage = document.createElement("div");
        instanceFlashMessage.id = "instance-flash-message";
        instanceFlashMessage.style.display = "none";
        // adding discard and save button:
            let button_ = document.createElement("button");
            button_.innerText = "discard changes";
            button_.addEventListener("click", ()=>eel.requestInflateInstanceDetailPanel(localStorage.getItem("eventID") || ""));
            instanceFlashMessage.appendChild(button_);

            button_ = document.createElement("button");
            button_.innerText = "save changes";
            button_.className = "active";
            button_.addEventListener("click", updateEventDetails);
            instanceFlashMessage.appendChild(button_);

        instance_details.appendChild(instanceFlashMessage);

    instanceDetailPanel.appendChild(instance_details);

    // creating instancePanelMain:
    let instancePanelMain = document.createElement("div");
    instancePanelMain.className = "instance-panel-main";

        // Create and append the options container
        let optionsContainer = document.createElement("div");
        optionsContainer.className = "options-container";
        
        // Options - Buttons :
            let optionButton = document.createElement("div");
            optionButton.innerText = "Event Details";
            optionButton.id = "instance-event-detail-button";
            // optionButton.className = "able active";
            // optionButton.onclick = "(()=>showEventDetails())()";
            optionsContainer.appendChild(optionButton);
            
            optionsContainer.appendChild(document.createElement("span"));
            
            optionButton = document.createElement("div");
            optionButton.innerText = "Event Controls";
            optionButton.id = "instance-event-control-button";
            optionsContainer.appendChild(optionButton);
            
            optionsContainer.appendChild(document.createElement("span"));
            
            optionButton = document.createElement("div");
            optionButton.innerText = "Registration List";
            optionButton.id = "instance-registration-list-button";
            optionsContainer.appendChild(optionButton);
            
            optionsContainer.appendChild(document.createElement("span"));

            optionButton = document.createElement("div");
            optionButton.innerText = "Participant List";
            optionButton.id = "instance-participation-list-button";
            optionsContainer.appendChild(optionButton);
            
        instancePanelMain.appendChild(optionsContainer);

        // Creating instanceDetailGrid
        let instanceDetailGrid = document.createElement("div");
        instanceDetailGrid.id = "instanceDetailGrid";
        // creating 3 columns
            let column_ = document.createElement("div");
            column_.className = "column";
            instanceDetailGrid.appendChild(column_);

            column_ = document.createElement("div");
            column_.className = "column";
            instanceDetailGrid.appendChild(column_);

            column_ = document.createElement("div");
            column_.className = "column";
            instanceDetailGrid.appendChild(column_);

        instancePanelMain.appendChild(instanceDetailGrid);

        // Creating instanceControlDiv
        let instanceControlDiv = document.createElement("div");
        instanceControlDiv.id = "instanceControlDiv";
        instanceControlDiv.style.display = "none";
            // creating header-controlsDiv -pair-1
                let headerDiv1 = document.createElement("div");
                headerDiv1.className = "header";
                    let icon1 = document.createElement("i");
                    icon1.className = "fa-solid fa-caret-right active";
                    
                    headerDiv1.appendChild(icon1);
                    headerDiv1.appendChild(document.createTextNode("Session controls"));
                
                let controlsDiv1 = document.createElement("div");
                controlsDiv1.className = "controls";
                
                    let controlButton = document.createElement("button");
                    controlButton.textContent = "generate-and-send tickets to all registered participants";
                    controlButton.id = "generateAndSendTicketsButton";
                    controlButton.style.display = "none";
                    controlsDiv1.appendChild(controlButton);

                    controlButton = document.createElement("button");
                    controlButton.textContent = "start session";
                    controlButton.id = "startSessionButton";
                    controlButton.style.display = "none";
                    controlsDiv1.appendChild(controlButton);

                    controlButton = document.createElement("button");
                    controlButton.textContent = "resume session";
                    controlButton.id = "resumeSessionButton";
                    controlButton.style.display = "none";
                    controlsDiv1.appendChild(controlButton);

                    controlButton = document.createElement("button");
                    controlButton.textContent = "end session";
                    controlButton.id = "endSessionButton";
                    controlButton.style.display = "none";
                    controlsDiv1.appendChild(controlButton);
                
                // Append the header and controls to the main container
                headerDiv1.addEventListener("click", ()=>{
                    if(icon1.classList.contains("active")) {
                        icon1.classList.remove("active");
                        controlsDiv1.style.display = "none";
                    }
                    else {
                        icon1.classList.add("active");
                        controlsDiv1.style.display = "flex";
                    }
                })
            instanceControlDiv.appendChild(headerDiv1);
            instanceControlDiv.appendChild(controlsDiv1);
            
            // creating header-controlsDiv -pair-2
                let headerDiv2 = document.createElement("div");
                headerDiv2.className = "header";
                    let icon2 = document.createElement("i");
                    icon2.className = "fa-solid fa-caret-right";
                    
                    headerDiv2.appendChild(icon2);
                    headerDiv2.appendChild(document.createTextNode("Export as *(csv-files)"));
            
                let controlsDiv2 = document.createElement("div");
                controlsDiv2.style.display = "none";
                controlsDiv2.className = "controls";
                
                    controlButton = document.createElement("button");
                    controlButton.textContent = "Event details";
                    controlButton.id = "exportEventDetailsButton";
                    controlButton.style.display = "none";
                    controlButton.addEventListener("click", ()=>{
                        eel.extractEventDetailsToTextFile(localStorage.getItem("eventID"))
                    });
                    controlsDiv2.appendChild(controlButton);
                
                    controlButton = document.createElement("button");
                    controlButton.textContent = "Registration List";
                    controlButton.id = "exportRegistrationListButton";
                    controlButton.style.display = "none";
                    controlButton.addEventListener("click", ()=>{
                        eel.extractRegisteredParticipants(localStorage.getItem("eventID"))
                    });
                    controlsDiv2.appendChild(controlButton);

                    controlButton = document.createElement("button");
                    controlButton.textContent = "Participant List";
                    controlButton.id = "exportParticipationListButton";
                    controlButton.style.display = "none";
                    controlButton.addEventListener("click", ()=>{
                        eel.extractRegisteredParticipants(localStorage.getItem("eventID"))
                    });
                    controlsDiv2.appendChild(controlButton);
                    
                
                // Append the header and controls to the main container
                headerDiv2.addEventListener("click", ()=>{
                    if(icon2.classList.contains("active")) {
                        icon2.classList.remove("active");
                        controlsDiv2.style.display = "none";
                    }
                    else {
                        icon2.classList.add("active");
                        controlsDiv2.style.display = "flex";
                    }
                })
                instanceControlDiv.appendChild(headerDiv2);
                instanceControlDiv.appendChild(controlsDiv2);
            
            // creating header-controlsDiv -pair-3
                let headerDiv3 = document.createElement("div");
                headerDiv3.className = "header";
                let icon3 = document.createElement("i");
                icon3.className = "fa-solid fa-caret-right";
                
                headerDiv3.appendChild(icon3);
                headerDiv3.appendChild(document.createTextNode("Other options"));
                
                let controlsDiv3 = document.createElement("div");
                controlsDiv3.style.display = "none";
                controlsDiv3.className = "controls";
                
                controlButton = document.createElement("button");
                controlButton.textContent = "update event-details";
                controlButton.id = "updateEventDetailButton";
                controlButton.style.display = "none";
                controlsDiv3.appendChild(controlButton);

                controlButton = document.createElement("button");
                controlButton.textContent = "delete event";
                controlButton.id = "deleteEventButton";
                controlButton.style.display = "none";
                controlsDiv3.appendChild(controlButton); 
                
                // Append the header and controls to the main container
                headerDiv3.addEventListener("click", ()=>{
                    if(icon3.classList.contains("active")) {
                        icon3.classList.remove("active");
                        controlsDiv3.style.display = "none";
                    }
                    else {
                        icon3.classList.add("active");
                        controlsDiv3.style.display = "flex";
                    }
                })
                instanceControlDiv.appendChild(headerDiv3);
                instanceControlDiv.appendChild(controlsDiv3);
        
        instancePanelMain.appendChild(instanceControlDiv);
         


        let instanceRegistrationAndParticipationListDiv = document.createElement("div");
        instanceRegistrationAndParticipationListDiv.id = "instance-registration-participation-listDiv";
        instanceRegistrationAndParticipationListDiv.remove();
        instanceRegistrationAndParticipationListDiv.style.display = "none";
        instanceRegistrationAndParticipationListDiv.innerHTML = `
        <div class="search-box-container">
            <div class="search-box">
                <input type="text" placeholder="search-box">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <div class="pagerate-limiter">
                <i class="fa-solid fa-chevron-left"></i>
                <div>1</div>
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        </div>
        <div class="rpListTable">
            <div class="row">
                <div class="data"><p>participant - ID</p></div>
                <div class="data"><p>participant-name</p></div>
                <div class="data"><p>email</p></div>
                <div class="data"><p>phone no.</p></div>
            </div>
        </div>`
        instanceRegistrationAndParticipationListDiv.querySelector(".search-box-container > .search-box > .fa-magnifying-glass").addEventListener("click", (event)=> {
            localStorage.setItem("__page",1);
            let searchBox_ = instanceRegistrationAndParticipationListDiv.querySelector(".search-box-container > .search-box > input");
            console.log(searchBox_.value);
            eel.requestRegistered_Participants(localStorage.getItem("registered_participantDiv"), localStorage.getItem("eventID"), parseInt(localStorage.getItem("__page")), searchBox_.value);
            searchBox_.value = "";
        });
        instanceRegistrationAndParticipationListDiv.querySelector(".search-box-container > .pagerate-limiter > .fa-chevron-left").addEventListener("click", (event)=> {
            if(!event.target.classList.contains("able")) return;
            eel.requestRegistered_Participants(localStorage.getItem("registered_participantDiv"), localStorage.getItem("eventID"), parseInt(localStorage.getItem("__page"))-1, localStorage.getItem("registered_participants_filter"));
        })
        instanceRegistrationAndParticipationListDiv.querySelector(".search-box-container > .pagerate-limiter > .fa-chevron-right").addEventListener("click", (event)=> {
            if(!event.target.classList.contains("able")) return;
            eel.requestRegistered_Participants(localStorage.getItem("registered_participantDiv"), localStorage.getItem("eventID"), parseInt(localStorage.getItem("__page"))+1, localStorage.getItem("registered_participants_filter"));
        })
        instancePanelMain.appendChild(instanceRegistrationAndParticipationListDiv);


    instanceDetailPanel.appendChild(instancePanelMain);
}

function clearInstanceDetailPanel() {
    instanceDetailPanel.style.height = "1.4rem";
    document.getElementById("instance-table").style.height = "calc(100% - 5.4rem)";
    document.querySelector("#instance-detail-panel > #instance-details").remove();
    document.querySelector("#instance-detail-panel > .instance-panel-main").remove();

    let instance_details = document.createElement("div");
        // instance_details.style.display = "none";
        instance_details.id = "instance-details";
        
        let header = document.createElement("header");
            header.innerText = "Select an instance";
        instance_details.appendChild(header);

    instanceDetailPanel.appendChild(instance_details);

    let instancePanelMain = document.createElement("div");
        instancePanelMain.className = "instance-panel-main";
    instanceDetailPanel.appendChild(instancePanelMain);
}

eel.expose(inflateRegisteredParticipantList);
function inflateRegisteredParticipantList(data, page, nextPageExists) {
    let table = document.querySelector("#instance-registration-participation-listDiv > .rpListTable");
    console.log(table.children);
    while(1 < table.children.length) {
        table.removeChild(table.children[1]);
    }
    console.log(data, page, nextPageExists);
    let prevPageButton = document.querySelector("#instance-registration-participation-listDiv > .search-box-container > .pagerate-limiter > .fa-chevron-left");
    let nextPageButton = document.querySelector("#instance-registration-participation-listDiv > .search-box-container > .pagerate-limiter > .fa-chevron-right");
    document.querySelector("#instance-registration-participation-listDiv > .search-box-container > .pagerate-limiter > div").innerText = page;
    localStorage.setItem("__page", page);
    if(page>1) prevPageButton.classList.add("able");
    else prevPageButton.classList.remove("able");
    
    if(nextPageExists) nextPageButton.classList.add("able");
    else nextPageButton.classList.remove("able");
    
    table.querySelector(".notfound")?.remove();
    for(let i=0;i<data.length;i++) {
        let row = document.createElement("div");
        row.className = "row";
        row.innerHTML = `
        <div class="data"><p>${data[i]?.pid}</p></div>
        <div class="data"><p>${data[i]?.name}</p></div>
        <div class="data"><p>${data[i]?.email}</p></div>
        <div class="data"><p>${data[i]?.phone}</p></div>
        `
        table.appendChild(row);
    }
}