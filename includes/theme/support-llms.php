<?php
/**
 * Register the rewrite rule for /llms.txt request.
 */
function my_theme_llmstxt_rewrite()
{
    add_rewrite_rule('^llms\.txt$', 'index.php?my_theme_llmstxt=true', 'top');
}
add_action('init', 'my_theme_llmstxt_rewrite', 10);

/**
 * Filter the list of public query vars in order to allow the WP::parse_request
 * to register the query variable.
 *
 * @param array $public_query_vars The array of public query variables.
 *
 * @return array
 */
function my_theme_llmstxt_query_var($public_query_vars)
{
    $public_query_vars[] = 'my_theme_llmstxt';
    return $public_query_vars;
}
add_filter('query_vars', 'my_theme_llmstxt_query_var', 10, 1);

/**
 * Hook the parse_request action and serve the llms.txt when custom query variable is set to 'true'.
 *
 * @param WP $wp Current WordPress environment instance
 */
function my_theme_llmstxt_request($wp)
{
    if (isset($wp->query_vars['my_theme_llmstxt']) && 'true' === $wp->query_vars['my_theme_llmstxt']) {
        /*
         * Set proper content-type as per specifications provided by these guides :
         * https://iabtechlab.com/llms-txt/
         *
         * The HTTP Content-type should be ‘text/plain’, and all other Content-types should be treated
         * as an error and the content ignored.
         */
        header('Content-Type: text/plain');

        // The code expects an existing llms.txt file in the root of your active theme.
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- The llms.txt spec requires and expects plain text, so no escaping needed.
        echo file_get_contents(get_stylesheet_directory() . '/llms.txt');
        exit;
    }
}
add_action('parse_request', 'my_theme_llmstxt_request', 10, 1);