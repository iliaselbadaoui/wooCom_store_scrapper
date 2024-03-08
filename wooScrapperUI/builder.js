/**
 * @returns HTMLElement
*/
function create(element)
{
	return document.createElement(element)
}

export class Validator
{
	#form
	#executable
	#singleExecution
	#isValid
	/**
	 *
	 * @param form {HTMLElement}
	 * @param executable {Function}
	 * @param singleExecution {Boolean}
	 */
	constructor(form, executable, singleExecution= false)
	{
		this.#form = form;
		this.#executable = executable;
		this.#singleExecution = singleExecution;
	}

	#isInputAndRequired(item)
	{
		return (item.tagName.toLowerCase() === 'input'
			&& item.type.toLowerCase() !== 'button'
			&& item.type.toLowerCase() !== 'submit'
			&& item.type.toLowerCase() !== 'reset'
			&& item.type.toLowerCase() !== 'image'
			&& item.getAttribute('required') !== null);
	}


	validate()
	{
		for(const item of this.#form.childNodes)
		{
			const type = item.type;
			if (this.#isInputAndRequired(item))
			{
				this.#isValid = true
				if (item.type.toLowerCase() === 'file' && item.files.length === 0)
					this.#isValid = false
				else if ((item.type.toLowerCase() === 'radio' || item.type.toLowerCase() === 'checkbox') && !item.checked)
					this.#isValid = false
				else if (item.value === '')
					this.#isValid = false

				if (!this.#isValid)
				{
					if (!this.#singleExecution)
					{
						this.#executable(item, type)
						return false
					}
					else
						break
				}
			}
		}
		if (this.#singleExecution && !this.#isValid)
		{
			this.#executable()
			return false
		}
		return true
	}
}

export class Preferences
{
	static instance = null
	/**
	 * @type {object}
	 * **/
	#userPreference;
	constructor() {
		this.#userPreference = {}
		if (localStorage.getItem('b_preferences') !== null)
			this.#userPreference = JSON.parse(localStorage.getItem('b_preferences'))
		if (Preferences.instance !== null)
			return Preferences.instance
		Preferences.instance = this;
	}

	/**
	 * @param {String} name
	 * @param {String} value
	 */
	add(name, value)
	{
		this.#userPreference[name]=value;
		localStorage['b_preferences'] = JSON.stringify(this.#userPreference)
	}

	/**
	 * @param {String} name
	 * @returns {String|null}
	 */
	get(name)
	{
		if (this.#userPreference.hasOwnProperty(name))
			return this.#userPreference[name]
		return null
	}

	delete(name)
	{
		if (this.#userPreference.hasOwnProperty(name))
		{
			delete this.#userPreference[name]
			localStorage['b_preferences'] = JSON.stringify(this.#userPreference)
			return true
		}
		return false
	}
}

export let prefs = new Preferences();

if (!prefs.get('language'))
	prefs.add("language", navigator.language.split('-')[0])
export const app = getId("App");
export const api = "/api/";

export function getId(id)
{
	return document.getElementById(id)
}

export function getSelector(selector)
{
	return document.querySelectorAll(selector);
}

export function object(data, type)
{
	let obj = create('object');

	obj.data = data;
	obj.type = type;

	return obj
}

export function paragraph(id, styleClass, textContent)
{
	let p = create('p');

	if (textContent.substring(0, 7).toLowerCase() === '%bcode%')
	{
		textContent = textContent.substring(7, textContent.length)
		p = bcode(textContent)

	}
	else if (textContent.substring(0, 6).toLowerCase() === '%html%')
		p.innerHTML = textContent.substring(6, textContent.length)
	else
		p.textContent = textContent
	if (id)
		p.id = id;
	if(styleClass)
		p.className = styleClass;
	return p;
}

export function jsonFile(path, success, error)
{
	let xhr = new XMLHttpRequest();
	xhr.open('GET', path, false);
	xhr.onreadystatechange = ()=>{
		if (xhr.status === 200)
			success(xhr.responseText);
		else
			error(xhr.statusText, xhr.responseText)
	}
	xhr.send()
}

export function	textBox(id ,hint, type, styleClass)
{
	let text = create("input");

	text.type = type;
	if (id !== null)
		text.id = id;
	text.placeholder = hint;
	text.className = styleClass;

	return text;
}

export function image(id, styleClass, source)
{
	let img = create("img");

	if (id !== null)
		img.id = id;
	img.className = styleClass;
	img.src = source;
	img.alt = ''

	return img;
}

export function block(id, styleClass, childs)
{
	let block = create("div");

	if (id !== null)
		block.id = id;
	block.className = styleClass;
	if (childs !== null && childs !== undefined)
	{
		childs.forEach(child => {
			block.append(child);
		});
	}
	return block;
}

export function button(id, styleClass, textValue, html)
{
	let button = create("button");

	if (id !== null)
		button.id = id;
	button.className = styleClass;
	if(textValue !== null)
		button.textContent = textValue;
	else if (html !== null)
		button.innerHTML = html;

	button.title = '';
	return button;
}

export function heading(number, styleClass, textContent)
{
	let heading = create("h"+number);

	if (styleClass !== null)
		heading.className = styleClass;
	heading.textContent = textContent;

	return heading;
}

export function anchor(id, styleClass, href, textContent)
{
	let a = create('a');

	if (id)
		a.id = id;
	if (styleClass)	
		a.className = styleClass;
	a.href = href;
	a.textContent = textContent

	return a;
}

export function textArea(id, styleClass, hint)
{
	let ta = create("textarea");

	if (id)
		ta.id = id;
	ta.className = styleClass;
	ta.placeholder = hint;

	return ta;
}

export function brdige(endpoint, method, formdata, sucess, err)
{
	let xhr = new XMLHttpRequest();

	if (method === "GET")
	{
		let params = "";
		formdata.forEach((value, key)=>{
			params+=key+"="+value+"&"
		});
		params+="EOP=NULL"
		endpoint+="?"+params
	}
	xhr.open(method, api+endpoint);
	xhr.withCredentials = true;
	xhr.onload = function ()
	{
		if (xhr.status === 200 && xhr.readyState === 4)
			sucess(xhr.responseText);
		else
			err(xhr.status);
	}
	xhr.send(formdata);
}

export function Option(value, text)
{
	let option = create("option");

	option.value = value;
	option.textContent = text;

	return option;
}

export function select(id, styleClass, options = null)
{
	let sel = create("select");
	if (id !== null)
		sel.id = id;
	if (styleClass !== null)
		sel.className = styleClass;
	if (options !== null)
	{
		options.forEach(opt => {
			let option = Option(opt.value, opt.text);
			sel.append(option);
		})
	}
	return sel;
}

export function table(id, styleclass, rows)
{
	let t = create('table');

	if (id)
		t.id = id
	t.className = styleclass;

	if (rows)
		rows.forEach(row=>{
			t.append(row);
		})

	return t;
}

export function tableRow(id, styleclass, data)
{
	let t = create('tr');

	if (id)
		t.id = id
	t.className = styleclass;

	if (data)
		data.forEach(d=>{
			t.append(d);
		})

	return t;
}

export function tableData(id, styleclass, value)
{
	let t = create('td');

	if (id)
		t.id = id
	t.className = styleclass;
	if (typeof value === 'string')
		t.textContent = value;
	else
		t.append(value)

	return t;
}

export function label(styleClass, value)
{
	let lab = document.createElement("span");

	lab.textContent = value;
	lab.className = styleClass;

	return lab;
}

export function audio(id, styleClass, src)
{
	let aud = create('audio');

	if (id)
		aud.id = id;
	if (styleClass)
		aud.className = styleClass;
	aud.src = src;
	return aud;
}

export function canvas(styleClass)
{
	let canv = document.createElement("canvas");
	canv.className = styleClass;

	return canv;
}

export function isArabic(str)
{
	var arabic = /[\u0600-\u06FF]/;

	if(arabic.test(str))
		return true;
	return false;
}
export function toBase64(file, callback)
{
	let reader = new FileReader();
	reader.onload = function(evt)
	{
		callback(evt.target.result);
	}
	reader.readAsDataURL(file);
}

export function resizeImage(base64, callback,options = {width: 200})
{
	let canv = canvas('builderSpecialCanvas'),
		image = new Image();

	canv.width = options.width;
	image.onload = function(){
		canv.height = options.width * (image.height/image.width);
		let height = canv.height;
		canv.getContext('2d').drawImage(image, 0, 0, options.width, height);
		callback(canv.toDataURL('image/jpeg', 1));
	}
	image.src = base64;
}

export function entrypoit(callback)
{
	document.onreadystatechange = function()
	{
		if (document.readyState === "complete")
			callback()
	}
}

export function alert(message, yesText, noText, okCallback, noCallback)
{
	let messageText = label('alertMessage', message),
		ok = button(null, 'alertOKEY alertButton', yesText, null),
		no = button(null, 'alertNO alertButton', noText, null),
		alertContainer = block('alertContainer', 'alertContainer', [messageText, ok, no]),
		platform = block('alertPlatform', 'builderAlert', [alertContainer]);

	app.append(platform);
	no.onclick = ()=>{
		noCallback(platform);
	}
	ok.onclick = ()=>{
		okCallback(platform);
	}
}

export function insertStyle(path)
{
	let link = document.createElement('link');

	link.rel = "stylesheet";
	link.href = path+"?v="+Math.random();

	document.head.append(link);
}
export function insertScript(path, type)
{
	let script = document.createElement('script');

	script.type = type;
	script.src = path+"?v="+Math.random();

	document.body.append(script);
}


export class Errors
{
	static exists = 100;
    static wrongCredential = 101;
	static failure = 102;
	static invalidSession = 103;
	static validSession = 104;
}

/**
 * 
 * @param {Component} component 
 * @param {string} textContent
 * @param {string} path
 * @param {string} id 
 * @param {string} styleClass 
 * @param {string} mode 
 * @returns {HTMLElement}
 */
export function toRoute(path, textContent, mode=null, id=null, styleClass=null)
{
	let a = create('a');

	if (id)
		a.id = id;
	if (styleClass)
		a.className = styleClass;
	if (mode === 'append')
	{
		path = location.pathname + path
	}

	a.textContent = textContent;
	a.onclick = (e)=>{

		e.preventDefault()
		history.pushState('', '', path);
	}

	return a;
}

export class Component
{
	/**
	 * @type {HTMLElement} component
	 * @type {string} path
	 * @type {Component []} subroutes
	 * @type {Component []} connectedComponents
	 * @type {Component} parent
	 */
	component;
	path;
	subroutes;
	connectedComponents;

	constructor(parent)
	{
		this.component = null;
		this.path = null;
		this.subroutes = [];
		this.connectedComponents = []
	}

	/**
	 * 
	 * @param {Component} subroute 
	 */
	addSubroute(subroute)
	{
		this.subroutes.push(subroute);
	}

	create()
	{this.component = null;}

	getHTML(){return this.component;}

	rerender()
	{
		let old = this.component
		this.create()
		old.replaceWith(this.component)
	}
	muteRerender()
	{
		// The component must be refreshed in a mute state
	}

	/**
	 * 
	 * @param {string []} routes 
	 */
	hasRoute(routes)
	{
		let path = routes[0];

		this.subroutes.forEach(sub =>{
			if (sub.component.parentNode === this.component)
				this.component.removeChild(sub.component);
		})

		if (routes.length > 1)
		{
			routes = routes.slice(1);
			for (let i = 0; i < this.subroutes.length; i++) {
				routes.forEach(route=>{
					if (this.subroutes[i].path === route)
					{
						this.component.append(this.subroutes[i].getHTML());
						return this.component;
					}
				})
				let res = (this.subroutes[i]).hasRoute(routes);
				if (res){
					this.component.append(res)
					return this.component;
				}
			}
			return null
		}
		else if (this.path === path)
		{
			this.subroutes.forEach(sub =>{
				if (sub.component.parentNode === this.component)
					this.component.removeChild(sub.component);
			})
			return this.component;
		}
		else
			return null;
	}
}

function riseEvent(target, eventName, ...params)
{
	target[eventName](...params)
}

export class Dropdown extends Component
{
	#id;
	#styleClass;
	#icon
	#state;
	#value;
	#htmlItems;
	#currentValue;
	static OPEN = 1
	static CLOSE = 0

	constructor(id=null, styleClass, dropIcon = null, Items=[], adapterCallback=null) {
		if (styleClass === null)
		{
			console.error('styleClass attribute must be defined.');
			return undefined;
		}
		if (Items.length === 0)
		{
			console.error('Items must be defined.');
			return undefined;
		}
		if (!adapterCallback && typeof adapterCallback !== Function)
		{
			console.error('An adapter must be specified');
			return undefined;
		}
		if (!dropIcon){
			console.error('The dropdown icon must be specified [innerHTML]');
			return undefined;
		}

		super();
		this.#id = id;
		this.#styleClass = styleClass;
		this.#value = Items[0].value;
		this.#htmlItems = []
		this.#state = Dropdown.CLOSE
		this.#icon = dropIcon
		Items.forEach(item=>{
			this.#htmlItems.push(adapterCallback(item))
		})
		this.create()
	}

	#getValue(value)
	{
		return this.#htmlItems.find(item => item.getAttribute('itemValue') === value)
	}

	setValue(value)
	{
		const item = this.#getValue(value)
		if (this.#getValue(value) !== undefined)
		{
			this.#currentValue.replaceChildren(item.cloneNode(true))
		}
	}
	// Here I have to check if the cookie is set to a lang other than the default
	// then implement the adapterCallback to create list of items from [Items]
	create() {
		let icon = button(null, 'b_dropIcon', null, this.#icon),
			currentItem = block(null, 'b_currentItem', null),
			selectedItem = block(null, 'b_selectedValue', [currentItem, icon]),
			listItems = block(null, 'b_listItems', []),
			dropDown = block(this.#id, 'b_dropdown', [selectedItem, listItems]);

		dropDown.classList.add(...this.#styleClass.split(' '))

		this.#currentValue = currentItem;
		listItems.append(...this.#htmlItems)
		selectedItem.onclick = ()=>{
			if (this.#state === Dropdown.CLOSE)
			{
				listItems.style = 'display: block !important;';
				this.#state = Dropdown.OPEN
			}
			else if (this.#state === Dropdown.OPEN)
			{
				listItems.removeAttribute('style')
				this.#state = Dropdown.CLOSE
			}
		}
		this.#htmlItems.forEach(item =>{
			item.onclick = ()=>{
				currentItem.replaceChildren(item.cloneNode(true))
				selectedItem.click()
				riseEvent(this, 'onChange', item.getAttribute('itemValue'))
			}
		})
		currentItem.append(this.#htmlItems[0].cloneNode(true))
		this.component = dropDown;
	}
}

export class router
{
	/**
	 * @type {Component}
	 */
	#entry;
	/**
	 * @type {Component} #theDefault
	 */
	#theDefault;
	static old;

	/**
	 * @param {Component} entry
	 * @param {Component} theDefault
	 */
	constructor(entry, theDefault)
	{
		this.#theDefault = theDefault;
		this.#entry = entry;
		this.old = entry.path;
		app.append(this.#entry.getHTML())
	}


	updateOLD()
	{
		this.old = document.location.pathname;
	}

	watch()
	{
		window.onpopstate = ()=>{
			this.resolve(this.old) // needs a rerender here to seem as it reloads
		}

		setInterval(()=>{
			let newPath = document.location.pathname;
			if (newPath !== this.old)
			{
				this.old = newPath;
				this.resolve(newPath);
			}
		},60)
	}


	/**@param {string []} path */
	#purify(paths)
	{
		let pure = [];
		for (let i = 0; i < paths.length; i++) {
			const path = paths[i];

			if (path !== '' || i === 0)
				pure.push('/'+path);
		}
		return pure;
	}


	/**@param {string} path */
	resolve(path)
	{
		
		let paths = this.#purify(path.split('/'));
	
		let component = this.#entry.hasRoute(paths);
		if (!component)
		{
			if (app === this.#entry.component.parentNode)
				app.removeChild(this.#entry.getHTML())
			app.append(this.#theDefault.getHTML());
		}
		else
		{
			if (app === this.#theDefault.component.parentNode)
				app.removeChild(this.#theDefault.component)
			app.append(component);
		}
	}

	static push(path)
	{
		history.pushState('', '', path)
	}

}

function provisory()
{
	let prov = create('span');

	prov.className = 'provisory'
	return prov
}

/**
 * @param {String} input
 * **/
function bcode(input) {
	const placeholderRegex = /%([^%:]+):([^%]+)%/g;
	let calls = []
	const result = input.replace(placeholderRegex, (match, functionName, paramStr) => {
		const params = paramStr.split(':');

		calls.push({func: functionName, args: params})
		let prov = provisory().outerHTML
		return prov;
	});

	let p = paragraph(null, null, '')

	p.innerHTML = result
	let provs = p.querySelectorAll('.provisory');
	provs.forEach((e, i) =>{
		e.replaceWith(eval(calls[i].func)(...(calls[i].args)))
	})
	return p;
}