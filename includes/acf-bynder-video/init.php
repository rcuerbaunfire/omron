<?php
/**
 * Registration logic for the new ACF field type.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'omron_include_acf_field_bynder_video' );
/**
 * Registers the ACF field type.
 */
function omron_include_acf_field_bynder_video() {
	if ( ! function_exists( 'acf_register_field_type' ) ) {
		return;
	}

	require_once __DIR__ . '/class-omron-acf-field-bynder-video.php';

	acf_register_field_type( 'omron_acf_field_bynder_video' );
}
