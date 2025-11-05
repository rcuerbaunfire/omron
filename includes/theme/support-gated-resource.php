<?php

/******************** GATED RESOURCE FORM SUBMISSION ************************/

function submit_member_form_ajax()
{
    if (!wp_verify_nonce($_POST['_ajax_nonce'], 'acf_block_nonce')) {
        wp_send_json_error(array('message' => 'Security check failed.'));
    }

    $data = $_POST['data'];
    $email = sanitize_email($data['email']);
    $first = sanitize_text_field($data['firstname'] ?? '');
    $last = sanitize_text_field($data['lastname'] ?? '');
    $country = sanitize_text_field($data['country'] ?? '');
    $company = sanitize_text_field($data['company'] ?? '');
    $blacklisted_domains = sanitize_text_field($data['blacklist'] ?? '');

    if (empty($email) || !is_email($email)) {
        wp_send_json_error(array('message' => 'Please provide a valid email address.'));
    }

    $is_blacklisted = is_email_domain_blacklisted($email, $blacklisted_domains);

    $post_id = wp_insert_post(array(
        'post_type' => 'member',
        'post_title' => $email,
        'post_status' => 'publish',
    ));

    if (is_wp_error($post_id)) {
        wp_send_json_error(array('message' => 'Failed to save your information. Please try again.'));
    }

    update_field('first_name', $first, $post_id);
    update_field('last_name', $last, $post_id);
    update_field('company', $company, $post_id);
    update_field('email', $email, $post_id);
    update_field('country', $country, $post_id);

    if (!$is_blacklisted) {
        update_field('action', true, $post_id);
    } else {
        update_field('action', false, $post_id);
    }

    update_field('cancelled', false, $post_id);

    $secret = wp_salt();
    $hash = hash_hmac('sha256', $email, $secret);

    wp_send_json_success(array(
        'email' => $email,
        'hash' => $hash,
        'auto_approved' => !$is_blacklisted
    ));
}

add_action('wp_ajax_submit_member_form', 'submit_member_form_ajax');
add_action('wp_ajax_nopriv_submit_member_form', 'submit_member_form_ajax');


function verify_member_cookie_ajax()
{
    if (!isset($_POST['_ajax_nonce']) || !wp_verify_nonce($_POST['_ajax_nonce'], 'acf_block_nonce')) {
        wp_send_json_error();
    }

    $email = $_POST['email'] ?? '';
    $hash  = $_POST['hash'] ?? '';

    $result = get_member_verification_status($email, $hash);

    if (!$result['success']) {
        wp_send_json_error();
    }

    wp_send_json_success(['status' => $result['status']]);
}

add_action('wp_ajax_verify_member_cookie', 'verify_member_cookie_ajax');
add_action('wp_ajax_nopriv_verify_member_cookie', 'verify_member_cookie_ajax');

function is_existing_member_ajax()
{
    if (!isset($_POST['_ajax_nonce']) || !wp_verify_nonce($_POST['_ajax_nonce'], 'acf_block_nonce')) {
        wp_send_json_error();
    }

    $email = $_POST['email'];

    $args = array(
        'post_type'      => 'member',
        'posts_per_page' => 1,
        'meta_query'     => array(
            'relation' => 'AND',
            array(
                'key'     => 'email',
                'value'   => $email,
                'compare' => '='
            ),
            array(
                'key'     => 'action',
                'value'   => '1',
                'compare' => '='
            )
        )
    );

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        $secret = wp_salt();
        $hash = hash_hmac('sha256', $email, $secret);

        wp_send_json_success(array(
            'hash' => $hash
        ));
    } else {
        wp_send_json_error();
    }
}


add_action('wp_ajax_is_existing_member', 'is_existing_member_ajax');
add_action('wp_ajax_nopriv_is_existing_member', 'is_existing_member_ajax');


function get_member_verification_status($email, $hash)
{
    $email = sanitize_email($email);
    $hash = sanitize_text_field($hash);

    if (empty($email) || empty($hash)) {
        return ['success' => false];
    }

    $secret = wp_salt();
    $calc = hash_hmac('sha256', $email, $secret);

    if (!hash_equals($calc, $hash)) {
        return ['success' => false];
    }

    $args = [
        'post_type'      => 'member',
        'meta_key'       => 'email',
        'meta_value'     => $email,
        'posts_per_page' => 1,
    ];

    $query = new WP_Query($args);

    if (!$query->have_posts()) {
        return ['success' => false];
    }

    $post_id = $query->posts[0]->ID;
    $accepted = get_field('action', $post_id);
    $cancelled = get_field('cancelled', $post_id);

    if ($cancelled) {
        return ['success' => true, 'status' => 'denied'];
    }

    if ($accepted) {
        return ['success' => true, 'status' => 'approved'];
    }

    return ['success' => true, 'status' => 'pending'];
}

function is_email_domain_blacklisted($email, $blacklisted_domains)
{
    $domain = strtolower(substr(strrchr($email, "@"), 1));

    if (empty($blacklisted_domains)) {
        return false;
    }

    return in_array($domain, $blacklisted_domains);
}













/******************** GATED RESOURCE MEMBER MANAGEMENT ************************/
function add_member_columns($columns)
{
    $new_columns = array();
    $new_columns['cb'] = $columns['cb'];
    $new_columns['first_name'] = 'First Name';
    $new_columns['last_name'] = 'Last Name';
    $new_columns['company'] = 'Company';
    $new_columns['country'] = 'Country';
    $new_columns['email'] = 'Email';
    $new_columns['status'] = 'Status';
    $new_columns['actions'] = 'Actions';

    return $new_columns;
}

function populate_member_columns($column, $post_id)
{
    switch ($column) {
        case 'first_name':
            echo esc_html(get_field('first_name', $post_id));
            break;
        case 'last_name':
            echo esc_html(get_field('last_name', $post_id));
            break;
        case 'company':
            echo esc_html(get_field('company', $post_id));
            break;
        case 'country':
            echo esc_html(get_field('country', $post_id));
            break;
        case 'email':
            echo esc_html(get_field('email', $post_id));
            break;
        case 'status':
            $action = get_field('action', $post_id);
            $cancelled = get_field('cancelled', $post_id);

            if ($cancelled) {
                $status_class = 'cancelled';
                $status_text = 'Denied';
            } else {
                $status_class = $action ? 'accepted' : 'pending';
                $status_text = $action ? 'Approved' : 'Pending';
            }
            echo '<span class="status-badge ' . $status_class . '">' . $status_text . '</span>';
            break;
        case 'actions':
            $action = get_field('action', $post_id);
            $cancelled = get_field('cancelled', $post_id);
            $accept_nonce = wp_create_nonce('accept_member_' . $post_id);
            $cancel_nonce = wp_create_nonce('cancel_member_' . $post_id);
        ?>
            <div class="member-actions">
                <button type="button"
                    class="button button-primary accept-member-btn <?php echo ($action && !$cancelled) ? 'disabled' : ''; ?>"
                    data-member-id="<?php echo $post_id; ?>" data-nonce="<?php echo $accept_nonce; ?>" <?php echo ($action && !$cancelled) ? 'disabled' : ''; ?>>
                    Approve
                </button>
                <button type="button" class="button button-secondary cancel-member-btn <?php echo $cancelled ? 'disabled' : ''; ?>"
                    data-member-id="<?php echo $post_id; ?>" data-nonce="<?php echo $cancel_nonce; ?>" <?php echo $cancelled ? 'disabled' : ''; ?>>
                    Deny
                </button>
            </div>
        <?php
            break;
    }
}

function handle_accept_member()
{
    $member_id = intval($_POST['member_id']);
    $nonce = $_POST['nonce'];

    if (!wp_verify_nonce($nonce, 'accept_member_' . $member_id)) {
        wp_die('Security check failed');
    }

    update_field('action', true, $member_id);
    update_field('cancelled', false, $member_id);

    wp_send_json_success(array(
        'new_status' => true,
        'status_text' => 'Approved',
        'message' => 'Member accepted successfully'
    ));
}

function handle_cancel_member()
{
    $member_id = intval($_POST['member_id']);
    $nonce = $_POST['nonce'];

    if (!wp_verify_nonce($nonce, 'cancel_member_' . $member_id)) {
        wp_die('Security check failed');
    }

    update_field('action', false, $member_id);
    update_field('cancelled', true, $member_id);

    wp_send_json_success(array(
        'cancelled' => true,
        'status_text' => 'Denied',
        'message' => 'Member cancelled successfully'
    ));
}

function member_admin_styles_scripts()
{
    global $post_type;
    if ($post_type == 'member') { ?>
    <style>
        .status-badge {
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
        }

        .status-badge.accepted {
            background-color: #d4edda;
            color: #155724;
        }

        .member-actions {
            display: flex;
            gap: 5px;
        }

        .status-badge.cancelled {
            background-color: #f8d7da;
            color: #721c24;
        }

        .status-badge.pending {
            background-color: #fff3cd;
            color: #856404;
        }

        .member-actions .button {
            font-size: 12px;
            padding: 4px 8px;
            height: auto;
            line-height: 1.2;
        }

        .member-actions .button.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* .subsubsub { display: none !important; }
                .search-box { display: none !important; } */
        .page-title-action {
            display: none !important;
        }

        /* .tablenav { display: none !important; } */
    </style>

    <script>
        jQuery(document).ready(function($) {
            $('.accept-member-btn').on('click', function() {
                if ($(this).hasClass('disabled')) return;

                var button = $(this);
                var memberId = button.data('member-id');
                var nonce = button.data('nonce');
                var row = button.closest('tr');

                button.prop('disabled', true);

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'accept_member',
                        member_id: memberId,
                        nonce: nonce
                    },
                    success: function(response) {
                        if (response.success) {
                            var statusCell = row.find('.status-badge');
                            statusCell.text('Approved');
                            statusCell.removeClass('accepted pending cancelled').addClass('accepted');

                            row.find('.accept-member-btn').addClass('disabled').prop('disabled', true);
                            row.find('.cancel-member-btn').removeClass('disabled').prop('disabled', false);

                            updateNonces(memberId, row);
                        }
                        button.prop('disabled', false);
                    },
                    error: function() {
                        alert('Error accepting member');
                        button.prop('disabled', false);
                    }
                });
            });

            $('.cancel-member-btn').on('click', function() {
                if ($(this).hasClass('disabled')) return;

                var button = $(this);
                var memberId = button.data('member-id');
                var nonce = button.data('nonce');
                var row = button.closest('tr');

                button.prop('disabled', true);

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'cancel_member',
                        member_id: memberId,
                        nonce: nonce
                    },
                    success: function(response) {
                        if (response.success) {
                            var statusCell = row.find('.status-badge');
                            statusCell.text('Denied');
                            statusCell.removeClass('accepted pending cancelled').addClass('cancelled');

                            row.find('.cancel-member-btn').addClass('disabled').prop('disabled', true);
                            row.find('.accept-member-btn').removeClass('disabled').prop('disabled', false);

                            updateNonces(memberId, row);
                        }
                        button.prop('disabled', false);
                    },
                    error: function() {
                        alert('Error cancelling member');
                        button.prop('disabled', false);
                    }
                });
            });

            function updateNonces(memberId, row) {
                $.post(ajaxurl, {
                    action: 'get_new_nonces',
                    member_id: memberId
                }, function(nonces) {
                    if (nonces.accept_nonce) {
                        row.find('.accept-member-btn').data('nonce', nonces.accept_nonce);
                    }
                    if (nonces.cancel_nonce) {
                        row.find('.cancel-member-btn').data('nonce', nonces.cancel_nonce);
                    }
                }, 'json');
            }
        });
    </script>
    <?php
    }
}

function get_new_member_nonces()
{
    $member_id = intval($_POST['member_id']);

    wp_send_json(array(
        'accept_nonce' => wp_create_nonce('accept_member_' . $member_id),
        'cancel_nonce' => wp_create_nonce('cancel_member_' . $member_id)
    ));
}

add_filter('manage_member_posts_columns', 'add_member_columns');
add_action('manage_member_posts_custom_column', 'populate_member_columns', 10, 2);
add_action('wp_ajax_accept_member', 'handle_accept_member');
add_action('wp_ajax_cancel_member', 'handle_cancel_member');
add_action('admin_head-edit.php', 'member_admin_styles_scripts');
add_action('wp_ajax_get_new_nonces', 'get_new_member_nonces');