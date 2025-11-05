<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$site_extras = get_field("site_extras", "option");

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block"),
    "back_cta" => get_field("blog_back_cta", $site_extras),
]);

$post_type = get_post_type();

if ($post_type == 'case-study') {
    $context["back_cta"] = get_field("case_study_back_cta", $site_extras);
} else if ($post_type == 'news') {
    $context["back_cta"] = get_field("news_back_cta", $site_extras);
}

$context["block"]["slug"] = sanitize_title($block["title"]);

acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);
