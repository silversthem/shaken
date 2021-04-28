/*
    Basic router for the app
    it works by reading the url after the #
    and parsing it as follows :
    site.com#route?param1=value1&param2=value2
    will call the route "route" with an object {param1:value1, param2:value2}
*/

export class Router {
    constructor() {
        this.routes = {}
    }
    // Sets a route, basically a function to call when the url matches
    setRoute(route, func) {
        this.routes[route] = func
    }
    // Reads url and calls right route if possible
    readUrl(url) {
        // if the url has the # separator, only taking url after the first #
        let splitUrl = url.split('#')
        if(splitUrl.length > 1) {
            url = splitUrl.slice(1).join('#')
        }
        // extracting params from queried route
        let paramsSplit = url.split('?')
        let route = paramsSplit[0]
        let params = {}
        if(paramsSplit.length > 1) {
            let paramsStr = paramsSplit.slice(1).join('?')
            let paramsTuples = paramsStr.split('&')
            for(const paramTuple of paramsTuples) {
                let tuple = paramTuple.split('=')
                let key = tuple[0]
                let value = null
                if(tuple.length > 1) {
                    value = tuple.slice(1).join('=')
                }
                params[key] = value
            }
        }
        // calling route
        if(route in this.routes) {
            this.routes[route](params)
            return True
        }
        return False
    }
    // Sets up the router in a window
    serve() {
        // parsing current url
        let currentUrl = window.location.href
        this.readUrl(currentUrl)
        // setting onhashchange event
        window.onhashchange(() => {
            this.readUrl(window.location.href)
        })
    }
}