class EntryElement
{
    constructor(row, uuid)
    {
        this.row = row;
        this.uuid = uuid;
        this.elem = null;

        if (this.createEntryElement === undefined) {
            throw new TypeError('Classes extending the entryelement abstract class');
        }

    }

    hookUp()
    {
        let _this = this;
        this.elem.onclick = function() {
            _this.onClick(this.elem);
        }
    }

    createElem(id)
    {
        let p = document.createElement('p');
        p.id = getId(this.uuid, "p" + id);

        return p;
    }

    onClick() {}

    updateStyle(displayType) {}
}
