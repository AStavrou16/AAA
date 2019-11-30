const TH_BASE_URL = "https://codecyprus.org/th/api/"; // the true API base url
const TH_TEST_URL = "https://codecyprus.org/th/test-api/"; // the test API base url
const Test_Question = "question?question-type=";

/**
 * An asynchronous function to realize the functionality of getting the available 'treasure hunts' (using /list) and
 * processing the result to update the HTML with a bullet list with the treasure hunt names and descriptions. Also,
 * for each treasure hunt in the bullet list, a link is shown to trigger another function, the 'select'.
 * @return {Promise<void>}
 */
async function doList() {

    // call the web service and await for the reply to come back and be converted to JSON
    const reply = await fetch(TH_BASE_URL + "list");
    const json = await reply.json();

    // identify the spinner, if available, using the id 'loader'...
    let spinner = document.getElementById("loader");
    // .. and stop it (by hiding it)
    spinner.hidden = true;

    // access the "treasureHunts" array on the reply message
    let treasureHuntsArray = json.treasureHunts;
    let listHtml = "<ul>"; // dynamically form the HTML code to display the list of treasure hunts
    for(let i = 0; i < treasureHuntsArray.length; i++) {
        listHtml += // each treasure hunt item is shown with an individual DIV element
            "<li>" +
            "<b>" + treasureHuntsArray[i].name + "<b><br>" + // the treasure hunt name is shown in bold...
            "<i>" + treasureHuntsArray[i].description + "</i><br>" + // and the description in italics in the following line
            "<a href=\"javascript:select(\'" + treasureHuntsArray[i].uuid + "\')\">Start</a>" + // and the description in italics in the following line
            "</li>";
    }
    listHtml += "</ul>";
    // update the DOM with the newly created list
    document.getElementById("treasureHunts").innerHTML = listHtml;
}

/**
 * This function is called when a particular treasure hunt is selected. This is merely a placeholder as you're expected
 * to realize this function-or an equivalent-to perform the necessary actions after a treasure hunt is selected.
 *
 * @param uuid this is the argument that corresponds to the UUID of the selected treasure hunt.
 * @return {Promise<void>}
 */
async function select(uuid) {
    // For now just print the selected treasure hunt's UUID. Normally, you're expected to guide the user in entering
    // their name etc. and proceed to calling the '/start' command of the API to start a new session.
    console.log("Selected treasure hunt with UUID: " + uuid);
    // todo add your own code ...
}
// Function to call a list of Treasure Hunts.
function callList() {
    let treasureHuntsElement = document.getElementById("treasureHunts");
    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            let treasureHunts = jsonObject.treasureHunts;
            console.log(treasureHunts);
            for (let i = 0; i < treasureHunts.length; i++) {
                treasureHuntsElement.innerHTML += "<a href='start.html'>" + treasureHunts[i].name + "</a><br>"
            }
        });
}
callList();

function start(){
    let startElement = document.getElementById("errorMessage");
    let playerName=document.getElementById("playerName").value;
    let app="treasure-hunt";
    let URL="https://codecyprus.org/th/api/start?player="+playerName+"&app="+app+"&treasure-hunt-id=ag9nfmNvZGVjeXBydXNvcmdyGQsSDFRyZWFzdXJlSHVudBiAgICAvKGCCgw";
    fetch(URL)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
                let startSession = jsonObject;
                if(startSession.status ==='OK'){
                    window.location.href="question.html?session="+startSession.session;
                }else{
                    startElement.innerHTML +=startSession.errorMessages+"<br>";
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
        document.getElementById('question').innerHTML = json.questionText;

        if (json.questionType === 'BOOLEAN') {
            document.getElementById('text').style.display = 'none';
            document.getElementById('boolean').style.display = 'block';
            document.getElementById('integer').style.display = 'none';
            document.getElementById('decimal').style.display = 'none';
            document.getElementById('mcq').style.display = 'none';
        }
        else if (json.questionType === 'TEXT'){
            document.getElementById('text').style.display = 'block';
            document.getElementById('boolean').style.display = 'none';
            document.getElementById('integer').style.display = 'none';
            document.getElementById('decimal').style.display = 'none';
            document.getElementById('mcq').style.display = 'none';
        }
        else if (json.questionType === 'NUMERIC'){
            document.getElementById('text').style.display = 'none';
            document.getElementById('boolean').style.display = 'none';
            document.getElementById('integer').style.display = 'none';
            document.getElementById('decimal').style.display = 'block';
            document.getElementById('mcq').style.display = 'none';
        }
        else if (json.questionType === 'MCQ'){
            document.getElementById('text').style.display = 'none';
            document.getElementById('boolean').style.display = 'none';
            document.getElementById('integer').style.display = 'none';
            document.getElementById('decimal').style.display = 'none';
            document.getElementById('mcq').style.display = 'block';
        }
        else if (json.questionType === 'INTEGER'){
            document.getElementById('text').style.display = 'none';
            document.getElementById('boolean').style.display = 'none';
            document.getElementById('integer').style.display = 'block';
            document.getElementById('decimal').style.display = 'none';
            document.getElementById('mcq').style.display = 'none';
        }
    }
    else{
        questionElement.innerHTML +=json.errorMessages+"<br>";
    }
}

function answer(v) {
    let a =document.getElementById('q').value;
    loadAnswer(a);
}

function answerTrue(v) {
  loadAnswer('true');
}

function answerFalse(v) {
    loadAnswer('false');
}

function loadAnswer() {
    //todo send the answer to the server via the API
}
LoadQuestion();

