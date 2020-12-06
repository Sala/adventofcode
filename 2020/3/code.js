import {readFile} from '../../helpers.js'
let matrix = [], patternLength, slopeHeight;

readFile( 'input.txt', true ).then( lines => {

	lines.forEach( ( line, index ) => {
		matrix[ index ] = Array.from( line ).map( c => c === '#' ? 1 : 0 )
	} )

	patternLength = matrix[ 0 ].length
	slopeHeight = matrix.length

	console.log( solve( 3 ) );
	console.log( solve( 1, 1 ) * solve( 3, 1 ) * solve( 5, 1 ) * solve( 7, 1 ) * solve( 1, 2 ) );
} )

function solve( stepLeft, stepDown = 1 ) {
	let countTrees = 0;
	let slopeI = stepDown, slopeJ = stepLeft;
	do {
		countTrees += matrix[ slopeI ][ slopeJ ]

		slopeI += stepDown
		slopeJ = ( slopeJ + stepLeft ) % patternLength;
	} while ( slopeI < slopeHeight )

	return countTrees
}

