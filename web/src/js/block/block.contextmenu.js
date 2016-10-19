(function()
{
	// Global context variable
	this.contextmenu = {
		AUTHOR: 'Philipp Heidrich',
		VERSION: 1
	}

	// Global context push array
	contextmenu.array = [];




	/**
	 *
	 *	Public functions
	 *
	 */

	/**
	 *	Insert in context array
	 */
	contextmenu.insert = function(obj)
	{
		contextmenu.array.push(obj);
	}


	/**
	 *	Close contextmenu
	 */
	contextmenu.close = function()
	{
		if(contextmenu.isUsed)
		{
			// Set used variable to false
			contextmenu.isUsed = false;

			// Delete html object
			contextmenu.cm_layer.parentNode.removeChild(contextmenu.cm_layer);
		}
	}





	/**
	 *
	 *	Private functions
	 *
	 */

	/**
	 *	Check if found this contextmenu entry
	 */
	function checkValidMenu(position, clickObj)
	{
		var newOutputArray = [];

		if(contextmenu.isUsed) contextmenu.close();

		// Check if this element found
		for(var i in contextmenu.array)
		{
			var _insertMenu = contextmenu.array[i],
				allFoundElem = document.querySelectorAll(_insertMenu.obj);

			if(_insertMenu.beCorrent())
			{
				for(var e = 0; e < allFoundElem.length; e++)
				{
					if(
						_insertMenu.findParent && hasParent(_insertMenu.obj, clickObj) ||
						allFoundElem[e] == clickObj
					)
					{
						newOutputArray.push(_insertMenu);
						break;
					}
				}
			}
		}

		if(newOutputArray.length)
		{
			createContextElm(position, newOutputArray);
		}
	}


	/**
	 *	Create contextmenu element
	 */
	function createContextElm(position, newOutputArray)
	{
		// Set used variable to true
		contextmenu.isUsed = true;

		// Create elements
		contextmenu.cm_layer = document.createElement('div');
		contextmenu.cm_layer.className = 'contextmenu';

		contextmenu.cm_list = document.createElement('ul');
		contextmenu.cm_list.className = 'contextmenu__list';
		contextmenu.cm_layer.appendChild(contextmenu.cm_list);

		// Create list element
		for(var _insert in newOutputArray)
		{
			var insertObj = newOutputArray[_insert];

			if(
				insertObj.childs &&
				insertObj.childs.length
			)
			{
				for(var i in insertObj.childs)
				{
					createListPoints(insertObj.childs[i]);
				}
			}
		}

		// Insert element
		document.body.appendChild(contextmenu.cm_layer);

		// Set new contextmenu position
		setNewPosition(position);
	}


	/**
	 *	Create list point
	 */
	function createListPoints(obj)
	{
		// Create Elements
		var obj_li = document.createElement('li');
		obj_li.className = 'contextmenu__point';
		contextmenu.cm_list.appendChild(obj_li);

		// Click event
		if(obj.click)
		{
			(function(callback)
			{
				this.onclick = function()
				{
					explorer.disabledRemoveSelection = true;
					explorer.disabledRenameTmpl = true;
					program.disableClickEvent = true;

					// Run callback
					callback();

					// Close contextmenu
					contextmenu.close();
				}
			}).call(obj_li, obj.click);
		}

		// Icon
		if(obj.icon)
		{
			var obj_icon = document.createElement('div');
			obj_icon.className = 'contextmenu__icon material-icons contextmenu__icon--' + obj.icon;
			obj_icon.innerHTML = obj.icon;
			obj_li.appendChild(obj_icon);
		}

		var obj_name = document.createElement('div');
		obj_name.className = 'contextmenu__value';
		obj_name.innerHTML = obj.value
		obj_li.appendChild(obj_name);
	}


	/**
	 *	Check if this a valid position for the contextmenu
	 */
	function setNewPosition(position)
	{
		var content = {
			x: contextmenu.cm_layer.offsetWidth,
			y: contextmenu.cm_layer.offsetHeight
		}

		var site = {
			x: document.documentElement.offsetWidth,
			y: document.documentElement.offsetHeight
		}

		// Check x
		if(site.x - content.x - position.x < 0)
		{
			contextmenu.cm_layer.style.right = '0px';
		}
		else
		{
			contextmenu.cm_layer.style.left = position.x + 'px';
		}

		// Check y
		if(site.y - content.y - position.y < 0)
		{
			contextmenu.cm_layer.style.bottom = '0px';
		}
		else
		{
			contextmenu.cm_layer.style.top = position.y + 'px';
		}
	}






	/**
	 *	Events
	 */

	/**
	 *	Global contextmenu event
	 */
	document.addEventListener('contextmenu', function(event)
	{
		var position = {
			x: event.clientX,
			y: event.clientY
		}

		// Create contextmenu
		checkValidMenu(position, event.target);

		// Stop event
		event.preventDefault();
	});

	/**
	 *	Global click event
	 */
	document.addEventListener('click', function(event)
	{
		if(!hasParent('.contextmenu', event.target))
		{
			contextmenu.close();
		}
	});

}).call(this);
