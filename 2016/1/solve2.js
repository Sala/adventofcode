var directions = 'L2,L5,L5,R5,L2,L4,R1,R1,L4,R2,R1,L1,L4,R1,L4,L4,R5,R3,R1,L1,R1,L5,L1,R5,L4,R2,L5,L3,L3,R3,L3,R4,R4,L2,L5,R1,R2,L2,L1,R3,R4,L193,R3,L5,R45,L1,R4,R79,L5,L5,R5,R1,L4,R3,R3,L4,R185,L5,L3,L1,R5,L2,R1,R3,R2,L3,L4,L2,R2,L3,L2,L2,L3,L5,R3,R4,L5,R1,R2,L2,R4,R3,L4,L3,L1,R3,R2,R1,R1,L3,R4,L5,R2,R1,R3,L3,L2,L2,R2,R1,R2,R3,L3,L3,R4,L4,R4,R4,R4,L3,L1,L2,R5,R2,R2,R2,L4,L3,L4,R4,L5,L4,R2,L4,L4,R4,R1,R5,L2,L4,L5,L3,L2,L4,L4,R3,L3,L4,R1,L2,R3,L2,R1,R2,R5,L4,L2,L1,L3,R2,R3,L2,L1,L5,L2,L1,R4'.split( ',' ),
	dirs = ['U', 'R', 'D', 'L'],
	pos = {
		'U': [0, 1],
		'R': [1, 0],
		'D': [0, - 1],
		'L': [- 1, 0]
	},
	index = 0, road = [],
	l, i, j,
	x = 0, y = 0, found = false;

for ( var k in directions ) {
	i = x;
	j = y;

	index = (4 + index + (directions[k].indexOf( 'L' ) === - 1 ? 1 : - 1)) % 4;
	l = parseInt( directions[k].match( /\d+/g )[0] );

	while ( l -- && ! found ) {
		i += pos[dirs[index]][0];
		j += pos[dirs[index]][1];

		if ( ! road[i] ) {
			road[i] = [];
		}

		if ( road[road[i][j]] ) {
			found = true;
			break;
		}

		road[i][j] = 1;
	}

	x = i;
	y = j;

	if ( found ) {
		break;
	}
}

console.log( Math.abs( x ) + Math.abs( y ) );

