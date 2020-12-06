import {readFile} from '../../helpers.js'

readFile( 'input.txt', true ).then( lines => {
	lines = lines.map( number => parseInt( number ) );

	solve1( lines )
	solve2( lines )
} )

function solve1( input ) {
	const l = input.length
	for ( let i = 0; i < l - 2; i ++ ) {
		for ( let j = i + 1; j < l - 1; j ++ ) {
			if ( input[ i ] + input[ j ] === 2020 ) {
				console.log( input[ i ] * input[ j ] );
			}
		}
	}
}

function solve2( input ) {
	const l = input.length
	for ( let i = 0; i < l - 3; i ++ ) {
		for ( let j = i + 1; j < l - 2; j ++ ) {
			for ( let k = j + 1; k < l - 1; k ++ ) {
				if ( input[ i ] + input[ j ] + input[ k ] === 2020 ) {
					console.log( input[ i ] * input[ j ] * input[ k ] );
				}
			}
		}
	}
}
