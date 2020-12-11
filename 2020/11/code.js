import {readFile, surroundingPositions} from '../../helpers.js';

readFile( 'input.txt', true ).then( rows => {
	const room = rows.map( row => {
		return row.split( '' ).map( position => position === 'L' ? 0 : null )
	} )

	console.log( solve1( room ) );
	console.log( solve2( room ) )
} )

function solve1( room ) {
	let peopleMoving = true
	let round = 0

	while ( peopleMoving ) {
		round ++
		peopleMoving = false

		let newRoom = []

		room.forEach( ( row, lineIndex ) => {
			let newLine = []
			row.forEach( ( position, positionIndex ) => {
				let occupiedSeats = 0;
				surroundingPositions( lineIndex, positionIndex, true ).forEach( surroundingPosition => {
					if ( room[ surroundingPosition.x ] && room[ surroundingPosition.x ][ surroundingPosition.y ] ) {
						occupiedSeats ++;
					}
				} )

				if ( position === 0 && occupiedSeats === 0 ) {
					newLine.push( 1 )
					peopleMoving = true;
				} else if ( position === 1 && occupiedSeats >= 4 ) {
					newLine.push( 0 )
					peopleMoving = true
				} else {
					newLine.push( position )
				}
			} )
			newRoom.push( newLine )
		} )
		//draw( newRoom )
		room = newRoom
	}

	return occupiedSeats( room );
}

function solve2( room ) {
	let peopleMoving = true
	let round = 0

	while ( peopleMoving ) {
		round ++
		peopleMoving = false

		let newRoom = []

		room.forEach( ( row, lineIndex ) => {
			let newLine = []
			row.forEach( ( position, positionIndex ) => {
				let occupiedSeats = 0;
				surroundingPositions( null, null, true ).forEach( surroundingPosition => {
					let newLineIndex = lineIndex + surroundingPosition.y
					let newPositionIndex = positionIndex + surroundingPosition.x
					while ( room[ newLineIndex ] && room[ newLineIndex ][ newPositionIndex ] === null ) {
						newLineIndex += surroundingPosition.y
						newPositionIndex += surroundingPosition.x
					}

					if ( room[ newLineIndex ] && room[ newLineIndex ][ newPositionIndex ] ) {
						occupiedSeats ++
					}
				} )

				if ( position === 0 && occupiedSeats === 0 ) {
					newLine.push( 1 )
					peopleMoving = true;
				} else if ( position === 1 && occupiedSeats >= 5 ) {
					newLine.push( 0 )
					peopleMoving = true
				} else {
					newLine.push( position )
				}
			} )
			newRoom.push( newLine )
		} )

		room = newRoom
	}

	return occupiedSeats( room );
}

function draw( room ) {
	room.forEach( row => {
		console.log( row.map( position => position === null ? '.' : ( position === 1 ? '#' : 'L' ) ).join( ' ' ) );
	} )
	console.log( '\r\n' );
}

function occupiedSeats( room ) {
	let empty = 0
	room.forEach( row => {
		row.forEach( position => {
			if ( position === 1 ) {
				empty ++;
			}
		} )
	} )
	return empty
}
