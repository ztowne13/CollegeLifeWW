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

    let displayElement = document.getElementById("display");
    let display = displayElement.options[displayElement.selectedIndex].value + "";

    let elements = [
        ElementTypes.Delete,
        ElementTypes.Edit,
        ElementTypes.Name,
        ElementTypes.Address,
        ElementTypes.Contact,
        ElementTypes.Extras
    ];

    let handler = new EntryHandler('', display, 'entries', elements)


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
            handler.addEntry(row, i + 1, display);

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

function newInputElem(type, id) {
    let elem = newElem('input');
    elem.setAttribute('type', type);
    elem.id = id;

    return elem;
}

function newElem(val) {
    return document.createElement(val);
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