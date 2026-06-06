export const zinnextActionOptions = [
  // Navigation & Interactions
  { value: 'navigate', label: 'Navigate' },
  { value: 'fill', label: 'Fill' },
  { value: 'click', label: 'Click' },
  { value: 'select', label: 'Select' },
  { value: 'press_key', label: 'Press Key' },
  { value: 'type_and_select', label: 'Type and Select' },
  { value: 'type_and_select_modal', label: 'Type and Select (Modal)' },
  { value: 'upload_file', label: 'Upload File' },
  { value: 'check_checkbox', label: 'Check Checkbox' },
  { value: 'check_filter_checkbox', label: 'Check Filter Checkbox' },
  { value: 'select_page_size', label: 'Select Page Size' },
  { value: 'check_n_checkboxes', label: 'Check N Checkboxes' },

  // Assertions
  { value: 'assert_visible', label: 'Assert Visible' },
  { value: 'assert_hidden', label: 'Assert Hidden' },
  { value: 'assert_text', label: 'Assert Text' },
  { value: 'assert_url', label: 'Assert URL' },
  { value: 'assert_body_contains', label: 'Assert Body Contains' },
  { value: 'assert_button_disabled', label: 'Assert Button Disabled' },
  { value: 'assert_field_error', label: 'Assert Field Error' },
  { value: 'assert_field_accepted', label: 'Assert Field Accepted' },
  { value: 'assert_children_disabled', label: 'Assert Children Disabled' },
  { value: 'assert_children_visible', label: 'Assert Children Visible' },
  { value: 'assert_element_count', label: 'Assert Element Count' },

  // Toast Assertions
  { value: 'assert_toast', label: 'Assert Toast' },
  { value: 'assert_toast_success', label: 'Assert Toast Success' },
  { value: 'assert_toast_error', label: 'Assert Toast Error' },

  // Wait Actions
  { value: 'wait_for_visible', label: 'Wait For Visible' },
  { value: 'wait_for_hidden', label: 'Wait For Hidden' },
  { value: 'wait_for_text', label: 'Wait For Text' },
];