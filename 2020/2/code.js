import {readFile} from '../../helpers.js'

readFile( 'input.txt', true ).then( lines => {
	console.log( solve1( lines ) );
	console.log( solve2( lines ) );
} )

function solve1( lines ) {
	let validPasswords = 0;

	lines.forEach( line => {
		const match = /(\d*)-(\d*) (\S): (.*)/gm.exec( line );

		if ( match ) {
			const min = parseInt( match[ 1 ] ),
				max = parseInt( match[ 2 ] ),
				letter = match[ 3 ],
				password = match[ 4 ]

			validPasswords += isPasswordValid( min, max, letter, password ) ? 1 : 0
		}
	} )

	return validPasswords
}

function solve2( lines ) {
	let validPasswords = 0;

	lines.forEach( line => {
		const regex = /(\d*)-(\d*) (\S): (.*)/gm;

		const match = regex.exec( line );
		const index1 = parseInt( match[ 1 ] ) - 1,
			index2 = parseInt( match[ 2 ] ) - 1,
			letter = match[ 3 ],
			password = match[ 4 ]

		validPasswords += isPasswordValid2( index1, index2, letter, password ) ? 1 : 0
	} )

	return validPasswords
}

/**
 * A letter should a appear between min and max occurrences
 * @param min
 * @param max
 * @param letter
 * @param password
 * @return {boolean}
 */
function isPasswordValid( min, max, letter, password ) {
	const count = password.split( '' ).filter( l => l === letter ).length

	return count >= min && count <= max;
}

/**
 * A letter should be either on index1 or on index2
 * @param index1
 * @param index2
 * @param letter
 * @param password
 * @return {boolean}
 */
function isPasswordValid2( index1, index2, letter, password ) {
	return ( password[ index1 ] === letter && password[ index2 ] !== letter ) || ( password[ index1 ] !== letter && password[ index2 ] === letter )
}
