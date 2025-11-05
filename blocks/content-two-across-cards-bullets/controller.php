<?php
use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
  "block" => $block,
  "fields" => get_field("block_ctacb")
]);

$context["block"]["slug"] = sanitize_title($block["title"]);

acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);