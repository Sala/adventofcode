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
 * Convert number from binary to decimal
 * @param bin
 * @return {number}
 */
function bin2dec( bin ) {
	return parseInt( bin, 2 );
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

/**
 * Calculate the sum of numbers in an array or sent as parameters
 * @param numbers
 * @return {number}
 */
function sum( numbers ) {
	if ( arguments.length > 1 ) {
		numbers = Array.from( arguments )
	}

	return numbers.length ? numbers.reduce( ( sum, n ) => sum + n ) : 0
}

/**
 * Calculate the product of numbers in an array or sent as parameters
 * @param numbers
 * @return {number}
 */
function multiply( numbers ) {
	if ( arguments.length > 1 ) {
		numbers = Array.from( arguments )
	}

	return numbers.length ? numbers.reduce( ( product, n ) => product * n, 1 ) : 1
}

/**
 * Are those two arrays having the same elements?
 * @param firstArray
 * @param secondArray
 * @return {*}
 */
function sameArrays( firstArray, secondArray ) {
	return firstArray.every( ( element, index ) => element === secondArray[ index ] )
}

/**
 *
 * @param matrix
 * @param stringLines
 * @return {*}
 */
function xFlipMatrix( matrix, stringLines = false ) {
	return matrix.map( row => stringLines ? row.split( '' ).reverse().join( '' ) : row.reverse() )
}

/**
 *
 * @param matrix
 * @return {*}
 */
function yFlipMatrix( matrix ) {
	for ( let i = 0; i < matrix.length / 2; i ++ ) {
		let aux = matrix[ i ];
		matrix[ i ] = matrix[ matrix.length - 1 - i ]
		matrix[ matrix.length - 1 - i ] = aux;
	}

	return matrix
}

/**
 *
 * @param matrix
 * @param stringLines
 * @return {(*)[]}
 */
function rotateMatrix( matrix, stringLines = false ) {
	let newM = []

	for ( let i = 0; i < matrix.length; i ++ ) {
		newM[ i ] = []
		for ( let j = 0; j < matrix.length; j ++ ) {
			newM[ i ][ j ] = matrix[ j ][ matrix.length - 1 - i ]
		}
	}

	return newM.map( line => stringLines ? line.join( '' ) : line )
}

function deepCopy( object ) {
	return JSON.parse( JSON.stringify( object ) )
}

/**
 * Generation permutations without repeating same letters
 * @param {Array} letters
 * @param {String} currentVariation
 * @param {Array} variations
 */
function generateVariations( letters, currentVariation = '', variations = [] ) {
	if ( letters.length === 0 ) {
		variations.push( currentVariation )
	} else {
		letters.forEach( letter => {
			generateVariations( [ ...letters.filter( l => l !== letter ) ], currentVariation + letter, variations )
		} )
	}
}

export {
	sum,
	dec2bin,
	bin2dec,
	readFile,
	deepCopy,
	multiply,
	sameArrays,
	xFlipMatrix,
	yFlipMatrix,
	rotateMatrix,
	generateVariations,
	surroundingPositions
}
