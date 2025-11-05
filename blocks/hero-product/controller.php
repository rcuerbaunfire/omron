<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block")
]);

if (
    $context['fields']['gallery_type'] === 'is-360-image' &&
    !empty($context['fields']['product_images'])
) {
    $context['image_urls'] = [];
    $product_images = array_slice($context['fields']['product_images'], 1);

    foreach ($product_images as $image_id) {
        $image_data = wp_get_attachment_image_src($image_id, 'medium_large');
        if ($image_data && isset($image_data[0])) {
            $context['image_urls'][] = $image_data[0];
        }
    }
}



$context["block"]["slug"] = sanitize_title($block["title"]);

acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);
