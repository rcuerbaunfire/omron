<?php

/**
 * Defines the custom field type class.
 */

if (! defined('ABSPATH')) {
    exit;
}

/**
 * omron_acf_field_bynder_video class.
 */
class omron_acf_field_bynder_video extends \acf_field
{
    /**
     * Controls field type visibilty in REST requests.
     *
     * @var bool
     */
    public $show_in_rest = true;

    /**
     * Environment values relating to the theme or plugin.
     *
     * @var array $env Plugin or theme context such as 'url' and 'version'.
     */
    private $env;

    /**
     * Constructor.
     */
    public function __construct()
    {
        /**
         * Field type reference used in PHP and JS code.
         *
         * No spaces. Underscores allowed.
         */
        $this->name = 'bynder_video';

        /**
         * Field type label.
         *
         * For public-facing UI. May contain spaces.
         */
        $this->label = __('Bynder Video', 'omron');

        /**
         * The category the field appears within in the field type picker.
         */
        $this->category = 'basic'; // basic | content | choice | relational | jquery | layout | CUSTOM GROUP NAME

        /**
         * Field type Description.
         *
         * For field descriptions. May contain spaces.
         */
        $this->description = __('This field does amazing things.', 'omron');

        /**
         * Field type Doc URL.
         *
         * For linking to a documentation page. Displayed in the field picker modal.
         */
        $this->doc_url = '';

        /**
         * Field type Tutorial URL.
         *
         * For linking to a tutorial resource. Displayed in the field picker modal.
         */
        $this->tutorial_url = '';

        /**
         * Defaults for your custom user-facing settings for this field type.
         */
        $this->defaults = array(
            'font_size'    => 14,
        );

        /**
         * Strings used in JavaScript code.
         *
         * Allows JS strings to be translated in PHP and loaded in JS via:
         *
         * ```js
         * const errorMessage = acf._e("bynder_video", "error");
         * ```
         */
        $this->l10n = array(
            'error'    => __('Error! Please enter a higher value', 'omron'),
        );

        $this->env = array(
            'url'     => site_url(str_replace(ABSPATH, '', __DIR__)), // URL to the acf-bynder-video directory.
            'version' => '1.0', // Replace this with your theme or plugin version constant.
        );

        /**
         * Field type preview image.
         *
         * A preview image for the field type in the picker modal.
         */
        $this->preview_image = $this->env['url'] . '/assets/videos/field-preview-custom.png';

        parent::__construct();
    }

    /**
     * Settings to display when users configure a field of this type.
     *
     * These settings appear on the ACF “Edit Field Group” admin page when
     * setting up the field.
     *
     * @param array $field
     * @return void
     */
    public function render_field_settings($field)
    {
        /*
		 * Repeat for each setting you wish to display for this field type.
		 */
        // acf_render_field_setting(
        //     $field,
        //     array(
        //         'label'            => __('Font Size', 'omron'),
        //         'instructions'    => __('Customise the input font size', 'omron'),
        //         'type'            => 'number',
        //         'name'            => 'font_size',
        //         'append'        => 'px',
        //     )
        // );

        // To render field settings on other tabs in ACF 6.0+:
        // https://www.advancedcustomfields.com/resources/adding-custom-settings-fields/#moving-field-setting
    }

    /**
     * HTML content to show when a publisher edits the field on the edit screen.
     *
     * @param array $field The field settings and values.
     * @return void
     */
    public function render_field($field)
    {
        $value = json_decode($field['value']);

        $name = '';
        $thumbnail = '';
        $file = '';

        if (is_object($value)) {
            $name = isset($value->name) ? $value->name : '';
            $file = isset($value->file) ? esc_url($value->file) : '';
            $thumbnail = isset($value->thumbnail) ? esc_url($value->thumbnail) : '';
        }
?>
        <div class="acf-bynder-wrapper">
            <button type="button" class="button open-bynder">Select from Bynder</button>

            <input type="hidden" name="<?php echo esc_attr($field['name']); ?>" value="<?php echo esc_attr(json_encode(array('name' => $name, 'file' => $file, 'thumbnail' => $thumbnail))); ?>" class="bynder-url" />

            <div class="bynder-preview">
                <div class="bynder-asset">
                    <img src="<?= $thumbnail ?>" loading="lazy" alt="<?= $name ?>">
                    <?php if ($name): ?><p><?= $name ?></p><?php endif; ?>
                </div>

                <div class="bynder-asset-remove">
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="13" cy="13" r="13" fill="#FF6058" />
                        <path d="M18 8.66034L8.66034 18L8 17.3397L17.3397 8L18 8.66034Z" fill="white" />
                        <path d="M18 17.3397L17.3397 18L8 8.66034L8.66034 8L18 17.3397Z" fill="white" />
                    </svg>
                </div>
            </div>
        </div>
<?php
    }

    /**
     * Enqueues CSS and JavaScript needed by HTML in the render_field() method.
     *
     * Callback for admin_enqueue_script.
     *
     * @return void
     */
    public function input_admin_enqueue_scripts()
    {
        $url = get_template_directory_uri() . '/includes/acf-bynder-video/';
        wp_register_script("bynder-compactview-script", get_template_directory_uri() . '/assets/js/external/bynder-compactview.min.js', array('jquery'), _S_VERSION, true);

        wp_register_script(
            'omron-bynder-video',
            "{$url}assets/js/field.js",
            array('acf-input', 'jquery', 'bynder-compactview-script'),
            _S_VERSION
        );

        wp_register_style(
            'omron-bynder-video',
            "{$url}assets/css/field.css",
            array('acf-input'),
            _S_VERSION
        );

        wp_enqueue_script('omron-bynder-video');
        wp_enqueue_style('omron-bynder-video');
    }
}
