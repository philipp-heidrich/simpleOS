(function()
{
	this.taskline = {
		AUTHOR: 'Philipp Heidrich'
	}


	/**
	 *
	 *	Boot functions
	 *
	 */

	 /**
 	 *	Start login boot
 	 */
 	taskline.boot = function()
 	{
 		// Show message
 		boot.printBootMessage('Load taskline');

		// Lade HTML
		boot.printBootMessage('&#10142; load objects');
 		taskline.obj = {
 			time_timeday: document.querySelector('.taskline .taskline__timeday'),
 			time_date: document.querySelector('.taskline .taskline__date'),
			program_open: document.querySelector('.taskline .taskline__programOpen')
 		}

		// Lade date + time
		boot.printBootMessage('&#10142; load time');
		initalTime();

		boot.printBootMessage('<br>');
 	}


	/**
	 *	Inital time
	 */
	function initalTime()
	{
		printDate();
		printTime();

		setInterval(function()
		{
			printDate();
			printTime();
		}, 1000);
	}





	/**
	 *
	 *	Public function
	 *
	 */

	/**
  	 *	Add a new program to taskline
  	 */
  	taskline.createTaskProgram = function(o)
  	{
  		o.taskProgram = document.createElement('li');
  		o.taskProgram.program_id = o.id_counter;
  		o.taskProgram.className = 'taskline__program';

  		// Value
		o.taskShow = document.createElement('div');
		o.taskShow.className = 'taskline__showBlock';
		o.taskShow.onclick = function(event)
 		{
 			// Remove global click event
 			program.disableClickEvent = true;

 			// Check is this minimized
 			if(o.isMinimized)
 			{
 				taskline.reminizedWindow(o.id_counter);
 				program.reminizedWindow(o.id_counter);
 			}

 			// Check ist selected
 			else if(o.isSelected)
 			{
 				taskline.minimizeWindow(o.id_counter);
 				program.minimizeWindow(o.id_counter);
 			}

 			// Set a new selection
 			else
			{
 				taskline.setSelection(o.id_counter);
 				program.setSelection(o.id_counter);
 			}
 		}
		o.taskProgram.appendChild(o.taskShow);

  		o.taskName = document.createElement('div');
  		o.taskName.className = 'taskline__programTxt';
  		o.taskName.innerHTML = o.title;
  		o.taskShow.appendChild(o.taskName);

 		// Taskmenu
 		o.taskMenu = document.createElement('div');
 		o.taskMenu.className = 'taskline__programMenu';
 		o.taskProgram.appendChild(o.taskMenu);

 		// Taskmenu - close
 		o.taskMenuClose = document.createElement('div');
 		o.taskMenuClose.className = 'taskline__programMenuBtn taskline__programMenuBtn--close';
 		o.taskMenuClose.onclick = function()
 		{
 			// Remove global click event
 			program.disableClickEvent = true;

 			program.removeWindow(o.id_counter);
 		}
 		o.taskMenu.appendChild(o.taskMenuClose);
 		o.taskMenuClose.appendChild(createFontIcon('close'));

  		// Output
  		taskline.obj.program_open.appendChild(o.taskProgram);
  	}


	/**
 	 *	Remove selection
 	 */
 	taskline.removeSelection = function()
 	{
 		if(program.selected)
 		{
 			var o = program.list[program.selected];

 			// Remove selection class
 			o.taskProgram.className = o.taskProgram.className.replace(' taskline__program--selected', '');
 		}
 	}


	/**
 	 *	Set selection
 	 */
 	taskline.setSelection = function(selectNr)
 	{
 		if(
 			program.list[selectNr] &&
 			selectNr !== program.selected
 		)
 		{
 			var o = program.list[selectNr];

 			// Delete selections
			taskline.removeSelection();

 			// Set selection class
 			o.taskProgram.className += ' taskline__program--selected';
 		}
 	}


	/**
 	 *	Minimize window
 	 */
 	taskline.minimizeWindow = function(id)
 	{
 		var o = program.list[id];

 		// Remove selection
		taskline.removeSelection();

 		// Edit HTML
		o.taskProgram.className += ' taskline__program--minimized';
 	}


	/**
 	 *	Reminimize window
 	 */
 	taskline.reminizedWindow = function(id)
 	{
		var o = program.list[id];

 		// Remove selection
		taskline.removeSelection();

 		// Edit HTML
		o.taskProgram.className = o.taskProgram.className.replace(' taskline__program--minimized', '');
	}









	/**
	 *
	 *	Private functions
	 *
	 */

	/**
	 *	Load time object
	 */
	function getTime()
	{
		var monthNames = [
			{
				name: 'January',
				short: 'Jan'
			},
			{
				name: 'February',
				short: 'Feb'
			},
			{
				name: 'March',
				short: 'Mar'
			},
			{
				name: 'April',
				short: 'Apr'
			},
			{
				name: 'May',
				short: 'May'
			},
			{
				name: 'June',
				short: 'Jun'
			},
			{
				name: 'July',
				short: 'Jul'
			},
			{
				name: 'August',
				short: 'Aug'
			},
			{
				name: 'September',
				short: 'Sep'
			},
			{
				name: 'October',
				short: 'Oct'
			},
			{
				name: 'November',
				short: 'Nov'
			},
			{
				name: 'December',
				short: 'Dec'
			}
		]

		var date 	= new Date(),
			returnObj = {
			hour: 				date.getHours(),
			min: 				date.getMinutes(),
			day: 				date.getDate(),
			month:				date.getMonth() + 1,
			monthName: 			monthNames[date.getMonth() + 1].name,
			monthNameShort:		monthNames[date.getMonth() + 1].short,
			year:				date.getFullYear()
		};

		// Change form
		returnObj.min = (returnObj.min < 10) ? '0' + returnObj.min : returnObj.min;
		returnObj.hour = (returnObj.hour < 10) ? '0' + returnObj.hour : returnObj.hour;
		returnObj.date = (returnObj.date < 10) ? '0' + returnObj.date : returnObj.date;
		returnObj.month = (returnObj.month < 10) ? '0' + returnObj.month : returnObj.month;

		return returnObj;
	}


	/**
	 *	Load date and print this
	 */
	function printDate()
	{
		var time = getTime();

		// Print time
		taskline.obj.time_date.innerHTML = time.day + '.' + time.monthNameShort + ' ' + time.year;
	}


	/**
	 *	Load time and print this
	 */
	function printTime()
	{
		var time = getTime();

		// Print time
		taskline.obj.time_timeday.innerHTML = time.hour + ':' + time.min;
	}


	/**
	 *	Create a google font icon
	 */
	function createFontIcon(fontType)
	{
		var iconfontObj = document.createElement('i');
		iconfontObj.className = 'material-icons';
		iconfontObj.innerHTML = fontType;

		return iconfontObj;
	}




}).call(this);
