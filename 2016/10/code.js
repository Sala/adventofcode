const {readFile} = require( '../../helpers' ),
	Bot = require( './bot' ),
	Output = require( './output' ),
	bots = {},
	outputs = {};

readFile( 'input.txt' ).then( input => {

	input = input.split( '\r\n' );

	input.forEach( line => {

		const matches = /\D*(\d*)\D*(\d*)\D*(\d*)/g.exec( line );

		if ( matches ) {
			/* we have instruction of how to pass the chips */
			if ( matches[ 3 ].length > 0 ) {
				const botId = matches[ 1 ],
					lowReceiver = matches[ 2 ],
					highReceiver = matches[ 3 ];

				if ( typeof bots[ botId ] === 'undefined' ) {
					/* if bots don't exist, creat an instance */
					bots[ botId ] = new Bot( botId );
				}

				if ( /low to bot/.test( line ) ) {
					if ( typeof bots[ lowReceiver ] === 'undefined' ) {
						/* if bots don't exist, creat an instance */
						bots[ lowReceiver ] = new Bot( lowReceiver );
					}

					bots[ botId ].setLowReceiver( bots[ lowReceiver ] );
				} else if ( /low to output/.test( line ) ) {
					if ( typeof outputs[ lowReceiver ] === 'undefined' ) {
						outputs[ lowReceiver ] = new Output( lowReceiver );
					}

					bots[ botId ].setLowReceiver( outputs[ lowReceiver ] );
				}

				if ( /high to bot/.test( line ) ) {
					if ( typeof bots[ highReceiver ] === 'undefined' ) {
						/* if bots don't exist, creat an instance */
						bots[ highReceiver ] = new Bot( highReceiver );
					}

					bots[ botId ].setHighReceiver( bots[ highReceiver ] );
				} else if ( /high to output/.test( line ) ) {
					if ( typeof outputs[ highReceiver ] === 'undefined' ) {
						outputs[ highReceiver ] = new Output( highReceiver );
					}

					bots[ botId ].setHighReceiver( outputs[ highReceiver ] );
				}
			} else if ( matches[ 1 ].length > 0 ) {
				/* we have some initial chips to set */
				const chip = parseInt( matches[ 1 ] ),
					botId = matches[ 2 ];

				if ( typeof bots[ botId ] === 'undefined' ) {
					/* if bots don't exist, creat an instance */
					bots[ botId ] = new Bot( botId );
				}

				bots[ botId ].addChip( chip );
			}
		}
	} );

	/* right answer from the first run 😎 */
	solve1( 17, 61 );
	/* solutions can't run both at the same time. comment at least one of them */
	solve2();
} )

function solve1( lowChip, highChip ) {
	let found = false;

	while ( ! found ) {
		for ( const id in bots ) {
			const bot = bots[ id ];

			if ( bot.canSend() ) {
				if ( bot.hasChip( lowChip ) && bot.hasChip( highChip ) ) {
					found = true;
					console.log( bot.getID() );
				} else {
					bot.sendChips();
				}
			}
		}
	}
}

function solve2() {
	let allChipsArePassed = false;

	while ( ! allChipsArePassed ) {
		allChipsArePassed = true;

		for ( const id in bots ) {
			const bot = bots[ id ];

			if ( bot.canSend() ) {
				allChipsArePassed = false;
				bot.sendChips();
			}
		}
	}
	console.log(
		outputs[ 0 ].chips.pop() *
		outputs[ 1 ].chips.pop() *
		outputs[ 2 ].chips.pop()
	);
}
