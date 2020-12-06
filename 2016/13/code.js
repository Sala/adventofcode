const {readFile, dec2bin, surroundingPositions} = require( '../../helpers' );
const KEY = 1362
const xLength = 50, yLength = 50;
const startingX = 1, startingY = 1;
const matrix = generateMatrix();
const scoreMatrix = generateScoreMatrix( 1, 1 );

solve()

function solve() {

	generateShortestPath( startingX, startingY )

	draw( scoreMatrix, true )

	console.log( scoreMatrix[ 39 ][ 31 ] );

	let positions = 0;
	for ( let y = 0; y <= yLength; y ++ ) {
		for ( let x = 0; x <= xLength; x ++ ) {
			if ( scoreMatrix[ y ][ x ] > 0 && scoreMatrix[ y ][ x ] <= 50 ) {
				positions ++;
			}
		}
	}

	/* include starting location */
	console.log( positions + 1 );

}

function generateShortestPath( centerX, centerY ) {
	surroundingPositions( centerX, centerY ).forEach( position => {
		if ( scoreMatrix[ position.y ] && scoreMatrix[ position.y ][ position.x ] && ( position.x !== startingX || position.y !== startingY ) ) {
			if ( scoreMatrix[ position.y ][ position.x ] > scoreMatrix[ centerY ][ centerX ] + 1 ) {
				scoreMatrix[ position.y ][ position.x ] = scoreMatrix[ centerY ][ centerX ] + 1;
				generateShortestPath( position.x, position.y )
			}
		}
	} )
}

function generateMatrix() {
	let m = [];

	for ( let y = 0; y <= yLength; y ++ ) {
		m[ y ] = []
		for ( let x = 0; x <= xLength; x ++ ) {
			m[ y ][ x ] = wallOrSpace( x, y )
		}
	}

	return m
}

function generateScoreMatrix( startX, startY ) {
	let m = [];

	for ( let y = 0; y <= yLength; y ++ ) {
		m[ y ] = []
		for ( let x = 0; x <= xLength; x ++ ) {
			m[ y ][ x ] = matrix[ y ][ x ] === 0 ? null : ( y === startY && x === startX ? 0 : Number.MAX_SAFE_INTEGER )
		}
	}

	return m
}

function draw( m, showScore = false ) {
	m.forEach( line => {
		console.log( line.map( n => n === null ? '##' : ( showScore ? ( n === Number.MAX_SAFE_INTEGER ? '--' : ( n > 9 ? n : `0${n}` ) ) : '..' ) ).join( ' ' ) );
	} )
}

function wallOrSpace( x, y ) {
	return dec2bin( x * x + 3 * x + 2 * x * y + y + y * y + KEY ).split( '' ).filter( n => parseInt( n ) === 1 ).length % 2 === 0 ? 1 : 0
}
