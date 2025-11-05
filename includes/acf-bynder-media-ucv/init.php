<?php
add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook === 'post.php' || $hook === 'post-new.php') {
        wp_register_script("bynder-compactview-script", get_template_directory_uri() . '/assets/js/external/bynder-compactview.min.js', array('jquery'), _S_VERSION, true);

        wp_enqueue_script(
            'media-tab-bynder',
            get_template_directory_uri() . '/includes/bynder/script.js',
            ['media-views', 'media-editor', 'jquery', 'bynder-compactview-script'],
            null,
            true
        );
    }
});
?>
