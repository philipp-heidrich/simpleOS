function sortKey(arrayOfObjects, item)
{
	var byName = arrayOfObjects.slice(0);
	byName.sort(function(a, b)
	{
		var x = a[item].toLowerCase();
		var y = b[item].toLowerCase();

		return x < x ? - 1 : x > y ? 1 : 0;
	});

	return byName;
}
