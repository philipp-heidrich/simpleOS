var programm_explorer = function(fullscreen)
{
	// Create global object
	var o = {
		AUTHOR: 'Philipp Heidrich',
		VERSION: 3
	};

	// Create window
	o.progObj = program.startWindow('explorer', 'Explorer', fullscreen);

	// Get HTML
	o.obj = {
		explorer_content: o.progObj.content,
		explorer_show: o.progObj.content.querySelector('.explorer__show'),
		explorer_templ: o.progObj.content.querySelector('.explorer__data'),
		explorer_path: o.progObj.content.querySelector('.explorer__path')
	}


	// Show current content
	showContent();
	showPath();

	// Add global click events
	setWindowEvents();





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
		var allDatas = class_storage.showAll();

		// Sort datas
		allDatas = sortDatas(allDatas, 'ASC');

		// Loop all files
		for(var _data in allDatas)
		{
			(function(_data, allDatas)
			{
				var _content = allDatas[_data];

				// Clone node
				var _node = o.obj.explorer_templ.cloneNode(true);
				o.obj.explorer_show.appendChild(_node);

				// Get html objects
				var _obj_name = _node.querySelector('.explorer__dataName'),
					_obj_icon = _node.querySelector('.explorer__icon')

				// Print name
				_obj_name.innerHTML = _content.name;

				// Create icon
				var _icon = document.createElement('i');
				_icon.className = 'material-icons';
				_obj_icon.appendChild(_icon);

				// Check if this a file
				if(_content.type == 'dir')
				{
					_node.className += ' explorer__dir';
					_icon.innerHTML = 'folder';
				}

				// Check if this a dir
				else if(_content.type == 'file')
				{
					_node.className += ' explorer__file';
					_icon.innerHTML = 'insert_drive_file';
				}

				// Add click event
				_node.addEventListener('click', function()
				{
					selectThisData(this);
				});

			}).call(this, _data, allDatas);
		}
	}


	/**
	 *	Show explorer path
	 */
	function showPath()
	{
		// Show display path
		var path = class_storage.getSplitPath(class_storage.getCurrentRealPath());

		for(var i in path)
		{
			var li = document.createElement('li');
			li.className = 'explorer__pathitem';
			li.innerHTML = path[i];
			o.obj.explorer_path.appendChild(li);

			var icon = document.createElement('i');
			icon.innerHTML = 'keyboard_arrow_right';
			icon.className = 'explorer__pathicon material-icons';
			li.appendChild(icon);
		}
	}


	/**
	 *	Select this data
	 */
	function selectThisData(obj)
	{
		// Delete selection
		deselectThisData();

		// Set new selection
		o.isSelected = obj;
		o.disabledGlobalClick = true;

		obj.className += ' explorer__data--selected';
	}


	/**
	 *	Deselect this data
	 */
	function deselectThisData()
	{
		if(o.isSelected)
		{
			o.isSelected.className = o.isSelected.className.replace(' explorer__data--selected', '');
			o.isSelected = false;
		}
	}


	/**
	 *	Add global window events
	 */
	function setWindowEvents()
	{
		o.obj.explorer_content.addEventListener('click', function(event)
		{
			var obj 			= event.target,
				clickObjParent 	= hasParent('.explorer__data', obj, true);

			// Remove selection
			if(
				o.isSelected &&
				!o.disabledGlobalClick &&
				clickObjParent != o.isSelected
			)
			{
				deselectThisData();
			}
			else if(o.disabledGlobalClick)
			{
				o.disabledGlobalClick = false;
			}
		});
	}


	/**
	 *	Sort files
	 */
	function sortDatas(object, sortyType)
	{
		if(sortyType) return sortDatasByAsc(object);
	}


	/**
	 *	Sort datas by ASC
	 */
	function sortDatasByAsc(object)
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
};
