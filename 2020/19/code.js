import {readFile} from '../../helpers.js';

function solveInput( input ) {
	readFile( input, true ).then( lines => {
		const rules = {}
		const codes = []
		lines.forEach( line => {
			if ( line.includes( ':' ) ) {
				let parts = line.split( ': ' )
				if ( parts[ 1 ].includes( '"' ) ) {
					rules[ parts[ 0 ] ] = parts[ 1 ].slice( 1, - 1 )
				} else {
					rules[ parts[ 0 ] ] = parts[ 1 ].split( ' | ' ).map( rule => rule.split( ' ' ) )
				}
			} else {
				codes.push( line )
			}
		} )

		console.log( input, solve( parseRules( rules ), codes ) );
	} )
}

solveInput( 'input-1.txt' )
solveInput( 'input-2.txt' )

solveInput( 'input-11.txt' )
solveInput( 'input-22.txt' )

function parseRules( rules ) {
	let rulesReady = false;

	while ( ! rulesReady ) {
		rulesReady = true;

		for ( let index in rules ) {
			if ( typeof rules[ index ] !== 'string' ) {
				rules[ index ] = rules[ index ].map( rule => {
					if ( Array.isArray( rule ) ) {
						rule = rule.map( i => {
							if ( typeof rules[ i ] === 'string' ) {
								i = rules[ i ]
								rulesReady = false
							}
							return i
						} )

						if ( rule.every( r => isNaN( r ) ) ) {
							if ( rule.every( r => r.length === 1 ) ) {
								rule = rule.join( '' )
							} else {
								rule = rule.join( '' )
							}
						}
					}

					return rule
				} )

				if ( rules[ index ].every( r => ! Array.isArray( r ) && isNaN( r ) ) ) {
					rules[ index ] = `(${rules[ index ].join( '|' )})`
					rulesReady = false
				}
			}
		}
	}

	return rules;
}

function solve( rules, codes ) {
	if ( typeof rules[ 0 ] !== 'string' ) {
		rules[ 0 ] = fixMainRule( rules )
	}

	const regEx = new RegExp( `^${rules[ 0 ]}$` )

	return codes.reduce( ( matches, code ) => matches + ( regEx.test( code ) ? 1 : 0 ), 0 )
}

function fixMainRule( rules ) {
	return rules[ 0 ].map( set => {
		if ( Array.isArray( set ) ) {
			set = set.map( rule => {
				let normalRule = rules[ rule ][ 0 ]
				const recursiveRule = rules[ rule ][ 1 ], newRule = []

				/* repeat the recursive rule a few times just to make sure we get the number of possible matches */
				while ( newRule.length <= 5 ) {
					newRule.push( `(${normalRule})` )
					normalRule = recursiveRule.map( r => r === rule ? normalRule : r ).join( '' )
				}

				return `(${newRule.join( '|' )})`
			} ).join( '' )
		}

		return `(${set})`
	} ).join( '|' )
}

