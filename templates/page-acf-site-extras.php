<?php
/*
Template Name: ACF Site Extras
*/

get_header();

use Timber\Timber;

$site_extras = get_field("site_extras", "option");

$context = Timber::context([
    "nt_heading" => get_field("404_heading", $site_extras),
    "nt_cta" => get_field("404_cta", $site_extras),
    "blog_back_cta" => get_field("blog_back_cta", $site_extras),
    "news_back_cta" => get_field("blog_back_cta", $site_extras),
    "case_study_back_cta" => get_field("case_study_back_cta", $site_extras),
    "news_label" => get_field("news_label", $site_extras),
    "post_label" => get_field("post_label", $site_extras),
    "case_study_label" => get_field("case_study_label", $site_extras)
]);
?>

<main>
    <?php Timber::render("./partials/site-extras.twig", $context); ?>
</main>

<?php get_footer(); ?>