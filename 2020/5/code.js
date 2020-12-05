const {readFile} = require( '../../helpers' );

readFile( 'input.txt', true ).then( tickets => {
	tickets = tickets.map( ticket => parseTicket( ticket ) )

	console.log( solve1( tickets ) );
	console.log( solve2( tickets ) );
} )

function solve1( tickets ) {
	return Math.max( ...tickets )
}

function solve2( tickets ) {
	let myTicket;

	tickets.sort().forEach( ( ticket, index ) => {
		const prev = tickets[ index - 1 ];

		if ( prev && ticket - prev === 2 ) {
			myTicket = ticket - 1
		}
	} )

	return myTicket;
}

function parseTicket( ticket ) {
	const row = binarySearch( 0, 127, Array.from( ticket.slice( 0, 7 ) ) );
	const column = binarySearch( 0, 7, Array.from( ticket.slice( 7 ) ) );

	return row * 8 + column
}

/**
 * it is what it says
 * @param min
 * @param max
 * @param steps
 * @returns {*}
 */
function binarySearch( min, max, steps ) {
	if ( steps.length === 0 ) {
		return min
	} else {
		const currentStep = steps.shift()

		if ( currentStep === 'F' || currentStep === 'L' ) {
			max = min + parseInt( ( max - min ) / 2 )
		} else {
			min = min + parseInt( ( max + 1 - min ) / 2 )
		}

		return binarySearch( min, max, steps )
	}
}
