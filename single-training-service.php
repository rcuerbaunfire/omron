<?php

/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package omron
 */

get_header();
?>

<main>
    <?php
    $site_extras = get_field("site_extras", "option");
    $back_cta = get_field("training_back_cta", $site_extras);
    $hero_cta = get_field("ts_cta");
    $categories = wp_get_post_terms(get_the_ID(), 'training-service-category', ['fields' => 'names']);
    $languages = wp_get_post_terms(get_the_ID(), 'training-service-language', ['fields' => 'names']);
    $tags = [$categories, $languages];
    ?>

    <section class="ts-head">
        <div class="~pt-[4.5rem]/[5.75rem] ~pb-[1.25rem]/[1.5rem]">
            <div class="container">
                <div class="flex flex-col ~gap-[4rem]/[6rem]">
                    <?php if ($back_cta) : ?>
                        <?php
                        $link_url = isset($back_cta['url']) ? $back_cta['url'] : "#";
                        $link_title = isset($back_cta['title']) ? $back_cta['title'] : "";
                        $link_target = isset($back_cta['target']) ? $back_cta['target'] : '_self';
                        ?>

                        <a class="post-back" href="<?= $link_url ?>" target="<?= $link_target ?>">
                            <svg width="13" height="13" viewbox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.44255 10.375L1.15088 6.94618L4.44254 3.51736" stroke="#262626" stroke-opacity="0.6" stroke-width="1.5" stroke-miterlimit="10" />
                                <path d="M11.9859 0.500098L11.9859 5.84905C11.9859 6.45472 11.4943 6.94627 10.8887 6.94627L1.01367 6.94627" stroke="#262626" stroke-opacity="0.6" stroke-width="1.5" stroke-miterlimit="10" />
                            </svg>

                            <p><?= $link_title ?></p>
                        </a>
                    <?php endif; ?>

                    <div class="flex flex-col ~gap-[3rem]/[4rem]">
                        <div class="flex ~gap-[1.5rem]/[4rem] lg:justify-between lg:items-end max-lg:flex-col">
                            <h2 class="lg:flex-1 lg:max-w-[69.625rem]"><?= get_the_title(); ?></h2>

                            <?php if ($hero_cta) : ?>
                                <?php
                                $link_url = isset($hero_cta['url']) ? $hero_cta['url'] : "#";
                                $link_title = isset($hero_cta['title']) ? $hero_cta['title'] : "";
                                $link_target = isset($hero_cta['target']) ? $hero_cta['target'] : '_self';
                                ?>

                                <?php if (strpos($link_url, 'embed:') !== false): ?>
                                    <div class="btn embed-btn blue has-arrow shrink-0">
                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.55697 10.375L11.8486 6.94618L8.55697 3.51736" stroke="white" stroke-width="1.5" stroke-miterlimit="10" />
                                            <path d="M1.01411 0.500006L1.0141 5.84896C1.0141 6.45463 1.50566 6.94618 2.11133 6.94618L11.9863 6.94618" stroke="white" stroke-width="1.5" stroke-miterlimit="10" />
                                        </svg>

                                        <p><?= htmlspecialchars($link_title) ?></p>

                                        <?= str_replace('embed:', '', $link_url) ?>
                                    </div>
                                <?php else: ?>
                                    <a class="btn blue filled has-arrow shrink-0" type="button" href="<?= $link_url ?>" target="<?= $link_target ?>">
                                        <svg width="13" height="13" viewbox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.55697 10.375L11.8486 6.94618L8.55697 3.51736" stroke="white" stroke-width="1.5" stroke-miterlimit="10" />
                                            <path d="M1.01411 0.500006L1.0141 5.84896C1.0141 6.45463 1.50566 6.94618 2.11133 6.94618L11.9863 6.94618" stroke="white" stroke-width="1.5" stroke-miterlimit="10" />
                                        </svg>

                                        <p><?= $link_title ?></p>
                                    </a>
                                <?php endif; ?>
                            <?php endif; ?>
                        </div>

                        <?php if (!empty($tags)) : ?>
                            <div class="flex max-lg:flex-col justify-between gap-[0.75rem]">
                                <?php foreach ($tags as $tag) : ?>
                                    <?php if (!empty($tag)) : ?>
                                        <div class="flex gap-[0.5rem] items-center">
                                            <div class="w-[0.5rem] h-[0.5rem] shrink-0 bg-green"></div>
                                            <small class="text-black-60"><?= implode(', ', $tag) ?></small>
                                        </div>
                                    <?php endif; ?>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="ts-content-outer st-xl sb-xxl">
        <div class="container">
            <div class="ts-content-inner">
                <div class="ts-content">
                    <?php the_content(); ?>
                </div>

                <?php
                $image_id  = get_post_thumbnail_id(get_the_ID());
                $image_url = wp_get_attachment_image_url($image_id, 'large');
                $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);
                ?>

                <?php if ($image_url) : ?>
                    <div class="ts-feat-image">
                        <img loading="lazy" src="<?= esc_url($image_url) ?>" alt="<?= esc_attr($image_alt) ?>">
                    </div>
                <?php endif ?>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>