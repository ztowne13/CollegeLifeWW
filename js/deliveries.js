const DORM_CHOOSER_COLOR = '#7dbaff';

function init(data)
{
    cachedData = data;

    let elements = [
        ElementTypes.Text
    ];

    this.dormChooser = new EntryHandler('', DisplayType.Button, 'entries-dorm', elements);
    this.rows = [];
    createDormChooser(data);
}

function createDormChooser(data)
{
    let options = [
        'Primero Grove (' + countMatches(data, [getDormIndex()], ['Primero Grove']) + ")",
        'Segundo (' + countMatches(data, [getDormIndex()], ['Segundo']) + ")",
        'Tercero (' + countMatches(data, [getDormIndex()], ['Tercero']) + ")",
        'Cuarto (' + countMatches(data, [getDormIndex()], ['Cuarto']) + ")",
        'Off Campus ('  + countMatches(data, [getDormIndex()], ['Off Campus']) + ")"
    ];

    for(let i = 0; i < options.length; i++)
    {
        let option = options[i];
        this.dormChooser.addEntry([option, DORM_CHOOSER_COLOR], -1);
    }
}

function updatePossibleBuildings(data)
{
    console.log("UPDATE BUILDINGS");
    let elements = [
        ElementTypes.Text,
        ElementTypes.Reassign
    ];

    let selected = [];
    for(let i = 0; i < this.dormChooser.entryManagers.length; i++)
    {
        let entryManager = this.dormChooser.entryManagers[i];
        if(entryManager.activated)
            selected.push(entryManager.entryElements[0].row[0].split(" (")[0]);
    }

    let rules = [
        new NotNullFilter([getDormIndex(), getAddressIndex()]),
        new WhereFilter(getTShirtIndex(), ['FALSE']),
        new WhereFilter(getDormIndex(), selected)
    ];

    let entryHandler = new EntryHandler('', DisplayType.Button, 'entries-building', elements);
    entryHandler.entriesElement.innerText = '';

    let possibleBuildings = [];

    let filterer = new Filterer(rules);

    for(let i = 1; i < data.length; i++)
    {
        if(filterer.filter(data[i]))
        {
            let address = data[i][getAddressIndex()];

            if(address === undefined || address == '')
                continue;

            let chopped = data[i][getDormIndex()] == 'Off Campus' ? address : address.split(' ')[0].toLowerCase();
            if(!possibleBuildings.includes(chopped)) {
                possibleBuildings.push(chopped);
            }
        }
    }

    for(let i = 0; i < possibleBuildings.length; i++)
    {
        let upperCased = possibleBuildings[i][0].toUpperCase() + possibleBuildings[i].substring(1)

        let plusCount = upperCased + " (" + countMatches(data, [getAddressIndex()], [upperCased]) + ")";
        entryHandler.addEntry([plusCount], -1);
    }
}

function countMatches(data, indexes, toMatches)
{
    let count = 0;

    let filterers = [];

    for(let i = 0; i < indexes.length; i++) {
        let rules = [
            new ContainsFilter(indexes[i], [toMatches[i]]),
            new WhereFilter(getTShirtIndex(), ['FALSE'])
        ];

        filterers.push(new Filterer(rules));
    }


    for (let i = 0; i < data.length; i++)
    {
        let success = false;

        for(let j = 0; j < indexes.length; j++) {
            if (filterers[j].filter(data[i])) {
                success = true;
            }
            else
            {
                success = false;
                break;
            }
        }

        if(success)
            count++;
    }
    return count;
}