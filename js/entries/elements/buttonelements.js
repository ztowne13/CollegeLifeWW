class EditEntryElement extends EntryElement
{
    createEntryElement()
    {

        this.elem = document.createElement('edit');
        this.elem.innerHTML = "Edit";
        this.elem.id = getId(this.uuid, "edit");

        this.hookUp();

        return this.elem;
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
        entryHandler.addEntryBefore(this.row, rowNum, uuid, document.getElementById(uuid));
    }

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

class CancelEntryElement extends EntryElement
{
    createEntryElement()
    {
        this.elem = document.createElement('cancel');
        this.elem.innerHTML = "Cancel";
        this.elem.id = getId(this.uuid, "cancel");

        this.hookUp();

        return this.elem;
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

    updateStyle(displayType) {
        this.elem.style.paddingTop = '75px';
        this.elem.style.paddingBottom = '75px';
    }
}

class SaveEntryElement extends EntryElement
{
    createEntryElement()
    {
        this.elem = document.createElement('save');
        this.elem.innerHTML = "Save";
        this.elem.id = getId(this.uuid, "save");

        this.hookUp();

        return this.elem;
    }

    onClick()
    {
        let _this = this;
        loadData(function(data) {
            _this.complete(data);
        })
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

    updateStyle(displayType) {
        this.elem.style.paddingTop = '75px';
        this.elem.style.paddingBottom = '75px';
    }
}

class DeleteEntryElement extends EntryElement
{
    createEntryElement()
    {
        this.elem = document.createElement('delete');
        this.elem.innerHTML = "Delete";
        this.elem.id = getId(this.uuid, "delete");

        this.hookUp();

        return this.elem
    }

    onClick()
    {
        let _this = this;
        loadData(function(data) {
            _this.complete(data);
        })
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