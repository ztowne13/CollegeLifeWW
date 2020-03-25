const SIZE3 = '41px';
const SIZE2 = '29px';
const SIZE1 = '15px';

const ElementTypes = {
    Edit: 'EditEntryElement',
    Delete: 'DeleteEntryElement',
    Contact: 'ContactEntryElement',
    Extras: 'ExtrasEntryElement',
    Name: 'NameEntryElement',
    Address: 'AddressEntryElement',
    EditContact: 'EditContactEntryElement',
    EditExtras: 'EditExtrasEntryElement',
    EditName: 'EditNameEntryElement',
    EditAddress: 'EditAddressEntryElement',
    Save: 'SaveEntryElement',
    Cancel: 'CancelEntryElement',
    Stat: 'StatEntryElement',
    Text: 'TextEntryElement',
    Reassign: 'ReassignEntryElement',
    Primero: 'PrimeroEntryElement',
    Segundo: 'SegundoEntryElement',
    Cuarto: 'CuartoEntryElement'
};

const DisplayType = {
    Simple: 1,
    SemiDetailed: 2,
    Detailed: 3,
    Edit: 4,
    Stat: 5,
    Button: 6
}

class EntryManager {
    constructor(entry)
    {
        this.entry = entry;
        this.entryElements = [];
    }
}

let EntryHandler = class {

    constructor(prefix, displayType, entriesElementName, elements)
    {
        this.prefix = prefix;
        this.displayType = displayType;
        this.entriesElement = document.getElementById(entriesElementName);
        this.elements = elements;

        this.entryManagers = []
    }

    addEntry(row, rowNum)
    {
        let uuid = uuidv4();
        uuid = uuid + "." + rowNum;

        let entryManager = this.getEntry(row, rowNum, uuid);
        if(entryManager === undefined)
            return;

        this.entriesElement.appendChild(entryManager.entry);
        this.entryManagers.push(entryManager);

        return entryManager;
    }

    addEntryBefore(row, rowNum, uuid, beforeEntry)
    {
        let elem = this.getEntry(row, rowNum, uuid).entry;
        this.entriesElement.insertBefore(elem, beforeEntry);
    }

    getEntry(row, rowNum, uuid)
    {
        if(rowNum > -1) {
            let first = row[getFirstNameIndex()];
            let last = row[getLastNameIndex()];

            if (!((isDefined(first) && first != "") || (isDefined(last) && last != ""))) {
                return;
            }
        }

        let entry = document.createElement("div");
        entry.setAttribute('class', 'entry');
        entry.id = this.prefix === '' ? uuid : getId(uuid, this.prefix);

        this.updateStyling(entry);

        let entryManager = new EntryManager(entry);

        for(let elementId in this.elements) {
            let newElement = eval("new " + this.elements[elementId] + "(row, uuid, entryManager);");

            newElement.createEntryElement();
            newElement.updateStyle(this.displayType);
            entry.append(newElement.elem);

            entryManager.entryElements.push(newElement);
        }

        return entryManager;
    }

    updateStyling(entry) {

        switch(parseInt(this.displayType))
        {
            case DisplayType.Detailed:
                entry.style.height = '108px';
                break;
            case DisplayType.SemiDetailed:
                entry.style.height = '84px';
                break;
            case DisplayType.Simple:
                entry.style.height = '55px';
                break;
            case DisplayType.Edit:
                entry.style.height = '175px';
                break;
            case DisplayType.Button:
                this.entriesElement.style.width = '350px';
            case DisplayType.Stat:
                this.entriesElement.style.marginTop = '25px';
                entry.style.height = '35px';
                break;
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


