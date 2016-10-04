(function()
{
	this.class_os = {
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
	class_os.saveFirstPcVisit = function()
	{
		option.save('os_firstVisit', true);

		return true;
	}


	/**
	 *	Get first pc visit
	 */
	class_os.getFirstPcVisit = function()
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
	class_os.savePcName = function(name)
	{
		// Save pc name
		option.save('os_name', name);
	}


	/**
	 *	Get pc name
	 */
	class_os.getPcName = function()
	{
		return option.load('os_name');
	}

}).call(this);
