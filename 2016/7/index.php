<?php

$ips = array();

$file = fopen( "input.txt", "r" );

if ( $file ) {
	while ( ( $line = fgets( $file ) ) !== false ) {

		$line = trim( $line );

		preg_match_all( "/\[([a-z]*)\]/", $line, $hyper );

		$super = preg_replace( "/\[([a-z]*)\]/", " ", $line );

		$ips[] = array( $hyper[1], explode( ' ', $super ) );
	}

	fclose( $file );
}


$count = 0;
foreach ( $ips as $ip ) {
	$no  = true;
	$yes = false;

	$found_aba = false;

	foreach ( $ip[0] as $i ) {
		$no = $no && ! is_abba( $i );
	}


	foreach ( $ip[1] as $i ) {
		$yes = $yes || is_abba( $i );
	}

	foreach ( $ip[1] as $i ) {
		$super = get_aba( $i );

		/* if we have one or more aba strings in the super net sequence  */
		if ( count( $super ) > 0 ) {
			/* cheack each of them */
			foreach ( $super as $aba ) {
				/* with each hyper net combination */
				foreach ( $ip[0] as $j ) {
					/* and find a match for an aba */
					if ( strpos( $j, get_bab_from_aba( $aba ) ) !== false ) {
						$found_aba = true;
					}
				}
			}
		}
	}

//	if ( $no && $yes ) {
	if ( $found_aba ) {
		$count ++;
	}

}

echo $count;

/**
 * Check if the word as a 4 letter palindrome with different first two letters substring
 *
 * @param $word
 *
 * @return bool
 */
function is_abba( $word ) {
	$yes = false;

	$index = 0;

	while ( ! $yes && $index < strlen( $word ) - 3 ) {
		$substr = substr( $word, $index, 4 );

		$reverse = strrev( $substr );

		if ( $substr == $reverse && $substr[0] != $substr[1] ) {
			$yes = true;
		}

		$index ++;

	}

	return $yes;
}

/**
 * Return all ABA type strings from the word
 *
 * @param $word
 *
 * @return array
 */
function get_aba( $word ) {
	$yes = false;

	$index = 0;

	$aba = array();

	while ( ! $yes && $index < strlen( $word ) - 2 ) {
		$substr = substr( $word, $index, 3 );

		if ( $substr[0] == $substr[2] && $substr[0] != $substr[1] ) {
			$aba[] = $substr;
		}

		$index ++;

	}

	return $aba;
}

/**
 * @param $word
 *
 * @return string
 */
function get_bab_from_aba( $word ) {
	return $word[1] . $word[0] . $word[1];
}