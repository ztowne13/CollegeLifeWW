const SIZE3 = '41px';
const SIZE2 = '29px';
const SIZE1 = '15px';

let EntryHandler = class {

    constructor(displayType, entriesElementName)
    {
        this.displayType = displayType;
        this.entriesElement = document.getElementById(entriesElementName);
    }

    addEntry(row, rowNum)
    {
        let first = row[getFirstNameIndex()];
        let last = row[getLastNameIndex()];

        if(!((isDefined(first) && first != "") || (isDefined(last) && last != ""))) {
            return;
        }

        let uuid = uuidv4();
        uuid = uuid + "." + rowNum;

        let entry = document.createElement("div");
        entry.setAttribute('class', 'entry');
        entry.id = uuid;

        let editButton = new EditEntryElement(row, uuid);
        editButton.createEntryElement();
        let deleteButton = new DeleteEntryElement(row, uuid);
        deleteButton.createEntryElement();
        let p3 = new ContactEntryElement(row, uuid);
        p3.createEntryElement()
        let p4 = new ExtrasEntryElement(row, uuid);
        p4.createEntryElement();

        editButton.updateStyle(this.displayType);
        deleteButton.updateStyle(this.displayType);
        p3.updateStyle(this.displayType);
        p4.updateStyle(this.displayType);



        this.updateEntryHeight(entry, editButton, deleteButton, p3, p4);

        entry.appendChild(deleteButton.elem);
        entry.appendChild(editButton.elem);
        entry.appendChild(new NameEntryElement(row, uuid).createEntryElement());
        entry.appendChild(new AddressEntryElement(row, uuid).createEntryElement());
        entry.appendChild(p3.elem);
        entry.appendChild(p4.elem);

        this.entriesElement.appendChild(entry);
    }

    updateEntryHeight(entry) {

        if (this.displayType == '3') {
            entry.style.height = '108px';
        } else if (this.displayType == '2') {
            entry.style.height = '84px';
        } else if(this.displayType == '1') {
            entry.style.height = '55px';
        }
    }
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

function newElem(val) {
    return document.createElement(val);
}


