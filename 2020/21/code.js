import {readFile} from '../../helpers.js';

readFile( 'input.txt', true ).then( lines => {
	const food = []
	lines.forEach( line => {
		const parts = line.slice( 0, - 1 ).split( ' (contains ' )

		food.push( {
			ingredients: parts[ 0 ].split( ' ' ),
			allergens: parts[ 1 ].split( ', ' )
		} )
	} )

	console.log( solve1( food ) );
	console.log( solve2( food ) );
} )

function solve1( food ) {
	const allergens = Object.values( parseAllergens( food ) ).flat()
	let safeIngredients = 0;

	food.forEach( f => {
		f.ingredients.forEach( ingredient => {
			if ( ! allergens.includes( ingredient ) ) {
				safeIngredients ++
			}
		} )
	} )

	return safeIngredients
}

function solve2( food ) {

	const allergens = parseAllergens( food )
	let allFound = false;

	while ( ! allFound ) {
		allFound = true;

		for ( let i in allergens ) {
			if ( Array.isArray( allergens[ i ] ) && allergens[ i ].length === 1 ) {
				allFound = false
				allergens[ i ] = allergens[ i ][ 0 ]

				for ( let j in allergens ) {
					if ( Array.isArray( allergens[ j ] ) && allergens[ j ].includes( allergens[ i ][ 0 ] ) ) {
						allergens[ j ] = allergens[ j ].filter( i => i !== allergens[ i ][ 0 ] )
					}
				}
			}
		}
	}

	let ordered = []
	for ( let a in allergens ) {
		ordered.push( {a, i: allergens[ a ]} )
	}

	return ordered
		.sort( ( a1, a2 ) => {
			return a1.a.charAt( 0 ) === a2.a.charAt( 0 ) ? ( a1.a.charAt( 1 ) > a2.a.charAt( 1 ) ? 1 : - 1 ) : ( a1.a.charAt( 0 ) > a2.a.charAt( 0 ) ? 1 : - 1 )
		} )
		.map( o => o.i )
		.join( ',' )
}

function parseAllergens( food ) {
	let allergens = {}

	food.forEach( f => {
		f.allergens.forEach( allergen => {
			if ( typeof allergens[ allergen ] === 'undefined' ) {
				allergens[ allergen ] = []
			}

			allergens[ allergen ].push( f.ingredients )
		} )
	} )

	for ( let allergen in allergens ) {
		let allergenFood = allergens[ allergen ],
			commonAllergens = allergenFood.pop()

		while ( allergenFood.length > 0 ) {
			commonAllergens = intersection( commonAllergens, allergenFood.pop() )
		}

		allergens[ allergen ] = commonAllergens
	}

	return allergens;
}

function intersection( firstArray, secondArray ) {
	return firstArray.filter( element => secondArray.includes( element ) )
}
