import {readFile, surroundingPositions, sum} from '../../helpers.js';

readFile( 'input.txt', true ).then( lines => {
	const statesToRun = 6
	let cube = [ [ [] ] ]
	lines.forEach( ( line, index ) => {
		cube[ 0 ][ index ] = line.split( '' ).map( n => n === '#' ? 1 : 0 )
	} )

	const hyperCube = [ cube ];

	console.log( solve1( cube, statesToRun ) );
	console.log( solve2( hyperCube, statesToRun ) );
} )

function solve1( cube, statesToRun ) {
	let currentState = 1;

	while ( currentState <= statesToRun ) {
		let newCube = new Array( cube.length + 2 )
		const faceLength = cube[ 0 ].length

		for ( let z = - 1; z <= cube.length; z ++ ) {
			let face = new Array( faceLength + 2 )

			for ( let y = - 1; y <= faceLength; y ++ ) {
				face[ y + 1 ] = new Array( faceLength + 2 )
				for ( let x = - 1; x <= faceLength; x ++ ) {
					let activeCubes = 0;

					if ( typeof cube[ z - 1 ] !== 'undefined' ) {
						activeCubes += getActiveCubesFromFace( cube[ z - 1 ], y, x )
					}

					if ( typeof cube[ z ] !== 'undefined' ) {
						activeCubes += getActiveCubesFromFace( cube[ z ], y, x, false )
					}

					if ( typeof cube[ z + 1 ] !== 'undefined' ) {
						activeCubes += getActiveCubesFromFace( cube[ z + 1 ], y, x )
					}

					if ( cube[ z ] && cube[ z ][ y ] && cube[ z ][ y ][ x ] ) {
						face[ y + 1 ][ x + 1 ] = activeCubes === 2 || activeCubes === 3 ? 1 : 0
					} else if ( activeCubes === 3 ) {
						face[ y + 1 ][ x + 1 ] = 1
					} else {
						face[ y + 1 ][ x + 1 ] = 0
					}
				}
			}
			newCube[ z + 1 ] = face
		}

		cube = JSON.parse( JSON.stringify( newCube ) )

		currentState ++
	}

	return countActive( cube )
}

function solve2( hyperCube, statesToRun ) {
	let currentState = 1;

	while ( currentState <= statesToRun ) {
		let newHyperCube = []

		for ( let w = - 1; w <= hyperCube.length; w ++ ) {
			let face = []

			for ( let z = - 1; z <= hyperCube[ 0 ].length; z ++ ) {
				let secondFace = []

				for ( let y = - 1; y <= hyperCube[ 0 ][ 0 ].length; y ++ ) {
					secondFace[ y + 1 ] = []

					for ( let x = - 1; x <= hyperCube[ 0 ][ 0 ][ 0 ].length; x ++ ) {
						const activeCubes = getHyperActiveCubes( hyperCube, w, z, y, x )

						if ( hyperCube[ w ] && hyperCube[ w ][ z ] && hyperCube[ w ][ z ][ y ] && hyperCube[ w ][ z ][ y ][ x ] ) {
							secondFace[ y + 1 ][ x + 1 ] = activeCubes === 2 || activeCubes === 3 ? 1 : 0
						} else if ( activeCubes === 3 ) {
							secondFace[ y + 1 ][ x + 1 ] = 1
						} else {
							secondFace[ y + 1 ][ x + 1 ] = 0
						}
					}
				}

				face[ z + 1 ] = secondFace
			}

			newHyperCube[ w + 1 ] = face
		}

		hyperCube = JSON.parse( JSON.stringify( newHyperCube ) )

		currentState ++
	}

	return countActive( hyperCube, true )
}

function getActiveCubesFromFace( face, centerX, centerY, includeCenter = true ) {
	let active = 0

	surroundingPositions( centerX, centerY, true ).forEach( position => {
		active += typeof face[ position.x ] === 'undefined' || typeof face[ position.x ][ position.y ] === 'undefined' ? 0 : face[ position.x ][ position.y ]
	} )

	if ( includeCenter ) {
		active += typeof face[ centerX ] === 'undefined' || typeof face[ centerX ][ centerY ] === 'undefined' ? 0 : face[ centerX ][ centerY ]
	}

	return active
}

function getHyperActiveCubes( hyperCube, w, z, y, x ) {
	const positions = [ - 1, 0, 1 ]
	let active = 0;
	positions.forEach( p1 => {
		positions.forEach( p2 => {
			positions.forEach( p3 => {
				positions.forEach( p4 => {
					if ( p1 || p2 || p3 || p4 ) {
						let ww = w + p1,
							zz = z + p2,
							yy = y + p3,
							xx = x + p4

						if ( hyperCube[ ww ] && hyperCube[ ww ][ zz ] && hyperCube[ ww ][ zz ][ yy ] && hyperCube[ ww ][ zz ][ yy ][ xx ] ) {
							active ++
						}
					}
				} )
			} )
		} )
	} )

	return active
}

function countActive( cube, isHyper = false ) {
	let active = 0;
	for ( let z = 0; z < cube.length; z ++ ) {
		for ( let y = 0; y < cube[ z ].length; y ++ ) {
			for ( let x = 0; x < cube[ z ][ y ].length; x ++ ) {
				active += isHyper ? sum( cube[ z ][ y ][ x ] ) : cube[ z ][ y ][ x ]
			}
		}
	}

	return active
}
