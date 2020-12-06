import {readFile} from '../../helpers.js'

readFile( 'input.txt' ).then( lines => {
	const groups = [];

	lines.split( '\r\n\r\n' ).forEach( group => {
		groups.push( group.split( '\r\n' ) )
	} )

	console.log( solve( groups, 'OR' ) );
	console.log( solve( groups, 'AND' ) );
} )

function solve( groups, op ) {
	let answersCount = 0;

	groups.forEach( group => {
		group = group.filter( group => group.trim() )

		if ( group.length === 1 ) {
			answersCount += group[ 0 ].length
		} else {
			let answers = {}

			group.forEach( person => {
				person.split( '' ).forEach( answer => {
					if ( typeof answers[ answer ] === 'undefined' ) {
						answers[ answer ] = 0
					}

					answers[ answer ] ++
				} )
			} )

			if ( op === 'OR' ) {
				answersCount += Object.keys( answers ).length
			} else if ( op === 'AND' ) {
				for ( let answer in answers ) {
					if ( answers[ answer ] === group.length ) {
						answersCount ++
					}
				}
			}
		}
	} )

	return answersCount
}
