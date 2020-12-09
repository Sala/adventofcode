import {readFile, sum} from '../../helpers.js'

readFile( 'input.txt', true ).then( lines => {
	const numbers = lines.map( line => parseInt( line ) )

	const notOkNumber = solve1( numbers, 25 )
	const weakness = solve2( notOkNumber, numbers )

	console.log( notOkNumber );
	console.log( weakness );
} )

function solve1( numbers, groupLength ) {
	let currentIndex = groupLength + 1;
	let numberFound = null;

	while ( currentIndex <= numbers.length && ! numberFound ) {
		const startIndex = currentIndex - groupLength - 1

		if ( validateNumber( numbers[ currentIndex - 1 ], numbers.slice( startIndex, startIndex + groupLength ) ) ) {
			currentIndex ++
		} else {
			numberFound = numbers[ currentIndex - 1 ]
		}

	}

	return numberFound
}

function solve2( number, numbers ) {
	let encryptionWeakness = 0;

	numbers.some( ( n, index ) => {
		let sumSet = [],
			i = index;

		while ( sum( sumSet ) < number ) {
			sumSet.push( numbers[ i ++ ] )
		}

		if ( sum( sumSet ) === number ) {
			encryptionWeakness = Math.min( ...sumSet ) + Math.max( ...sumSet );
		}

		return encryptionWeakness
	} )

	return encryptionWeakness
}

function validateNumber( number, group ) {
	let isValidNumber = false;

	for ( let i = 0; i < group.length - 1; i ++ ) {
		for ( let j = i + 1; j < group.length; j ++ ) {
			isValidNumber = isValidNumber || ( group[ i ] + group[ j ] === number )
		}
	}

	return isValidNumber;
}
