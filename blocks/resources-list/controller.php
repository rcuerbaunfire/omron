<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block"),
]);

$gated_access_status = "invalid";

if (isset($_COOKIE['member_data'])) {
    $cookie_val = $_COOKIE['member_data'];
    $cookie_parts = explode('|', $cookie_val);

    if (count($cookie_parts) === 2) {
        $email = sanitize_email($cookie_parts[0]);
        $hash = sanitize_text_field($cookie_parts[1]);

        $status_result = get_member_verification_status($email, $hash);

        if ($status_result['success']) {
            $gated_access_status = $status_result['status'];
        }
    }
}

$context["gated_access_status"] = $gated_access_status;

if ($gated_access_status == "approved") {
    $asset_base_count = 20;

    $token = OMRON_BYNDER_API_TOKEN;
    $omb_base_url = OMRON_BYNDER_BASE_URL;

    $all_raw_taxonomies = array_unique(omb_collect_all_ids($context['fields']['tax_tree_level_1']));
    $all_raw_taxonomies = array_diff($all_raw_taxonomies, ["934C35AD-AE5E-41D1-9692ADF404AB63CD"]); //remove japanese by default
    $assets_base_taxonomies = implode(',', $all_raw_taxonomies);

    $assets_params = [
        'limit' => $asset_base_count,
        'orderBy' => 'dateCreated desc',
        'page' => 1,
        'total' => 1,
        'keyword' => '',
        'property_Sync' => 'ORT_Website',
        'propertyOptionId' => $assets_base_taxonomies,
        'property_Language' => "847280D1-3D0E-4A4E-9B8813A365E0BF0F"
    ];

    $assets_transient_key = "omb_api_resources_cache";
    $assets = get_transient($assets_transient_key);
    // $assets = false;
    $metas_transient_key = "omb_api_metas_cache";
    $metas = get_transient($metas_transient_key);

    $response_timeout_in_seconds = 5;

    $api_headers = [
        'Authorization' => 'Bearer ' . OMRON_BYNDER_API_TOKEN,
        'Content-Type'  => 'application/json',
    ];

    if (!$assets) {
        $assets_params_url = "{$omb_base_url}/media/?" . http_build_query($assets_params);

        $bynder_assets_response  = wp_remote_get($assets_params_url, [
            "timeout" => $response_timeout_in_seconds,
            'headers' => $api_headers,
        ]);

        if (!is_wp_error($bynder_assets_response)) {
            $bynder_assets_data = json_decode(wp_remote_retrieve_body($bynder_assets_response), true);

            if (isset($bynder_assets_data) && is_array($bynder_assets_data) && $bynder_assets_data['total']['count'] != 0) {
                $assets = $bynder_assets_data;
                set_transient($assets_transient_key, $assets, OMRON_TRANSIENT_DURATION);
            }
        } else {
            $assets = [];
        }
    }

    if (!$metas) {
        $metas_params_url = "{$omb_base_url}/metaproperties";

        $bynder_metas_response  = wp_remote_get($metas_params_url, [
            "timeout" => $response_timeout_in_seconds,
            'headers' => $api_headers,
        ]);

        if (!is_wp_error($bynder_metas_response)) {
            $bynder_metas_data = json_decode(wp_remote_retrieve_body($bynder_metas_response), true);

            if (isset($bynder_metas_data)) {
                $metas = $bynder_metas_data;
                set_transient($metas_transient_key, $metas, OMRON_TRANSIENT_DURATION);
            }
        } else {
            $metas = null;
        }
    }
    
    $context['assets'] = $assets;
    $context["metas"] = $metas;
    $context["base_count"] = $asset_base_count;
    $context['taxonomy_ids'] = omb_reindex_for_json($all_raw_taxonomies);
} else {
    $blacklisted_domains = $context["fields"]["blacklisted_email"] ?? null;

    if ($blacklisted_domains) {
        $domains = [];

        foreach ($blacklisted_domains as $row) {
            if (!empty($row['email_domain'])) {
                $domains[] = strtolower(trim($row['email_domain']));
            }
        }

        $context['processed_blacklisted_domains'] = $domains;
    }
}

$context["block"]["slug"] = sanitize_title($block["title"]);

acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);
