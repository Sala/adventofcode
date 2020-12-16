import {readFile, sum} from '../../helpers.js';

const reading = {
	rules: true,
	myTicket: false,
	otherTickets: false
}

readFile( 'input.txt', true ).then( lines => {
	let rules = [],
		myTicket,
		otherTickets = []
	lines.forEach( line => {

		if ( line.includes( 'your ticket' ) ) {
			reading.rules = false;
			reading.myTicket = true
		} else if ( line.includes( 'nearby tickets' ) ) {
			reading.myTicket = false
			reading.otherTickets = true
		} else {
			switch ( true ) {
				case reading.rules:
					const matches = /(.*): (\d*)-(\d*) or (\d*)-(\d*)/gm.exec( line )

					rules.push( {
						name: matches[ 1 ],
						range1: {
							from: parseInt( matches[ 2 ] ),
							to: parseInt( matches[ 3 ] )
						},
						range2: {
							from: parseInt( matches[ 4 ] ),
							to: parseInt( matches[ 5 ] )
						}

					} )

					break;
				case reading.myTicket:
					myTicket = line.split( ',' ).map( n => parseInt( n ) )
					break;
				case reading.otherTickets:
					otherTickets.push( line.split( ',' ).map( n => parseInt( n ) ) )
					break
			}
		}
	} )

	console.log( solve1( rules, otherTickets ) );
	console.log( solve2( myTicket, rules, otherTickets ) );
} )

function solve1( rules, otherTickets ) {
	let errorRate = 0;

	otherTickets.forEach( ticket => {
		let errorFields = ticket.filter( number => {
			return ! rules.some( rule => {
				return ( number >= rule.range1.from && number <= rule.range1.to ) || ( number >= rule.range2.from && number <= rule.range2.to )
			} )
		} )

		errorRate += sum( errorFields )
	} )

	return errorRate
}

function solve2( myTicket, rules, otherTickets ) {
	/* remove bad tickets */
	otherTickets = otherTickets.filter( ticket => {
		return ticket.filter( number => {
			return ! rules.some( rule => {
				return ( number >= rule.range1.from && number <= rule.range1.to ) || ( number >= rule.range2.from && number <= rule.range2.to )
			} )
		} ).length === 0
	} )

	/* find all possible indexes for a rule */
	rules.forEach( rule => {
		let ruleIndex = 0;

		while ( ruleIndex < rules.length ) {
			if ( otherTickets.every( ticket =>
				( ticket[ ruleIndex ] >= rule.range1.from && ticket[ ruleIndex ] <= rule.range1.to ) ||
				( ticket[ ruleIndex ] >= rule.range2.from && ticket[ ruleIndex ] <= rule.range2.to )
			) ) {
				if ( typeof rule.index === 'undefined' ) {
					rule.index = []
				}

				rule.index.push( ruleIndex )
			}

			ruleIndex ++
		}
	} )

	let notReady = true;

	while ( notReady ) {
		notReady = false
		/* if a rule had only one index, that is the one. remove that index from the rest of the rules. */
		rules.forEach( rule => {
			if ( typeof rule.index !== 'number' ) {
				if ( rule.index.length === 1 ) {
					rule.index = rule.index[ 0 ]

					rules.forEach( r => {
						if ( Array.isArray( r.index ) ) {
							r.index = r.index.filter( i => i !== rule.index )
						}
					} )
				} else {
					notReady = true
				}
			}
		} )
	}

	let product = 1
	rules.forEach( rule => {
		if ( rule.name.includes( 'departure' ) ) {
			product *= myTicket[ rule.index ]
		}
	} )

	return parseInt( product )
}
