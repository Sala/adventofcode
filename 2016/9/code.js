import {readFile} from '../../helpers.js'

readFile( 'input.txt' ).then( input => {

	input = input.replace( /(\r\n|\n|\r)/gm, '' );

	console.log( solve1( input ) );
	console.log( solve2( input ) );
} )

function solve1( input ) {
	let match;
	let length = input.length;

	while ( ( match = /\((\d*)x(\d*)\)/.exec( input ) ) !== null ) {
		const subStringLength = parseInt( match[ 1 ] ),
			multiply = parseInt( match[ 2 ] ),
			formatLength = 3 + String( subStringLength ).length + String( multiply ).length;

		length = length + ( multiply - 1 ) * subStringLength - formatLength;

		input = input.substring( formatLength + match.index + subStringLength );
	}

	return length;
}

function solve2( input ) {
	let match,
		rounds = 1,
		length = 0;

	console.time( 'run' );

	while ( ( match = /\((\d*)x(\d*)\)/.exec( input ) ) !== null ) {

		const subStringLength = parseInt( match[ 1 ] ),
			multiply = parseInt( match[ 2 ] ),
			formatLength = 3 + String( subStringLength ).length + String( multiply ).length,
			stringToMultiply = input.substring( match.index + formatLength, match.index + formatLength + subStringLength );

		length += match.index;

		/* here I've learned that I should only keep the remaining string and store the length until now. otherwise I will have a long string */
		input = input.substring( match.index + formatLength );

		for ( let i = 1; i <= multiply - 1; i ++ ) {
			input = stringToMultiply + input;
		}

		rounds ++;
	}

	console.timeEnd( 'run' );

	return length + input.length;
}
