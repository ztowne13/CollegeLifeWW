const RuleType = {
    WhereFilter: '1',
    NotNullFilter: '2',
    ContainsFilter: '3'
}

class Filterer
{
    constructor(rules)
    {
        this.rules = rules;
    }

    filter(dataRow)
    {
        for(let i = 0; i < this.rules.length; i++)
        {
            if(!this.rules[i].filter(dataRow))
                return false;
        }

        return true;
    }
}

class Filter
{
    constructor(ruleType)
    {
        this.ruleType = ruleType;
    }

    filter(dataRow) {}
}

class WhereFilter extends Filter
{
    constructor(dataColNum, toMatchList)
    {
        super(RuleType.WhereFilter);

        this.dataColNum = dataColNum;
        this.toMatchList = toMatchList;
    }

    filter(dataRow)
    {
        for(let i = 0; i < this.toMatchList.length; i++)
        {
            if(dataRow[this.dataColNum] === undefined)
                continue;

            if(dataRow[this.dataColNum].toLowerCase() == this.toMatchList[i].toLowerCase())
            {
                return true;
            }
        }
        return false;
    }
}

class ContainsFilter extends Filter
{
    constructor(dataColNum, toMatchList)
    {
        super(RuleType.ContainsFilter);

        this.dataColNum = dataColNum;
        this.toMatchList = toMatchList;
    }

    filter(dataRow)
    {
        for(let i = 0; i < this.toMatchList.length; i++)
        {
            if(dataRow[this.dataColNum] === undefined)
                continue;

            if(dataRow[this.dataColNum].toLowerCase().includes(this.toMatchList[i].toLowerCase()))
            {
                return true;
            }
        }
        return false;
    }
}

class NotNullFilter extends Filter
{
    constructor(dataColNums)
    {
        super(RuleType.NotNullFilter);

        this.dataColNums = dataColNums;
    }

    filter(dataRow)
    {
        for(let i = 0; i < this.dataColNums.length; i++)
        {
            let colNum = this.dataColNums[i];
            if(dataRow[colNum] === undefined)
            {
                return false;
            }
        }

        return true;
    }
}



