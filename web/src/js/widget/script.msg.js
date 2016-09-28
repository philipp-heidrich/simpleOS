(function()
{
	this.msg = {
		AUTHOR: 'Philipp Heidrich',
		VERSION: '1'
	}


	/**
	 *	Variablen
	 **/
	var defaultOption = {
		content: {
			append: 'body'
		},
		button: [{
			title: 'OK'
		}]
	}

	msg.init = function(option)
	{
		// Merge Optionen it default Werten
		this.option = msg.mergeOptions(option, defaultOption);

		// Baue Gruntgerüst
		this.html = msg.buildLayer(this);

		// Platziere Inhalt
		msg.buildContent(this);

		// Platziere Buttons
		msg.buildButtons(this);

		// Ausgabe
		msg.printMsg(this);
	}






	/**
	 *
	 *	Helper Funktionen
	 *
	 **/

	/**
	 *	Merge default Optionen mit User Optionen
	 **/
	msg.mergeOptions = function(origin, defaultObj)
	{
		for(var i in defaultObj)
		{
			if(origin === undefined)
			{
				origin = defaultObj;
			}

			if(typeof defaultObj[i] == 'object')
			{
				origin[i] = msg.mergeOptions(origin[i], defaultObj[i]);
			}
			else if(
				typeof defaultObj[i] == 'string' ||
				typeof defaultObj[i] == 'number'
			)
			{
				if(!origin[i])
				{
					origin[i] = defaultObj[i];
				}
			}
		}

		return origin;
	}


	/**
	 *	Baut das Gruntgerüst
	 **/
	msg.buildLayer = function(msgObj)
	{
		var html = {},
			option = msgObj.option;

		// Prüfe ob es schon eine msg Box gibt
		if(!document.querySelectorAll('.msg').length)
		{
			// Main Layer
			html.layer = document.createElement('div');
			html.layer.className = 'msg';

			// Out Layer
			html.out = document.createElement('div');
			html.out.className = 'msg__out';
			if(option.abort)
			{
				html.out.onclick = option.abort;
			}
			else {
				html.out.onclick = function()
				{
					msg.close();
				}
			}
			html.layer.appendChild(html.out);
		}
		else {
			html.layer 	= document.querySelector('.msg');
			html.out	= html.layer.querySelector('.msg__out');
		}

		// Content
		html.content = document.createElement('div');
		if(option.content.type)
		{
			html.content.className = 'msg__content msg__content--' + option.content.type;
		}
		else {
			html.content.className = 'msg__content';
		}

		html.content.msg = msgObj;
		html.layer.appendChild(html.content);

		html.contentInner = document.createElement('div');
		html.contentInner.className = 'msg__innerContent';
		html.content.appendChild(html.contentInner);

		html.footer = document.createElement('div');
		html.footer.className = 'msg__footer';
		html.content.appendChild(html.footer);

		return html;
	}


	/**
	 *	Baut den Inhalt in das HTML ein
	 **/
	msg.buildContent = function(msgObj)
	{
		var content = msgObj.option.content,
			html = msgObj.html;

		if(content.img)
		{
			var img = document.createElement('img');
			img.className = 'msg__img';
			img.src = content.img;
			html.content.appendChild(img);

			html.contentInner.className += ' msg__innerContent--widthImg';
		}

		if(content.googleIcons)
		{
			var iconBlock = document.createElement('div');
			iconBlock.className = 'msg__googleIcon';
			html.content.appendChild(iconBlock);

			var googleIcon = document.createElement('i');
			googleIcon.className = 'material-icons';
			googleIcon.innerHTML = content.googleIcons;
			iconBlock.appendChild(googleIcon);

			html.contentInner.className += ' msg__innerContent--widthImg';
		}

		if(content.header)
		{
			var h3 = document.createElement('h3');
			h3.className = 'msg__heading';
			h3.innerHTML = content.header;
			html.contentInner.appendChild(h3);
		}

		if(content.txt)
		{
			var pTag = document.createElement('p');
			pTag.innerHTML = content.txt;
			html.contentInner.appendChild(pTag);
		}

		// Füge ein HTML Objeckt ein
		if(
			content.include &&
			document.querySelector(content.include)
		)
		{
			var copyHtml = document.querySelector(content.include).cloneNode(true);
			html.contentInner.appendChild(copyHtml);
		}
	}


	/**
	 *	Baut die gewünschten Buttons ein
	 **/
	msg.buildButtons = function(msgObj)
	{
		var button = msgObj.option.button,
			html = msgObj.html;

		if(
			button &&
			button.length
		)
		{
			for(var i = 0; i < button.length; i++)
			{
				var _option = button[i];

				var _btn = document.createElement('div');
				_btn.innerHTML = _option.title;
				_btn.className = 'msg__btn';


				if(_option.click)
				{
					_btn.onclick = _option.click;
				}
				else {
					_btn.onclick = function()
					{
						msg.close(msgObj);
					}
				}

				if(_option.float)
				{
					_btn.className += ' msg__btn--' + _option.float;
				}

				// type
				// none 				- inherit
				// msg__btn--noBtn
				if(_option.type)
				{
					_btn.className += ' msg__btn--' + _option.type;
				}



				html.footer.appendChild(_btn);
			}

			var clearEl = document.createElement('div');
			clearEl.className = 'clear';
			html.footer.appendChild(clearEl);
		}
	}



	/**
	 *	Schließt die Box
	 **/
	msg.close = function(msgObj, cb)
	{
		var html 			= (msgObj) ? msgObj.html : (document.querySelector('.msg .msg__content--focus')) ? document.querySelector('.msg .msg__content--focus').msg.html : false,
			allOpenmsg 	= document.querySelectorAll('.msg .msg__content--start');

		if(html)
		{
			if(allOpenmsg.length == 1)
			{
				html.out.className += ' msg__out--close';
			}

			html.content.className += ' msg__content--close';

			(function(_html)
			{
				var html = _html;

				setTimeout(function()
				{
					var allOpenmsg = document.querySelectorAll('.msg .msg__content--start');

					if(allOpenmsg.length == 1)
					{
						html.layer.parentNode.removeChild(html.layer);
					}
					// Es exestieren noch weitere msg Objeckte
					else {
						html.content.parentNode.removeChild(html.content);

						// Neuen Focus setzten
						if(allOpenmsg[allOpenmsg.length - 2])
							allOpenmsg[allOpenmsg.length - 2].className += ' msg__content--focus';
					}

					if(cb)
					{
						cb();
					}

				}, 500);
			}).call(this, html);
		}
	}



	/**
	 *	Ausgabe auf dem Dokument
	 **/
	msg.printMsg = function(msgObj)
	{
		var content = msgObj.option.content,
			html = msgObj.html;

		// Focus von bestehenden msg Objeckten nehmen
		var allmsg = document.querySelectorAll('.msg .msg__content');
		for(var i = 0; i < allmsg.length; i++)
		{
			if(allmsg[i].className.match('msg__content--focus'))
				allmsg[i].className = allmsg[i].className.replace(/ msg__content--focus/, '');
		}

		// Erstellt HTML
		document.querySelector(content.append).appendChild(html.layer);

		setTimeout(function()
		{
			if(!allmsg.length)
			{
				html.out.className += ' msg__out--start';
			}

			html.content.className += ' msg__content--start msg__content--focus';


			// Prüfen ob ein Callbacka ausgegeben werden soll
			if(msgObj.option.callback)
			{
				msgObj.option.callback(msgObj);
			}
		}, 100);
	}


})(this);






///// TESTS
window.addEventListener('load', function()
{
	// new msg.init({
	// 	content: {
	// 		// type: 'warning',
	// 		// class: 'small',
	// 		// include: '#hiddenFields #btcAddress',
	// 		// img: "https://www.wall-art.de/out/wallart-dm/img/logos/wall-art-logo-shop-id-1.svg",
	// 		// googleIcons: 'verified_user',
	// 		// txt: "Baum im Wind",
	// 		// header: "Überschrift"
	// 	},
	// 	abort: rateus.rateLater,
	// 	callback: function()
	// 	{
	// 		alert();
	// 	}
	// 	// button: false
	// 	button: [
	// 		{
	// 			title: 'Ok',
	// 			click: function()
	// 			{
	// 				alert();
	// 				msg.close();
	// 			}
	// 		}
	// 	]
	// });
});
