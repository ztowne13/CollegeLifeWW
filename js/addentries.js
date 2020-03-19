function init(data) {
    // makeApiCall(data)
    submitbutton.onclick = click;
}

var submitbutton = document.getElementById('submit_button');
var form = document.getElementById('form');

function nextAvailableRow(data)
{
    for(let i = 0; i < data.length; i++)
    {
        let row = data[i];
        let first = row[getFirstNameIndex()];
        let last = row[getLastNameIndex()];

        if(!((isDefined(first) && first != "") || (isDefined(last) && last != ""))) {
            return i + 1;
        }
    }

    return -1;
}



function buildArray()
{
    let first = document.getElementById('firstname').value;
    let last = document.getElementById('lastname').value;

    let yeare = document.getElementById("year");
    let year = yeare.options[yeare.selectedIndex].value + "";

    let email = document.getElementById('email').value;
    let cell = document.getElementById('cell').value;

    let sizee = document.getElementById("size");
    let size = sizee.options[sizee.selectedIndex].value + "";

    let biblestudye = document.getElementById("biblestudy");
    let biblestudy = biblestudye.options[biblestudye.selectedIndex].value + "";

    let facebooke = document.getElementById("facebook");
    let facebook = facebooke.options[facebooke.selectedIndex].value + "";

    let notes = document.getElementById('notes').value;
    let recruiter = document.getElementById('recruiter').value;
    let address = document.getElementById('address').value;

    let dorme = document.getElementById("dorm");
    let dorm = dorme.options[dorme.selectedIndex].value + "";

    let newArray = [];
    newArray[getFirstNameIndex()] = first;
    newArray[getLastNameIndex()] = last;
    newArray[getYearIndex()] = year;
    newArray[getEmailIndex()] = email;
    newArray[getCellIndex()] = cell;
    newArray[getSizeIndex()] = size;
    newArray[getBibleStudyIndex()] = biblestudy;
    newArray[getFacebookIndex()] = facebook;
    newArray[getNotesIndex()] = notes;
    newArray[getRecruiterIndex()] = recruiter;
    newArray[getAddressIndex()] = address;
    newArray[getDormIndex()] = dorm;

    console.log("newArray: " + newArray);
    return newArray;
}

function click()
{
    loadData(updateAfterLoad);
}

function updateAfterLoad(data)
{
    let first = document.getElementById('firstname').value;
    let last = document.getElementById('lastname').value;

    if((isDefined(first) && first != "") || (isDefined(last) && last != ""))
        makeApiCall(data, buildArray());

    document.getElementById('firstname').value = '';
    document.getElementById('lastname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('cell').value = '';
    document.getElementById('notes').value = '';
    document.getElementById('recruiter').value = '';
    document.getElementById('address').value = '';

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function makeApiCall(data, array)
{
    let nextRow = nextAvailableRow(data);
    if(nextRow == -1)
        makeApiCall_insert(data, array);
    else
        makeApiCall_overwrite(data, PAGE_NAME + "A" + nextRow + ":Z" + nextRow, array)
}

function makeApiCall_overwrite(data, range, array) {
    var params = {
        spreadsheetId: SHEET_ID,
        range: range,
        valueInputOption: 'USER_ENTERED',
    };

    var valueRangeBody = {
        "range": range,
        "majorDimension": "ROWS",
        "values": [array]
    };

    var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
    request.then(function(response) {
        console.log(response.result);
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}


function makeApiCall_insert(data, array) {
    var params = {
        spreadsheetId: SHEET_ID,
        range: PAGE_NAME + 'A1:Z',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: "OVERWRITE",
    };

    var valueRangeBody = {
        "range": PAGE_NAME + "A1:Z",
        "majorDimension": "ROWS",
        "values": [array]
    };

    var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
    request.then(function(response) {
        console.log(response.result);
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}
