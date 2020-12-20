import {readFile} from '../../helpers.js';

readFile( 'input.txt', true ).then( lines => {

	const intervals = lines.map( line => {
		const parts = line.split( '-' )

		return {
			from: parseInt( parts[ 0 ] ),
			to: parseInt( parts[ 1 ] ),
		}
	} )

	console.log( solve1( intervals.sort( ( i1, i2 ) => i1.to - i2.to ) ) );
	console.log( solve2( intervals.sort( ( i1, i2 ) => i1.from - i2.from ) ) );
} )

function solve1( intervals ) {

	let minIP = intervals[ 0 ].to + 1;

	intervals.forEach( interval => {
		if ( minIP >= interval.from && minIP <= interval.to ) {
			minIP = interval.to + 1
		}
	} )

	return minIP
}

function solve2( intervals ) {
	let validIPs = 0

	for ( let n = 0; n <= 4294967295; n ++ ) {
		if ( n % 10000000 === 0 ) {
			console.log( n );
			/* from time to time, remove intervals that we've past so we don't have to always verify them */
			intervals = intervals.filter( i => i.to > n || i.from > n )
		}

		if ( intervals.every( i => n < i.from || n > i.to ) ) {
			validIPs ++;
		}
	}

	return validIPs
}
