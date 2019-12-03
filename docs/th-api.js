/*
ISSUES:
LOCATION
TEXT ANSWER IS NOT WORKING

 */
const TH_BASE_URL = "https://codecyprus.org/th/api/"; // the true API base url
const TH_TEST_URL = "https://codecyprus.org/th/test-api/"; // the test API base url

// Function to call a list of Treasure Hunts.
function callList() {
    let treasureHuntsElement = document.getElementById("treasureHunts");
    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            let treasureHunts = jsonObject['treasureHunts'];
            console.log(treasureHunts);
            for (let i = 0; i < treasureHunts.length; i++) {
                treasureHuntsElement.innerHTML += "<a href='start.html'>" + treasureHunts[i].name + "</a><br>"
            }
        });
}
callList();

function start(){
    let error = document.getElementById("errorMessages");
    let playerName=document.getElementById("playerName").value;
    let app="treasure-hunt";
    let URL="https://codecyprus.org/th/api/start?player="+playerName+"&app="+app+"&treasure-hunt-id=ag9nfmNvZGVjeXBydXNvcmdyGQsSDFRyZWFzdXJlSHVudBiAgICAvKGCCgw";
    fetch(URL)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
                let startSession = jsonObject;
                if(startSession.status ==='OK'){
                    window.location.href="question.html?session="+startSession['session'];
                }else{
                    error.innerHTML +=startSession['errorMessages']+"<br>";
                }
        }
        );
}

function LoadQuestion(){
    fetch(TH_BASE_URL+"question?session="+ getParameter('session'))
        .then(response => response.json())
        .then(json => handleQuestionLibrary(json))
}

function getParameter(parameter) {
    let url =  new URL(window.location.href);
    return url.searchParams.get(parameter)
}
function handleQuestionLibrary(json) {
    let questionElement = document.getElementById("errorMessages");
console.log(json);
    if(json.status === "OK") {
        document.getElementById('question').innerHTML = json['questionText'];
        if (json['completed']===true){
            window.location.href='score.html?session='+getParameter('session');
        }
        if (json['canBeSkipped'] === false){
            document.getElementById('skip').style.display = 'none';
        }
        if (json['questionType'] === 'BOOLEAN') {
            document.getElementById('text').style.display = 'none';
            document.getElementById('boolean').style.display = 'block';
            document.getElementById('integer').style.display = 'none';
            document.getElementById('decimal').style.display = 'none';
            document.getElementById('mcq').style.display = 'none';
        }
        else if (json['questionType'] === 'TEXT') {
            document.getElementById('text').style.display = 'block';
            document.getElementById('boolean').style.display = 'none';
            document.getElementById('integer').style.display = 'none';
            document.getElementById('decimal').style.display = 'none';
            document.getElementById('mcq').style.display = 'none';
        }
        else if (json['questionType'] === 'NUMERIC'){
            document.getElementById('text').style.display = 'none';
            document.getElementById('boolean').style.display = 'none';
            document.getElementById('integer').style.display = 'none';
            document.getElementById('decimal').style.display = 'block';
            document.getElementById('mcq').style.display = 'none';
        }
        else if (json['questionType'] === 'MCQ'){
            document.getElementById('text').style.display = 'none';
            document.getElementById('boolean').style.display = 'none';
            document.getElementById('integer').style.display = 'none';
            document.getElementById('decimal').style.display = 'none';
            document.getElementById('mcq').style.display = 'block';
        }
        else if (json['questionType'] === 'INTEGER'){
            document.getElementById('text').style.display = 'none';
            document.getElementById('boolean').style.display = 'none';
            document.getElementById('integer').style.display = 'block';
            document.getElementById('decimal').style.display = 'none';
            document.getElementById('mcq').style.display = 'none';
        }
    }
    else{
        questionElement.innerHTML +=json['errorMessages']+"<br>";
    }
    if (navigator.geolocation) {
        if(json['requiresLocation']===true) {
            navigator.geolocation.getCurrentPosition(sendLocation);
        }
    }
    else {
        alert("Geolocation is not supported by your browser.");
    }
}

function sendLocation(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    fetch(TH_BASE_URL+"location?session="+ getParameter('session') + "&latitude="+ lat + "&longitude=" + lng)
        .then(response => response.json())
        .then(json => {
           if (json.status=== 'OK'){
               //????????
           }
           else{
               let error = document.getElementById("errorMessages");
               error.innerHTML += json['errorMessages']
           }
        });
}


function loadAnswer(ans) {
    fetch(TH_BASE_URL+"answer?session="+ getParameter('session') + "&answer="+ ans)
        .then(response => response.json())
        .then(json => handleQuestionLibrary(json));
     window.location.reload();
}
//SKIP
function skip() {
    fetch(TH_BASE_URL+"skip?session="+ getParameter('session'))
        .then(response => response.json())
        .then(json => {
            if (json.canBeSkipped === false){
                document.getElementById('skip').style.display = 'none';
            }
            if (json.status === 'OK') {
                window.location.href = "question.html?session=" + getParameter(['session']);
            } else {
                let error = document.getElementById("errorMessages");
                error.innerHTML += json['errorMessages']
            }
        }
        );
}
function score() {
    fetch(TH_BASE_URL+"score?session="+ getParameter('session'))
        .then(response => response.json())
        .then(json => {
                if (json.status === 'OK') {
                    let name = document.getElementById('username');
                    name.innerHTML = "Username : " + json.player;
                    let score = document.getElementById('points');
                    score.innerHTML = "Points : " + json.score;
                } else {
                    let error = document.getElementById("errorMsg");
                    error.innerHTML += json['errorMessages']
                }
            }
        );
}


