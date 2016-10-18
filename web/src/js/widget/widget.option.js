(function()
{
	this.option = {
		AUTHOR: 'Philipp Heidrich'
	}

	option.globalParam = "wos";


	/**
	 *	Hole default Wert
	 */
	option.getDefault = function(lsItem)
	{
		var defaultItem = null;

		switch(lsItem)
		{
			// User
			case option.globalParam + '_account_status':
				defaultItem = 'pwd';
				break;

			// Users
			case option.globalParam + '_account_users':
				defaultItem = {};
				break

			// Filesystem
			case option.globalParam + '_storage_filesys':
				defaultItem = [{
					"name": "home",
					"id": "home",
					"type": "dir",
					"childs": []
				}, {
					"name": "etc",
					"id": "etc",
					"type": "dir",
					"childs": []
				}, {
					"name": "var",
					"id": "var",
					"type": "dir",
					"childs": []
				}]
		}

		// Gebe default Wert zurück
		return defaultItem;
	}

	// Funktion für das laden von Optionen
	option.load = function(item)
	{
		var defaultItem = null,
			lsItem 		= option.globalParam + '_' + item;

		// Versuche Objeckt aus dem LS zu holen
		var returnValue = localStorage.getItem(lsItem);

		if(returnValue)
		{
			returnValue = JSON.parse(returnValue);
		}
		else
		{
			var defaultItem = option.getDefault(lsItem);

			// Speichere neuen Wert in den LS
			// wenn es einen Defaultwert gibt
			if(defaultItem !== null)
			{
				option.save(item, defaultItem);

				// Übernehme default Wert
				returnValue = defaultItem;
			}
		}

		return returnValue;
	}

	// Funktion für das Speichern von Optionen
	option.save = function(type, value)
	{
		try
		{
			var saveJSON = JSON.stringify(value);
		}
		catch(error)
		{
			var saveJSON = option.getDefault(type);
		}

		localStorage.setItem(option.globalParam + '_' + type, saveJSON);
	}

	/**
	 *	Füge Option mit ein
	 **/
	option.insert = function(_id, inputObj)
	{
		// Lade Option
		var _option = option.load(_id);

		// Prüfe was es für ein Element ist
		if(Array.isArray(_option))
		{
			if(Array.isArray(inputObj))
			{
				_option.concat(inputObj);
			}
			else {
				_option.push(inputObj);
			}
		}
		else if(typeof _option == 'object')
		{
			for(var _item in inputObj)
			{
				_option[_item] = inputObj[_item];
			}
		}
		else if(typeof _option == 'string')
		{
			_option = _option + inputObj;
		}

		// Speichern
		option.save(_id, _option);

		// Rückgabe vom Objeckt
		return _option;
	}



	// Exportiert Einstellungen
	option.export = function()
	{
		return JSON.stringify(localStorage);
	}

	// Importiert Einstellungen
	option.import = function(option)
	{
		var importObj = JSON.parse(option);

		for(var _obj in importObj)
		{
			// Prüfen ob es eine Calm Einstellung ist
			if(_obj.match(option.globalParam))
			{
				localStorage.setItem(_obj, importObj[_obj]);
			}
		}
	}

}).call(this);
