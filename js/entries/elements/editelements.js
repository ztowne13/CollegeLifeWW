class EditNameEntryElement extends EntryElement
{
    createEntryElement()
    {
        let spacer = newElem('spacer');
        this.elem = newElem('p');

        let name = newInputElem('text', getId(this.uuid, "editname"));
        name.value = getValFrom(this.uuid, "name");

        let yearArray = ["Freshmen", "Sophomore", "Junior", "Senior", "Senior+", "Unknown"];
        let year = newSelectElem(getId(this.uuid, "edityear"), yearArray, getValFrom(this.uuid, "year"));

        let tArray = ["T-Shirt Delivered", "T-Shirt Not Delivered"];
        let deliveredT = newSelectElem(getId(this.uuid, "editdelivered"),
            tArray, getValFrom(this.uuid, "delivered") == "X" ? "T-Shirt Not Delivered" : "T-Shirt Delivered");

        let sizeArray = ['Small', 'Medium', 'Large', 'Extra Large'];
        let tsize = newSelectElem(getId(this.uuid, 'editsize'), sizeArray, formattedSize(getValFrom(this.uuid, 'size')));

        this.elem.appendChild(name);
        this.elem.appendChild(spacer.cloneNode());
        this.elem.appendChild(year);
        this.elem.appendChild(spacer.cloneNode());
        this.elem.appendChild(deliveredT);
        this.elem.appendChild(spacer.cloneNode());
        this.elem.appendChild(tsize);

        return this.elem;
    }
}

class EditAddressEntryElement extends EntryElement
{
    createEntryElement()
    {
        let spacer = newElem('spacer');
        this.elem = newElem('p');

        let dormArray = ["Primero Grove", "Segundo", "Tercero", "Cuarto", "Off Campus"]
        let dorm = newSelectElem(getId(this.uuid, "editdorm"), dormArray, getValFrom(this.uuid, "dorm"));

        let address = newInputElem('text', getId(this.uuid, "editaddress"));
        address.value = getValFrom(this.uuid, "address");
        address.setAttribute('placeholder', "Wall 122");

        this.elem.appendChild(dorm);
        this.elem.appendChild(spacer.cloneNode());
        this.elem.appendChild(address);

        return this.elem;
    }
}

class EditContactEntryElement extends EntryElement
{
    createEntryElement()
    {
        let spacer = newElem('spacer');
        this.elem = newElem('p');

        let email = newInputElem('text', getId(this.uuid, "editemail"));
        email.value = getValFrom(this.uuid, "email");
        email.setAttribute('placeholder', "email@gmail.com");

        let cell = newInputElem('text', getId(this.uuid, "editcell"));
        cell.value = getValFrom(this.uuid, "cell");
        cell.setAttribute('placeholder', '5805615144');

        let wants = getValFrom(this.uuid, 'wants');
        let bibStudSelected = wants.includes("Bible Study") ? "Wants to join Bible Study" : "Doesn't want to join";
        let bibStudArray = ["Wants to join Bible Study", "Doesn't want to join"];
        let bibStud = newSelectElem(getId(this.uuid, "editbibstud"), bibStudArray, bibStudSelected);

        let fbarray = ["Add to FB", "Don't add to FB"];
        let fbselected = wants.includes("FB") ? "Add to FB" : "Don't add to FB";
        let fb = newSelectElem(getId(this.uuid, "editfb"), fbarray, fbselected);

        this.elem.appendChild(email);
        this.elem.appendChild(spacer.cloneNode());
        this.elem.appendChild(cell);
        this.elem.appendChild(spacer.cloneNode());
        this.elem.appendChild(bibStud);
        this.elem.appendChild(spacer.cloneNode());
        this.elem.appendChild(fb);

        return this.elem;
    }
}

class EditExtrasEntryElement extends EntryElement
{
    createEntryElement()
    {
        let spacer = newElem('spacer');
        this.elem = newElem('p');

        let notes = newInputElem('text', getId(this.uuid, "editnotes"));
        notes.value = getValFrom(this.uuid, "notes").replace("Notes: ", "");
        notes.setAttribute('placeholder', 'Notes...');

        let recruiter = newInputElem('text', getId(this.uuid, "editrecruiter"));
        recruiter.value = getValFrom(this.uuid, "recruiter").replace('Recruiter: ', '');
        recruiter.setAttribute('recruiter', "Recruiter...");

        this.elem.appendChild(notes);
        this.elem.appendChild(spacer.cloneNode());
        this.elem.appendChild(recruiter);

        return this.elem;
    }
}