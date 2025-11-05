<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block_tl"),
    "base_count" => 1,
    "posts" => []
]);

$transient_key = OMRON_TRANSIENT_PREFIX . "training_services_list";

$posts = get_transient($transient_key);

if (!$posts) {
    $posts = Timber::get_posts(array(
        'post_type' => "training-service",
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'order' => 'DESC',
    ));

    set_transient($transient_key, $posts, OMRON_TRANSIENT_DURATION);
}

$context['posts'] = $posts;

$categories_raw = Timber::get_terms(array(
    'taxonomy' => 'training-service-category',
    'hide_empty' => false,
));

$context['categories'] = [
    'parents' => [],
    'non_parents' => [],
];

foreach ($categories_raw as $term) {
    if ($term->slug === 'uncategorized') {
        continue;
    }

    if ($term->parent == 0) {
        $category_data = [
            "category" => $term,
            "is_parent" => false,
            "children" => [],
            "name" => $term->name,
        ];

        $children = [];
        foreach ($categories_raw as $child) {
            if ($child->parent == $term->id && $child->slug !== 'uncategorized') {
                $children[] = $child;
            }
        }

        if (!empty($children)) {
            $category_data['is_parent'] = true;
            $category_data['children'] = $children;
            $context['categories']['parents'][] = $category_data;
        } else {
            $context['categories']['non_parents'][] = $category_data;
        }
    }
}

$context['languages'] = Timber::get_terms(array(
    'taxonomy' => 'training-service-language',
    'hide_empty' => false,
));


$context["block"]["slug"] = sanitize_title($block["title"]);

acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);
