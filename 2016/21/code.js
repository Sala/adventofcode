import {readFile, generateVariations} from '../../helpers.js';

readFile( 'input.txt', true ).then( instructions => {

	const password = 'abcdefgh'
	const scrambled = 'fbgdceah'
	const variations = []

	console.log( generatePassword( password, instructions ) );

	generateVariations( password.split( '' ), '', variations )

	const originalPassword = variations.find( variation => {
		return generatePassword( variation, instructions ) === scrambled
	} )

	console.log( originalPassword );
} )

function generatePassword( password, instructions ) {
	let match;

	password = password.split( '' )

	instructions.forEach( instruction => {

		switch ( true ) {
			case instruction.includes( 'swap position ' ):
				match = /swap position (?<from>\d+) with position (?<to>\d+)/g.exec( instruction )

				if ( match ) {
					const aux = password[ match.groups.from ];
					password[ match.groups.from ] = password[ match.groups.to ]
					password[ match.groups.to ] = aux
				} else {
					console.log( 'CLIK DREAPTA DELET DATEN MORTI MATI NU STAM LA DISCUTI' );
				}
				break;

			case instruction.includes( 'swap letter ' ):
				match = /swap letter (?<from>\S+) with letter (?<to>\S+)/g.exec( instruction )

				password = password.map( letter => {
					if ( letter === match.groups.from ) {
						letter = match.groups.to
					} else if ( letter === match.groups.to ) {
						letter = match.groups.from
					}

					return letter;
				} )

				break;

			case instruction.includes( 'rotate based on position of letter' ):
				match = /rotate based on position of letter (?<letter>\w)/g.exec( instruction )

				const index = password.findIndex( letter => letter === match.groups.letter )
				let rotations = 1 + index + ( index >= 4 ? 1 : 0 )

				while ( rotations -- ) {
					const last = password.pop()
					password.unshift( last )
				}

				break;

			case instruction.includes( 'rotate ' ):
				match = /rotate (?<direction>left|right) (?<steps>\d+) step/g.exec( instruction )

				let steps = parseInt( match.groups.steps );
				while ( steps -- ) {
					if ( match.groups.direction === 'left' ) {
						const first = password.shift()
						password.push( first )
					} else if ( match.groups.direction === 'right' ) {
						const last = password.pop()
						password.unshift( last )
					}
				}
				break;

			case instruction.includes( 'reverse positions ' ):
				match = /reverse positions (?<from>\d) through (?<to>\d)/.exec( instruction )

				password = password.join( '' )
				const part = password.slice( match.groups.from, 1 + parseInt( match.groups.to ) )
				password = password.replace( part, part.split( '' ).reverse().join( '' ) )
				password = password.split( '' )

				break;

			case instruction.includes( 'move position ' ):
				match = /move position (?<from>\d) to position (?<to>\d)/.exec( instruction );

				const letter = password[ match.groups.from ]
				const newPos = parseInt( match.groups.to )
				password = password.filter( l => l !== letter )

				if ( newPos === 0 ) {
					password.unshift( letter )
				} else if ( newPos === password.length ) {
					password.push( letter )
				} else {
					password = password.map( ( l, i ) => i === newPos ? letter + l : l ).join( '' ).split( '' )
				}

				break;
		}

	} )

	return password.join( '' )
}
