const {readFile} = require( '../../helpers' );
let instructions = [],
	variables = {a: 0, b: 0, c: 1, d: 0}

readFile( 'input.txt', true ).then( lines => {
	lines.forEach( line => {
		let commandRegEx = /(\S*) (\S*)\s?(\S*)/g,
			match = commandRegEx.exec( line )

		instructions.push( {
			command: match[ 1 ],
			param1: match[ 2 ],
			param2: match[ 3 ]
		} )
	} )

	solve()
} )

function solve() {
	let index = 0;

	while ( index < instructions.length ) {
		const instruction = instructions[ index ];

		switch ( instruction.command ) {
			case 'cpy':
				variables[ instruction.param2 ] = isNaN( instruction.param1 ) ? variables[ instruction.param1 ] : parseInt( instruction.param1 )
				index ++
				break;

			case 'inc':
				variables[ instruction.param1 ] ++;
				index ++
				break;

			case 'dec':
				variables[ instruction.param1 ] --;
				index ++
				break;

			case 'jnz':
				index += parseInt( variables[ instruction.param1 ] ) === 0 ? 1 : parseInt( instruction.param2 )
				break;
		}
	}

	console.log( variables.a );
}

