<?php
add_action('acf/init', function () {
    if (function_exists('get_field')) {
        define('OMRON_BYNDER_API_TOKEN', get_field('omb_api_token', 'option'));
        define('OMRON_BYNDER_BASE_URL', get_field('omb_base_url', 'option'));
        define('OMRON_BYNDER_CACHE_VERSION', get_field('omb_cache_version', 'option'));
    }
});

function omb_get_asset_taxonomy_name($asset, $list, $key)
{
    if (empty($list) || !isset($asset[$key]) || empty($asset[$key])) {
        return '';
    }

    $matches = [];

    foreach ($asset[$key] as $type) {
        foreach ($list as $item) {
            foreach ($item['children'] as $child) {
                if (strcasecmp($child['name'], $type) === 0) {
                    $matches[] = $item['name'];
                    break;
                }
            }
        }
    }

    return implode(', ', array_unique($matches));
}

function omb_get_asset_summary($taxonomies, $asset)
{
    // $lines = omb_get_asset_taxonomy_name($asset, $taxonomies['lines'], 'property_Product_Line');
    // $software = omb_get_asset_taxonomy_name($asset, $taxonomies['categories'], 'property_Software_Phase');
    // $categories = omb_get_asset_taxonomy_name($asset, $taxonomies['categories'], 'property_Asset_Sub-Type');
    // $translation = omb_get_asset_taxonomy_name($asset, $taxonomies['categories'], 'property_Language');

    // $parts = array_filter([$lines, $software, $categories, $translation]);

    // return implode(', ', $parts);
}

function omb_collect_all_ids($array)
{
    $ids = [];

    foreach ($array as $item) {
        if (isset($item['details']['id'])) {
            $rawIds = explode(',', $item['details']['id']);
            $ids = array_merge($ids, $rawIds);
        }

        foreach ($item as $key => $value) {
            if (is_array($value) && strpos($key, 'tax_tree_level_') === 0) {
                $ids = array_merge($ids, omb_collect_all_ids($value));
            }
        }

        foreach ($item as $subItem) {
            if (is_array($subItem)) {
                foreach ($subItem as $subSubItem) {
                    if (is_array($subSubItem) && isset($subSubItem['details'])) {
                        $ids = array_merge($ids, omb_collect_all_ids([$subSubItem]));
                    }
                }
            }
        }
    }

    return $ids;
}

function omb_reindex_for_json(array $array): string
{
    return json_encode(array_values($array));
}

function omb_get_option_label_by_mame($data, $optionName) {
    if (!isset($data['options']) || !is_array($data['options'])) {
        return null;
    }

    foreach ($data['options'] as $option) {
        if (isset($option['name']) && $option['name'] === $optionName) {
            return $option['label'] ?? null;
        }
    }

    return null;
}


