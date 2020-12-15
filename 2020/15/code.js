const puzzleInput = '9,6,0,10,18,2,1'

function solveInput( position, input, result = false ) {
	const numbers = {}

	input = input.split( ',' ).map( n => parseInt( n ) )

	input.forEach( ( number, index ) => {
		numbers[ number ] = {
			lastIndex: index + 1,
			beforeLastIndex: false
		}
	} )

	console.log( solve( position, numbers, input.pop() ) )
}

solveInput( 2020, puzzleInput )
solveInput( 30000000, puzzleInput )

function solve( numberOfRounds, numbers, lastNumber ) {

	let round = Object.values( numbers ).length

	while ( round < numberOfRounds ) {
		round ++

		if ( numbers[ lastNumber ].beforeLastIndex === false ) {
			lastNumber = 0
		} else {
			lastNumber = numbers[ lastNumber ].lastIndex - numbers[ lastNumber ].beforeLastIndex
		}

		if ( typeof numbers[ lastNumber ] === 'undefined' ) {
			numbers[ lastNumber ] = {
				lastIndex: round,
				beforeLastIndex: false
			}
		} else {
			numbers[ lastNumber ].beforeLastIndex = numbers[ lastNumber ].lastIndex
			numbers[ lastNumber ].lastIndex = round
		}
	}

	return lastNumber
}

