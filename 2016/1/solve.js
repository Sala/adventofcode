var directions = 'L2,L5,L5,R5,L2,L4,R1,R1,L4,R2,R1,L1,L4,R1,L4,L4,R5,R3,R1,L1,R1,L5,L1,R5,L4,R2,L5,L3,L3,R3,L3,R4,R4,L2,L5,R1,R2,L2,L1,R3,R4,L193,R3,L5,R45,L1,R4,R79,L5,L5,R5,R1,L4,R3,R3,L4,R185,L5,L3,L1,R5,L2,R1,R3,R2,L3,L4,L2,R2,L3,L2,L2,L3,L5,R3,R4,L5,R1,R2,L2,R4,R3,L4,L3,L1,R3,R2,R1,R1,L3,R4,L5,R2,R1,R3,L3,L2,L2,R2,R1,R2,R3,L3,L3,R4,L4,R4,R4,R4,L3,L1,L2,R5,R2,R2,R2,L4,L3,L4,R4,L5,L4,R2,L4,L4,R4,R1,R5,L2,L4,L5,L3,L2,L4,L4,R3,L3,L4,R1,L2,R3,L2,R1,R2,R5,L4,L2,L1,L3,R2,R3,L2,L1,L5,L2,L1,R4'.split( ',' ),
	length = {U: 0, R: 0, D: 0, L: 0},
	dirs = ['U', 'R', 'D', 'L'],
	index = 0;

for ( var i in directions ) {
	index = (4 + index + (directions[i].indexOf( 'L' ) === - 1 ? 1 : - 1)) % 4;
	length[dirs[index]] += parseInt( directions[i].match( /\d+/g )[0] );
}

result = Math.abs( length.U - length.D ) + Math.abs( length.R - length.L );

console.log( result );

