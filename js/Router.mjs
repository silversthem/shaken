/*
	Basic router for the app
	it works by reading the url after the #
	and parsing it as follows :
	site.com#route?param1=value1&param2=value2
	will call the route "route" with an object {param1:value1, param2:value2}
	Also contains static functions to help usage
	Router.go(route, {param1:value1}) will do a browser hash change, calling the route on serving routers
	note that this does not reload the page
	Router.update({param1:value2})
	will update parameters in the browser hash without changing the route
*/

// Returns a object of {key:value} from a parameter string
// key1=value1&key2=value2&key3 will return {key1:"value1", key2:"value2", key3:""}
// note that keys and values are always string
function parseParameters(paramStr) {
	return paramStr.split('&').filter(param => param != '').map(param => {
		let keyValueSplit = param.split('=')
		return [keyValueSplit[0], keyValueSplit.slice(1).join('=')]
	}).reduce((obj, keyValPair) => Object.assign(obj, {[keyValPair[0]]:keyValPair[1]}), {})
}

// Basically the opposite of the parseParameters function
// Takes an object and returns a string
// {key1:"value1", key2:"value2", key3:""} will return key1=value1&key2=value2&key3
function writeParameters(params) {
	return Object.keys(params).map(key => (params[key] != '') ? key + '=' + params[key] : key).join('&')
}

export class Router {
	// initializes the router
	constructor() {
		this.routes = {}
	}
	// Sets a route, basically a function to call when the url matches
	setRoute(route, func) {
		this.routes[route] = func
	}
	// Reads url and calls right route if possible
	readUrl(url) {
		let {route, parameters: params} = Router.parseURL(url)
		// calling route
		if(route in this.routes) {
			return this.routes[route](params) ?? true
		}
		return false
	}
	// Sets up the router in a window
	serve() {
		// parsing current url
		let currentUrl = window.location.href
		this.readUrl(currentUrl)
		// setting onhashchange event
		window.addEventListener('hashchange', () => {
			this.readUrl(window.location.href)
		})
	}

	// Parses an url into a {route:route, parameters:{...}} object
	static parseURL(url) {
		url = decodeURI(url)
		let splitUrl = url.split('#')
		let route = ''
		let params = {}
		// if the url has the # separator, only taking url after the first # to parse
		if(splitUrl.length > 1) {
			url = splitUrl.slice(1).join('#')
			// extracting params from queried route
			let paramsSplit = url.split('?')
			route = paramsSplit[0]
			params = parseParameters(paramsSplit.slice(1).join('?'))
		}
		return {'route': route, 'parameters': params}
	}

	// static function to go to the desired route
	static go(route = '', params = {}) {
		let newHash = '#' + route
		if(Object.keys(params).length > 0) {
			newHash += '?' + writeParameters(params)
		}
		window.location.href = newHash
	}
	// static function to update parameters without changing route
	static update(newParams = {}) {
		let {route, parameters: params} = Router.parseURL(document.location.href)
		// updating params
		Object.keys(newParams).forEach(param => params[param] = newParams[param])
		// changing url
		Router.go(route, params)
	}
}