<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block")
]);

$items = $context['fields']['location_items'] ?? [];
$groups = [];
$current_group = [];

$has_started_group = false;

foreach ($items as $item) {
    if (!empty($item['start_new_group'])) {
        if (!empty($current_group)) {
            $groups[] = $current_group;
        }

        $current_group = [$item];
        $has_started_group = true;
    } else {
        $current_group[] = $item;
    }
}

if (!empty($current_group)) {
    $groups[] = $current_group;
}

if (!$has_started_group && !empty($items)) {
    $groups = [$items];
}

$context['location_groups'] = $groups;

$context["block"]["slug"] = sanitize_title($block["title"]);

acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);
