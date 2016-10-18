(function()
{
	this.class_storage = {
		AUTHOR: 'Philipp Heidrich'
	}


	// New file object
	var newFile = function(id, file, kind, content)
	{
		var file = {
			'id': id,
			'name': file,
			'type': 'file',
			'content': content
		}

		if(kind)
			file.kind = kind;

		// Return the new file
		return file;
	}






	/**
	 *
	 *	Boot functions
	 *
	 */

	 /**
 	 *	Start login boot
 	 */
 	class_storage.boot = function()
 	{
 		// Show message
 		boot.printBootMessage('Load storage');

		// Lade HTML
		boot.printBootMessage('&#10142; load filesystem');
		loadFilesystem();

		boot.printBootMessage('<br>');
 	}




	/**
	 *
	 *	Public functions
	 *
	 */

	/**
	 *	Show current real path
	 */
	class_storage.getCurrentRealPath = function(currentPath)
 	{
 		var path = currentPath;

		// Replace ~ with the real path
		path = path.replace('~', '/home/' + class_user.getCurrentUser());

		return path;
 	}


	/**
	 *	Create a dir - mkdir
	 */
	class_storage.createDir = function(path)
	{
		var path 		= class_storage.getSplitPath(path),
			name 		= path.pop(),
			id 			= convertNameToId(name),
			foundPath 	= class_storage.fs,
			isFound 	= false;

		for(var _item in path)
		{
			var _dir = path[_item],
				_id = convertNameToId(_dir);

			for(var _searchItem in foundPath)
			{
				if(
					foundPath[_searchItem].type == 'dir' &&
					foundPath[_searchItem].id == _id
				)
				{
					isFound = true;
					foundPath = foundPath[_searchItem].childs;

					break;
				}
				else
				{
					isFound = false;
				}
			}
		}

		// Check if this a valid path to the dir
		if(isFound)
		{
			var foundItem = false;

			// Check if exists a dir
			for(var _item in foundPath)
			{
				if(foundPath[_item].id == id)
				{
					foundItem = true;
					break;
				}
			}

			if(!foundItem)
			{
				// Create new dir
				foundPath.push({
					'name': name,
					'id': id,
					'type': 'dir',
					'childs': []
				});

				// Save filesystem
				saveFileSystem();

				return true;
			}
		}

		return false;
	}


	/**
	 *	Create new file
	 */
	class_storage.createFile = function(path, file, kind, content)
	{
		var splitPath 	= class_storage.getSplitPath(path),
			dirObj 		= getDir(splitPath),
			id 			= convertNameToId(file);

		if(dirObj)
		{
			var foundItem = false;

			// Check if exists a dir
			for(var _item in dirObj)
			{
				if(
					dirObj[_item].id == id &&
					dirObj[_item].type == 'file'
				)
				{
					foundItem = true;
					break;
				}
			}

			if(!foundItem)
			{
				// Push this in the filesystem
				dirObj.push(new newFile(id, file, kind, content));

				// Save filesystem
				saveFileSystem();

				return true;
			}
		}

		return false;
	}


	/**
	 *	Append content to file
	 */
	class_storage.appendContent = function(path, content)
	{
		var splitPath = class_storage.getSplitPath(path),
			dirObj = getFile(splitPath);

		if(dirObj)
		{
			dirObj.content += content;

			saveFileSystem();

			return true;
		}

		return false;
	}



	/**
	 *	Show all files
	 */
	class_storage.showAll = function(path)
	{
		var splitPath = class_storage.getSplitPath(path),
			dirContent = getDir(splitPath);

		return dirContent;
	}


	/**
	 *	Split path
	 */
	class_storage.getSplitPath = function(path)
	{
		var returnSplitPath = [];

		// Check if the first character ~
		if(path[0] == '~')
		{
			path = path.replace('~', '/home/' + class_user.getCurrentUser());
		}

		if(path[0] !== '/')
		{
			path = class_storage.currentPath + path;
		}

		// Check if this not root
		if(path !== '/')
		{
			returnSplitPath = path.split('/');

			// Replace the first item
			if(returnSplitPath[0] == '')
			{
				returnSplitPath.shift();
			}
		}

		return returnSplitPath;
	}










	/**
	 *
	 *	Private functions
	 *
	 */

	/**
	 *	Get the dir
	 */
	function getDir(dirArray)
	{
		var foundPath = class_storage.fs,
			isFound = false;

		if(!dirArray.length)
		{
			isFound = true;
		}
		else {
			for(var _item in dirArray)
			{
				var _dir = dirArray[_item],
					_id = convertNameToId(_dir);

				for(var _searchItem in foundPath)
				{
					if(
						foundPath[_searchItem] &&
						foundPath[_searchItem].type == 'dir' &&
						foundPath[_searchItem].id == _id &&
						foundPath[_searchItem].childs
					)
					{
						isFound = true;
						foundPath = foundPath[_searchItem].childs;

						break;
					}
					else
					{
						isFound = false;
					}
				}
			}
		}

		// Check have this element a dir
		if(isFound)
		{
			return foundPath;
		}
		else {
			return false;
		}
	}


	/**
	 *	Get file
	 */
	function getFile(pathArray)
	{
		var foundPath = class_storage.fs,
			isDirFound = false;

		var path = pathArray,
			file = path.pop();

		for(var _item in path)
		{
			var _dir = path[_item];

			alert('TODO');

			if(
				foundPath[_dir] &&
				foundPath[_dir].type == 'dir'
			)
			{
				foundPath = foundPath[_dir];
				isDirFound = true;
			}
			else {
				break;
			}
		}

		// Check if the dir found
		if(
			isDirFound &&
			foundPath.childs &&
			foundPath.childs[file]
		)
		{
			return foundPath.childs[file];
		}

		return false;
	}


	/**
	 *	Load options
	 */
	function loadFilesystem()
	{
		class_storage.fs = option.load('storage_filesys');
	}


	/**
	 *	Save fs
	 */
	function saveFileSystem()
	{
		option.save('storage_filesys', class_storage.fs);
	}


	/**
	 *	Convert name to id
	 */
	function convertNameToId(name)
	{
		name = name.replace(/ /g, '_');

		return name;
	}



}).call(this);
