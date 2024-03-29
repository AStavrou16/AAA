const TH_BASE_URL = "https://codecyprus.org/th/api/"; // the true API base url
const TH_TEST_URL = "https://codecyprus.org/th/test-api/"; // the test API base url


// Function to call a list of Treasure Hunts.
function callList() {
    let treasureHuntsElement = document.getElementById("treasureHunts");
    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            let treasureHunts = jsonObject['treasureHunts'];
            for (let i = 0; i < treasureHunts.length; i++) {
                let uuid = treasureHunts[i]['uuid'];
                console.log(uuid);
                treasureHuntsElement.innerHTML += "<a href='start.html?uuid=" + treasureHunts[i].uuid + "'>" + treasureHunts[i].name + "</a><br>"
            }
        });
}
callList();

function start(){
    let uuid = getParameter("uuid");
    let error = document.getElementById("errorMessages");
    let playerName=document.getElementById("playerName").value;
    let app="teamAAA";
    let URL=TH_BASE_URL+"start?player="+playerName+"&app="+app+"&treasure-hunt-id=" + uuid;
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
document.getElementById('text').style.display = 'none';
document.getElementById('integer').style.display = 'none';
document.getElementById('decimal').style.display = 'none';
document.getElementById('mcq').style.display = 'none';
document.getElementById('boolean').style.display = 'none';
function handleQuestionLibrary(json) {
    let questionElement = document.getElementById("errorMessages");

    if(json.status === "OK") {
        document.getElementById('question').innerHTML = json['questionText'];

        if (json['completed']===true){
            window.location.href='score.html?session='+getParameter('session');
        }
        if (json['canBeSkipped'] === false){
            document.getElementById('skip').style.display = 'none';
        }
        if (json['questionType'] === 'BOOLEAN') {
            document.getElementById('boolean').style.display = 'block';
        }
        else if (json['questionType'] === 'TEXT') {
            document.getElementById('text').style.display = 'block';
        }
        else if (json['questionType'] === 'NUMERIC'){
            document.getElementById('decimal').style.display = 'block';
        }
        else if (json['questionType'] === 'MCQ'){
            document.getElementById('mcq').style.display = 'block';
        }
        else if (json['questionType'] === 'INTEGER'){
            document.getElementById('integer').style.display = 'block';
        }
        setInterval(getLocation(json),60000)
    }
    else{
        questionElement.innerHTML +=json['errorMessages']+"<br>";
    }

}

function getLocation(json) {
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
           if (json.status=== 'ERROR'){
               let error = document.getElementById("errorMessages");
               error.innerHTML += json['errorMessages']
           }
        });
}


function loadAnswer(ans) {
    fetch(TH_BASE_URL+"answer?session="+ getParameter('session') + "&answer="+ ans)
        .then(response => response.json())
        .then(json => {
            if (json.status=== 'OK' && json['correct'] === false){
                let error = document.getElementById("errorMessages");
                error.innerHTML = json['message'];
                let score = document.getElementById("score");
                score.innerHTML = json['scoreAdjustment'] + " points"
            }
            else if (json.status=== 'OK' && json['correct'] === true) {
                window.location.reload();
            }
});
}
//SKIP
function skip() {
    fetch(TH_BASE_URL+"skip?session="+ getParameter('session'))
        .then(response => response.json())
        .then(json => {
            if (json['canBeSkipped'] === false){
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
                    score.innerHTML = "Points : " + json['score'];
                } else {
                    let error = document.getElementById("errorMessages");
                    error.innerHTML += json['errorMessages']
                }
            }
        );
}
function Leaderboard() {
    let list = '<ol>';
    fetch(TH_BASE_URL+"leaderboard?session="+ getParameter('session') + "&sorted&limit=10")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(json => {
            if (json['status'] === 'ERROR'){
                let error = document.getElementById("errorMessages");
                error.innerHTML += json['errorMessages']
            }
            else {
                let leaderboard = json['leaderboard'];
                let options = { day: 'numeric', month:'short', hour:'2-digit', minute: '2-digit', second:'2-digit'};
                for(let i=0;i<leaderboard.length;i++){
                    let date = new Date(leaderboard[i]['completionTime']);
                    let formattedDate = date.toLocaleDateString("en-UK", options);
                    list += '<li>' + leaderboard[i]['player'] + ", " + leaderboard[i]['score'] + ", " + formattedDate + "</li>";
                }
                list+='</ol>';
                document.getElementById('list').innerHTML=list;
            }
        });
}
