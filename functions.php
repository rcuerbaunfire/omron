<?php

/**
 * omron functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package omron
 */

// Ensure this file is being accessed within WordPress
if (!defined('ABSPATH')) {
    exit;
}

require_once 'vendor/autoload.php';
Timber\Timber::init();

define('_S_VERSION', '2.2.3');

require_once 'includes/theme/allow-file-types.php';
require_once 'includes/theme/disable-comments.php';

// require_once 'includes/theme/setup-timber.php';
require_once 'includes/theme/setup-shortcodes.php';

require_once 'includes/theme/support-transients.php';

require_once 'includes/theme/support-helpers.php';
require_once 'includes/theme/support-visual-overrides.php';
require_once 'includes/theme/support-bynder.php';
require_once 'includes/theme/support-gated-resource.php';
require_once 'includes/theme/support-financial-service.php';

require_once 'includes/theme/disable-native-blocks.php';
require_once 'includes/theme/support-llms.php';

// require_once 'includes/acf-bynder-image/init.php'; 
// require_once 'includes/acf-bynder-video/init.php';

if (!function_exists('bf_setup')) {
    function bf_setup()
    {
        add_theme_support('align-wide');
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
    }

    add_action('after_setup_theme', 'bf_setup');
}
















/******************** LOAD CSS/JS ************************/
add_action('wp_enqueue_scripts', 'front_css_styles');
add_action('wp_enqueue_scripts', 'front_js_scripts');

add_action('admin_enqueue_scripts', 'back_css_styles');
add_action('admin_enqueue_scripts', 'back_js_scripts');

add_action('enqueue_block_editor_assets', 'enqueue_block_editor_scripts');


function front_css_styles()
{
    wp_enqueue_style('bf-normalize-style', get_template_directory_uri() . '/assets/css/theme/normalize.css', array(), _S_VERSION);
    wp_enqueue_style('bf-admin-bar-style', get_template_directory_uri() . '/assets/css/admin/bar.css', array(), _S_VERSION);
    wp_enqueue_style('bf-theme-style', get_template_directory_uri() . '/assets/css/theme/styles.css', array(), uniqid());

    // wp_register_style('bf-lenis-style', get_template_directory_uri() . '/assets/css/external/lenis.css', array(), _S_VERSION);

    wp_register_style('bf-swiper-style', get_template_directory_uri() . '/assets/css/external/swiper-bundle.min.css', array(), _S_VERSION);
    // wp_register_style('bf-owl-style', get_template_directory_uri() . '/assets/css/external/owl.css', array(), _S_VERSION);

    wp_register_style('bf-jquery-ui-style', get_template_directory_uri() . '/assets/css/external/jquery-ui.css', array(), _S_VERSION);
    wp_register_style('bf-toastify-style', get_template_directory_uri() . '/assets/css/external/toastify.min.css', array(), _S_VERSION);
    wp_register_style('bf-mapbox-style', get_template_directory_uri() . '/assets/css/external/mapbox-gl.css', array(), _S_VERSION);
}

function front_js_scripts()
{
    // wp_enqueue_script("bf-gblaze-smoother-script", get_template_directory_uri() . '/assets/js/external/smooth-scroll-gblaze.min.js', array(), _S_VERSION, false);

    // wp_enqueue_script("bf-lenis-script", get_template_directory_uri() . '/assets/js/external/lenis.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_enqueue_script("bf-gsap-script", get_template_directory_uri() . '/assets/js/external/gsap.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_enqueue_script("bf-scroll-trigger-script", get_template_directory_uri() . '/assets/js/external/ScrollTrigger.min.js', array('jquery'), _S_VERSION, array('strategy' => 'defer', 'in_footer' => true));
    // wp_enqueue_script("bf-smooth-scroll-script", get_template_directory_uri() . '/assets/js/external/ScrollSmoother.min.js', array('jquery'), _S_VERSION, array('strategy' => 'defer', 'in_footer' => true));
    wp_enqueue_script("bf-scroll-to-script", get_template_directory_uri() . '/assets/js/external/ScrollToPlugin.min.js', array('jquery'), _S_VERSION, array('strategy' => 'defer', 'in_footer' => true));
    // wp_enqueue_script("split-text-script", get_template_directory_uri() . '/assets/js/external/SplitText.min.js', array(), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));


    wp_register_script("bf-vimeo-script", get_template_directory_uri() . '/assets/js/external/vimeo-player.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_register_script('bf-swiper-script', get_template_directory_uri() . '/assets/js/external/swiper.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_register_script('bf-owl-script', get_template_directory_uri() . '/assets/js/external/owl.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_register_script("bf-jquery-ui-script", get_template_directory_uri() . '/assets/js/external/jquery-ui.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    wp_register_script("bf-apex-script", get_template_directory_uri() . '/assets/js/external/apexcharts.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    wp_register_script('bf-popper-script', get_template_directory_uri() . '/assets/js/external/popper.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_register_script("bf-tippy-script", get_template_directory_uri() . '/assets/js/external/tippy.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_register_script("bf-toastify-script", get_template_directory_uri() . '/assets/js/external/toastify.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    wp_register_script("bf-hubspot-script", get_template_directory_uri() . '/assets/js/external/hubspot-embed.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_register_script("bf-mapbox-script", get_template_directory_uri() . '/assets/js/external/mapbox-gl.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    if (is_404()) {
        wp_enqueue_script("bf-lottie-script", get_template_directory_uri() . '/assets/js/external/lottie-player.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    } else {
        wp_register_script("bf-lottie-script", get_template_directory_uri() . '/assets/js/external/lottie-player.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    }

    wp_enqueue_script("bf-custom-min-js", get_template_directory_uri() . '/assets/js/custom.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    wp_localize_script('acf-resources-list-view-script', 'z3', [
        'tk' => OMRON_BYNDER_API_TOKEN,
        'b' => OMRON_BYNDER_BASE_URL,
        'x' => OMRON_BYNDER_CACHE_VERSION,
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('acf_block_nonce')
    ]);
}

function back_css_styles($hook)
{
    wp_enqueue_style('bf-custom-admin-style', get_template_directory_uri() . '/assets/css/admin/styles.css', array(), _S_VERSION);

    if ($hook === 'post.php' || $hook === 'post-new.php') {
        wp_enqueue_style('acfe-style', get_template_directory_uri() . '/assets/css/external/acfe.css', array(), _S_VERSION);
    }
}

function back_js_scripts($hook)
{
    if ($hook === 'post.php' || $hook === 'post-new.php') {
    }
}

function enqueue_block_editor_scripts()
{
    wp_enqueue_script('bf-block-preview-script', get_template_directory_uri() . '/assets/js/admin/block-preview.js', array('jquery'), _S_VERSION, true);
    wp_localize_script("bf-block-preview-script", 'theme_path', array('url' => get_template_directory_uri()));
}
















/******************** ACF ************************/
add_action('init', 'register_custom_blocks');

function register_custom_blocks()
{
    if (!function_exists('acf_register_block_type')) {
        return;
    }

    $theme_slug = get_field("theme_slug", "option");
    $theme_slug = $theme_slug ? $theme_slug : "baunfire";

    $blocks_dir = __DIR__ . '/blocks';

    if (!is_dir($blocks_dir) || !is_readable($blocks_dir)) {
        return;
    }

    foreach (scandir($blocks_dir) as $dir) {
        $block_path = $blocks_dir . '/' . $dir;

        if ($dir === '.' || $dir === '..' || !is_dir($block_path)) {
            continue;
        }

        $block_json = $block_path . '/block.json';
        if (!file_exists($block_json)) {
            continue;
        }

        register_block_type($block_path, [
            'category' => $theme_slug,
            'icon'     => block_icon(true),
            'supports' => [
                'anchor' => true,
            ],
        ]);
    }
}

add_filter('block_categories_all', 'custom_block_category', 10, 2);

function custom_block_category($categories, $post)
{
    $theme_slug = get_field("theme_slug", "option");
    $theme_slug = $theme_slug ? $theme_slug : "baunfire";

    $custom_category = array(
        array(
            'slug' => $theme_slug,
            'title' => __(ucfirst(strtolower($theme_slug)) . ' Blocks', 'omron')
        ),
    );

    return array_merge($custom_category, $categories);
}

add_filter('block_categories_all', 'custom_block_category', 10, 2);
