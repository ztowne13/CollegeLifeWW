class TextButtonEntryElement extends EntryElement
{
    constructor(text, type, row, uuid, entryManager, ignoreTypeForId = false)
    {
        super(row, uuid, entryManager);

        this.text = text;
        this.type = type;
        this.ignoreTypeForId = ignoreTypeForId;
    }

    createEntryElement()
    {
        this.elem = document.createElement(this.type);
        this.elem.innerHTML = this.text;
        this.elem.id = this.ignoreTypeForId ? this.uuid : getId(this.uuid, this.type);

        this.hookUp(false);

        return this.elem;
    }

    onClick()
    {
        let _this = this;
        loadData(function(data) {
            _this.complete(data);
        })
    }
}

class EditButtonEntryElement extends TextButtonEntryElement
{
    updateStyle(displayType) {
        this.elem.style.paddingTop = '75px';
        this.elem.style.paddingBottom = '75px';
    }
}

class EntryButtonEntryElement extends TextButtonEntryElement
{
    updateStyle(displayType) {
        let size = SIZE1;
        if(displayType == DisplayType.SemiDetailed)
            size = SIZE2;
        else if(displayType == DisplayType.Detailed)
            size = SIZE3;

        this.elem.style.paddingTop = size;
        this.elem.style.paddingBottom = size;
    }
}

class EditEntryElement extends EntryButtonEntryElement
{
    constructor(row, uuid, entryManager)
    {
        super('Edit', 'edit', row, uuid, entryManager);
    }

    onClick()
    {
        let id = this.elem.id;
        let uuid = getUuidFromId(id);

        document.getElementById(uuid).style.display = 'none';

        let elements = [
            ElementTypes.Cancel,
            ElementTypes.Save,
            ElementTypes.EditName,
            ElementTypes.EditAddress,
            ElementTypes.EditContact,
            ElementTypes.EditExtras
        ]

        let entryHandler = new EntryHandler('editing', DisplayType.Edit, 'entries', elements);

        let rowNum = id.split(".")[1];
        let entryManager = entryHandler.addEntryBefore(this.row, rowNum, uuid, document.getElementById(uuid));
        entryManager.previousEntryManager = this.entryManager;
    }
}

class CancelEntryElement extends EditButtonEntryElement
{
    constructor(row, uuid, entryManager)
    {
        super('Cancel', 'cancel', row, uuid, entryManager);
    }

    onClick()
    {
        let id = this.elem.id;
        let prefix = getPrefixFromId(id);
        let uuid = getUuidFromId(id);

        document.getElementById(uuid).style.display = 'block';
        let entries = document.getElementById('entries');
        let editing = document.getElementById(getId(uuid, "editing"));
        entries.removeChild(editing);
    }
}

class SaveEntryElement extends EditButtonEntryElement
{
    constructor(row, uuid, entryManager)
    {
        super('Save', 'save', row, uuid, entryManager);
    }

    complete(data)
    {
        console.log("this: " + this);
        if(spreadsheetChanged(data))
            return;

        let uuid = getUuidFromId(this.elem.id);

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

        let rowNum = this.elem.id.split(".")[1];

        makeApiCall_overwriteUpdate("A" + rowNum + ":Z" + rowNum, newArray, refresh);
    }
}

class DeleteEntryElement extends EntryButtonEntryElement
{
    constructor(row, uuid, entryManager)
    {
        super('Delete', 'delete', row, uuid, entryManager);
    }

    complete(data)
    {
        if(spreadsheetChanged(data))
            return;

        let rowNum = this.elem.id.split(".")[1];
        let newArray = [];

        for(let i = 0; i < 26; i++) {
            newArray[i] = "";
        }

        makeApiCall_overwrite("A" + rowNum + ":" + "Z" + rowNum, newArray);

        cachedData[rowNum - 1] = "";
        data[rowNum - 1] = "";

        document.getElementById(getUuidFromId(this.elem.id)).style.display = 'none';
    }
}