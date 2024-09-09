document.getElementById('promoMe').addEventListener('click', ()=> {
    window.open("https://www.aryanmarwaha.me", "_blank");
})

// message: {
    // title : optional,
    // mood : optional (true)? success : warning,
    // body : text
// }
eel.expose(generatePopupMessage)
function generatePopupMessage(message) {
    let popupElement = document.createElement("div");
    popupElement.className="popup-element";
    
    let header = document.createElement("div");
    header.className="header";

    let title = document.createElement("div");
    if(message.title) {
        title.innerText = (message.mood)? "✅" : "⚠️" + message.title;
    }
    let closeButton = document.createElement("button");
    closeButton.innerHTML = "<i class='fa-solid fa-xmark'></i>";

    let loader = document.createElement("span");
    let messageBody = document.createElement("div");
    messageBody.className="message-body";
    messageBody.innerText = (message.body)? message.body : "";

    header.appendChild(title); header.appendChild(closeButton);
    popupElement.appendChild(header);
    popupElement.appendChild(loader);

    popupElement.appendChild(messageBody);

    document.getElementById("popup-container").appendChild(popupElement);
    let timer = setTimeout(()=> {
        popupElement.remove();
    },10000);
    closeButton.addEventListener("click", ()=> {
        clearInterval(timer);
        popupElement.remove();
    });
}