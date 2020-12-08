import {readFile} from '../../helpers.js'

readFile( 'input.txt', true ).then( lines => {
	let instructions = [];

	lines.forEach( line => {
		const match = /(\w*) ([+|-]\d*)/gm.exec( line )

		instructions.push( {
			command: match[ 1 ],
			param: parseInt( match[ 2 ] ),
			visited: false
		} )
	} )

	console.log( runCode( instructions, true ) );

	console.log( solve2( instructions ) );
} )

function solve2( instructions ) {
	let notInfiniteLoop = false,
		indexToChange = 0,
		betterInstructions,
		oneChangeDone;

	while ( notInfiniteLoop === false && indexToChange < instructions.length ) {
		oneChangeDone = false;

		betterInstructions = instructions.map( ( instruction, index ) => {
			let command = instruction.command

			if ( ! oneChangeDone && indexToChange <= index && ( instruction.command === 'jmp' || instruction.command === 'nop' ) ) {
				command = instruction.command === 'jmp' ? 'nop' : 'jmp'
				oneChangeDone = true;
			}

			return {
				command,
				param: instruction.param,
				visited: false
			}
		} )

		indexToChange ++

		notInfiniteLoop = runCode( betterInstructions )
	}

	return notInfiniteLoop
}

function runCode( instructions, alwaysReturnAcc = false ) {
	let index = 0, infiniteLoop = false;
	let acc = 0

	while ( index < instructions.length && ! infiniteLoop ) {
		const instruction = instructions[ index ];

		if ( instructions[ index ].visited ) {
			infiniteLoop = true
		} else {
			instructions[ index ].visited = true

			switch ( instruction.command ) {
				case 'acc':
					acc += instruction.param
					index ++
					break;

				case 'nop':
					index ++
					break;

				case 'jmp':
					index += instruction.param
					break;
			}
		}
	}

	return infiniteLoop && ! alwaysReturnAcc ? false : acc;
}

