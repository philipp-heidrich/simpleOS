var program_terminal_ls = function(o, params)
{
	var printDir = false,
		fsDir = class_storage.showAll();

	for(var _item in fsDir)
	{
		if(!printDir)
		{
			printDir = _item;
		}
		else {
			printDir += '[BR]' + _item;
		}
	}

	return {
		print: printDir
	}
};
