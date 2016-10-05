(function()
{
	this.dynbox = {
		AUTHOR: 'Philipp Heidrich',
		VERSION: 2
	}


	/**
	 *	Initalscript
	 */
	dynbox.init = function(obj)
	{
		this.dynObj_obj = obj;

		// Erstelle Objeckte
		dynbox.createElm(this);

		// Event erstellen
		dynbox.addEvent(this);
	}



	/**
	 *	Objeckte erstellen
	 */
	dynbox.createElm = function(o)
	{
		o.dynObj_obj.setAttribute('spellcheck', 'false');
		o.dynObj_obj.setAttribute('autocomplete', 'off');
		o.dynObj_obj.setAttribute('autocorrect', 'off');
		o.dynObj_obj.setAttribute('autocapitalize', 'off');
		o.dynObj_obj.style.overflowY = 'hidden';

		// Erstelle Pointerbox
		o.dynObj_pointer = document.createElement('div');
		o.dynObj_pointer.className = "dynbox__pointer";
		o.dynObj_pointer.style.top = 0;
		o.dynObj_pointer.style.left = 0;
		o.dynObj_pointer.style.opacity = 0;
		o.dynObj_pointer.style.zIndex = 0;
		o.dynObj_pointer.style.position = 'absolute';
		o.dynObj_obj.parentNode.appendChild(o.dynObj_pointer);
	}


	/**
	 *	Auslesen der Länge der Textarea
	 */
	dynbox.checkBoxLength = function(o)
	{
		var _value = o.dynObj_obj.value;

		// Tausche Zeilenumbrüche aus
		_value = _value.replace(/\n/g, "<br>");

		// Übergebe Inhalt von der Textarea an das Poiter Element
		o.dynObj_pointer.innerHTML = _value;

		// Hole die aktuelle Größe des Elementes
		var _height = o.dynObj_pointer.offsetHeight

		// Speichere Sie auf das neue Element
		o.dynObj_obj.style.minHeight = (_height + 30) + 'px';
	}


	/**
	 *	Event erstellen
	 */
	dynbox.addEvent = function(obj)
	{
		obj.dynObj_obj.addEventListener('keyup', function()
		{
			dynbox.checkBoxLength(obj);
		});
	}

}).call(this);
