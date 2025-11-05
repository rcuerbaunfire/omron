<?php

define('OMRON_TRANSIENT_PREFIX', 'omb_');
define('OMRON_TRANSIENT_DURATION', 7 * DAY_IN_SECONDS);

add_action('admin_menu', function () {
    add_menu_page(
        'Transients',
        'Transients',
        'manage_options',
        'clear-omb-transients',
        'clear_omb_transients_callback',
        menu_icon(),
        90
    );
});

function clear_omb_transients_callback()
{
    global $wpdb;

    if (isset($_POST['clear_omb_transients']) && check_admin_referer('clear_omb_transients_action')) {
        $like = '_transient_omb_%';
        $sql = "
            DELETE FROM {$wpdb->options}
            WHERE option_name LIKE %s
            OR option_name LIKE %s
        ";
        $wpdb->query(
            $wpdb->prepare(
                $sql,
                $like,
                str_replace('_transient_', '_transient_timeout_', $like)
            )
        );
        echo '<div class="notice notice-success is-dismissible"><p>OMB transients cleared!</p></div>';
    }

    $transients = $wpdb->get_results("
        SELECT option_name, option_value 
        FROM {$wpdb->options}
        WHERE option_name LIKE '_transient_omb_%'
    ");

    echo '<div class="wrap">';
    echo '<h1>Omron Transients</h1>';

    echo '<form method="post">';
    wp_nonce_field('clear_omb_transients_action');
    echo '<p><input type="submit" name="clear_omb_transients" class="button button-primary" value="Clear All Omron Transients"></p>';
    echo '</form>';

    if (!empty($transients)) {
        echo '<table class="widefat striped">';
        echo '<thead><tr><th>Transient Name</th><th>Value (Truncated)</th></tr></thead>';
        echo '<tbody>';
        foreach ($transients as $transient) {
            $name = str_replace('_transient_', '', $transient->option_name);
            $value = maybe_unserialize($transient->option_value);
            if (is_scalar($value)) {
                $truncated = wp_trim_words((string)$value, 20);
            } else {
                $truncated = '<pre style="white-space:pre-wrap;">' . esc_html(print_r($value, true)) . '</pre>';
            }
            echo '<tr>';
            echo '<td><code>' . esc_html($name) . '</code></td>';
            echo '<td>' . esc_html($truncated) . '</td>';
            echo '</tr>';
        }
        echo '</tbody></table>';
    } else {
        echo '<p>No transients found starting with <code>omb_</code>.</p>';
    }

    echo '</div>';
}