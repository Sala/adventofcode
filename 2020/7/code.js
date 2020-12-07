import {readFile} from '../../helpers.js'

const myBag = 'shiny gold';
const bagRules = {};

readFile( 'input.txt', true ).then( lines => {

	lines.forEach( line => {
		const rule = {}
		const parts = line.split( ' bags contain' )
		if ( parts ) {
			rule.outside = parts [ 0 ]
			rule.inside = {};

			parts[ 1 ].split( ', ' ).forEach( bags => {
				const inside = /(\d*) (.*) bag/gm.exec( bags.trim() )

				if ( inside && ! isNaN( parseInt( inside[ 1 ] ) ) ) {
					rule.inside[ inside[ 2 ] ] = parseInt( inside[ 1 ] )
				}
			} )

			if ( Object.keys( rule.inside ).length > 0 ) {
				bagRules[ rule.outside ] = rule.inside
			}
		}
	} )

	console.log( findBags( myBag ) );
	console.log( countInsideBags( myBag ) - 1 );
} )

function findBags( bag, foundBags = [] ) {
	let bagsCount = 0;

	for ( const bagColor in bagRules ) {
		if ( typeof bagRules[ bagColor ][ bag ] !== 'undefined' && ! foundBags.includes( bagColor ) ) {
			foundBags.push( bagColor )
			bagsCount += 1 + findBags( bagColor, foundBags )
		}
	}

	return bagsCount
}

function countInsideBags( bag ) {
	let insideBags = 1;

	if ( bagRules[ bag ] ) {
		for ( const color in bagRules[ bag ] ) {
			insideBags += bagRules[ bag ][ color ] * countInsideBags( color )
		}
	}

	return insideBags
}
