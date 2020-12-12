console.log( solve1( 3005290 ) );
console.log( fastSolve3( 3005290, false ) );

let stop = false
for ( let i = 1; i <= 100 && ! stop; i ++ ) {
	/* testing slow solution with the fast one just to find if it works and adjust indexes */
	if ( slowSolve2( i ) !== fastSolve3( i, false ) ) {
		console.log( slowSolve2( i ) );
		console.log( fastSolve3( i, true ) );
		console.log( '----------------------------------' );
		console.log( i );
		stop = true;
	}
}

function solve1( elvesNr ) {
	let elves = generateElves( elvesNr )

	while ( elves.length > 1 ) {
		const elvesCount = elves.length

		for ( let i = 0; i < elvesCount; i += 2 ) {
			const nextElf = i === elvesCount - 1 ? elves[ 0 ] : elves[ i + 1 ]
			elves[ i ].p += nextElf.p
			nextElf.p = 0
		}

		elves = elves.filter( e => e.p )
	}

	return elves[ 0 ].i;
}

function slowSolve2( elvesNr ) {
	let elves = generateElves( elvesNr ),
		currentElvLabel = 0

	while ( elves.length > 1 ) {
		const elvesCount = elves.length;
		let currentElvIndex = elves.findIndex( elv => elv.i > currentElvLabel )

		if ( elvesCount % 1000 === 0 ) {
			console.log( elvesCount );
		}

		if ( currentElvIndex === - 1 ) {
			currentElvIndex = 0
		}

		const currentElv = elves[ currentElvIndex ]

		currentElvLabel = currentElv.i

		const otherElvIndex = ( currentElvIndex + ( elvesCount % 2 === 0 ? elvesCount / 2 : ( elvesCount - 1 ) / 2 ) ) % elvesCount,
			otherElv = elves[ otherElvIndex ]

		otherElv.p = 0

		for ( let i = otherElvIndex + 1; i < elves.length; i ++ ) {
			elves[ i - 1 ] = elves[ i ];
		}
		elves.length --
		/* trying to find the fastest remove from an array */
		//	elves = elves.filter( e => e.p )
		//	elves = elves.slice( 0, otherElvIndex ).concat( elves.slice( otherElvIndex + 1 ) )
		//	elves = [ ...elves.slice( 0, otherElvIndex ), ...elves.slice( otherElvIndex + 1 ) ]
	}

	return elves.pop().i;
}

function fastSolve3( elvesNr, log = true ) {
	let elves = generateElves( elvesNr ),
		currentElvLabel = 0

	while ( elves.length > 1 ) {
		let elvesCount = elves.length;
		let currentElvIndex = elves.findIndex( elv => elv.i > currentElvLabel )

		if ( currentElvIndex === - 1 ) {
			currentElvIndex = 0
		}

		log && console.log( currentElvLabel, elves[ currentElvIndex ].i, currentElvIndex );

		for ( let i = 0; i < elvesCount / 3; i ++ ) {
			let nextElvIndex = ( currentElvIndex + i + parseInt( elvesCount / 2 ) + i )

			if ( nextElvIndex >= elves.length ) {
				nextElvIndex = nextElvIndex === elves.length ? 0 : nextElvIndex % elves.length
			}
			elves[ nextElvIndex ].p = 0

			currentElvLabel = elves[ ( currentElvIndex + i ) % elves.length ].i

			log && console.log( `${currentElvLabel} -> ${elves[ nextElvIndex ].i}` );

			elvesCount --
		}

		log && console.log( '----------' );

		elves = elves.filter( e => e.p )

		log && console.log( elves.map( e => e.i ).join( ' ' ) );
	}

	return elves.pop().i;
}

function generateElves( elvesNr ) {
	let elves = []

	for ( let i = 1; i <= elvesNr; i ++ ) {
		elves.push( {p: 1, i: i} )
	}

	return elves;
}
