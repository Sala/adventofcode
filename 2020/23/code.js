//const input = 389125467
const input = 538914762

const cups = String( input ).split( '' ).map( n => parseInt( n ) )

slowSolve( 100, cups )

for ( let i = 10; i <= 1000000; i ++ ) {
	cups.push( i )
}

fastSolve( 10000000, cups )

function slowSolve( moves, cups ) {

	while ( moves ) {
		const currentCup = cups[ 0 ]
		const threeCups = cups.slice( 1, 4 )
		let destinationCup = currentCup

		do {
			destinationCup --

			if ( destinationCup === 0 ) {
				destinationCup = Math.max( ...cups )
			}
		} while ( threeCups.includes( destinationCup ) )

		cups = cups.join( '' ).replace( threeCups.join( '' ), '' ).replace( destinationCup, `${destinationCup}${threeCups.join( '' )}` ).split( '' ).map( n => parseInt( n ) )

		const first = cups.shift()
		cups.push( first )

		moves --
	}

	const oneIndex = cups.findIndex( cup => cup === 1 )

	console.log( cups.slice( oneIndex + 1 ).join( '' ) + cups.slice( 0, oneIndex ).join( '' ) );
}

function fastSolve( moves, cups ) {
	const smartCups = {}
	const cupsNumber = cups.length

	cups.forEach( ( cup, index ) => {
		smartCups[ cup ] = index === cupsNumber - 1 ? cups[ 0 ] : cups[ index + 1 ]
	} )

	let currentCup = cups[ 0 ]

	while ( moves -- ) {
		const nCup = smartCups[ currentCup ]
		const nnCup = smartCups[ nCup ]
		const nnnCup = smartCups[ nnCup ]

		let destinationCup = currentCup
		do {
			destinationCup --

			if ( destinationCup === 0 ) {
				destinationCup = cupsNumber
			}
		} while ( nCup === destinationCup || nnCup === destinationCup || nnnCup === destinationCup )

		/* after current cup comes the one after the last from the three */
		smartCups[ currentCup ] = smartCups[ nnnCup ]

		/* last cup from the 3 has next the one after destination */
		smartCups[ nnnCup ] = smartCups[ destinationCup ]

		/* after destination */
		smartCups[ destinationCup ] = nCup

		/* current cup is the one after the current one */
		currentCup = smartCups[ currentCup ]
	}

	console.log( parseInt( BigInt( smartCups[ 1 ] ) * BigInt( smartCups[ smartCups[ 1 ] ] ) ) );
}
