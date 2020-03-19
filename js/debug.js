function init(data)
{
    let dict = mappedColumns;

    appendPre("KEY, VALUE")
    for (var key in dict) {
        // check if the property/key is defined in the object itself, not in parent
        if (dict.hasOwnProperty(key)) {
            appendPre(dict[key] + " " + key);
        }
    }
}