(function()
{
	this.program_terminal = {
		AUTHOR: 'Philipp Heidrich',
		VERSION: 1
	}

	program_terminal.pressedKeys = [];


	/**
	 *	Inital terminal
	 */
	program_terminal.init = function()
	{
		// Create html
		this.progObj = program.startWindow('terminal', 'Terminal');

		var _content = this.progObj.content;

		this.obj = {
			terminal: _content,
			ownerArea: _content.querySelector('.terminal__ownerArea'),
			inputArea: _content.querySelector('.terminal__inputArea'),
			inputField: _content.querySelector('.terminal__inputField'),
			input: _content.querySelector('.terminal__input'),
			history: _content.querySelector('.terminal__history'),
			user: _content.querySelector('.terminal__user'),
			placeholder: _content.querySelector('.terminal__placeholder')
		}

		// Add events
		addEvent(this);

		// Add terminal infos
		addTerminalInfo(this);

		// Add User
		addUserToInput(this);
	}




	/**
	 *
	 *	Private function
	 *
	 */


	/**
	 *	Add events from the program
	 */
	function addEvent(o)
	{
		// Click event to focus the input field
		o.progObj.content.addEventListener('click', function()
		{
			setFocusToInput(o);
		});

		// Keypress event
		o.obj.input.addEventListener('keydown', function(event)
		{
			keypressConsole(event, o);
		});

		// Keypress event
		o.obj.input.addEventListener('keyup', function(event)
		{
			keyupConsole(event, o);
		});

		// Push resize function
		program.pushResizeFunction(o.progObj.id_counter, function()
		{
			scrollToBottom(o);
		});

		// Push maximize function
		program.pushMaximizedFunction(o.progObj.id_counter, function()
		{
			scrollToBottom(o);
		});

		// Push reduce function
		program.pushReduceFunction(o.progObj.id_counter, function()
		{
			scrollToBottom(o);
		});
	}


	/**
	 *	Add user infos
	 */
	function addUserToInput(o)
	{
		o.obj.inputField.insertBefore(createOwnerBlock(), o.obj.inputArea);
	}


	/**
	 *	Add terminal info
	 */
	function addTerminalInfo(o)
	{
		var terminalNote = 'webOS terminal - v.' + program_terminal.VERSION + '<br>' +
							'using username "' + class_user.getCurrentUser() + '"<br>' +
							'<br>' +
							'This terminal program is an alpha version. All available commands can you see with "help"';

		printHistory(terminalNote , o);
	}


	/**
	 *	Set the focus to the input field
	 */
	function setFocusToInput(o)
	{
		var _input = o.obj.input,
			text = _input.innerHTML;

		_input.focus();
		_input.innerHTML = _input.innerHTML;
	}


	/**
	 *	Keypress detection for console inputs
	 */
	function keypressConsole(event, o)
	{
		var keycode = event.keyCode;

		// Save keypress
		program_terminal.pressedKeys[keycode] = true;

		// Key: ENTER
		if(keycode == 13)
		{
			runCode(o);
			event.preventDefault();
		}

		// Key: CTRL + L
		if(
			program_terminal.pressedKeys[17] &&
			keycode == 76
		)
		{
			clearConsole(o);
			event.preventDefault();
		}

		// Key: CTRL + U
		if(
			program_terminal.pressedKeys[17] &&
			keycode == 85
		)
		{
			clearInput(o);
			event.preventDefault();
		}
	}


	/**
	 *	Keyup detection for console inputs
	 */
	function keyupConsole(event, o)
	{
		var keycode = event.keyCode;

		if(program_terminal.pressedKeys[keycode])
		{
			program_terminal.pressedKeys[keycode] = false;
		}
	}


	/**
	 *	Run code
	 */
	function runCode(o)
	{
		var _input = o.obj.input,
			commandString = _input.innerHTML,
			command = splitCommand(_input.innerHTML);

		// Print owner
		printOwnerToHisotry(o);

		// Print command in history
		printHistory(commandString, o, true);

		// Search for a program
		var app = getCommand(command);
		if(app)
		{
			if(app.echo)
			{
				printHistory(app.echo, o);
			}
			else if(app.run)
			{
				var array = app.run();

				for(var _item in array)
				{
					printHistory(array[_item], o);
				}
			}
		}

		// No valid app found
		else
		{
			// Print command in history
			printHistory('No application &raquo;' + commandString + '&laquo; found', o);
		}

		// Clear input field
		_input.innerHTML = '';

		// Scroll to bottom
		scrollToBottom(o);
	}


	/**
	 *	Print in the history
	 */
	function printHistory(text, o, printIcon)
	{
		if(
			text ||
			text !== ''
		)
		{
			var history = o.obj.history;

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
	function printOwnerToHisotry(o)
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
		path.innerHTML = class_storage.getCurrentPath();
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
				echo: ['ls']
			},
			ls: {
				run: function()
				{
					var ls = class_storage.showAll(),
						array = [];

					for(var _item in ls)
					{
						array.push(_item + '\t[' + [ls[_item].type] + ']');
					}

					return array;
				}
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
		var splitCommand = string.split(/ /g);

		var command = {
			app: splitCommand.shift()
		}

		return command;
	}


	/**
	 *	Scroll to bottom
	 */
	function scrollToBottom(o)
	{
		var _terminal = o.obj.terminal,
			scrollHeight = _terminal.scrollHeight;

		_terminal.scrollTop = scrollHeight;
	}


	/**
	 *	Clear console
	 */
	function clearConsole(o)
	{
		o.obj.history.innerHTML = '';
	}


	/**
	 *	Clear input
	 */
	function clearInput(o)
	{
		o.obj.input.innerHTML = '';
	}




















	// TEST
	window.addEventListener('load', function()
	{
		setTimeout(function()
		{
			new program_terminal.init();

		}, 1000);
	});




}).call(this);
