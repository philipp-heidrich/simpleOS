(function()
{
	this.class_module = {
		AUTHOR: 'Philipp Heidrich'
	}


	/**
	 *
	 *	Public functions
	 *
	 **/

	/**
	 *	Change module
	 **/
	class_module.changeModule = function(content)
	{
		var allContents = document.querySelectorAll('#wrapper .content');

		// Get new counter
		if(!class_module.changeModule_ctr)
		{
			class_module.changeModule_ctr = 9;
		}
		else
		{
			class_module.changeModule_ctr++;
		}

		// Hide current content
		content.className += ' content--show';

		// Loop all contents to hide them
		for(var i = 0; i < allContents.length; i++)
		{
			var _content = allContents[i];

			// Check if this content show
			if(_content.className.match('content--active'))
			{
				// Remove hidden attribute
				_content.className = _content.className.replace(' content--active', '');
			}
		}

		// Get new z-index
		content.style.zIndex = class_module.changeModule_ctr;

		// Fadein
		setTimeout(function()
		{
			// Remove hide class
			// content.className = content.className.replace(' content--hide', '');

			// Show new content
			content.className += ' content--active';
		}, 10);
	}




	/**
	 *
	 *	Private functions
	 *
	 **/





}).call(this);
