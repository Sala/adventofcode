import {readFile} from '../../helpers.js';

readFile( 'input.txt', true ).then( lines => {
	const players = {}
	let player

	lines.forEach( line => {
		if ( line.includes( 'Player' ) ) {
			player = line.match( /\d/ )[ 0 ]
			players[ player ] = []
		} else {
			players[ player ].push( parseInt( line ) )
		}
	} )

	console.log( normalCombat( [ ...players[ 1 ] ], [ ...players[ 2 ] ] ) );

	const newPlayers = recursiveCombat( players );

	console.log( score( newPlayers[ 1 ].length ? newPlayers[ 1 ] : newPlayers[ 2 ] ) );
} )

function normalCombat( playerOne, playerTwo ) {
	while ( playerOne.length && playerTwo.length ) {
		let p1 = playerOne.shift()
		let p2 = playerTwo.shift()

		if ( p1 > p2 ) {
			playerOne.push( p1, p2 )
		} else {
			playerTwo.push( p2, p1 )
		}
	}

	return playerOne.length ? score( playerOne ) : score( playerTwo )
}

function recursiveCombat( players ) {
	let rounds = [],
		notRepeating = true

	while ( players[ 1 ].length && players[ 2 ].length && notRepeating ) {
		const round = players[ 1 ].join( '' )
		if ( rounds.includes( round ) ) {
			notRepeating = false;
			players[ 2 ] = []
		} else {
			rounds.push( round )

			const p1 = players[ 1 ].shift()
			const p2 = players[ 2 ].shift()

			if ( players[ 1 ].length >= p1 && players[ 2 ].length >= p2 ) {
				const newPlayers = recursiveCombat( {1: [ ...players[ 1 ].slice( 0, p1 ) ], 2: [ ...players[ 2 ].slice( 0, p2 ) ]} )

				if ( newPlayers[ 1 ].length ) {
					players[ 1 ].push( p1, p2 )
				} else {
					players[ 2 ].push( p2, p1 )
				}
			} else if ( p1 > p2 ) {
				players[ 1 ].push( p1, p2 )
			} else {
				players[ 2 ].push( p2, p1 )
			}
		}
	}

	return {
		1: players[ 1 ],
		2: players[ 2 ]
	}
}

function score( cards ) {
	return cards.reduce( ( sum, card, index ) => sum + ( cards.length - index ) * card, 0 )
}
