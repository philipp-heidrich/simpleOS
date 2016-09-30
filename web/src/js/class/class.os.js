(function()
{
	this.os = {
		AUTHOR: 'Philipp Heidrich'
	}


	/**
	 *
	 *	Public functions
	 *
	 */

	/**
	 *	Save first pc visit
	 */
	os.saveFirstPcVisit = function()
	{
		option.save('os_firstVisit', true);

		return true;
	}


	/**
	 *	Get first pc visit
	 */
	os.getFirstPcVisit = function()
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
	 *	Save pc name
	 */
	os.savePcName = function(name)
	{
		// Save pc name
		option.save('os_name', name);
	}

}).call(this);
