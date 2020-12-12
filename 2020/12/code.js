import {readFile} from '../../helpers.js';

readFile( 'input.txt', true ).then( instructions => {
	instructions = instructions.map( line => {
		const matches = /(\D)(\d*)/g.exec( line )

		return {
			direction: matches[ 1 ],
			steps: parseInt( matches[ 2 ] )
		}
	} )

	console.log( solve1( instructions ) );
	console.log( solve2( instructions ) )
} )

function solve1( instructions ) {
	let currentPosition = {
		direction: 'E',
		x: 0,
		y: 0
	}

	instructions.forEach( instruction => {
		currentPosition = move( currentPosition, {...instruction} )
	} )

	return Math.abs( currentPosition.x ) + Math.abs( currentPosition.y )
}

function solve2( instructions ) {
	let currentPosition = {
		w: {
			x: 10,
			y: 1
		},
		x: 0,
		y: 0
	}

	instructions.forEach( instruction => {
		currentPosition = move2( currentPosition, {...instruction} )
	} )

	return Math.abs( currentPosition.x ) + Math.abs( currentPosition.y )
}

function move( currentPosition, instruction ) {

	if ( instruction.direction === 'L' ) {
		switch ( currentPosition.direction ) {
			case 'N':
				switch ( instruction.steps ) {
					case 90:
						currentPosition.direction = 'W';
						break;
					case 180:
						currentPosition.direction = 'S';
						break;
					case 270:
						currentPosition.direction = 'E';
						break;
				}

				break;
			case 'E':
				switch ( instruction.steps ) {
					case 90:
						currentPosition.direction = 'N';
						break;
					case 180:
						currentPosition.direction = 'W';
						break;
					case 270:
						currentPosition.direction = 'S';
						break;
				}
				break;
			case 'S':
				switch ( instruction.steps ) {
					case 90:
						currentPosition.direction = 'E';
						break;
					case 180:
						currentPosition.direction = 'N';
						break;
					case 270:
						currentPosition.direction = 'W';
						break;
				}
				break;
			case 'W':
				switch ( instruction.steps ) {
					case 90:
						currentPosition.direction = 'S';
						break;
					case 180:
						currentPosition.direction = 'E';
						break;
					case 270:
						currentPosition.direction = 'N';
						break;
				}
				break;
		}
	}

	if ( instruction.direction === 'R' ) {
		switch ( currentPosition.direction ) {
			case 'N':
				switch ( instruction.steps ) {
					case 90:
						currentPosition.direction = 'E';
						break;
					case 180:
						currentPosition.direction = 'S';
						break;
					case 270:
						currentPosition.direction = 'W';
						break;
				}
				break;
			case 'E':
				switch ( instruction.steps ) {
					case 90:
						currentPosition.direction = 'S';
						break;
					case 180:
						currentPosition.direction = 'W';
						break;
					case 270:
						currentPosition.direction = 'N';
						break;
				}
				break;
			case 'S':
				switch ( instruction.steps ) {
					case 90:
						currentPosition.direction = 'W';
						break;
					case 180:
						currentPosition.direction = 'N';
						break;
					case 270:
						currentPosition.direction = 'E';
						break;
				}
				break;
			case 'W':
				switch ( instruction.steps ) {
					case 90:
						currentPosition.direction = 'N';
						break;
					case 180:
						currentPosition.direction = 'E';
						break;
					case 270:
						currentPosition.direction = 'S';
						break;
				}
				break;
		}
	}

	if ( instruction.direction === 'F' ) {
		instruction.direction = currentPosition.direction
	}

	switch ( instruction.direction ) {
		case 'N':
			currentPosition.y += instruction.steps
			break

		case 'E':
			currentPosition.x += instruction.steps
			break

		case 'S':
			currentPosition.y -= instruction.steps;
			break;

		case 'W':
			currentPosition.x -= instruction.steps
			break;
	}

	return currentPosition
}

function move2( currentPosition, instruction ) {

	const waypointX = currentPosition.w.x
	const waypointY = currentPosition.w.y

	if ( instruction.direction === 'L' ) {
		switch ( instruction.steps ) {
			case 90:
				currentPosition.w.x = - 1 * waypointY
				currentPosition.w.y = waypointX
				break;
			case 180:
				currentPosition.w.x = - 1 * waypointX
				currentPosition.w.y = - 1 * waypointY
				break;
			case 270:
				currentPosition.w.x = waypointY
				currentPosition.w.y = - 1 * waypointX
				break;
		}
	}

	if ( instruction.direction === 'R' ) {
		switch ( instruction.steps ) {
			case 90:
				currentPosition.w.x = waypointY
				currentPosition.w.y = - 1 * waypointX
				break;
			case 180:
				currentPosition.w.x = - 1 * waypointX
				currentPosition.w.y = - 1 * waypointY
				break;
			case 270:
				currentPosition.w.x = - 1 * waypointY
				currentPosition.w.y = waypointX
				break;
		}
	}

	if ( instruction.direction === 'F' ) {
		currentPosition.x += instruction.steps * currentPosition.w.x
		currentPosition.y += instruction.steps * currentPosition.w.y
	}

	switch ( instruction.direction ) {
		case 'N':
			currentPosition.w.y += instruction.steps
			break

		case 'E':
			currentPosition.w.x += instruction.steps
			break

		case 'S':
			currentPosition.w.y -= instruction.steps;
			break;

		case 'W':
			currentPosition.w.x -= instruction.steps
			break;
	}

	return currentPosition
}
