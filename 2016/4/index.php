<?php

$rooms = array();

$file = fopen( "input.txt", "r" );

if ( $file ) {
	while ( ( $line = fgets( $file ) ) !== false ) {

		preg_match( "/(.*)-(\d*)\[([a-z]*)\]/", $line, $output );

		array_shift( $output );

		$rooms[] = $output;
	}

	fclose( $file );
}

$sum = 0;

foreach ( $rooms as $room ) {
	$letters = sort_letters( $room[0] );

	$sum += strpos( $letters, $room[2] ) === false ? 0 : intval( $room[1] );

	if ( strpos( $letters, $room[2] ) !== false ) {
		$name = shift( $room[0], $room[1] );

		if ( strpos( $name, 'northpole' ) !== false ) {
			var_dump( 'ID: '. $room[1] );
		}
	}
}

var_dump( 'Sum: '. $sum );

/**
 * Return sorted letters by occurrence or alphabetically on tie
 *
 * @param $word
 *
 * @return string
 */
function sort_letters( $word ) {
	$letters = array();
	for ( $i = 0; $i < strlen( $word ); $i ++ ) {
		if ( $word[ $i ] == '-' ) {
			continue;
		}

		$count = substr_count( $word, $word[ $i ] );

		if ( empty( $letters[ $count ] ) ) {
			$letters[ $count ] = array();
		}

		if ( ! in_array( $word[ $i ], $letters[ $count ] ) ) {
			$letters[ $count ] [] = $word[ $i ];
		}
	}

	krsort( $letters );

	$first = '';

	foreach ( $letters as $k => $group ) {
		usort( $letters[ $k ], 'strcmp' );

		$first .= implode( '', $letters[ $k ] );
	}

	return $first;
}

/**
 * Shift letters in word
 *
 * @param $string
 * @param $distance
 *
 * @return string
 */
function shift( $string, $distance ) {
	$distance   = $distance % 26;
	$string     = strtolower( $string );
	$result     = array();
	$characters = str_split( $string );

	if ( $distance < 0 ) {
		$distance += 26;
	}

	foreach ( $characters as $idx => $char ) {
		if ( $char == '-' ) {
			$result[ $idx ] = ' ';
		} else {
			$result[ $idx ] = chr( 97 + ( ord( $char ) - 97 + $distance ) % 26 );
		}
	}

	return join( '', $result );
}
