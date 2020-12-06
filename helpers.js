import * as fs from 'fs'

/**
 * Does what it says.
 * @param {string} fileName
 * @param {boolean} splitLines
 * @return {Promise<Array>}
 */
function readFile( fileName = '', splitLines = false ) {
	return new Promise( ( resolve, reject ) => {
		fs.readFile( fileName, 'utf8', ( error, contents ) => {
			if ( error ) {
				reject( error );
			} else {
				if ( splitLines ) {
					contents = contents.split( '\r\n' ).filter( line => line.trim().length );
				}

				resolve( contents );
			}
		} );
	} )
}

/**
 * Convert decimal to binary
 * @param dec
 * @return string
 */
function dec2bin( dec ) {
	return ( dec >>> 0 ).toString( 2 )
}

/**
 * Matrix surrounding positions
 * @returns {({x: number, y: number}|{x: number, y: number}|{x: number, y: number}|{x: number, y: number}|{x: number, y: number})[]}
 */
function surroundingPositions( x = null, y = null, includeDiagonals = false ) {
	const positions = [
		{x: 0, y: - 1},
		{x: - 1, y: 0},
		{x: 1, y: 0},
		{x: 0, y: 1},
	]

	if ( includeDiagonals ) {
		positions.push( {x: - 1, y: - 1} )
		positions.push( {x: 1, y: - 1} )
		positions.push( {x: - 1, y: 1} )
		positions.push( {x: 1, y: 1} )
	}

	return ( x === null || y === null ) ? positions : positions.map( position => ( {x: x + position.x, y: y + position.y} ) )
}

export {
	readFile,
	dec2bin,
	surroundingPositions
}
