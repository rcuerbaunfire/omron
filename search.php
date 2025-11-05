<?php

/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package omron
 */
?>

<?php get_header();

use Timber\Timber;
use Timber\PostQuery;

$site_extras = get_field("site_extras", "option");
$search_term = get_search_query();

if ($search_term) {
    $results = new PostQuery($GLOBALS['wp_query']);
    $pagination = Timber::get_pagination();

    $total_found = $GLOBALS['wp_query']->found_posts;

    $search_types_raw = ['page', 'post', 'news', 'event', 'case-study'];
    $selected_type = isset($_GET['type']) ? sanitize_text_field($_GET['type']) : 'all';

    $search_types = [];

    foreach ($search_types_raw as $type) {
        $count_query = new WP_Query([
            'post_type'      => $type,
            'posts_per_page' => -1,
            'fields'         => 'ids',
            's'              => $search_term,
        ]);

        $search_types[] = [
            "type" => $type,
            "count" => $count_query->found_posts,
        ];
    }
}

$context = Timber::context([
    "search_placeholder" => get_field("search_placeholder", $site_extras),
    "search_filter_label" => get_field("search_filter_label", $site_extras),
    "search_clear_label" => get_field("search_clear_label", $site_extras),
    "search_showing_label" => get_field("search_showing_label", $site_extras),
    "search_search_results_label" => get_field("search_search_results_label", $site_extras),
    "search_by_type_label" => get_field("search_by_type_label", $site_extras),
    "search_all_types_label" => get_field("search_all_types_label", $site_extras),
    "search_resources_label" => get_field("search_resources_label", $site_extras),
    "search_content_label" => get_field("search_content_label", $site_extras),
    "search_blog_label" => get_field("search_blog_label", $site_extras),
    "search_news_label" => get_field("search_news_label", $site_extras),
    "search_events_label" => get_field("search_events_label", $site_extras),
    "search_empty_label" => get_field("search_empty_label", $site_extras),
    "search_dialog_apply_label" => get_field("search_dialog_apply_label", $site_extras),
    "search_dialog_close_label" => get_field("search_dialog_close_label", $site_extras),
    "search_term" => $search_term,
    "search_types" => $search_types,
    "active_type" => $selected_type,
    "total_found" => $total_found,
    "results" => $results,
    "pagination" => $pagination,
]);
?>

<main>
    <?php Timber::render("./partials/search.twig", $context); ?>
</main>

<?php get_footer(); ?>