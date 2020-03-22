class NameEntryElement extends EntryElement
{
    createEntryElement()
    {
        this.elem = this.createElem("1");

        let name = document.createElement("name");
        name.innerHTML = this.row[getFirstNameIndex()] + " " + this.row[getLastNameIndex()];
        name.id = getId(this.uuid, "name");

        if(this.row[getTShirtIndex()] !== "TRUE") {
            name.style.color ='#ff8080'
        }
        else
        {
            name.style.color = "#dcffc3";
        }

        this.elem.appendChild(name);

        return this.elem;
    }
}

class AddressEntryElement extends EntryElement
{
    createEntryElement()
    {
        this.elem = this.createElem("2");

        let size = newElem('size');
        size.id = getId(this.uuid, 'size');
        size.innerHTML = this.row[getSizeIndex()];

        let dorm = document.createElement('dorm');
        dorm.innerHTML = this.row[getDormIndex()];
        if(dorm.innerHTML == "")
            dorm.innerHTML = "Off Campus";
        dorm.id = getId(this.uuid, "dorm");

        let address = document.createElement('addr');
        address.innerHTML = this.row[getAddressIndex()];
        address.id = getId(this.uuid, "address");

        this.elem.appendChild(dorm);
        this.elem.appendChild(address);
        this.elem.appendChild(size);

        return this.elem;
    }
}

class ContactEntryElement extends EntryElement
{
    createEntryElement()
    {
        this.elem = this.createElem("3");

        let email = document.createElement('email');
        email.innerHTML = this.row[getEmailIndex()];
        email.id = getId(this.uuid, "email");

        let cell = document.createElement('cell');
        cell.innerHTML = this.row[getCellIndex()];
        cell.id = getId(this.uuid, "cell");

        let year = document.createElement("year");
        year.innerHTML = formattedYear(this.row[getYearIndex()]);
        year.id = getId(this.uuid, "year");

        this.elem.appendChild(year);
        this.elem.appendChild(email);
        this.elem.appendChild(cell);

        return this.elem;
    }
    
    updateStyle(displayType) {
        if(displayType == DisplayType.Simple)
            this.elem.style.display = 'none';
    }
}

class ExtrasEntryElement extends EntryElement
{
    createEntryElement()
    {
        this.elem = this.createElem("4");
        let yesNoSpace = document.createElement('yesnospace');

        let notes = document.createElement('notes');
        notes.innerHTML =  "Notes: " + this.row[getNotesIndex()];
        notes.id = getId(this.uuid, "notes");

        let recruiter = document.createElement('recruiter');
        recruiter.innerHTML = "Recruiter: " + (isDefined(this.row[getRecruiterIndex()]) ? this.row[getRecruiterIndex()] : "n/a");
        recruiter.id = getId(this.uuid, "recruiter");

        let isFBVal = this.row[getFacebookIndex()];
        let isFB = isDefined(isFBVal) ? isFBVal.toLowerCase() == 'yes' : false;
        let isBibStudVal = this.row[getBibleStudyIndex()];
        let isBibStud = isDefined(isBibStudVal) ? isBibStudVal.toLowerCase() == 'yes' : false;

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
        wantsNode.id = getId(this.uuid, "wants");

        if(isDefined(this.row[getNotesIndex()])) {
            this.elem.appendChild(notes);
            this.elem.appendChild(yesNoSpace.cloneNode());
        }
        this.elem.appendChild(recruiter);
        this.elem.appendChild(wantsNode);

        return this.elem;
    }

    updateStyle(displayType) {
        if(displayType == DisplayType.Simple || displayType == DisplayType.SemiDetailed)
            this.elem.style.display = 'none';
    }
}