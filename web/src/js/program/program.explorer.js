(function()
{
	this.explorer = {
		AUTHOR: 'Philipp Heidrich',
		VERSION: 4
	}


	/**
	 *	Add desktop contextmenu to block.contextmenu.js
	 */
	contextmenu.insert({
		obj: '.explorer__show',
		childs: [{
			value: 'Create new folder',
			icon: 'folder',
			click: function()
			{
				explorer.createDirLayer();
			}
		}]
	});





	/**
	 *
	 *	Public functions
	 *
	 */

	/**
 	 *	Create new dir @TODO
 	 */
 // 	explorer.createDirLayer = function()
 // 	{
	// 	if(program.selected)
	// 	{
	// 		var explorerWindow = program.list[program.selected];
	//
	// 		if(
	// 			explorerWindow.id_program &&
	// 			explorerWindow.id_program == 'explorer' &&
	// 			!explorer.isNewData
	// 		)
	// 		{
	// 			var obj_content = explorerWindow.content,
	// 				obj_show = obj_content.querySelector('.explorer__show');
	//
	// 			var node = explorer.createData(null, 'dir');
	// 			obj_show.appendChild(node);
	//
	// 			return true;
	// 		}
	// 	}
	//
	// 	return false;
 // 	}


	/**
	 *	Create Data
	 */
	explorer.createData = function(dataObj)
	{
		// Create new data object
		var returnObj = {
			id: dataObj.name,
			name: dataObj.name
		};

		returnObj.obj_node = document.querySelector('#hiddenTemplate > .explorer__data').cloneNode(true);
		returnObj.obj_node.onclick = function()
		{
			(function(returnObj)
			{
				explorer.selectThisData(returnObj);

			}).call(null, returnObj);
		}

		// Get html objects
		returnObj.obj_name = returnObj.obj_node.querySelector('.explorer__dataName');
		returnObj.obj_icon = returnObj.obj_node.querySelector('.explorer__icon');
		returnObj.obj_renameInput = returnObj.obj_node.querySelector('.explorer__renameinput');

		// Print name
		returnObj.obj_name.innerHTML = dataObj.name;

		// Print kind of file
		if(dataObj.type == 'file' && dataObj.kind)
		{
			returnObj.obj_name.innerHTML += '.' + dataObj.kind;
		}

		// Create icon
		var _icon = document.createElement('i');
		_icon.className = 'material-icons';
		returnObj.obj_icon.appendChild(_icon);

		// Check if this a file
		if(dataObj.type == 'dir')
		{
			returnObj.obj_node.className += ' explorer__dir';
			_icon.innerHTML = 'folder';
		}

		// Check if this a dir
		else if(dataObj.type == 'file')
		{
			returnObj.obj_node.className += ' explorer__file';
			_icon.innerHTML = 'insert_drive_file';
		}

		return returnObj;
	}


	/**
	 *	Select this data
	 */
	explorer.selectThisData = function(content)
	{
		// Delete selection
		explorer.removeThisData();

		// Save selection
		explorer.isSelected = content;

		// Add class name
		content.obj_node.className += ' explorer__data--selected';
	}


	/**
	 *	Deselect this data
	 */
	explorer.removeThisData = function()
	{
		if(explorer.isSelected)
		{
			var obj = explorer.isSelected.obj_node;

			obj.className = obj.className.replace(' explorer__data--selected', '');
			obj = false;
		}
	}


	/**
	 *	Sort files
	 */
	explorer.sortDatas = function(object, sortyType)
	{
		if(sortyType) return explorer.sortDatasByAsc(object);
	}


	/**
	 *	Sort datas by ASC
	 */
	explorer.sortDatasByAsc = function(object)
	{
		var dirs = [],
			files = [];

		for(var data in object)
		{
			var _data = object[data];

			if(_data.type == 'dir')
			{
				dirs.push(_data);
			}
			else if(_data.type == 'file')
			{
				files.push(_data);
			}
		}

		dirs = sortKey(dirs, 'name');
		files = sortKey(files, 'name');

		return dirs.concat(files);
	}


	/**
	 *	Show rename field
	 */
	explorer.showRename = function()
	{
		if(
			explorer.isSelected &&
			!explorer.isRename
		)
		{
			var obj = explorer.isSelected;

			// Set used rename
			explorer.isRename = explorer.isSelected;

			// Add class name
			obj.obj_node.className += ' explorer__data--rename';

			// Insert name value
			obj.obj_renameInput.value = explorer.isSelected.name;
			obj.obj_renameInput.select();
		}
	}


	/**
	 *	Hide rename field
	 */
	explorer.hideRename = function()
	{
		if(explorer.isRename)
		{
			var obj = explorer.isRename;

			// Add class name
			obj.obj_node.className = obj.obj_node.className.replace(' explorer__data--rename', '');

			// Remove rename selection
			explorer.isRename = false;
		}
	}


	/**
	 *	Save new data name
	 */
	explorer.saveNewPath = function()
	{
		if(explorer.isRename)
		{
			var obj = explorer.isRename,
				old_name = obj.obj_name.innerHTML,
				new_name = obj.obj_renameInput.value;

			var layer = program.getSelectedWindow().layer,
				o = layer.explorer,
				currentPath = o.currentPath;

			// Rename on fs
			class_storage.renameDir(currentPath, old_name, new_name);

			// Rename name event
			obj.obj_name.innerHTML = new_name;
		}
	}





	/**
	 *
	 *	Events
	 *
	 */

	document.addEventListener('click', function(event)
	{
		// Remove selection
		if(
			explorer.isSelected &&
			!hasParent('.explorer__data', event.target)
		)
		{
			explorer.removeThisData();
		}

		// Remove rename
		if(
			explorer.isSelected &&
			explorer.isRename &&
			!hasParent('.explorer__data--rename', event.target)
		)
		{
			explorer.saveNewPath();
			explorer.hideRename();
		}
	});

	document.addEventListener('keydown', function(event)
	{
		var key = event.keyCode;

		if(program.getSelectedWindow().id_program == 'explorer')
		{
			// F2
			if(
				key == 113 &&
				explorer.isSelected
			)
			{
				explorer.showRename();
				event.preventDefault();
			}

			// ESC
			if(
				key == 27 &&
				explorer.isSelected &&
				explorer.isRename
			)
			{
				explorer.hideRename();
				event.preventDefault();
			}

			// ENTER
			if(
				key == 13 &&
				explorer.isRename
			)
			{
				// If focus
				if(document.activeElement == explorer.isRename.obj_renameInput)
				{
					explorer.saveNewPath();
					explorer.hideRename();

					event.preventDefault();
				}
			}
		}
	});

}).call(this);






/**
 *	Set a new explorer
 */
var programm_explorer = function(fullscreen)
{
	// Create global object
	var o = {};

	// Create window
	o.progObj = program.startWindow('explorer', 'Explorer', fullscreen);

	// Insert explorer object
	o.progObj.layer.explorer = o;

	// Get HTML
	o.obj = {
		explorer_content: o.progObj.content,
		explorer_show: o.progObj.content.querySelector('.explorer__show'),
		explorer_path: o.progObj.content.querySelector('.explorer__pathlist'),
		explorer_input: o.progObj.content.querySelector('.explorer__pathinput')
	}

	// Current path
	o.currentPath = '~';

	// Show current content
	showContent();
	showPath();



	/**
	 *
	 *	Private functions
	 *
	 **/

	/**
	 *	Clear show content
	 */
	function clearContent()
	{
		o.obj.explorer_show.innerHTML = '';
	}


	/**
	 *	Show current content
	 */
	function showContent()
	{
		// Clear content
		clearContent();

		// Get datas
		var allDatas = class_storage.showAll(o.currentPath);

		// Sort datas
		allDatas = explorer.sortDatas(allDatas, 'ASC');

		// Loop all files
		for(var _data in allDatas)
		{
			(function(_data, allDatas)
			{
				var _content = allDatas[_data];
				var dataObj = explorer.createData(_content);
				dataObj.obj_node.ondblclick = function()
				{
					(function(o)
					{
						if(this.type == 'dir')
						{
							// Save new path
							o.currentPath += (o.currentPath == '/') ? this.name : '/' + this.name;

							// Show new content
							showContent();
							showPath();
						}
					}).call(_content, o);
				};

				o.obj.explorer_show.appendChild(dataObj.obj_node);

			}).call(null, _data, allDatas);
		}
	}


	/**
	 *	Clear explorer path
	 */
	function clearShowPath()
	{
		// Remove input values
		o.obj.explorer_input.value = '';
		o.obj.explorer_path.innerHTML = '';

		// Create home dir
		var li = document.createElement('li');
		li.className = 'explorer__pathitem';
		li.path = '/';
		li.onclick = function()
		{
			// Save new path
			o.currentPath = this.path;

			// Show new content
			showContent();
			showPath();
		}
		o.obj.explorer_path.appendChild(li);

		var home = document.createElement('i');
		home.innerHTML = 'home';
		home.className = 'explorer__pathhome material-icons';
		li.appendChild(home);

		var icon = document.createElement('i');
		icon.innerHTML = 'keyboard_arrow_right';
		icon.className = 'explorer__pathicon material-icons';
		li.appendChild(icon);
	}


	/**
	 *	Show explorer path
	 */
	function showPath()
	{
		var realPath = class_storage.getCurrentRealPath(o.currentPath),
			splitPath = class_storage.getSplitPath(realPath),
			stringPath = '';

		// Clear path
		clearShowPath();

		// Print hidden input field
		o.obj.explorer_input.value = realPath;

		for(var i in splitPath)
		{
			stringPath += '/' + splitPath[i];

			var li = document.createElement('li');
			li.className = 'explorer__pathitem';
			li.innerHTML = splitPath[i];
			li.path = stringPath;
			li.onclick = function()
			{
				// Save new path
				o.currentPath = this.path;

				// Show new content
				showContent();
				showPath();
			}
			o.obj.explorer_path.appendChild(li);

			var icon = document.createElement('i');
			icon.innerHTML = 'keyboard_arrow_right';
			icon.className = 'explorer__pathicon material-icons';
			li.appendChild(icon);
		}
	}
};
