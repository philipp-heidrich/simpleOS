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

}).call(this);
