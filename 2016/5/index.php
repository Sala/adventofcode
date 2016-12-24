<?php

$input    = 'cxdnnyjw';
$index    = 0;
$password = '';
$found    = 0;

while ( 0 && strlen( $password ) < 8 ) {

	$hash = md5( $input . $index );
	if ( strpos( $hash, '00000' ) === 0 ) {
		$password .= $hash[5];
	}

	$index ++;
}

while ( $found < 8 ) {

	$hash = md5( $input . $index );
	if ( strpos( $hash, '00000' ) === 0 && is_numeric( $hash[5] ) && intval( $hash[5] ) < 8 ) {
		if ( ! isset( $password[ $hash[5] ] ) ) {
			$found ++;
			$password[ $hash[5] ] = $hash[6];
		}
	}

	$index ++;
}

ksort( $password );

echo implode( '', $password );