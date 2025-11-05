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

use Timber\Timber;

$site_navigation = get_field("site_navigation", "option");
$site_extras = get_field("site_extras", "option");

$context = Timber::context([
    "header_nav_item" => get_field("header_nav_item", $site_navigation),
    "search_placeholder" => get_field("search_placeholder", $site_extras),
    "more_languages_note_label" => get_field("more_languages_note_label", $site_extras),
    "nav_back" => get_field("nav_back", $site_navigation),
    "override_nav_theme" => get_field("override_nav_theme"),
    "nav_theme" => get_field("nav_theme"),
]);
?>

<!doctype html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="theme-color" content="<?= get_field("theme_color", "option") ?>">

    <script type="text/javascript">
        const templateURL = '<?= get_template_directory_uri(); ?>';
        history.scrollRestoration = "auto";
    </script>

    <?php wp_head(); ?>

    <!-- Start of Async HubSpot Analytics Code -->
    <script type="text/javascript">
        (function(d, s, i, r) {
            if (d.getElementById(i)) {
                return;
            }
            var n = d.createElement(s),
                e = d.getElementsByTagName(s)[0];
            n.id = i;
            n.src = '//js.hubspot.com/analytics/' + (Math.ceil(new Date() / r) * r) + '/193755.js';
            e.parentNode.insertBefore(n, e);
        })(document, "script", "hs-analytics", 300000);
    </script>
    <!-- End of Async HubSpot Analytics Code -->

    <!-- Start of Pardot Analytics Code -->
    <script type="text/javascript">
        var piAId = '23312';
        var piCId = '1498';
        (function() {
            function async_load() {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = ('https:' == document.location.protocol ? 'https://pi' : 'http://cdn') + '.pardot.com/pd.js';
                var c = document.getElementsByTagName('script')[0];
                c.parentNode.insertBefore(s, c);
            }
            if (window.attachEvent) {
                window.attachEvent('onload', async_load);
            } else {
                window.addEventListener('load', async_load, false);
            }
        })();
    </script>
    <!-- End of Pardot Analytics Code -->

    <!-- This site uses the Google Analytics by MonsterInsights plugin v9.6.1 - Using Analytics tracking - https://www.monsterinsights.com/ -->
    <script src="//www.googletagmanager.com/gtag/js?id=G-3RYFFLBG67" data-cfasync="false" data-wpfc-render="false" type="text/javascript" async></script>
    <script data-cfasync="false" data-wpfc-render="false" type="text/javascript">
        var mi_version = '9.6.1';
        var mi_track_user = true;
        var mi_no_track_reason = '';
        var MonsterInsightsDefaultLocations = {
            "page_location": "https:\/\/44.233.151.167\/home\/?region=us"
        };
        if (typeof MonsterInsightsPrivacyGuardFilter === 'function') {
            var MonsterInsightsLocations = (typeof MonsterInsightsExcludeQuery === 'object') ? MonsterInsightsPrivacyGuardFilter(MonsterInsightsExcludeQuery) : MonsterInsightsPrivacyGuardFilter(MonsterInsightsDefaultLocations);
        } else {
            var MonsterInsightsLocations = (typeof MonsterInsightsExcludeQuery === 'object') ? MonsterInsightsExcludeQuery : MonsterInsightsDefaultLocations;
        }

        var disableStrs = [
            'ga-disable-G-3RYFFLBG67',
        ];

        /* Function to detect opted out users */
        function __gtagTrackerIsOptedOut() {
            for (var index = 0; index < disableStrs.length; index++) {
                if (document.cookie.indexOf(disableStrs[index] + '=true') > -1) {
                    return true;
                }
            }

            return false;
        }

        /* Disable tracking if the opt-out cookie exists. */
        if (__gtagTrackerIsOptedOut()) {
            for (var index = 0; index < disableStrs.length; index++) {
                window[disableStrs[index]] = true;
            }
        }

        /* Opt-out function */
        function __gtagTrackerOptout() {
            for (var index = 0; index < disableStrs.length; index++) {
                document.cookie = disableStrs[index] + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
                window[disableStrs[index]] = true;
            }
        }

        if ('undefined' === typeof gaOptout) {
            function gaOptout() {
                __gtagTrackerOptout();
            }
        }
        window.dataLayer = window.dataLayer || [];

        window.MonsterInsightsDualTracker = {
            helpers: {},
            trackers: {},
        };
        if (mi_track_user) {
            function __gtagDataLayer() {
                dataLayer.push(arguments);
            }

            function __gtagTracker(type, name, parameters) {
                if (!parameters) {
                    parameters = {};
                }

                if (parameters.send_to) {
                    __gtagDataLayer.apply(null, arguments);
                    return;
                }

                if (type === 'event') {
                    parameters.send_to = monsterinsights_frontend.v4_id;
                    var hookName = name;
                    if (typeof parameters['event_category'] !== 'undefined') {
                        hookName = parameters['event_category'] + ':' + name;
                    }

                    if (typeof MonsterInsightsDualTracker.trackers[hookName] !== 'undefined') {
                        MonsterInsightsDualTracker.trackers[hookName](parameters);
                    } else {
                        __gtagDataLayer('event', name, parameters);
                    }

                } else {
                    __gtagDataLayer.apply(null, arguments);
                }
            }

            __gtagTracker('js', new Date());
            __gtagTracker('set', {
                'developer_id.dZGIzZG': true,
            });
            if (MonsterInsightsLocations.page_location) {
                __gtagTracker('set', MonsterInsightsLocations);
            }
            __gtagTracker('config', 'G-3RYFFLBG67', {
                "forceSSL": "true",
                "link_attribution": "true"
            });
            window.gtag = __gtagTracker;
            (function() {
                /* https://developers.google.com/analytics/devguides/collection/analyticsjs/ */
                /* ga and __gaTracker compatibility shim. */
                var noopfn = function() {
                    return null;
                };
                var newtracker = function() {
                    return new Tracker();
                };
                var Tracker = function() {
                    return null;
                };
                var p = Tracker.prototype;
                p.get = noopfn;
                p.set = noopfn;
                p.send = function() {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift('send');
                    __gaTracker.apply(null, args);
                };
                var __gaTracker = function() {
                    var len = arguments.length;
                    if (len === 0) {
                        return;
                    }
                    var f = arguments[len - 1];
                    if (typeof f !== 'object' || f === null || typeof f.hitCallback !== 'function') {
                        if ('send' === arguments[0]) {
                            var hitConverted, hitObject = false,
                                action;
                            if ('event' === arguments[1]) {
                                if ('undefined' !== typeof arguments[3]) {
                                    hitObject = {
                                        'eventAction': arguments[3],
                                        'eventCategory': arguments[2],
                                        'eventLabel': arguments[4],
                                        'value': arguments[5] ? arguments[5] : 1,
                                    }
                                }
                            }
                            if ('pageview' === arguments[1]) {
                                if ('undefined' !== typeof arguments[2]) {
                                    hitObject = {
                                        'eventAction': 'page_view',
                                        'page_path': arguments[2],
                                    }
                                }
                            }
                            if (typeof arguments[2] === 'object') {
                                hitObject = arguments[2];
                            }
                            if (typeof arguments[5] === 'object') {
                                Object.assign(hitObject, arguments[5]);
                            }
                            if ('undefined' !== typeof arguments[1].hitType) {
                                hitObject = arguments[1];
                                if ('pageview' === hitObject.hitType) {
                                    hitObject.eventAction = 'page_view';
                                }
                            }
                            if (hitObject) {
                                action = 'timing' === arguments[1].hitType ? 'timing_complete' : hitObject.eventAction;
                                hitConverted = mapArgs(hitObject);
                                __gtagTracker('event', action, hitConverted);
                            }
                        }
                        return;
                    }

                    function mapArgs(args) {
                        var arg, hit = {};
                        var gaMap = {
                            'eventCategory': 'event_category',
                            'eventAction': 'event_action',
                            'eventLabel': 'event_label',
                            'eventValue': 'event_value',
                            'nonInteraction': 'non_interaction',
                            'timingCategory': 'event_category',
                            'timingVar': 'name',
                            'timingValue': 'value',
                            'timingLabel': 'event_label',
                            'page': 'page_path',
                            'location': 'page_location',
                            'title': 'page_title',
                            'referrer': 'page_referrer',
                        };
                        for (arg in args) {
                            if (!(!args.hasOwnProperty(arg) || !gaMap.hasOwnProperty(arg))) {
                                hit[gaMap[arg]] = args[arg];
                            } else {
                                hit[arg] = args[arg];
                            }
                        }
                        return hit;
                    }

                    try {
                        f.hitCallback();
                    } catch (ex) {}
                };
                __gaTracker.create = newtracker;
                __gaTracker.getByName = newtracker;
                __gaTracker.getAll = function() {
                    return [];
                };
                __gaTracker.remove = noopfn;
                __gaTracker.loaded = true;
                window['__gaTracker'] = __gaTracker;
            })();
        } else {
            console.log("");
            (function() {
                function __gtagTracker() {
                    return null;
                }

                window['__gtagTracker'] = __gtagTracker;
                window['gtag'] = __gtagTracker;
            })();
        }
    </script>
    <!-- / Google Analytics by MonsterInsights -->

    <!-- Start of Old GA4 -->
    <script type="text/javascript">
        var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
        document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
    </script>

    <script type="text/javascript">
        var countryCode = "UA-509671-1";
        var pageTracker = _gat._getTracker(countryCode);
        pageTracker._initData();
        pageTracker._trackPageview();
    </script>
    <!-- End of Old GA4 -->

    <!-- Google Tag Manager -->
    <script>
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-557F5B4Z');
    </script>
    <!-- End Google Tag Manager -->
</head>

<body <?php body_class("lang-" . get_language()); ?> data-lang="<?= get_language() ?>" data-site-url="<?= home_url() ?>" data-version="<?= _S_VERSION ?>">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-557F5B4Z"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
     
    <?php if (!is_data_source_page(get_page_template_slug())) : ?>
        <?php Timber::render("./partials/nav-header.twig", $context); ?>
    <?php endif ?>