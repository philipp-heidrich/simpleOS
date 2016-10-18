var program_terminal_ls = function(o, params)
{
	var printDir = false,
		fsDir = class_storage.showAll(o.currentPath);

	for(var _item in fsDir)
	{
		if(!printDir)
		{
			printDir = fsDir[_item].name;
		}
		else {
			printDir += '[BR]' + fsDir[_item].name;
		}
	}

	return {
		print: printDir
	}
};
