import {readFile, sum} from '../../helpers.js';

readFile( 'input.txt' ).then( row => {
	const firstRow = row.trim().split( '' ).map( tile => tile === '.' ? 1 : 0 );

	solve1( [ firstRow ], 40 )
	solve1( [ firstRow ], 400000 )
} )

function solve1( tiles, rowsToGenerate ) {
	const rowLength = tiles[ 0 ].length

	while ( tiles.length < rowsToGenerate ) {
		const currentRow = tiles[ tiles.length - 1 ],
			newRow = []

		currentRow.forEach( ( tile, index ) => {
			newRow.push( determineTile( index === 0 ? 1 : currentRow[ index - 1 ], tile, index === rowLength - 1 ? 1 : currentRow[ index + 1 ] ) )
		} )

		tiles.push( newRow )
	}

	console.log( sum( tiles.map( row => sum( row ) ) ) );
}

/**
 * Its left and center tiles are traps, but its right tile is not.
 * Its center and right tiles are traps, but its left tile is not.
 * Only its left tile is a trap.
 * Only its right tile is a trap.
 * @param {number} left
 * @param {number} center
 * @param {number} right
 * @return {number}
 */
function determineTile( left, center, right ) {
	return (
		( ! left && ! center && right ) ||
		( left && ! center && ! right ) ||
		( ! left && center && right ) ||
		( left && center && ! right )
	) ? 0 : 1
}
