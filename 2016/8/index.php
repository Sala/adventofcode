<?php

$instructions = array();

$l = 50;
$h = 6;

$matrix = array();

for ( $i = 0; $i < $l; $i ++ ) {
	$matrix[ $i ] = array();
	for ( $j = 0; $j < $h; $j ++ ) {
		$matrix[ $i ][ $j ] = 0;
	}
}

$file = fopen( "input.txt", "r" );

if ( $file ) {
	while ( ( $line = fgets( $file ) ) !== false ) {

		$line = trim( $line );

		$instructions[] = $line;
	}

	fclose( $file );
}

foreach ( $instructions as $instruction ) {
	if ( strpos( $instruction, 'rect' ) === 0 ) {

		preg_match( "/(\d*)x(\d*)/", $instruction, $output );

		do_rect( $matrix, $output[1], $output[2] );

	} else if ( strpos( $instruction, 'rotate row' ) === 0 ) {
		preg_match( "/[rotate row] y=(\d*) by (\d*)/", $instruction, $output );

		$count = $output[2];

		while ( $count -- ) {
			rotate_row( $matrix, $output[1] );
		}
	} else if ( strpos( $instruction, 'rotate column' ) === 0 ) {
		preg_match( "/[rotate column] x=(\d*) by (\d*)/", $instruction, $output );

		$count = $output[2];

		while ( $count -- ) {
			rotate_column( $matrix, $output[1] );
		}
	}
}

echo count_ones( $matrix );

/**
 * Rotate one column of the matrix
 *
 * @param $matrix
 * @param $column
 */
function rotate_column( &$matrix, $column ) {
	global $h;

	$last = $matrix[ $column ][ $h - 1 ];

	for ( $i = $h - 1; $i > 0; $i -- ) {
		$matrix[ $column ][ $i ] = $matrix[ $column ][ $i - 1 ];
	}

	$matrix[ $column ][0] = $last;
}

/**
 * Rotate one row of the matrix
 *
 * @param $matrix
 * @param $row
 */
function rotate_row( &$matrix, $row ) {

	global $l;

	$last = $matrix[ $l - 1 ][ $row ];

	for ( $i = $l - 1; $i > 0; $i -- ) {
		$matrix[ $i ][ $row ] = $matrix[ $i - 1 ][ $row ];
	}

	$matrix[0][ $row ] = $last;
}

/**
 * Fill rectangular with ones
 *
 * @param $matrix
 * @param $x
 * @param $y
 */
function do_rect( &$matrix, $x, $y ) {
	for ( $i = 0; $i < $x; $i ++ ) {
		for ( $j = 0; $j < $y; $j ++ ) {
			$matrix[ $i ][ $j ] = 1;
		}
	}
}

/**
 * Count how many 1 we have in matrix
 *
 * @param $matrix
 *
 * @return int
 */
function count_ones( $matrix ) {

	global $l, $h;
	$count = 0;
	for ( $j = 0; $j < $h; $j ++ ) {
		for ( $i = 0; $i < $l; $i ++ ) {
			$count += $matrix[ $i ][ $j ];
			echo $matrix[ $i ][ $j ] == 1 ? 'X' : '&nbsp;&nbsp;&nbsp;';

			if($i%5==4) {
				echo '';
			}
		}
		echo "<br>";
	}

	return $count;
}
