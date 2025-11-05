<?php

/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package omron
 */
?>

<?php get_header();

use Timber\Timber;

$site_extras = get_field("site_extras", "option");

$context = Timber::context([
    "nt_heading" => get_field("404_heading", $site_extras),
    "nt_cta" => get_field("404_cta", $site_extras),
]);
?>

<main>
    <?php Timber::render("./partials/404.twig", $context); ?>
</main>

<?php get_footer(); ?>