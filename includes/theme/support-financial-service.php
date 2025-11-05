<?php
define("OMRON_ROI_RESULTS_PAGE_PERMALINK", "/financial-result");
define("OMRON_ROI_LEASING_DURATION", json_encode([36, 48, 60]));

add_action('rest_api_init', function () {
    register_rest_route('omronroi/v1', '/create-record', [
        'methods' => 'POST',
        'callback' => 'roi_create_record',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('omronroi/v1', '/fetch-record', [
        'methods' => 'GET',
        'callback' => 'roi_fetch_record',
        'permission_callback' => '__return_true',
    ]);
});

add_action('current_screen', function ($screen) {
    if ($screen->post_type !== 'roi-result' || $screen->base !== 'edit') {
        return;
    }

    add_filter('manage_roi-result_posts_columns', function ($columns) {
        $new = [];
        foreach ($columns as $key => $label) {
            $new[$key] = $label;
            if ($key === 'cb') {
                $new['post_id'] = 'ID';
            }
        }
        return $new;
    });

    add_action('manage_roi-result_posts_custom_column', function ($column, $post_id) {
        if ($column === 'post_id') {
            echo $post_id;
        }
    }, 10, 2);

    add_filter('manage_edit-roi-result_sortable_columns', function ($columns) {
        $columns['post_id'] = 'ID';
        return $columns;
    });
});

add_filter('acf/load_field/name=price_currency', 'get_available_currencies', 10, 2);
add_filter('acf/load_field/name=ff_currency_type', 'get_available_currencies', 10, 2);

function get_available_currencies($field)
{
    global $post;
    $field['choices'] = array();
    $blocks = parse_blocks($post->post_content);

    foreach ($blocks as $block) {
        if ($block['blockName'] == 'acf/content-roi-calculator') {
            $items = $block['attrs']['data'];
            $currency_count = $items['block_roi_currencies'];

            if ($items['block_roi_currencies'] != 0) {
                for ($x = 0; $x < $currency_count; $x++) {
                    $currency_name = $items["block_roi_currencies_{$x}_currency_name"];
                    $currency_symbol =  $items["block_roi_currencies_{$x}_currency_symbol"];
                    $key = "key_{$currency_name}";

                    if ($currency_name && $currency_symbol) {
                        $field['choices'][$key] = $currency_name;
                    }
                }
            }
        }
    }

    return $field;
}

function roi_create_record($request)
{
    $data = $request->get_json_params();

    $date = new DateTime();
    $formatted_date = $date->format('m/d/y g:i A');
    $post_title = 'ROI Record - ' . $formatted_date;

    $post_id = wp_insert_post([
        'post_type'   => 'roi-result',
        'post_title'  => $post_title,
        'post_status' => 'publish',
    ]);

    if (is_wp_error($post_id)) {
        return new WP_Error('post_error', 'Failed to create post', ['status' => 500]);
    }

    $fields = [
        'robot_name' => $data['robot']['name'] ?? '',
        'robot_image' => $data['robot']['image'] ?? null,
        'robot_subtext' => $data['robot']['subtext'] ?? '',
        'robot_cost' => $data['robot_cost'] ?? null,
        'inflation_rate' => $data['inflation_rate'] ?? null,
        'interest_rate' => $data['interest_rate'] ?? null,
        'currency' => $data['currency_sign'] ?? '',
        'employees_in_one_shift' => $data['hs_employees_per_shift'] ?? '',
        'shifts_per_day' => $data['hs_shifts_per_day'] ?? '',
        'annual_cost_per_employee' => $data['hs_annual_cost_per_employee'] ?? '',
        'other_annual_costs' => $data['hs_other_annual_costs'] ?? '',
        'number_of_robots' => $data['hs_number_of_robots'] ?? '',
        'robot_running_costs' => $data['hs_robot_running_costs'] ?? '',
        'annual_robot_system_gains_savings' => $data['hs_annual_robot_system_gains_savings'] ?? '',
        'system_integration_other_costs' => $data['hs_system_integration___other_costs'] ?? '',
        'operator_support_needed' => $data['hs_operator_support_needed'] ?? '',
        'robot_training_costs' => $data['hs_robot_training_costs'] ?? '',
    ];

    foreach ($fields as $key => $value) {
        $value = sanitize_text_field($value);
        update_field($key, $value, $post_id);
    }

    $redirect_uri = add_query_arg('id', $post_id, home_url(OMRON_ROI_RESULTS_PAGE_PERMALINK));

    return new WP_REST_Response(['success' => true, 'redirect_uri' => $redirect_uri], 200);
}

function roi_fetch_record($request)
{
    $record_id = $request->get_param('id');
    if (!$record_id) return new WP_Error('no_id', 'Missing record ID', ['status' => 400]);

    $number_of_months = 12;

    // Fetch ACF fields
    $robot_cost = get_field("robot_cost", $record_id);
    $inflation_rate = get_field("inflation_rate", $record_id) / 100;
    $interest_rate = get_field("interest_rate", $record_id) / 100;
    $leasing_duration = json_decode(OMRON_ROI_LEASING_DURATION); // ["36", "48", "60"]

    $currency = get_field("currency", $record_id);
    $employees_in_one_shift = get_field("employees_in_one_shift", $record_id);
    $shifts_per_day = get_field("shifts_per_day", $record_id);
    $annual_cost_per_employee = get_field("annual_cost_per_employee", $record_id);
    $other_annual_costs = get_field("other_annual_costs", $record_id);

    $number_of_robots = get_field("number_of_robots", $record_id);
    $robot_running_costs = get_field("robot_running_costs", $record_id);
    $annual_robot_system_gains = get_field("annual_robot_system_gains_savings", $record_id);
    $system_integration_costs = get_field("system_integration_other_costs", $record_id);
    $robot_training_costs = get_field("robot_training_costs", $record_id);
    $operator_support_needed = get_field("operator_support_needed", $record_id) / 100; // in %

    // Step 1 – Current Process Total Annual Cost
    $total_annual_labor_cost = $employees_in_one_shift * $shifts_per_day * $annual_cost_per_employee;
    $total_annual_cost = $total_annual_labor_cost + $other_annual_costs;

    // Step 2 – Robot Initial Investment (CapEx)
    $robot_initial_investment = ($robot_cost * $number_of_robots) + $system_integration_costs + $robot_training_costs;

    // Step 3 – Robot Annual Running Cost
    $operator_support_cost = $employees_in_one_shift * $shifts_per_day * $annual_cost_per_employee * $operator_support_needed;
    $total_robot_running_cost = $robot_running_costs * $number_of_robots;
    $robot_annual_running_cost = $operator_support_cost + $total_robot_running_cost - $annual_robot_system_gains;

    // Step 4 – Annual Savings (pre-inflation)
    $annual_savings = $total_annual_cost - $robot_annual_running_cost;

    // PMT: Leasing Monthly Payments
    $monthly_payment = [];
    foreach ($leasing_duration as $dur) {
        $monthly_payment[$dur] = calculatePMT($interest_rate / $number_of_months, $dur, $robot_initial_investment, 0, 1);
    }

    // Annual and Cumulative Cash Flows (CapEx + Leasing)
    $annual_savings_list = [];
    $annual_cf = [];
    $cumulative_cf = [];

    $leasing = [];
    $cumulative_leasing = [];

    foreach ($leasing_duration as $dur) {
        $leasing[$dur] = [];
        $cumulative_leasing[$dur] = [];
    }

    for ($i = 0; $i < 5; $i++) {
        // Apply inflation year-by-year
        $year_saving = $i === 0 ? $annual_savings : $annual_savings_list[$i - 1] * (1 + $inflation_rate);
        $annual_savings_list[] = $year_saving;

        // CapEx: Year 1 subtracts investment
        $cf = $i === 0 ? $year_saving - $robot_initial_investment : $year_saving;
        $annual_cf[] = $cf;

        $cumulative_cf[$i] = $cf + ($cumulative_cf[$i - 1] ?? 0);

        // Leasing: subtract yearly leasing cost
        foreach ($leasing_duration as $dur) {
            $yearly_lease_payment = $i < ($dur / 12) ? $monthly_payment[$dur] * 12 : 0;
            $leasing[$dur][] = $yearly_lease_payment;

            $leasing_cf = $year_saving - $yearly_lease_payment;
            $cumulative_leasing[$dur][$i] = $leasing_cf + ($cumulative_leasing[$dur][$i - 1] ?? 0);
        }
    }

    // Final Metrics
    $payback = $annual_savings > 0 ? round(($robot_initial_investment / $annual_savings) * $number_of_months) : null;
    $roi = (($cumulative_cf[4] - $robot_initial_investment) / $robot_initial_investment) * 100;
    $net_present_value = calculateNPV($inflation_rate, $annual_cf);

    // Return
    return new WP_REST_Response([
        'success' => true,
        'data' => [
            'currency' => $currency,
            'stats' => [
                'payback' => $payback,
                'roi' => $roi,
                'net_present_value' => $net_present_value
            ],
            'total_annual_cost' => $total_annual_cost,
            'robot_initial_investment' => $robot_initial_investment,
            'robot_annual_running_cost' => $robot_annual_running_cost,
            'annual_savings' => $annual_savings_list,
            'annual_cf' => $annual_cf,
            'cumulative_cf' => $cumulative_cf,
            'monthly_payment' => $monthly_payment,
            'leasing' => $leasing,
            'cumulative_leasing' => $cumulative_leasing
        ]
    ], 200);
}


// Correct PMT and NPV
function calculatePMT($rate, $nper, $pv, $fv = 0, $type = 0)
{
    if ($rate == 0) return -($pv + $fv) / $nper;

    $factor = pow(1 + $rate, $nper);
    $pmt = ($rate * ($pv * $factor + $fv)) / ($type ? ((1 + $rate) * ($factor - 1)) : ($factor - 1));

    return -$pmt;
}

function calculateNPV($rate, $cashflows)
{
    $npv = 0;
    
    foreach ($cashflows as $i => $cf) {
        $npv += $cf / pow(1 + $rate, $i + 1);
    }
    
    return $npv;
}
