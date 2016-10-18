var program_terminal = function(fullscreen)
{
	// Create global object
	var o = {
		AUTHOR: 'Philipp Heidrich',
		VERSION: 3,
		pressedKeys: []
	};

	// Create window
	o.progObj = program.startWindow('terminal', 'Terminal', fullscreen);

	// Create terminal object
	o.obj = {
		terminal: o.progObj.content,
		ownerArea: o.progObj.content.querySelector('.terminal__ownerArea'),
		inputArea: o.progObj.content.querySelector('.terminal__inputArea'),
		inputField: o.progObj.content.querySelector('.terminal__inputField'),
		input: o.progObj.content.querySelector('.terminal__input'),
		history: o.progObj.content.querySelector('.terminal__history'),
		user: o.progObj.content.querySelector('.terminal__user'),
		placeholder: o.progObj.content.querySelector('.terminal__placeholder')
	}

	// Current path
	o.currentPath = '~';

	// Add events
	addEvent();

	// Add terminal infos
	addTerminalInfo();

	// Add User
	addUserToInput();

	// Set focus
	setFocusToInput();






	/**
	 *
	 *	Private function
	 *
	 */


	/**
	 *	Add events from the program
	 */
	function addEvent()
	{
		// Click event to focus the input field
		o.progObj.content.addEventListener('click', function()
		{
			setFocusToInput();
		});

		// Keypress event
		o.obj.input.addEventListener('keydown', function(event)
		{
			keypressConsole(event);
		});

		// Keypress event
		o.obj.input.addEventListener('keyup', function(event)
		{
			keyupConsole(event);
		});

		// Push resize function
		program.pushResizeFunction(o.progObj.id_counter, function()
		{
			scrollToBottom();
		});

		// Push maximize function
		program.pushMaximizedFunction(o.progObj.id_counter, function()
		{
			scrollToBottom();
		});

		// Push reduce function
		program.pushReduceFunction(o.progObj.id_counter, function()
		{
			scrollToBottom();
		});
	}


	/**
	 *	Add user infos
	 */
	function addUserToInput()
	{
		o.obj.inputField.insertBefore(createOwnerBlock(), o.obj.inputArea);
	}


	/**
	 *	Add terminal info
	 */
	function addTerminalInfo()
	{
		var terminalNote = 'webOS terminal - v.' + o.VERSION + '<br>' +
							'using username "' + class_user.getCurrentUser() + '"<br>' +
							'<br>' +
							'This terminal program is an alpha version. All available commands can you see with "help"';

		printHistory(terminalNote);
	}


	/**
	 *	Set the focus to the input field
	 */
	function setFocusToInput()
	{
		var input = o.obj.input,
			text = getInput();

		input.focus();

		setInput(text);
	}


	/**
	 *	Keypress detection for console inputs
	 */
	function keypressConsole(event)
	{
		var keycode = event.keyCode;

		// Save keypress
		o.pressedKeys[keycode] = true;

		// Key: ENTER
		if(keycode == 13)
		{
			runCode();
			event.preventDefault();
		}

		// Key: CTRL + L
		if(
			o.pressedKeys[17] &&
			keycode == 76
		)
		{
			clearConsole();
			event.preventDefault();
		}

		// Key: CTRL + U
		if(
			o.pressedKeys[17] &&
			keycode == 85
		)
		{
			clearInput();
			event.preventDefault();
		}

		// Key: TAB
		if(keycode == 9)
		{
			tabFiles();
			event.preventDefault();
		}
	}


	/**
	 *	Keyup detection for console inputs
	 */
	function keyupConsole(event)
	{
		var keycode = event.keyCode;

		if(o.pressedKeys[keycode])
		{
			o.pressedKeys[keycode] = false;
		}
	}


	/**
	 *	Run code
	 */
	function runCode()
	{
		var input = o.obj.input,
			commandString = getInput(),
			command = splitCommand(commandString);

		// Print owner
		printOwnerToHisotry();

		// Print command in history
		printHistory(commandString, true);

		if(command.app)
		{
			// Search for a program
			var app = getCommand(command);
			if(app)
			{
				if(app.echo)
				{
					printHistory(app.echo);
				}
				else if(app.run)
				{
					var appReturn = new app.run(o, command.params);

					// Print
					if(appReturn.print)
					{
						printHistory(appReturn.print);
					}
				}
			}

			// No valid app found
			else
			{
				// Print command in history
				printHistory('No application &raquo;' + commandString + '&laquo; found');
			}
		}

		// Clear input field
		clearInput();

		// Scroll to bottom
		scrollToBottom();
	}


	/**
	 *	Print in the history
	 */
	function printHistory(text, printIcon)
	{
		if(
			text ||
			text !== ''
		)
		{
			var history = o.obj.history;

			// Replace placeholders
			text = switchFromPlaceholder(text);

			var li = document.createElement('li');
			li.className = 'terminal__historyLi';
			history.appendChild(li);

			if(printIcon)
			{
				var icon = document.createElement('div');
				icon.className = 'terminal__icon';
				icon.innerHTML = '$';
				li.appendChild(icon);

				var value = document.createElement('div');
				value.className = 'terminal__value';
				value.innerHTML = text;
				li.appendChild(value);
			}
			else
			{
				li.innerHTML = text;
			}
		}
	}


	/**
	 *	Print user to history
	 */
	function printOwnerToHisotry()
	{
		var history = o.obj.history;

		var li = document.createElement('li');
		li.className = 'terminal__historyLi terminal__historyLi--newblock';
		li.appendChild(createOwnerBlock());

		history.appendChild(li);
	}


	/**
	 *	Create owner block
	 */
	function createOwnerBlock()
	{
		var _user = class_user.getCurrentUser(),
			_pc = class_os.getPcName();

		var block = document.createElement('div');
		block.className = 'terminal__ownerArea';

		var user = document.createElement('div');
		user.className = 'terminal__user';
		user.innerHTML = _user + '@' + _pc;
		block.appendChild(user);

		var path = document.createElement('div');
		path.className = 'terminal__path';
		path.innerHTML = o.currentPath;
		block.appendChild(path);

		return block;
	}


	/**
	 *	Get terminal command
	 */
	function getCommand(commandObj)
	{
		var commands = {
			help: {
				echo: 'ls[BR]exit'
			},
			ls: {
				run: program_terminal_ls
			},
			exit: {
				run: program_terminal_exit
			}
		}

		if(commands[commandObj.app])
		{
			return commands[commandObj.app];
		}
		else
		{
			return false;
		}
	}


	/**
	 *	Split the command name
	 */
	function splitCommand(string)
	{
		var _split = string.split(/ /g);

		var command = {
			app: _split.shift()
		}

		for(var _item in _split)
		{
			// If this a param block
			if(_split[_item][0] == '-')
			{
				// Delete the first element
				_split[_item] = _split[_item].replace('-', '');

				// Split the params
				command.params = _split[_item].split('');
			}
		}

		return command;
	}


	/**
	 *	Scroll to bottom
	 */
	function scrollToBottom()
	{
		var _terminal = o.obj.terminal,
			scrollHeight = _terminal.scrollHeight;

		_terminal.scrollTop = scrollHeight;
	}


	/**
	 *	Clear console
	 */
	function clearConsole()
	{
		o.obj.history.innerHTML = '';
	}


	/**
	 *	Clear input
	 */
	function clearInput()
	{
		setInput("");
	}


	/**
	 *	Tab and search for files
	 */
	function tabFiles()
	{
		var currentPath = class_storage.showAll(o.currentPath),
			inputValue = getInput(),
			inputSplit = inputValue.split(/ /g),
			foundThis = [];

		if(
			inputSplit.length &&
			inputSplit[inputSplit.length - 1]
		)
		{
			var seachPattner = inputSplit.pop();

			for(var _name in currentPath)
			{
				// Replace dot with \.
				var findThis = seachPattner.replace('.', '\\.');

				var regex = new RegExp("^(" + findThis + ')', 'i');
				if(currentPath[_name].name.match(regex))
				{
					foundThis.push(currentPath[_name].name);
				}
			}

			// Print all found names
			if(foundThis.length)
			{
				// Have found more than one
				if(foundThis.length > 1)
				{
					var returnValue = false,
						matchValue = "",
						lengthMatch = 0;

					// Search for the same beinning content
					var matchCharLenght = 0;

					for(var i = 0; i < 500; i++)
					{
						var _loopChar = false,
							_loopMatchAll = true;

						for(var _string in foundThis)
						{
							if(!_loopChar)
							{
								_loopChar = foundThis[_string][i];
							}
							else
							{
								if(
									foundThis[_string][i] &&
									foundThis[_string][i] == _loopChar
								)
								{

								}
								else {
									_loopMatchAll = false;
									break;
								}
							}
						}

						if(
							_loopMatchAll &&
							_loopChar
						)
						{
							matchValue += _loopChar;
							matchCharLenght++;
						}
						else
						{
							break;
						}
					}

					// All founds value have the same beginning content
					if(
						matchCharLenght &&
						matchCharLenght > seachPattner.length
					)
					{
						var regex = new RegExp(seachPattner + '$', 'i');
						setInput(inputValue.replace(regex, matchValue));
					}

					// No match value found
					else {
						// Print owner
						printOwnerToHisotry();

						for(var _item in foundThis)
						{
							if(_item == 0)
							{
								returnValue = foundThis[_item];
							}
							else
							{
								returnValue += ' ' + foundThis[_item];
							}
						}

						// Print to history
						printHistory(returnValue);
					}
				}

				// Have found only one
				else {
					var regex = new RegExp(seachPattner + '$', 'i');
					setInput(inputValue.replace(regex, foundThis[0] + ''));
				}

				scrollToBottom();
			}
		}
	}


	/**
	 *	Get terminal input
	 */
	function getInput()
	{
		return o.obj.input.value;
	}


	/**
	 *	Set terminal input
	 */
	function setInput(insert)
	{
		o.obj.input.value = insert;
	}


	/**
	 *	Switch to terminal placeholders
	 */
	function switchFromPlaceholder(text)
	{
		text = text.replace(/\[BR\]/g, '<br>');

		return text;
	}
};
