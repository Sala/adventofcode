const reminderDivide = BigInt( 20201227 )

//solve(17807724, 5764801)
solve(8335663, 8614349)


function solve( doorPublic, keyPublic ) {
	const doorLoopSize = getLoopSize( doorPublic )
	const keyLoopSize = getLoopSize( keyPublic )

	console.log( encrypt( keyPublic, doorLoopSize ) );
	console.log( encrypt( doorPublic, keyLoopSize ) );
}

function getLoopSize( key, initialNumber = 7 ) {
	let loopSize = 1;
	let number = BigInt( initialNumber )

	while ( number % reminderDivide !== BigInt( key ) ) {
		number = ( number * BigInt( initialNumber ) ) % reminderDivide
		loopSize ++
	}

	return loopSize
}

function encrypt( key, loopSize ) {
	let number = BigInt( 1 )

	while ( loopSize -- ) {
		number = ( number * BigInt( key ) ) % reminderDivide
	}

	return parseInt( number )
}
