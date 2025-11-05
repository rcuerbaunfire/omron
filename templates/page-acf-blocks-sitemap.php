<?php
/*
Template Name: ACF Blocks Sitemap
*/

get_header();

?>

<main>
    <section class="py-[10rem]">
        <div class="container">
            <?php
            echo '<h3>ACF Blocks Overview</h3>';

            $query = new WP_Query([
                'post_type' => ['page', 'post'],
                'posts_per_page' => -1,
            ]);

            if ($query->have_posts()) {
                $blocks_data = [];
                while ($query->have_posts()) {
                    $query->the_post();
                    $post_id = get_the_ID();
                    $post_title = get_the_title();
                    $post_link = get_permalink();

                    $blocks = parse_blocks(get_the_content());
                    $seen_blocks = [];

                    foreach ($blocks as $block) {
                        if ($block['blockName'] && strpos($block['blockName'], 'acf/') === 0) {
                            $block_name = str_replace('acf/', '', $block['blockName']);

                            if (!in_array($block_name, $seen_blocks, true)) {
                                $seen_blocks[] = $block_name;
                                $blocks_data[$block_name][] = [
                                    'title' => $post_title,
                                    'link' => $post_link
                                ];
                            }
                        }
                    }
                }

                wp_reset_postdata();

                if (!empty($blocks_data)) {
                    echo "<div class='mt-[2.875rem] flex flex-col gap-[3.75rem]'>";
                    foreach ($blocks_data as $block_name => $instances) {
                        echo "<div class='flex gap-[2.5rem] items-start'>";
                        echo "<img class='object-contain h-[6.25rem] w-[12.5rem] shrink-0' src=" . get_template_directory_uri() . "/blocks/" . $block_name . "/preview.png"  . ">";
                        echo "<div class='flex flex-col gap-[1rem] flex-1'>";
                        echo "<h6>$block_name</h6>";
                        echo '<ul class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[1rem]">';
                        foreach ($instances as $instance) {
                            echo '<li class="flex flex-col gap-1">';
                            echo '<span class="text-[1.125rem]">' . esc_html($instance['title']) . '</span>';
                            echo '<div class="flex gap-2">';
                            echo '<a class="text-[#1263FF] underline text-[0.875rem]" href="' . esc_url($instance['link']) . '" target="_blank" rel="noopener noreferrer">View</a>';
                            echo '<a class="text-[#1263FF] underline text-[0.875rem]" href="' . esc_url(get_edit_post_link(url_to_postid($instance['link']))) . '">Edit</a>';
                            echo '</div>';
                            echo '</li>';
                        }
                        echo '</ul>';
                        echo "</div>";
                        echo "</div>";
                    }
                    echo "</div>";
                } else {
                    echo '<p>No ACF blocks found.</p>';
                }
            } else {
                echo '<p>No content found.</p>';
            }
            ?>
        </div>
    </section>
</main>

<?php get_footer(); ?>