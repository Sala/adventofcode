import {readFile} from '../../helpers.js';

readFile( 'input.txt', true ).then( lines => {
	let sum1 = 0,
		sum2 = BigInt( 0 );

	lines.forEach( line => {
		sum1 += evaluate( line, calculate )
		sum2 += evaluate( line, calculate2 )
	} )

	console.log( sum1 );
	console.log( parseInt( sum2 ) );
} )

function evaluate( line, calcFn ) {
	const pRegex = /(\([^()]*\))/g,
		replaces = []
	let matches;

	if ( line[ 0 ] === '(' && line[ line.length - 1 ] === ')' && line.split( '(' ).length === 2 ) {
		line = line.slice( 1, - 1 )
	}

	while ( ( matches = pRegex.exec( line ) ) !== null ) {
		// This is necessary to avoid infinite loops with zero-width matches
		if ( matches.index === pRegex.lastIndex ) {
			pRegex.lastIndex ++;
		}

		replaces.push( {
			from: matches[ 1 ],
			to: calcFn( matches[ 1 ].slice( 1, - 1 ) )
		} )
	}

	replaces.forEach( replacement => {
		line = line.replace( replacement.from, parseInt( replacement.to ) )
	} )

	return line.includes( '(' ) ? evaluate( line, calcFn ) : calcFn( line )
}

function calculate( line ) {
	line = line.split( ' ' )

	let result = parseInt( line[ 0 ] );

	for ( let i = 2; i < line.length; i += 2 ) {
		result = eval( `${result} ${line[ i - 1 ]} ${line[ i ]}` )
	}

	return result;
}

function calculate2( line ) {
	while ( line.includes( '+' ) ) {
		const replacements = [],
			match = /\d* \+ \d*/g.exec( line )

		if ( match ) {
			const numbers = match[ 0 ].split( ' + ' )

			replacements.push( {
				from: match[ 0 ],
				to: BigInt( numbers[ 0 ] ) + BigInt( numbers[ 1 ] )
			} )
		}

		replacements.forEach( replacement => {
			line = line.replace( replacement.from, parseInt( replacement.to ) )
		} )
	}

	return BigInt( eval( line ) )
}
