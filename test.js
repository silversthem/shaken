import {AppDataController} from "/js/AppDataController.mjs"


class TestData {
	constructor() {
		this.t = new AppDataController({onLoadedEvent: (key) => {
			if(key == "cocktails") {
				console.log(this.t.cocktails)
			} else if(key == "tags") {
				console.log(this.t.tags)
			}
		}, onErrorLoadingEvent: (key) => {}})
	}
}

let t = new TestData()
