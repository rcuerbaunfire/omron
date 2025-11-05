<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block")
]);

$context["block"]["slug"] = sanitize_title($block["title"]);

$post_type = $context["fields"]["type"];
$post_type = str_replace("rs-", "", $post_type);

$categories_raw = Timber::get_terms(array(
    'taxonomy' => 'category',
    'hide_empty' => false,
));

if ($post_type != 'post') {
    $cpt_taxonomy = get_object_taxonomies($post_type);
    $taxonomy_slug = !empty($cpt_taxonomy) ? $cpt_taxonomy[0] : null;

    $categories_raw = Timber::get_terms(array(
        'taxonomy' => $taxonomy_slug,
        'hide_empty' => false,
    ));
}

$context['categories'] = [];

foreach ($categories_raw as $parent) {
    if ($parent->parent == 0 && $parent->slug != 'uncategorized') {
        $category_data = [
            "category" => $parent,
            "parent" => false,
            "children" => [],
            "name" => $parent->name
        ];

        $parent_children = [];

        foreach ($categories_raw as $child) {
            if ($parent->id == $child->parent && $child->slug != 'uncategorized') {
                $parent_children[] = $child;
            }
        }

        if (count($parent_children) != 0) {
            $category_data['parent'] = true;
            $category_data['children'] = $parent_children;
        }

        $context['categories'][] = $category_data;
    }
}

$raw_posts = Timber::get_posts(array(
    'post_type' => $post_type,
    'posts_per_page' => -1,
    'post_status' => 'publish',
    'order' => 'DESC',
));

$blogs = [];

foreach ($raw_posts as $post) {
    $image = get_blog_head_image($post->ID);

    $blogs[] = [
        'post' => $post,
        'image' => $image,
    ];
}

$context['blogs'] = $blogs;

acf_reset_meta($block["id"]);


Timber::render("./template.twig", $context);
