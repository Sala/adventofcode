import {readFile} from '../../helpers.js'

function solve( input ) {
	readFile( input, true ).then( discs => {

		discs = discs.map( disc => {
			const matches = /\#(\d) has (\d*).*position (\d*)/gm.exec( disc )
			const index = parseInt( matches[ 1 ] );
			const positions = parseInt( matches[ 2 ] );
			const start = parseInt( matches[ 3 ] );

			/* somehow, trying to find a common multiple */
			return ( time ) => ( time + start + index ) % positions === 0
		} )

		let time = 0;

		while ( ! discs.every( validateDisc => validateDisc( time ) ) ) {
			time ++;
		}

		console.log( time );
	} )
}

solve( 'input.txt' )
solve( 'second-input.txt' )
