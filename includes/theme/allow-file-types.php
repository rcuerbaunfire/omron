<?php
// Allow SVG
// Support more file types

add_filter('wp_check_filetype_and_ext', function ($data, $file, $filename, $mimes) {
    global $wp_version;
    if ($wp_version !== '4.7.1') {
        return $data;
    }

    $filetype = wp_check_filetype($filename, $mimes);

    return [
        'ext' => $filetype['ext'],
        'type' => $filetype['type'],
        'proper_filename' => $data['proper_filename']
    ];
}, 10, 4);

add_filter('upload_mimes', function ($mime_types) {
    $mime_types['jpg'] = 'image/jpeg';
    $mime_types['jpeg'] = 'image/jpeg';
    $mime_types['png'] = 'image/png';
    $mime_types['pdf'] = 'application/pdf';
    $mime_types['ico'] = 'image/x-icon';
    $mime_types['svg'] = 'image/svg+xml';
    $mime_types['svgz'] = 'image/svg+xml';
    return $mime_types;
});