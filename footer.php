<?php

/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package omron
 */

use Timber\Timber;

$site_navigation = get_field("site_navigation", "option");

$context = Timber::context([
    "footer_social_label" => get_field("footer_social_label", $site_navigation),
    "footer_social" => get_field("footer_social", $site_navigation),
    "primary_footer_nav_columns" => get_field("primary_footer_nav_columns", $site_navigation),
    "secondary_footer_nav_item" => get_field("secondary_footer_nav_item", $site_navigation),
    "footer_credits" => get_field("footer_credits", $site_navigation),
    "footer_form_label" => get_field("footer_form_label", $site_navigation),
    "footer_form" => get_field("footer_form_hubspot_form", $site_navigation),
    "prefooter_heading" => get_field("prefooter_heading", $site_navigation),
    "prefooter_cta" => get_field("prefooter_cta", $site_navigation),
    "prefooter_media_type" => get_field("prefooter_media_type", $site_navigation),
    "prefooter_image" => get_field("prefooter_image", $site_navigation),
    "prefooter_video" => get_field("prefooter_video", $site_navigation),
    "back_to_top" => get_field("back_to_top", $site_navigation),
]);
?>

<?php if (!is_data_source_page(get_page_template_slug())) : ?>
    <?php Timber::render("./partials/nav-footer.twig", $context); ?>
<?php endif ?>

<?php wp_footer(); ?>

<script type="text/javascript">
    _linkedin_partner_id = "7840324";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script>

<script type="text/javascript">
    (function(l) {
        if (!l) {
            window.lintrk = function(a, b) {
                window.lintrk.q.push([a, b])
            };
            window.lintrk.q = []
        }

        var s = document.getElementsByTagName("script")[0];
        var b = document.createElement("script");

        b.type = "text/javascript";
        b.async = true;

        b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";

        s.parentNode.insertBefore(b, s);
    })(window.lintrk);
</script>

<noscript>
    <img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=7840324&fmt=gif" />
</noscript>

<!-- Start of HubSpot Script Code -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js-na2.hs-scripts.com/47882041.js"></script>
<!-- End of HubSpot Script Code -->

</body>

</html>