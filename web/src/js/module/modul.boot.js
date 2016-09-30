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
			login.boot,
			desktop.boot,
			taskline.boot,
			startmenu.boot
		],

		// Run Callback
		function()
		{
			// Check is this the first visit
			if(os.getFirstPcVisit())
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
			scroller: document.querySelector('.boot .boot__scroller')
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
				// Delete first array function
				var _firstEl = loadArray.shift();

				// Run first array function
				if(_firstEl)
					_firstEl();

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
	 *	Events
	 */
	window.addEventListener('load', function()
	{
		boot.init();
	});


}).call(this);
