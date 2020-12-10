import {readFile, multiply, sameArrays} from '../../helpers.js';

const combinationsCache = {}

readFile( 'input.txt', true ).then( lines => {
	const adapters = lines.map( line => parseInt( line ) ).sort( ( a1, a2 ) => a1 - a2 );
	/* more or less we're interested only on the differences */
	const differences = adapters.map( ( a, i ) => i === 0 ? a : a - adapters[ i - 1 ] ).concat( [ 3 ] )

	console.log( solve1( adapters ) );
	console.log( solve2( differences ) )

	/**
	 * This is way too slow. I knew that this is not the way after the first two minutes, but I still waited more than an hour
	 * console.log( slowCombinations( adapters ) );
	 */
} )

function solve1( adapters ) {
	let oneJ = 0, threeJ = 1

	adapters.forEach( ( adapter, index ) => {
		const previous = index === 0 ? 0 : adapters[ index - 1 ]

		if ( adapter - previous === 1 ) {
			oneJ ++
		} else if ( adapter - previous === 3 ) {
			threeJ ++
		}
	} )

	return oneJ * threeJ
}

function slowCombinations( adapters, startIndex = 0, level = '' ) {
	let count = 1;

	for ( let index = startIndex; index < adapters.length - 1; index ++ ) {
		const previous = index === 0 ? 0 : adapters[ index - 1 ]
		if ( adapters[ index + 1 ] - previous <= 3 ) {
			count += slowCombinations( adapters.filter( a => a !== adapters[ index ] ), index, `${level}|` )
		}
	}

	return count
}

/**
 * Remove consecutive adapters that have a difference of 3
 * @param adapters
 * @return {[]}
 */
function fewerAdapters( adapters ) {
	let newAdapters = [],
		delta = 0

	adapters.forEach( ( adapter, index ) => {
		const prev = index === 0 ? 0 : adapters[ index - 1 ]
		const next = index === adapters.length - 1 ? adapter + 3 : adapters[ index + 1 ]
		if ( next - prev === 6 ) {
			delta += 3
		} else {
			newAdapters.push( adapter - delta )
		}
	} )

	console.log( `removed ${delta / 3}` );

	return newAdapters
}

/**
 * Save number of consecutive differences, find combinations for those consecutive series and multiply them
 * @param differences
 * @return {number}
 */
function solve2( differences ) {
	const combinations = [];
	let consecutive = []
	differences.forEach( ( d, i ) => {
		if ( d < 3 ) {
			consecutive.push( d )
		} else {
			if ( consecutive.length > 1 ) {
				combinations.push( consecutive )
			}
			consecutive = []
		}
	} )

	return multiply( combinations.map( c => {
		if ( typeof combinationsCache[ c.length ] === 'undefined' ) {
			combinationsCache[ c.length ] = lameCombinations( c ).length
		}

		return combinationsCache[ c.length ];
	} ) );
}

function lameCombinations( adapters ) {
	let combinations = [ adapters ]

	adapters.forEach( ( adapter, index ) => {
			if ( index > 0 && adapters[ index - 1 ] + adapter <= 3 && adapters[ index - 1 ] <= adapter ) {
				lameCombinations( [ ...adapters.slice( 0, index - 1 ), adapter + adapters[ index - 1 ], ...adapters.slice( index + 1 ) ] ).forEach( combination => {
					if ( ! combinations.some( c => sameArrays( c, combination ) ) ) {
						combinations.push( combination )
					}
				} )
			}
		}
	)

	return combinations
}
