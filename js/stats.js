function init(data)
{
    let maxLength = 26;
    console.log("DATA: " + data);
    console.log("DATA LEN: " + data.length);

    let peopleEntered = getPeopleEntered(data);
    let tShirtsDelivered = getTShirtsDelivered(data);

    document.getElementById('entered').innerText = peopleEntered;
    document.getElementById('delivered').innerText = tShirtsDelivered;
    document.getElementById('tobedelivered').innerText = peopleEntered - tShirtsDelivered;

    let elements = [
        ElementTypes.Stat
    ]
    //document.getElementById('recruit').innerText = getPeopleStats(data);
    let entryHandler = new EntryHandler('', DisplayType.Stat, 'entries', elements);
    let peopleStats = getPeopleStats(data);
    for(let i = 0; i < peopleStats.length; i++)
    {
        let peopleStat = peopleStats[i];
        entryHandler.addEntry(peopleStat, -1);
    }
}

function getTShirtsDelivered(data)
{
    let count = 0;

    for(i = 0; i < data.length; i++)
    {
        let val = data[i][getTShirtIndex()];
        if(isDefined(val) && val == "TRUE")
            count++;
    }
    return count;
}

function getPeopleEntered(data)
{
    let count = 0;

    for(i = 0; i < data.length; i++)
    {
        let val = data[i][getFirstNameIndex()];
        if(isDefined(val) && val != "")
            count++;
    }

    return count;
}

function getPeopleStats(data) {
    let dict = {};
    let info = []

    for(let i = 0; i < data.length; i++)
    {
        let row = data[i];
        let recruiterVal = row[getRecruiterIndex()];

        if(!isDefined(recruiterVal) || recruiterVal == "")
            continue;

        recruiterVal = recruiterVal.replace("and", ",");
        recruiterVal = recruiterVal.replace("+", ",");
        recruiterVal = recruiterVal.replace(/\s/g, "");
        recruiterVal = recruiterVal.replace(".", "");
        recruiterVal = recruiterVal.replace("/", ",");

        let recruiters = recruiterVal.toLowerCase().split(",");
        for(let j = 0; j < recruiters.length; j++)
        {
            let recruiter = recruiters[j];
            if(recruiter in dict)
                dict[recruiter] = dict[recruiter] + 1;
            else
                dict[recruiter] = 1;
        }
    }
    //recruiter: num
    let formatted = "";
    let lastBestKey;
    let lastBestAmnt;

    let count = 1;

    while(true)
    {
        lastBestKey = "";
        lastBestAmnt = -1
        for(let key in dict)
        {
            let amnt = dict[key];
            if(amnt > lastBestAmnt) {
                lastBestKey = key;
                lastBestAmnt = amnt;
            }
        }

        if(lastBestAmnt == -1)
            break;

        info.push([lastBestKey, lastBestAmnt]);
        formatted = formatted + count + ". " + lastBestKey + " - " + lastBestAmnt + "\n";
        dict[lastBestKey] = -1;
        count++;
    }

    return info;
    // return formatted;
}