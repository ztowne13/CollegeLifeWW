class DormReassignEntryElement extends TextButtonEntryElement
{
    constructor(text, elementType, fullName, row, uuid, entryManager) {
        super(text, elementType, row, uuid, entryManager);
        this.fullName = fullName;
    }

    onClick()
    {
        let _this = this;
        loadData(function(data) {_this.complete(data)});
    }

    complete(data)
    {
        let existingInnerText = this.entryManager.previousEntryManager.entryElements[0].elem.innerHTML.split(" (")[0];

        let rules = [
            new NotNullFilter([getAddressIndex()]),
            new ContainsFilter([getAddressIndex()], [existingInnerText])
        ];

        let filterer = new Filterer(rules);

        this.toReassign = 0;
        this.reassigned = 0;

        for(let i = 1; i < data.length; i++)
        {
            if(filterer.filter(data[i])) {
                let newArray = createUpdateArray(data[i]);
                newArray[getDormIndex()] = this.fullName;

                this.toReassign++;

                let rowNum = i+1;

                let _this = this;
                console.log("Updating row: " + data[i]);
                makeApiCall_overwriteUpdate("A" + rowNum + ":Z" + rowNum, newArray, function(data) {_this.reassignComplete(data)});
            }
        }
    }

    reassignComplete(data)
    {
        this.reassigned++;
        this.toReassign--;
        console.log("Reassigned, " + this.toReassign + " left.");
        if(this.toReassign == 0)
        {
            console.log("Done reassigning: " + this.reassigned);
            cachedData = data;
            updatePossibleBuildings(data);
        }
    }
}

class PrimeroReassignEntryElement extends DormReassignEntryElement
{
    constructor(row, uuid, entryManager) {
        super('P', 'changer', 'Primero Grove', row, uuid, entryManager);
    }
}

class SegundoReassignEntryElement extends DormReassignEntryElement
{
    constructor(row, uuid, entryManager) {
        super('S', 'changer', 'Segundo', row, uuid, entryManager);
    }
}

class TerceroReassignEntryElement extends DormReassignEntryElement
{
    constructor(row, uuid, entryManager) {
        super('T', 'changer', 'Tercero', row, uuid, entryManager);
    }
}

class CuartoReassignEntryElement extends DormReassignEntryElement
{
    constructor(row, uuid, entryManager) {
        super('C', 'changer', 'Cuarto', row, uuid, entryManager);
    }
}

class OffCampusReassignEntryElement extends DormReassignEntryElement
{
    constructor(row, uuid, entryManager) {
        super('O', 'changer', 'Off Campus', row, uuid, entryManager);
    }
}

class ReturnReassignEntryElement extends TextButtonEntryElement
{
    constructor(row, uuid, entryManager) {
        super('✖', 'back', row, uuid, entryManager);
    }

    onClick() {
        updatePossibleBuildings(cachedData);
    }
}

class ReassignEntryElement extends TextButtonEntryElement
{
    constructor(row, uuid, entryManager)
    {
        super('✎', 'edit', row, uuid, entryManager, false);
    }

    onClick() {
        this.entryManager.blockEntryClick = true;

        let id = this.elem.id;
        let uuid = getUuidFromId(id);

        this.entryManager.entry.style.display = 'none';

        let elements = [
            ElementTypes.ReassignReturn,
            ElementTypes.ReassignOffCampus,
            ElementTypes.ReassignCuarto,
            ElementTypes.ReassignTercero,
            ElementTypes.ReassignSegundo,
            ElementTypes.ReassignPrimero
        ];

        let entryHandler = new EntryHandler('reassigning', DisplayType.Button, 'entries-building', elements);

        let rowNum = id.split(".")[1];
        let entryManager = entryHandler.addEntryBefore(this.row, rowNum, uuid, this.entryManager.entry);
        entryManager.previousEntryManager = this.entryManager;
    }

    updateStyle(displayType) {
        this.elem.style.paddingTop = '5px';
        this.elem.style.paddingBottom = '5px';
    }
}