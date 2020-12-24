import {readFile} from '../../helpers.js';

readFile( 'input.txt', true ).then( lines => {

	const tiles = solve1( lines )

	console.log( countBlackTiles( tiles ) );

	solve2( tiles, 100 );

	console.log( countBlackTiles( tiles ) );
} )

function solve1( instructions ) {
	const tiles = {}

	instructions.forEach( instruction => {
		const tile = parseInstructionSimple( instruction )
		tiles[ tile ] = ! tiles[ tile ]
	} )

	return tiles
}

/**
 * This weird implementation cost me around two hours of trying to find what I've did wrong
 * @param instruction
 * @return {string}
 */
function parseInstructionComplicated( instruction ) {
	let x = 0, y = 0

	instruction = instruction.replace( /se/g, '-se-' )
	                         .replace( /sw/g, '-sw-' )
	                         .replace( /ne/g, '-ne-' )
	                         .replace( /nw/g, '-nw-' )

	instruction = instruction.split( '-' ).map( dir => {
		return [ 'se', 'sw', 'ne', 'nw' ].includes( dir ) ? dir : dir.split( '' )
	} ).flat().filter( d => d )

	instruction.forEach( pos => {
		switch ( pos ) {
			case 'n':
				y += 1;
				break;
			case 's':
				y -= 1;
				break;
			case 'e':
				x += 1;
				break;
			case 'w':
				x -= 1;
				break;

			case 'ne':
				y += 1
				x += .5
				break;
			case 'nw':
				y += 1
				x -= .5
				break;
			case 'se':
				y -= 1
				x += .5
				break;
			case 'sw':
				y -= 1
				x -= .5
				break;
			default:
				console.log( 'CLIK DREAPTA DELET DATEN MORTI MATI NU STAM LA DISCUTI' );
		}
	} )

	return `${x}|${y}`
}

/**
 * I'm not sure why I haven't went with this implementation from the start
 * @param instruction
 * @return {string}
 */
function parseInstructionSimple( instruction ) {
	let x = 0, y = 0

	for ( let i = 0; i < instruction.length; i ++ ) {
		if ( instruction[ i ] === 'e' ) {
			x += 1
		} else if ( instruction[ i ] === 'w' ) {
			x -= 1
		} else if ( instruction[ i ] === 'n' ) {
			y += 1
			x += instruction[ i + 1 ] === 'e' ? .5 : - .5
			i ++
		} else if ( instruction[ i ] === 's' ) {
			y -= 1
			x += instruction[ i + 1 ] === 'e' ? .5 : - .5
			i ++
		}
	}

	return `${x}|${y}`
}

function solve2( tiles, days ) {
	const around = [ {x: .5, y: 1}, {x: 1, y: 0}, {x: .5, y: - 1}, {x: - .5, y: - 1}, {x: - 1, y: 0}, {x: - .5, y: 1} ]
	let blackTiles = []
	for ( let pos in tiles ) {
		if ( tiles[ pos ] ) {
			const parts = pos.split( '|' )
			blackTiles.push( {
				x: parseFloat( parts[ 0 ] ),
				y: parseFloat( parts[ 1 ] )
			} )
		}
	}

	while ( days -- ) {
		const toWhite = [], toBlack = []

		blackTiles.forEach( blackTile => {
			let adjacentBlackTiles = 0

			around.forEach( position => {
				const newX = blackTile.x + position.x
				const newY = blackTile.y + position.y

				if ( tiles[ `${newX}|${newY}` ] ) {
					/* it's a black adjacent tile */
					adjacentBlackTiles ++
				} else {
					/* it's white tile, let's check how many black adjacent it has */
					const blackTilesAdjacentToTheWhiteTile = around.reduce( ( count, pos ) => {
						return tiles[ `${newX + pos.x}|${newY + pos.y}` ] ? count + 1 : count
					}, 0 );

					if ( blackTilesAdjacentToTheWhiteTile === 2 ) {
						toBlack.push( {x: newX, y: newY} )
					}
				}
			}, 0 )

			if ( adjacentBlackTiles === 0 || adjacentBlackTiles > 2 ) {
				toWhite.push( blackTile )
			}
		} )

		toWhite.forEach( white => {
			tiles[ `${white.x}|${white.y}` ] = false

			blackTiles = blackTiles.filter( tile => tile.x !== white.x || tile.y !== white.y )
		} )

		toBlack.forEach( black => {
			const tile = `${black.x}|${black.y}`

			if ( ! tiles[ tile ] ) {
				/* so we won't add duplicates */
				tiles[ tile ] = true
				blackTiles.push( black )
			}
		} )
	}

	return tiles
}

function countBlackTiles( tiles ) {
	return Object.values( tiles ).filter( t => t === true ).length;
}


