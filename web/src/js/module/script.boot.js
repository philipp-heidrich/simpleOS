(function()
{
	this.boot = {
		AUTHOR: "Philipp Heidrich"
	}


	/**
	 *	Inital boot
	 */
	boot.init = function()
	{
		// Load HTML
		boot.loadHTML();

		// Inital bootloader
		boot.loader([
			register.boot,
			login.boot
		],

		// Run Callback
		function()
		{
			// Check is this the first visit
			if(boot.check_isFirstVisit())
			{
				setTimeout(register.init, 500);
			}
			else
			{
				setTimeout(login.init, 500);
			}
		});
	}


	/**
	 *	Load all HTML
	 */
	boot.loadHTML = function()
	{
		boot.obj = {
			content: document.querySelector('#wrapper .boot'),
			scroller: document.querySelector('.boot .boot--scroller')
		}
	}


	/**
	 *	Load all objects
	 */
	boot.loader = function(loadArray, cb)
	{
		setTimeout(function()
		{
			if(loadArray.length)
			{
				// Run first array function
				loadArray[0]();

				// Delete first array function
				loadArray.shift();

				// Run next loading
				boot.loader(loadArray, cb);
			}

			// Nothing in bootloader
			else
			{
				cb();
			}
		}, 200);
	}



	/**
	 *	Print new boot message
	 */
	boot.printBootMessage = function(message)
	{
		var li = document.createElement('li');
		li.innerHTML = message;
		boot.obj.scroller.appendChild(li);
	}


	/**
	 *	Check is this the first visit
	 */
	boot.check_isFirstVisit = function()
	{
		if(
			!option.load('os_firstVisit') ||
			option.load('os_firstVisit') == false
		)
		{
			return true;
		}
		else
		{
			return false;
		}
	}







	/**
	 *	Events
	 */
	window.addEventListener('load', function()
	{
		boot.init();
	});


}).call(this);
