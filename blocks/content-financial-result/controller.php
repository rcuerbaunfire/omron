<?php

use Timber\Timber;

$result_id = isset($_GET['id']) && preg_match('/^\d+$/', $_GET['id']) ? (int) $_GET['id'] : null;
$result_post = get_post($result_id);

if ($result_post && $result_post->post_type === 'roi-result') {
    acf_setup_meta($block["data"], $block["id"], true);

    $context = Timber::context([
        "block" => $block,
        "fields" => get_field("block")
    ]);

    $context['result_id'] = $result_id;
    $context['has_result'] = true;
    $context["terms"] = json_decode(OMRON_ROI_LEASING_DURATION);
    $context["block"]["slug"] = sanitize_title($block["title"]);

    acf_reset_meta($block["id"]);


    Timber::render("./template.twig", $context);
} else {
    $site_extras = get_field("site_extras", "option");

    $context = Timber::context([
        "nt_heading" => get_field("404_heading", $site_extras),
        "nt_cta" => get_field("404_cta", $site_extras),
    ]);

    Timber::render("./partials/404.twig", $context);
}
