<?php
/*
Template Name: ACF Site Navigation
*/

get_header();

use Timber\Timber;

$context = Timber::context([
    "header_nav_item" => get_field("header_nav_item"),
    "footer_social_label" => get_field("footer_social_label"),
    "footer_social" => get_field("footer_social"),
    "primary_footer_nav_columns" => get_field("primary_footer_nav_columns"),
    "secondary_footer_nav_item" => get_field("secondary_footer_nav_item"),
    "footer_credits" => get_field("footer_credits"),
    "footer_form_label" => get_field("footer_form_label"),
    "footer_form_shorcode" => get_field("footer_form_shorcode"),
    "prefooter_heading" => get_field("prefooter_heading"),
    "prefooter_cta" => get_field("prefooter_cta"),
    "prefooter_media_type" => get_field("prefooter_media_type"),
    "prefooter_image" => get_field("prefooter_image"),
    "prefooter_video" => get_field("prefooter_video"),
    "back_to_top" => get_field("back_to_top"),
]);
?>

<main>
    <?php Timber::render("./partials/nav-content.twig", $context); ?>
</main>

<?php get_footer(); ?>