<?php
use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);
$site_extras = get_field("site_extras", "option");

$context = Timber::context([
  "block" => $block,
  "fields" => get_field("block"),
  "share_label" => get_field("share_label", $site_extras)
]);

$context["block"]["slug"] = sanitize_title($block["title"]);

acf_reset_meta($block["id"]);


Timber::render("./template.twig", $context);