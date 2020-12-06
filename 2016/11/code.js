import {readFile} from '../../helpers.js'
import Container from './container.js';

const startingFloorIndex = 0;

const elevator = new Container( startingFloorIndex )
let floors = [];

/* the generator that will help us move each pair to the top */
let movingGenerator;
/* the pair that we're currently moving to the top */
let movingPair = null;

const state = {
	pairsDone: false,
	firstPairMoved: false,
	elevatorIsOnFloorWithPair: false,
	pairIsOnTheLastFloor: false
};

readFile( 'input.txt', true ).then( lines => {
	const generatorRegex = /(\w*) generator/g,
		microchipRegex = /(\w*)-compatible microchip/g;
	let match;

	lines.forEach( ( line, index ) => {
		floors[ index ] = new Container( index );
		while ( ( match = generatorRegex.exec( line ) ) !== null ) {

			floors[ index ].addGenerator( match[ 1 ].charAt( 0 ).toUpperCase() + match[ 1 ].charAt( 1 ) )
		}

		while ( ( match = microchipRegex.exec( line ) ) !== null ) {
			floors[ index ].addMicroChip( match[ 1 ].charAt( 0 ).toUpperCase() + match[ 1 ].charAt( 1 ) )
		}
	} )

	console.log( `\n\r\n\rMoves: ${solve()}` );

	console.log( '\n\r\n\r\n\r\n\r\n\r' );
} )

/**
 * 0.) Create only pairs if possible
 * 1.) Move FIRST pair to top
 * 2.) Come down with the FIRST generator and move another pair to top
 * 3.) When two pairs are on a floor, move one microchip down so we can move the other up
 * 5.) Repeat
 * @return {number}
 */
function solve() {
	if ( elevatorFloor() < 0 || elevatorFloor() > lastFloor() ) {
		throw new Error( 'NOT SURE WHERE YOU WANT TO GO !!!' );
	}

	if ( elevator.length > 2 ) {
		throw new Error( `YOU'RE TOO HEAVY !!!` )
	}

	const validStepCount = elevator.items.length > 0 ? 1 : 0;
	const elevatorIndex = elevatorFloor()

	if ( elevator.items.length ) {
		elevator.items.forEach( item => {
			elevator.remove( item );
			currentFloor().add( item );
		} )

		draw( 'Emptied the elevator.' )
	}

	/* validate just after we empty the elevator */
	validate();

	switch ( false ) {
		case state.pairsDone:
			console.log( 'Doing pairs.' );
			fixPairs()
			break;

		case state.firstPairMoved:
			console.log( 'Move first pair.' );
			moveFirstPair()
			break;

		case state.elevatorIsOnFloorWithPair:
			console.log( 'Move elevator down.' );
			moveElevatorDownToPair();
			break;

		case state.pairIsOnTheLastFloor:
			console.log( 'Move pair to the last floor.' );
			movePairUp()
			break;
	}

	if ( elevatorIndex !== elevatorFloor() && elevator.items.length === 0 ) {
		throw new Error( `Don't move without anything in the elevator !!!` );
	}

	return everythingOk() ? validStepCount : solve() + validStepCount;
}

function movePairUp() {
	if ( onLastFloor() ) {
		if ( currentFloor().hasGenerator( movingPair ) && currentFloor().hasMicroChip( movingPair ) ) {
			state.pairIsOnTheLastFloor = true;
			state.elevatorIsOnFloorWithPair = false;
		} else if ( currentFloor().hasGenerator( movingPair ) && currentFloor().hasGenerator( movingGenerator ) && ! currentFloor().hasMicroChip( movingPair ) ) {
			if ( currentFloor().generators.length === 2 ) {
				/* this is some kind of optimization, because usually we would go down after the other microchip
				 * but even if we get it, we can't leave it there, so after that we would just get it down.
				 * we switch the roles and the element that was supposed to be the pair to get up, becomes the moving element
				 * now we move down and we get another pair
				 */
				console.log( `Optimization -> the moving generator switches from ${movingGenerator} to ${movingPair}.` );
				movingGenerator = movingPair
				state.pairIsOnTheLastFloor = true;
				state.elevatorIsOnFloorWithPair = false;
			} else {
				/* we have only the generator, we have to get the microchip up also, so we go down after it */
				addGeneratorInTheElevator( movingPair );
				draw( `Going down after the ${movingPair} microchip so we can get it to the last floor.` )
				goDown()
			}
		}
	} else {
		if ( movingGenerator === movingPair ) {
			if ( elevatorFloor() === lastFloor() - 1 ) {
				const isTheLastPair = floors.every( floor => floor.index < elevatorFloor() ? floor.length === 0 : ( floor.index === elevatorFloor() ? floor.length === 2 : true ) )

				if ( isTheLastPair ) {
					addGeneratorInTheElevator( movingPair )
					addMicroChipInTheElevator( movingPair )

					draw( `Getting the last pair on the ${lastFloor() + 1}th floor` )

					goUp()
				} else {
					if ( floors.every( floor => floor.index < elevatorFloor() ? floor.length === 0 : true ) ) {
						/* if we don't have anything below, there is no point in going down. just move the pair up */
						movingPair = currentFloor().generators[ 0 ]
						movingGenerator = currentFloor().generators[ 1 ]
					} else {
						state.pairIsOnTheLastFloor = true;
						state.elevatorIsOnFloorWithPair = false;

						addGeneratorInTheElevator( movingGenerator )

						draw( 'Leave microchip here and go down for another pair.' )
						goDown()
					}
				}
			} else {
				addMicroChipInTheElevator( movingPair )
				addGeneratorInTheElevator( movingPair )

				/* only to the third floor because we can't leave the chip alone with another generator. -1=one before the last | +1=for index display */
				draw( `Moving pair to the ${lastFloor() - 1 + 1} floor.` )
				goUp()
			}
		} else if ( currentFloor().hasGenerator( movingGenerator ) && currentFloor().hasGenerator( movingPair ) ) {

			if ( currentFloor().hasMicroChip( movingPair ) && currentFloor().hasMicroChip( movingGenerator ) ) {
				/* we're on a level with 2 generators and 2 microchips - pair we want to get to the last floor and the moving helper
				 * if we want to move anything, we first have to get the moving chip a floor down so we can get the other one to the top
				 */
				addMicroChipInTheElevator( movingGenerator )
				addGeneratorInTheElevator( movingGenerator )

				draw( 'Move the chip down so we can later move the pair up.' )
				goDown()
			} else if ( ! currentFloor().hasMicroChip( movingPair ) ) {
				if ( currentFloor().hasMicroChip( movingGenerator ) ) {
					/* switch roles so we can optimize moving the microchips up */
					console.log( `Optimization -> ${movingGenerator} becomes the moving pair and ${movingPair} becomes the moving generator.` );
					let aux = movingPair;
					movingPair = movingGenerator
					movingGenerator = aux;
				} else {
					const pairMicroChipFloor = floors.find( floor => floor.microChips.includes( movingPair ) ).index
					const directionToGo = elevatorFloor() > pairMicroChipFloor ? 'down' : 'up'
					/* we don't have the chip, if it's down, we go after it, if it's above we go with both generators up. */
					if ( directionToGo === 'up' ) {
						/* when we go up, we take the chip with us */
						addGeneratorInTheElevator( movingGenerator )
					}
					addGeneratorInTheElevator( movingPair )
					draw( `Go ${directionToGo} ${directionToGo === 'up' ? 'to' : 'after'} the ${movingPair} microchip.` )
					elevator.index += directionToGo === 'up' ? 1 : - 1
				}
			} else if ( currentFloor().hasMicroChip( movingPair ) && currentFloor().generators.length > 2 ) {
				/* this means the current floor has more generators and we can' leave the chip here, so we have to take it up with his generator */
				addGeneratorInTheElevator( movingPair )
				addMicroChipInTheElevator( movingPair )

				draw( 'Moving the pair up one floor.' )
				goUp()
			} else {
				addGeneratorInTheElevator( movingGenerator )
				addGeneratorInTheElevator( movingPair )

				draw( 'Moving two generators up.' )
				goUp()
			}
		} else if ( ! onLastFloor() && currentFloor().hasGenerator( movingPair ) && currentFloor().hasMicroChip( movingPair ) && ! currentFloor().hasGenerator( movingGenerator ) ) {
			const movingGeneratorFloor = floors.find( floor => floor.generators.includes( movingGenerator ) ).index
			const directionToGo = elevatorFloor() > movingGeneratorFloor ? 'down' : 'up'
			/* either we moved up with the moving pair (to avoid multiple generators) and left the moving generator down so we have to retrieve it,
			 * or we're under the moving generator because earlier we had to get down for the chip */
			if ( directionToGo === 'up' ) {
				/* when we go up, we take the chip with us */
				addMicroChipInTheElevator( movingPair )
			}
			addGeneratorInTheElevator( movingPair )

			draw( `Go ${directionToGo} after the ${movingGenerator} generator.` )
			elevator.index += directionToGo === 'up' ? 1 : - 1
		} else if ( currentFloor().hasGenerator( movingGenerator ) && currentFloor().hasMicroChip( movingGenerator ) && ! currentFloor().hasGenerator( movingPair ) ) {
			addGeneratorInTheElevator( movingGenerator )
			/* we had two pairs on a floor, we moved the chip and the generator down, and now we go with the generator up so we can move the pair */
			draw( 'Get the generator back to the pair so we can move it.' )
			goUp()
		}
	}
}

function moveElevatorDownToPair() {
	const elementPair = getElementPair();
	if ( ! onLastFloor() && elementPair ) {
		movingPair = elementPair
		state.elevatorIsOnFloorWithPair = true;
		state.pairIsOnTheLastFloor = false;
	} else {
		movingGenerator = currentFloor().generators.find( g => ! currentFloor().microChips.includes( g ) );

		if ( ! movingGenerator ) {
			movingGenerator = currentFloor().generators[ 0 ]
		}

		addGeneratorInTheElevator( movingGenerator )

		draw( `Moving generator for ~${movingGenerator}~ down to bring another pair up.` )

		goDown();
	}
}

function fixPairs() {
	const elementWithNextUnpairedGenerator = findNextUnpairedGenerator( elevatorFloor() )
	const elementWithNextUnpairedChip = findNextUnpairedChip( elevatorFloor() )

	if ( elementWithNextUnpairedGenerator.length ) {
		elementWithNextUnpairedGenerator.forEach( element => {
			addMicroChipInTheElevator( element )
		} )

		draw( 'Moving micro chip up to form a pair.' )
		goUp()
	} else if ( elementWithNextUnpairedChip.length ) {
		elementWithNextUnpairedChip.forEach( element => {
			addGeneratorInTheElevator( element )
		} )

		draw( 'Moving generator up to form pair.' )
		goUp()
	} else {
		state.pairsDone = true;
	}

	state.pairsDone = ! buildingNeedsPairing() || ( elementWithNextUnpairedGenerator.length === 0 && elementWithNextUnpairedChip.length === 0 )
}

function moveFirstPair() {
	const elementWithPair = getElementPair()

	if ( elementWithPair ) {
		if ( onLastFloor() ) {
			state.firstPairMoved = true
		} else {
			addMicroChipInTheElevator( elementWithPair )
			addGeneratorInTheElevator( elementWithPair )

			draw( `Moving pair for element ~${elementWithPair}~ up.` )
			goUp()
		}
	}
}

function findNextUnpairedGenerator( currentFloorIndex ) {
	const microChipsFromCurrentFloor = floors[ currentFloorIndex ].microChips
	let generatorsFound = []

	while ( generatorsFound.length === 0 && ++ currentFloorIndex <= lastFloor() ) {
		const generators = floors[ currentFloorIndex ].generators

		if ( generators.length && generators.some( g => microChipsFromCurrentFloor.includes( g ) ) ) {
			generatorsFound = generators.filter( g => microChipsFromCurrentFloor.includes( g ) )
		}
	}

	return generatorsFound
}

function findNextUnpairedChip( currentFloorIndex ) {
	const generatorsFromCurrentFloor = floors[ currentFloorIndex ].generators
	let microChipsFound = []

	while ( microChipsFound.length === 0 && ++ currentFloorIndex <= lastFloor() ) {
		const generators = floors[ currentFloorIndex ].microChips

		if ( generators.length && generators.some( g => generatorsFromCurrentFloor.includes( g ) ) ) {
			microChipsFound = generators.filter( g => generatorsFromCurrentFloor.includes( g ) )
		}
	}

	return microChipsFound
}

function getElementPair() {
	return currentFloor().items.length === 0 ? null : currentFloor().generators.find( elementGenerator => currentFloor().microChips.includes( elementGenerator ) )
}

function buildingNeedsPairing() {
	return elevator.items.length !== 0 || floors.some( floor => floor.generators.some( generator => ! floor.microChips.includes( generator ) ) )
}

function draw( message = '' ) {
	const itemsCount = floors.reduce( ( count, floor ) => floor.length + count, 0 );

	if ( message ) {
		console.info( message );
	}

	[ ...floors ].reverse().forEach( ( floor, index ) => {
			const elevatorItems = floor.index === elevatorFloor() ? elevator.items.sort() : []
			const emptySlots = ( new Array( Math.max( itemsCount - floor.length - elevatorItems.length, 0 ) ) ).fill( '____' )

			console.log( `F${floors.length - index} ${elevatorFloor() === floor.index ? `[${elevatorItems.join( ' . ' )}] ` : ( elevator.length ? '' : '   ' )} ${[
				...floor.items.sort(),
				...emptySlots
			].join( ' . ' )}` );
		}
	)

	console.log( ( new Array( 42 ) ).fill( '~' ).join( '' ) );
//	console.log( '\n\r', ( new Array( 42 ) ).fill( '~' ).join( '' ), '\n\r' );
}

function everythingOk() {
	return floors.every( floor => floor.index !== lastFloor() ? floor.length === 0 && elevator.length === 0 : true )
}

function currentFloor() {
	return floors[ elevatorFloor() ]
}

function validate() {
	floors.forEach( floor => {
		if ( floor.generators.length > 0 && floor.microChips.some( m => ! floor.generators.includes( m ) ) ) {
			draw( `Error on floor ${floor.index}` );
			throw new Error();
		}
	} )
}

function goUp() {
	elevator.index ++
}

function goDown() {
	elevator.index --
}

function elevatorFloor() {
	return elevator.index
}

function onLastFloor() {
	return elevatorFloor() === lastFloor()
}

function lastFloor() {
	return floors.length - 1
}

function addMicroChipInTheElevator( microChip ) {
	currentFloor().removeMicroChip( microChip )
	elevator.addMicroChip( microChip )
}

function addGeneratorInTheElevator( generator ) {
	currentFloor().removeGenerator( generator )
	elevator.addGenerator( generator )
}
