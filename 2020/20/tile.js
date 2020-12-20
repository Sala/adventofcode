import {rotateMatrix, xFlipMatrix, yFlipMatrix, deepCopy} from '../../helpers.js';

class Tile {

	constructor( id, matrix = [], sideTiles ) {
		this.id = id
		this.matrix = matrix
		this.original = deepCopy( matrix )
		this.length = matrix[ 0 ].length
		this.sides = sideTiles
	}

	getEmptyCorners() {
		return Object.keys( this.sides ).filter( side => this.sides[ side ].length === 0 )
	}

	/**
	 * See what id matches on a specific side
	 * @param side
	 * @return {*|null}
	 */
	getSideMatch( side ) {
		let line = this[ `get${side}` ]()

		if ( typeof this.sides[ line ] === 'undefined' ) {
			line = line.split( '' ).reverse().join( '' )
		}

		return this.sides[ line ].length ? this.sides[ line ][ 0 ] : null
	}

	getLeft() {
		let left = []
		for ( let j = 0; j < this.length; j ++ ) {
			left.push( this.matrix[ j ][ 0 ] )
		}

		return left.join( '' )
	}

	getRight() {
		let right = []
		for ( let j = 0; j < this.length; j ++ ) {
			right.push( this.matrix[ j ][ this.length - 1 ] )
		}

		return right.join( '' )
	}

	getTop() {
		return this.matrix[ 0 ]
	}

	getBottom() {
		return this.matrix[ this.length - 1 ]
	}

	/**
	 * Rotate matrix until the sides match the values
	 * Flip the matrix if the match was done on a reverse value
	 * @param sides
	 * @param values
	 */
	matchSides( sides, values ) {
		while ( ! sides.map( side => this[ `get${side}` ]() ).every( side => values.includes( side ) || values.includes( side.split( '' ).reverse().join( '' ) ) ) ) {
			this.matrix = rotateMatrix( this.matrix, true )
		}

		if ( sides.length === 1 && values.length === 1 ) {
			let side = sides.pop()
			if ( this[ `get${side}` ]() !== values[ 0 ] ) {
				if ( side === 'Left' || side === 'Right' ) {
					this.matrix = yFlipMatrix( this.matrix )
				} else {
					this.matrix = xFlipMatrix( this.matrix, true )
				}
			}
		}
	}

	draw( original = false ) {
		console.log( '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~' );
		( original ? this.original : this.matrix ).forEach( row => {
			console.log( row );
		} )
		console.log( '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~' );
	}
}

export default Tile
