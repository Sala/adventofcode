import {readFile, xFlipMatrix, rotateMatrix, deepCopy} from '../../helpers.js';
import Tile from './tile.js';

readFile( 'input.txt', true ).then( lines => {
	const tiles = {};
	let currentTile

	lines.forEach( line => {
		if ( line.includes( 'Tile' ) ) {
			currentTile = parseInt( line.match( /\d+/ )[ 0 ] )
			tiles[ currentTile ] = []
		} else {
			tiles[ currentTile ].push( line )
		}
	} )

	solve1( tiles );

	solve2( tiles );
} )

function solve1( tiles ) {
	const corners = parseMatchingTiles( tiles )
		/* the corners are the tiles that have two sides that don't match with anything */
		.filter( tile => Object.values( tile.sides ).filter( m => m.length ).length === 2 )
		.reduce( ( result, tile ) => result * BigInt( tile.id ), BigInt( 1 ) )

	console.log( parseInt( corners ) );
}

function solve2( tiles ) {
	const finalImage = joinTiles( buildImageTiles( tiles ) )

	readFile( 'sea-monster.txt', true ).then( monster => {
		const monstersFound = matrixVariations( finalImage )
			.map( image => findMonsters( image, monster ) )
			.filter( m => m )

		console.log( calculateDensity( finalImage ) - Math.max( ...monstersFound ) * calculateDensity( monster ) );
	} )
}

function buildImageTiles( tiles ) {
	let imageLength = Math.sqrt( Object.keys( tiles ).length )
	const image = [ [] ]

	const matchingTiles = parseMatchingTiles( tiles );

	const firstTile = matchingTiles.find( tile => Object.values( tile.sides ).filter( m => m.length ).length === 2 )

	const firstSmartTile = new Tile( firstTile.id, tiles[ firstTile.id ], firstTile.sides )

	let nullSides = firstSmartTile.getEmptyCorners()

	firstSmartTile.matchSides( [ 'Top', 'Left' ], nullSides )

	image[ 0 ][ 0 ] = firstSmartTile

	/* fill first row by matching to the tile from the left */
	for ( let i = 1; i < imageLength; i ++ ) {
		const leftTile = image[ 0 ][ i - 1 ]

		const currentTileId = parseInt( leftTile.getSideMatch( 'Right' ) )

		const tile = matchingTiles.find( tile => parseInt( tile.id ) === currentTileId )

		const currentSmartTile = new Tile( tile.id, tiles[ tile.id ], tile.sides )

		currentSmartTile.matchSides( [ 'Left' ], [ leftTile.getRight() ] )

		image[ 0 ][ i ] = currentSmartTile
	}

	/* fill the rest by matching the tile from above */
	for ( let j = 1; j < imageLength; j ++ ) {
		image[ j ] = []
		for ( let i = 0; i < imageLength; i ++ ) {
			const aboveTile = image[ j - 1 ][ i ]

			const currentTileId = parseInt( aboveTile.getSideMatch( 'Bottom' ) )

			const tile = matchingTiles.find( tile => parseInt( tile.id ) === currentTileId )

			const currentSmartTile = new Tile( tile.id, tiles[ tile.id ], tile.sides )

			currentSmartTile.matchSides( [ 'Top' ], [ aboveTile.getBottom() ] )

			image[ j ][ i ] = currentSmartTile
		}
	}

	return image
}

function joinTiles( image ) {
	const finalImage = [];

	image.forEach( ( row, y ) => {
		row.forEach( tile => {
			const delta = y * ( tile.matrix.length - 2 )

			tile.matrix.slice( 1, - 1 ).forEach( ( line, lineIndex ) => {
				if ( typeof finalImage[ delta + lineIndex ] === 'undefined' ) {
					finalImage[ delta + lineIndex ] = ''
				}

				finalImage[ delta + lineIndex ] += line.slice( 1, - 1 )
			} )

		} )
	} )

	return finalImage
}

function findMonsters( matrix, monster ) {
	const matrixLength = matrix.length
	const monsterHeight = monster.length
	const monsterLength = monster[ 0 ].length
	let monstersFound = 0

	for ( let j = 0; j < matrixLength - monsterHeight; j ++ ) {
		for ( let i = 0; i < matrixLength - monsterLength; i ++ ) {
			let monsterMatch = true;

			for ( let jj = 0; jj < monsterHeight && monsterMatch; jj ++ ) {
				for ( let ii = 0; ii < monsterLength && monsterMatch; ii ++ ) {
					if ( monster[ jj ][ ii ] === '#' &&
					     matrix[ j + jj ][ i + ii ] !== '#' ) {
						monsterMatch = false
					}
				}
			}

			if ( monsterMatch ) {
				monstersFound ++
			}
		}
	}

	return monstersFound
}

/**
 * For each tile side, find how many other tiles match it.
 * In our example we're lucky that it's max only one
 * @param tiles
 * @return {[]}
 */
function parseMatchingTiles( tiles ) {
	let matchingTiles = []

	for ( let id in tiles ) {
		const tileLength = tiles[ id ].length
		const sides = {}

		let left = [], right = [];
		for ( let j = 0; j < tileLength; j ++ ) {
			left.push( tiles[ id ][ j ].charAt( 0 ) )
			right.push( tiles[ id ][ j ].charAt( tileLength - 1 ) )
		}

		sides[ tiles[ id ][ 0 ] ] = [];
		sides[ right.join( '' ) ] = []
		sides[ tiles[ id ][ tileLength - 1 ] ] = []
		sides[ left.join( '' ) ] = []

		matchingTiles.push( {
			id,
			sides,
		} )
	}

	matchingTiles.forEach( t1 => {
		matchingTiles.forEach( t2 => {
			if ( t1.id !== t2.id ) {
				for ( let side in t1.sides ) {
					if ( typeof t2.sides[ side ] !== 'undefined' || typeof t2.sides[ side.split( '' ).reverse().join( '' ) ] !== 'undefined' ) {
						t1.sides[ side ].push( t2.id )
					}
				}
			}
		} )
	} )

	return matchingTiles
}

function matrixVariations( matrix ) {
	const variations = [];
	let m = deepCopy( matrix )

	for ( let i = 1; i <= 4; i ++ ) {
		variations.push( m )
		variations.push( xFlipMatrix( deepCopy( m ), true ) )

		m = rotateMatrix( m, true )
	}

	return variations
}

function calculateDensity( matrix ) {
	return matrix.reduce( ( density, row ) => density + row.split( '' ).filter( x => x === '#' ).length, 0 )
}
