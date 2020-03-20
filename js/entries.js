var cachedData;
var cachedElem;

let mappedEntries = {};

function init(data) {
    cachedData = data;

    display(data);

    document.getElementById('search').addEventListener('input', function (evt) {
        update(data);
    });

    document.getElementById('display').addEventListener('change', function (evt) {
        update(data);
    });
}

function update(data)
{
    clearData();
    display(data);
}

function clearData() {
    let entriesNode = document.getElementById('entries');
    while (entriesNode.firstChild) {
        entriesNode.removeChild(entriesNode.firstChild);
    }
}

function display(data)
{
    let maxLength = 26;
    let count = 0;

    for (let i = 0; i < data.length; i++) {
        let row = data[i];
        // Print columns A and E, which correspond to indices 0 and 4.

        let line = row[0];
        for(j = 1; j < row.length && j < maxLength; j++)
        {
            if(i == 0 && row[j] == "")
            {
                maxLength = j;
                break;
            }
            line = line + ", " + row[j];
        }

        if(statisfiesSearch(row) && i != 0) {
            addEntry(row, i + 1);
            count++;
        }
    }

    document.getElementById('headerentries').innerHTML = "Entries (" + count + ")";
}

function statisfiesSearch(value) {
    let searchValue = document.getElementById('search').value;

    let valueTo =
        value[getFirstNameIndex()] + " " +
        value[getLastNameIndex()] + " " +
        formattedYear(value[getYearIndex()]) + " " +
        value[getDormIndex()] + " " +
        value[getAddressIndex()] + " " +
        value[getNotesIndex()] + " " +
        formattedSize(value[getSizeIndex()]);

    let displaye = document.getElementById("display");
    let display = displaye.options[displaye.selectedIndex].value + "";

    if(display != '1') {
        valueTo = valueTo +" " +
        value[getEmailIndex()] + " " +
        value[getCellIndex()];
    }
    if(display == '3') {
        valueTo = valueTo +" " +
            value[getRecruiterIndex()] + " " +
            value[getNotesIndex()];
    }

    let asString = valueTo.toLowerCase().replace(",", "");

    return asString.toLowerCase().includes(searchValue.toLowerCase());
}

function formattedSize(val) {
    switch(val) {
        case 'S':
            return "Small";
        case 'M':
            return "Medium";
        case 'L':
            return "Large";
        case "XL":
            return "Extra Large";
    }
}

function deleteBut(elem) {
    cachedElem = elem;
    loadData(deleteButFinish);
}

function save(elem) {
    cachedElem = elem;
    loadData(saveFinish);
}

function same(list1, list2) {
    if(list1.length != list2.length)
        return false;

    for(let i = 0; i < list1.length; i++) {
        if(list1[i].toString().localeCompare(list2[i].toString())) {
            console.log("DIFFERENCE");
            console.log("L1: " + list1[i]);
            console.log("L2: " + list2[i]);
            return false;
        }
    }

    return true;
}

function spreadsheetChanged(data) {
    let entries = document.getElementById('entries');

    if(!same(data, cachedData)) {
        clearData();

        let error = newElem('h1');
        error.style.color = 'red';
        error.innerHTML = "The spreadsheet has been changed, please reload.";

        entries.appendChild(error);

        return true;
    }

    return false;
}

function fromYear(year) {
    switch(year) {
        case 'Freshmen':
            return '1';
        case 'Sophomore':
            return '2';
        case 'Junior':
            return '3';
        case 'Senior':
            return '4';
        case 'Senior+':
            return '5+';
    }
}

function saveFinish(data) {
    let elem = cachedElem;

    if(spreadsheetChanged(data))
        return;

    let uuid = getUuidFromId(elem.id);

    let name = getValFrom(uuid, 'editname').split(" ");
    let year = fromYear(getValFrom(uuid, 'edityear'));
    let delivered = getValFrom(uuid, 'editdelivered').includes('Not') ? 'FALSE' : 'TRUE';
    let dorm = getValFrom(uuid, 'editdorm');
    let address = getValFrom(uuid, 'editaddress');
    let email = getValFrom(uuid, 'editemail');
    let cell = getValFrom(uuid, 'editcell');
    let bibStud = getValFrom(uuid, 'editbibstud').includes('Doesn') ? 'No' : 'Yes';
    let fb = getValFrom(uuid, 'editfb').includes('Don') ? 'No' : 'Yes';
    let notes = getValFrom(uuid, 'editnotes');
    let recruiter = getValFrom(uuid, 'editrecruiter');
    let size = getValFrom(uuid, 'editsize');
    size = size.includes('Extra') ? 'XL' : size[0];


    let newArray = [];
    newArray[getFirstNameIndex()] = name[0];
    newArray[getLastNameIndex()] = name[1] == null ? "" : name[1];
    newArray[getYearIndex()] = year;
    newArray[getTShirtIndex()] = delivered;
    newArray[getEmailIndex()] = email;
    newArray[getCellIndex()] = cell;
    newArray[getSizeIndex()] = size;
    newArray[getBibleStudyIndex()] = bibStud;
    newArray[getFacebookIndex()] = fb;
    newArray[getNotesIndex()] = notes;
    newArray[getRecruiterIndex()] = recruiter;
    newArray[getAddressIndex()] = address;
    newArray[getDormIndex()] = dorm;

    let rowNum = elem.id.split(".")[1];

    makeApiCall_overwriteUpdate("A" + rowNum + ":Z" + rowNum, newArray, refresh);

    //window.scrollTo(500, 0);
    // clearData();
    // display(data);
}

function refresh(data) {
    cachedData = data;
    clearData();
    display(data);
}

function makeApiCall_overwriteUpdate(range, array, after) {
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
        loadData(refresh);
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });

}

function deleteButFinish(data) {

    let elem = cachedElem;

    if(spreadsheetChanged(data))
        return;

    let rowNum = elem.id.split(".")[1];
    let newArray = [];

    for(let i = 0; i < 26; i++) {
        newArray[i] = "";
    }

    makeApiCall_overwrite("A" + rowNum + ":" + "Z" + rowNum, newArray);

    cachedData[rowNum - 1] = "";
    data[rowNum - 1] = "";

    document.getElementById(getUuidFromId(elem.id)).style.display = 'none';
}

function makeApiCall_overwrite(range) {
    range = PAGE_NAME + range;

    var params = {
        spreadsheetId: SHEET_ID,
        range: range,
    };

    var request = gapi.client.sheets.spreadsheets.values.clear(params);
    request.then(function(response) {
        console.log(response.result);
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}

function cancel(elem) {
    let id = elem.id;
    let prefix = getPrefixFromId(id);
    let uuid = getUuidFromId(id);

    document.getElementById(uuid).style.display = 'block';
    let entries = document.getElementById('entries');
    let editing = document.getElementById(getId(uuid, "editing"));
    entries.removeChild(editing);
}

function edit(elem) {

    let id = elem.id;
    let prefix = getPrefixFromId(id);
    let uuid = getUuidFromId(id);

    document.getElementById(uuid).style.display = 'none';

    let entries = document.getElementById('entries');
    let entry = document.createElement("div");
    entry.setAttribute('class', 'entry');
    entry.id = getId(uuid, "editing");
    entry.style.height = '175px';

    let spacer = newElem('spacer');

    /**
     * First <p>
     */

    let p1 = document.createElement('p');

    let name = newInputElem('text', getId(uuid, "editname"));
    name.value = getValFrom(uuid, "name");

    let yearArray = ["Freshmen", "Sophomore", "Junior", "Senior", "Senior+", "Unknown"];
    let year = newSelectElem(getId(uuid, "edityear"), yearArray, getValFrom(uuid, "year"));

    let tArray = ["T-Shirt Delivered", "T-Shirt Not Delivered"];
    let deliveredT = newSelectElem(getId(uuid, "editdelivered"),
        tArray, getValFrom(uuid, "delivered") == "X" ? "T-Shirt Not Delivered" : "T-Shirt Delivered");

    let sizeArray = ['Small', 'Medium', 'Large', 'Extra Large'];
    let tsize = newSelectElem(getId(uuid, 'editsize'), sizeArray, formattedSize(getValFrom(uuid, 'size')));

    p1.appendChild(name);
    p1.appendChild(spacer.cloneNode());
    p1.appendChild(year);
    p1.appendChild(spacer.cloneNode());
    p1.appendChild(deliveredT);
    p1.appendChild(spacer.cloneNode());
    p1.appendChild(tsize);

    /**
     * Second <p>
     */

    let p2 = newElem('p');

    let dormArray = ["Primero Grove", "Segundo", "Tercero", "Cuarto", "Off Campus"]
    let dorm = newSelectElem(getId(uuid, "editdorm"), dormArray, getValFrom(uuid, "dorm"));

    let address = newInputElem('text', getId(uuid, "editaddress"));
    address.value = getValFrom(uuid, "address");
    address.setAttribute('placeholder', "Wall 122");

    p2.appendChild(dorm);
    p2.appendChild(spacer.cloneNode());
    p2.appendChild(address);

    /**
     * Third <p>
     */

    let p3 = newElem('p');

    let email = newInputElem('text', getId(uuid, "editemail"));
    email.value = getValFrom(uuid, "email");
    email.setAttribute('placeholder', "email@gmail.com");

    let cell = newInputElem('text', getId(uuid, "editcell"));
    cell.value = getValFrom(uuid, "cell");
    cell.setAttribute('placeholder', '5805615144');

    let wants = getValFrom(uuid, 'wants');
    let bibStudSelected = wants.includes("Bible Study") ? "Wants to join Bible Study" : "Doesn't want to join";
    let bibStudArray = ["Wants to join Bible Study", "Doesn't want to join"];
    let bibStud = newSelectElem(getId(uuid, "editbibstud"), bibStudArray, bibStudSelected);

    let fbarray = ["Add to FB", "Don't add to FB"];
    let fbselected = wants.includes("FB") ? "Add to FB" : "Don't add to FB";
    let fb = newSelectElem(getId(uuid, "editfb"), fbarray, fbselected);

    p3.appendChild(email);
    p3.appendChild(spacer.cloneNode());
    p3.appendChild(cell);
    p3.appendChild(spacer.cloneNode());
    p3.appendChild(bibStud);
    p3.appendChild(spacer.cloneNode());
    p3.appendChild(fb);

    /**
     * Fourth <p>
     */

    let p4 = newElem('p');

    let notes = newInputElem('text', getId(uuid, "editnotes"));
    notes.value = getValFrom(uuid, "notes").replace("Notes: ", "");
    notes.setAttribute('placeholder', 'Notes...');

    let recruiter = newInputElem('text', getId(uuid, "editrecruiter"));
    recruiter.value = getValFrom(uuid, "recruiter").replace('Recruiter: ', '');
    recruiter.setAttribute('recruiter', "Recruiter...");

    p4.appendChild(notes);
    p4.appendChild(spacer.cloneNode());
    p4.appendChild(recruiter);


    let saveButton = document.createElement('save');
    saveButton.setAttribute('onclick', "save(this)");
    saveButton.innerHTML = "Save";
    saveButton.id = getId(uuid, "save");

    let cancelButton = document.createElement('cancel');
    cancelButton.setAttribute('onclick', "cancel(this)");
    cancelButton.innerHTML = "Cancel";
    cancelButton.id = getId(uuid, "cancel");

    let size = '75px';

    cancelButton.style.paddingBottom = size;
    cancelButton.style.paddingTop = size;
    saveButton.style.paddingBottom = size;
    saveButton.style.paddingTop = size;

    entry.appendChild(cancelButton);
    entry.appendChild(saveButton);
    entry.appendChild(p1);
    entry.appendChild(p2);
    entry.appendChild(p3);
    entry.appendChild(p4);
    entries.insertBefore(entry, document.getElementById(uuid));
}

function newElem(val) {
    return document.createElement(val);
}

function getValFrom(uuid, prefix)
{
    if(document.getElementById(getId(uuid, prefix)) == null)
        return "";

    let elem = document.getElementById(getId(uuid, prefix));
    let tagName = elem.tagName;


    if(tagName.includes('SELECT'))
        return elem.options[elem.selectedIndex].value + "";
    if(tagName.includes("INPUT") && elem.type == "text")
        return elem.value;

    return elem.innerHTML;
}

function newInputElem(type, id) {
    let elem = newElem('input');
    elem.setAttribute('type', type);
    elem.id = id;

    return elem;
}

function newSelectElem(id, array, selected) {
    var selectList = document.createElement("select");
    selectList.id = id;

    for (var i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        option.value = array[i];
        option.text = array[i];

        if(array[i] == selected)
            option.setAttribute('selected', 'selected');

        selectList.appendChild(option);
    }

    return selectList;
}

function getId(uuid, prefix) {
    return prefix + "-" + uuid;
}

function getPrefixFromId(id)
{
    return id.split("-")[0];
}

function getUuidFromId(id)
{
    return id.split("-")[1];
}

// Height: 105, 80, 60

function addEntry(row, rowNum)
{
    let first = row[getFirstNameIndex()];
    let last = row[getLastNameIndex()];

    if(!((isDefined(first) && first != "") || (isDefined(last) && last != ""))) {
        return;
    }

    let uuid = uuidv4();
    uuid = uuid + "." + rowNum;

    let displaye = document.getElementById("display");
    let display = displaye.options[displaye.selectedIndex].value + "";

    let entries = document.getElementById('entries');
    let entry = document.createElement("div");
    entry.setAttribute('class', 'entry');
    entry.id = uuid;

    if(display == '3')
        entry.style.height = '108px';
    if(display == '2')
        entry.style.height = '84px';
    if(display == '1')
        entry.style.height = '55px';


    /**
     * First <p>
     **/

    let p1 = document.createElement('p');
    p1.id = getId(uuid, "p1");

    let name = document.createElement("name");
    name.innerHTML = row[getFirstNameIndex()] + " " + row[getLastNameIndex()];
    name.id = getId(uuid, "name");

    let year = document.createElement("year");
    year.innerHTML = formattedYear(row[getYearIndex()]);
    year.id = getId(uuid, "year");

    let yesNoSpace = document.createElement('yesnospace');

    let isDelivered = row[getTShirtIndex()];
    var delivered;
    /*if(isDelivered == "TRUE") {
        delivered = document.createElement('yes');
        delivered.innerHTML = '✓';
    }
    else {
        delivered = document.createElement('no');
        delivered.innerHTML = 'X';
    }*/

    if(isDelivered !== "TRUE") {
        name.style.color ='#ff8080'
    }
    else
    {
        name.style.color = "#dcffc3";
    }

    //delivered.id = getId(uuid, "delivered");

    let size = newElem('size');
    size.id = getId(uuid, 'size');
    size.innerHTML = row[getSizeIndex()];

    p1.appendChild(name);
    p1.appendChild(year);
    //p1.appendChild(yesNoSpace);
    //p1.appendChild(delivered);
    p1.appendChild(size);

    /**
     * Second <p>
     **/

    let p2 = document.createElement('p');
    p2.id = getId(uuid, "p2");

    let dorm = document.createElement('dorm');
    dorm.innerHTML = row[getDormIndex()];
    if(dorm.innerHTML == "")
        dorm.innerHTML = "Off Campus";
    dorm.id = getId(uuid, "dorm");

    let address = document.createElement('addr');
    address.innerHTML = row[getAddressIndex()];
    address.id = getId(uuid, "address");

    p2.appendChild(dorm);
    p2.appendChild(address);

    /**
     * Third <p>
     **/

    let p3 = document.createElement('p');
    p3.id = getId(uuid, "p3");

    let email = document.createElement('email');
    email.innerHTML = row[getEmailIndex()];
    email.id = getId(uuid, "email");

    let cell = document.createElement('cell');
    cell.innerHTML = row[getCellIndex()];
    cell.id = getId(uuid, "cell");

    let isFBVal = row[getFacebookIndex()];
    let isFB = isDefined(isFBVal) ? isFBVal.toLowerCase() == 'yes' : false;
    // var fb;
    // if(isFB.toLowerCase() == "yes") {
    //     fb = document.createElement('yes');
    //     fb.innerHTML = "Bible Study"
    // } else {
    //     fb = document.createElement('no');
    //     fb.innerHTML = "Bible Study";
    // }
    //
    let isBibStudVal = row[getBibleStudyIndex()];
    let isBibStud = isDefined(isBibStudVal) ? isBibStudVal.toLowerCase() == 'yes' : false;
    // var bibStud;
    // if(isBibStud.toLowerCase() == "yes") {
    //     bibStud = document.createElement('yes');
    //     bibStud.innerHTML = "FB";
    // } else {
    //     bibStud = document.createElement('no');
    //     bibStud.innerHTML = "FB";
    // }

    //console.log("isBibStud: " + isBibStud);
    let wants = (isBibStud || isFB) ? "Yes To: " : "";
    if(isBibStud)
        wants = wants + "Bible Study";
    if(isFB)
    {
        if(isBibStud)
            wants = wants + ", ";
        wants = wants + "FB";
    }

    let wantsNode = document.createElement('wants');
    wantsNode.innerHTML = wants;
    wantsNode.id = getId(uuid, "wants");

    p3.appendChild(email);
    p3.appendChild(cell);
    p3.appendChild(wantsNode);
    // p3.appendChild(yesNoSpace.cloneNode());
    // p3.appendChild(fb);
    // p3.appendChild(yesNoSpace.cloneNode());
    // p3.appendChild(bibStud);

    /**
     * Fourth <p>
     */

    let p4 = document.createElement('p');
    p4.id = getId(uuid, "p4");

    let notes = document.createElement('notes');
    notes.innerHTML =  "Notes: " + row[getNotesIndex()];
    notes.id = getId(uuid, "notes");

    let recruiter = document.createElement('recruiter');
    recruiter.innerHTML = "Recruiter: " + (isDefined(row[getRecruiterIndex()]) ? row[getRecruiterIndex()] : "n/a");
    recruiter.id = getId(uuid, "recruiter");

    if(isDefined(row[getNotesIndex()])) {
        p4.appendChild(notes);
        p4.appendChild(yesNoSpace.cloneNode());
    }
    p4.appendChild(recruiter);

    let editButton = document.createElement('edit');
    editButton.setAttribute('onclick', "edit(this)");
    editButton.innerHTML = "Edit";
    editButton.id = getId(uuid, "edit");

    let deleteButton = document.createElement('delete');
    deleteButton.setAttribute('onclick', "deleteBut(this)");
    deleteButton.innerHTML = "Delete";
    deleteButton.id = getId(uuid, "delete");

    let size3 = '41px';
    let size2 = '29px';
    let size1 = '15px'

    if(display == '3') {
        editButton.style.paddingBottom = size3;
        editButton.style.paddingTop = size3;
        deleteButton.style.paddingBottom = size3;
        deleteButton.style.paddingTop = size3;
    }
    if(display == '2') {
        editButton.style.paddingBottom = size2;
        editButton.style.paddingTop = size2;
        deleteButton.style.paddingBottom = size2;
        deleteButton.style.paddingTop = size2;
    }
    if(display == '1') {
        editButton.style.paddingBottom = size1;
        editButton.style.paddingTop = size1;
        deleteButton.style.paddingBottom = size1;
        deleteButton.style.paddingTop = size1;
    }

    entry.appendChild(deleteButton);
    entry.appendChild(editButton);
    entry.appendChild(p1);
    entry.appendChild(p2);
    entry.appendChild(p3);
    entry.appendChild(p4);
    if(display == '1') {
        p3.style.display = 'none';
        p4.style.display = 'none';
    }
    if(display == '2')
        p4.style.display = 'none';

    entries.appendChild(entry);
}

function formattedYear(year)
{
    switch (year) {
        case '1':
            return 'Freshmen';
        case '2':
            return 'Sophomore';
        case '3':
            return 'Junior';
        case '4':
            return 'Senior';
        case '5':
            return 'Senior+';
        default:
            return 'Unknown';
    }
}

function uuidv4() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}