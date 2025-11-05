<?php
/**
 * Registration logic for the new ACF field type.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'omron_include_acf_field_bynder_image' );
/**
 * Registers the ACF field type.
 */
function omron_include_acf_field_bynder_image() {
	if ( ! function_exists( 'acf_register_field_type' ) ) {
		return;
	}

	require_once __DIR__ . '/class-omron-acf-field-bynder-image.php';

	acf_register_field_type( 'omron_acf_field_bynder_image' );
}
