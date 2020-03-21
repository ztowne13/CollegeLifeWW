// Client ID and API key from the Developer Console

var PAGE_NAME = "Main!";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

var mappedColumns = {};

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    loadConstants();

    gapi.load('client:auth2', initClient);
}

function loadConstants()
{
    let imported = document.createElement('script');
    imported.src = 'data/data.js';
    document.head.appendChild(imported);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        loadData(init);
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    clearContent();

}

function clearContent()
{
    console.log("count: " + getContent().childNodes.length);
    len = getContent().childNodes.length;
    for(i = 0 ; i < len; i++) {
        getContent().removeChild(getContent().childNodes[0]);
    }
}

function appendPre(message) {
    var pre = getContent();
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function getContent() {
    return document.getElementById('content');
}

/**
 * First, Last, Year, Email, Cell
 *
 *
 **/

function printStats() {
    let data = loadData()

    // appendPre("Total: " + data[getFirstNameIndex()].length);
}

function loadData(callback) {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Main!A1:Z',
    }).then(function(response) {
        let range = response.result;
        console.log("length: " + range.values.length);
        if (range.values.length > 0) {
            console.log("proceeding to map values");
            mapValues(range.values);
            callback(range.values);
        } else {
            appendPre('No data found.');
        }
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}

function mapValues(values) {
    let row = values[0];
    console.log("mapping row: " + row);
    for (let i = 0; i < row.length; i++) {
        let val = row[i];
        val = val.toLowerCase();
        mappedColumns[val] = i;
    }

    return mappedColumns
}

function getFirstNameIndex() {
    if(!("first" in mappedColumns))
        appendPre("ERROR: Make sure a column as the header 'first'.");
    return mappedColumns["first"];
}

function getLastNameIndex() {
    if(!("last" in mappedColumns))
        appendPre("ERROR: Make sure a column as the header 'last'.");
    return mappedColumns["last"];
}

function getYearIndex() {
    if(!("year" in mappedColumns))
        appendPre("ERROR: Make sure a column as the header 'year'.");
    return mappedColumns["year"];
}

function getEmailIndex() {
    if(!("email" in mappedColumns))
        appendPre("ERROR: Make sure a column as the header 'email'.");
    return mappedColumns["email"];
}

function getTShirtIndex() {
    if(!("tshirt" in mappedColumns))
        appendPre("ERROR: Make sure a column as the header 'tshirt'.");
    return mappedColumns["tshirt"];
}

function getSizeIndex() {
    if(!("size" in mappedColumns))
        appendPre("ERROR: Make sure a column as the header 'size'.");
    return mappedColumns["size"];
}

function getCellIndex() {
    if(!("cell" in mappedColumns))
        appendPre("ERROR: Make sure a column as the header 'cell'.");
    return mappedColumns["cell"];
}

function getBibleStudyIndex() {
    if(!("bible study" in mappedColumns))
        appendPre("ERROR: Make sure a column as the header 'bible study'.");
    return mappedColumns["bible study"];
}

function getFacebookIndex() {
    if(!("facebook" in mappedColumns))
        appendPre("ERROR: Make sure a column as the header 'facebook'.");
    return mappedColumns["facebook"];
}

function getRecruiterIndex() {
    if(!("recruiter" in mappedColumns))
        appendPre("ERROR: Make sure a column as the header 'recruiter'.");
    return mappedColumns["recruiter"];
}

function getNotesIndex() {
    if(!("notes" in mappedColumns))
        appendPre("ERROR: Make sure a column as the header 'notes'.");
    return mappedColumns["notes"];
}

function getDormIndex() {
    if(!("dorm" in mappedColumns))
        appendPre("ERROR: Make sure a column as the header 'dorm'.");
    return mappedColumns["dorm"];
}

function getAddressIndex() {
    if(!("address" in mappedColumns))
        appendPre("ERROR: Make sure a column as the header 'address'.");
    return mappedColumns["address"];
}

function isDefined(variable)
{
    return typeof variable !== 'undefined'
}