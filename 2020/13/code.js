import {readFile} from '../../helpers.js';

readFile( 'input.txt', true ).then( lines => {
	const earliestTime = BigInt( parseInt( lines[ 0 ] ) )
	const busses = lines[ 1 ].split( ',' )
	                         .map( ( bus, i ) => bus === 'x' ? null : {i, r: BigInt( bus - i % bus ), m: BigInt( bus )} )
	                         .filter( n => n )

	console.log( solve1( earliestTime, busses ) );
	console.log( fastMath( busses ) )
	console.log( slowBrute( busses ) )
} )

function solve1( earliestTime, busses ) {
	const bigZero = BigInt( 0 )
	let myBus = bigZero, timeToWait = bigZero;

	while ( ! myBus ) {
		if ( busses.some( bus => earliestTime % bus.m === bigZero ) ) {
			myBus = busses.find( bus => earliestTime % bus.m === bigZero ).m
		} else {
			timeToWait ++
			earliestTime ++
		}
	}

	return parseInt( myBus * timeToWait )
}

function slowBrute( busses ) {
	busses = busses.sort( ( b1, b2 ) => parseInt( b2.m - b1.m ) )

	let timeToLeave = false,
		biggestBus = busses[ 0 ],
		nextTime = biggestBus.r - biggestBus.m;

	while ( ! timeToLeave ) {
		nextTime += biggestBus.m;

		timeToLeave = busses.every( bus => ( nextTime + BigInt( bus.i ) ) % bus.m === BigInt( 0 ) ) ? nextTime : false
	}

	return parseInt( timeToLeave );
}

function fastMath( numbers ) {
	const M = numbers.reduce( ( p, n ) => p * BigInt( n.m ), BigInt( 1 ) )
	const sum = numbers.reduce( ( s, n ) => s + BigInt( n.r ) * ( M / BigInt( n.m ) ) * inv( M / n.m, n.m ), BigInt( 0 ) )

	return parseInt( sum % M );
}

function inv( number, mod ) {
	const m0 = mod;
	let x0 = BigInt( 0 ), x1 = BigInt( 1 );

	if ( mod === 1 ) {
		return BigInt( 0 );
	}

	while ( number > 1 ) {
		const q = BigInt( parseInt( number / mod ) );
		let t = mod;

		mod = number % mod;
		number = t;

		t = x0;

		x0 = x1 - q * x0;

		x1 = t;
	}

	if ( x1 < 0 ) {
		x1 += m0;
	}

	return BigInt( x1 );
}


