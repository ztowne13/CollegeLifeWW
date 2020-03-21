class EntryElement
{
    constructor(row, uuid)
    {
        this.row = row;
        this.uuid = uuid;

        if (this.createEntryElement === undefined) {
            throw new TypeError('Classes extending the widget abstract class');
        }
    }
    
    createElem(id)
    {
        let p = document.createElement('p');
        p.id = getId(this.uuid, "p" + id);
        
        return p;
    }
}

class NameEntryElement extends EntryElement
{
    createEntryElement()
    {
        let p1 = this.createElem("1");

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

        p1.appendChild(name);

        return p1;
    }
}

class AddressEntryElement extends EntryElement
{
    createEntryElement()
    {
        let p2 = this.createElem("2");

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

        p2.appendChild(dorm);
        p2.appendChild(address);
        p2.appendChild(size);

        return p2;
    }
}

class ContactEntryElement extends EntryElement
{
    createEntryElement()
    {
        let p3 = this.createElem("3");

        let email = document.createElement('email');
        email.innerHTML = this.row[getEmailIndex()];
        email.id = getId(this.uuid, "email");

        let cell = document.createElement('cell');
        cell.innerHTML = this.row[getCellIndex()];
        cell.id = getId(this.uuid, "cell");

        let year = document.createElement("year");
        year.innerHTML = formattedYear(this.row[getYearIndex()]);
        year.id = getId(this.uuid, "year");

        p3.appendChild(year);
        p3.appendChild(email);
        p3.appendChild(cell);

        return p3;
    }
}

class ExtrasEntryElement extends EntryElement
{
    createEntryElement()
    {
        let p4 = this.createElem("4");
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
            p4.appendChild(notes);
            p4.appendChild(yesNoSpace.cloneNode());
        }
        p4.appendChild(recruiter);
        p4.appendChild(wantsNode);

        return p4;
    }
}

class EditEntryElement extends EntryElement 
{
    createEntryElement()
    {
        
        let editButton = document.createElement('edit');
        editButton.setAttribute('onclick', "edit(this)");
        editButton.innerHTML = "Edit";
        editButton.id = getId(this.uuid, "edit");

        return editButton;
    }
}

class DeleteEntryElement extends EntryElement
{
    createEntryElement()
    {
        let deleteButton = document.createElement('delete');
        deleteButton.setAttribute('onclick', "deleteBut(this)");
        deleteButton.innerHTML = "Delete";
        deleteButton.id = getId(this.uuid, "delete");

        return deleteButton
    }
}