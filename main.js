function addIngredient() {
	let list = document.getElementById('cocktail-ingredients')
	let input = document.getElementById('cocktail-add-ingredient')
	let val = input.value
	for(i in list.childNodes) {
		if(val == list.childNodes[i].value) {
			let ni = document.createElement('div')
			let te = document.createTextNode(val)
			let de = document.createElement('button')
			de.setAttribute('class', 'delete-button')
			de.innerText = 'x'
			de.addEventListener('click', () => {deleteIngredient(val)})
			ni.dataset.value = val
			ni.appendChild(te)
			ni.appendChild(de)
			document.getElementById('selected-ingredients').appendChild(ni)
			input.value = ""
			search_cocktails()
		}
	}
}

function deleteIngredient(val) {
	let list = document.getElementById('selected-ingredients')
	for(i in list.childNodes) {
		let node = list.childNodes[i]
		if(node.nodeType == Node.ELEMENT_NODE && node.dataset.value == val) {
			list.removeChild(node)
			search_cocktails()
		}
	}
}

function search_cocktails() {
	// getting tags
	let ingredients_div = document.getElementById('selected-ingredients')
	let searched_ingredients = []
	for(i in ingredients_div.childNodes) {
		let node = ingredients_div.childNodes[i]
		if(node.nodeType == Node.ELEMENT_NODE) {
			searched_ingredients.push(node.dataset.value)
		}
	}
	// searching cocktails
	let results = []
	for(name in cocktails) {
		let cocktail = cocktails[name]
		// we make an object of all the ingredients to find, 0 if not found 1 if found
		let ingredients_matched = {}
		for(i in searched_ingredients) {
			let ingredient = searched_ingredients[i]
			ingredients_matched[ingredient] = 0
		}
		// we search the ingredients
		for(i in cocktail) {
			let ingredient = cocktail[i]
			if(ingredient["tag"] in ingredients_matched) {
				ingredients_matched[ingredient["tag"]] = 1
			}
		}
		// we check the state of the search object
		let score = 0
		for(ingredient in ingredients_matched) {
			score += ingredients_matched[ingredient]
		}
		// Adding all positive score to the results
		if(score > 0) {
			results.push({"name": name, "score":score, "matches":ingredients_matched})
		}
	}
	// sorting resulsts by score
	results.sort((a,b) => b.score - a.score)
	// printing results
	let results_div = document.getElementById('results')
	results_div.innerHTML = ''
	let perfect_score = searched_ingredients.length
	for(i in results) {
		let result = results[i]
		results_div.appendChild(create_result_div(result.name, result.matches, perfect_score == result.score))
	}
}

function create_result_div(name, matches, perfect_score = False) {
	let div = document.createElement('div')
	div.setAttribute('class', 'result')
	// making link
	let n = document.createElement('a')
	if(perfect_score) {
		n.setAttribute('class', 'perfect-match')
	}
	n.setAttribute('href', '#' + name)
	n.innerText = name
	// making the description
	let p = document.createElement('p')
	for(match in matches) {
		let e = document.createElement('span')
		e.innerText = match
		if(matches[match]) { // ingredient is in
			e.setAttribute('class', 'is-in')
		} else {
			e.setAttribute('class', 'is-not-in')
		}
		p.appendChild(e)
	}
	div.appendChild(n)
	div.appendChild(p)
	return div
}