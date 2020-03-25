class EntryElement
{
    constructor(row, uuid, entryManager)
    {
        this.entryManager = entryManager;
        this.entryElement = entryManager.entry;
        this.row = row;
        this.uuid = uuid;
        this.elem = null;

        if (this.createEntryElement === undefined) {
            throw new TypeError('Classes extending the entryelement abstract class');
        }

    }

    hookUp(withEntry = false)
    {
        let _this = this;
        this.elem.onclick = function() {
            _this.onClick(this.elem);
        }

        if(withEntry)
        {
            this.entryElement.style.cursor = 'pointer';
            this.entryElement.onclick = function() {
                _this.onClickEntry(this.elem);
            }
        }
    }

    createElem(id)
    {
        let p = document.createElement('p');
        p.id = getId(this.uuid, "p" + id);

        return p;
    }

    onClick() {}

    onClickEntry() {}

    updateStyle(displayType) {}
}
