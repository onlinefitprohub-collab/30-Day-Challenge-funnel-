# HighLevel Page Builder Developer-Grade Element Schema Reference

This document provides a comprehensive, developer-grade reference for the HighLevel page builder element schema. It details the properties, accepted values, and structural constraints required to programmatically replicate or interact with HighLevel funnel and website pages. This guide is intended for developers, AI coding assistants (like Replit), and automation scripts.

## Core Architecture and Hierarchy

The HighLevel page builder follows a strict hierarchical layout system. All content must be nested according to this structure.

**Page/Global Settings** represent the root level containing global styles, SEO metadata, and custom code. **Sections** are full-width containers that hold rows. Sections can have backgrounds including colors, images, videos, or gradients. **Rows** act as horizontal containers within sections and can be configured to have 1 to 6 columns. **Columns** are the vertical containers within rows that hold the actual elements. Finally, **Elements** are the individual components such as text, images, buttons, forms, and widgets placed inside the columns. Every node in this hierarchy shares a set of common properties for spacing, visibility, and basic styling.

## Common Base Properties

Almost all layout containers and elements share these base properties in their schema to control spacing, visibility, and sizing.

| Property Category | Schema Key | Accepted Values | Description |
| :--- | :--- | :--- | :--- |
| **Visibility** | `visibility` | `desktop`, `mobile`, `all` | Controls whether the element is rendered on specific devices. |
| **Custom Class** | `custom_class` | `string` (e.g., `my-custom-btn`) | User-defined CSS classes for external styling targeting. |
| **Padding** | `padding_top`, `padding_bottom`, `padding_left`, `padding_right` | `number` (px) | Internal spacing. Layout elements usually default to 10px-20px. |
| **Margin** | `margin_top`, `margin_bottom` | `number` (px) | External spacing. Elements typically only have top/bottom margins. |
| **Sizing** | `width`, `height` | `auto`, `px`, `%`, `vh`, `vw`, `em`, `rem` | Explicit sizing controls. Requires a unit suffix or `auto`. |
| **Mobile Sizing** | `mobile_width`, `mobile_height` | `auto`, `px`, `%`, `vh`, `vw`, `em`, `rem` | Device-specific overrides for width and height. |
| **Background Color**| `bg_color` | `rgba()`, `hex`, `transparent` | Solid background color. |

## Advanced Common Styling

Containers and many elements support advanced styling properties, including shadows, borders, and complex backgrounds.

| Property Category | Schema Key | Accepted Values | Description |
| :--- | :--- | :--- | :--- |
| **Box Shadow** | `box_shadow` | Object: `{ x: number, y: number, blur: number, spread: number, color: rgba, type: 'inner' \| 'outer' }` | Outer or inner drop shadows. Elements can have multiple shadows. |
| **Text Shadow** | `text_shadow` | Object: `{ x: number, y: number, blur: number, color: rgba }` | Applied only to text-based elements (Headings, Paragraphs). |
| **Border** | `border_type` | `none`, `solid`, `dashed`, `dotted` | The style of the border. |
| **Border Width** | `border_width` | `number` (px) | Thickness of the border. |
| **Border Color** | `border_color` | `rgba()`, `hex` | Color of the border. |
| **Border Radius** | `border_radius` | `number` (px) | Corner rounding. |
| **Background Image**| `bg_image_url` | `string` (URL) | URL of the background image. |
| **Background Video**| `bg_video_url` | `string` (URL) | URL of an MP4 or WebM video. Supports `autoplay` and `loop` booleans. |
| **Gradient** | `bg_gradient` | Object: `{ type: 'linear' \| 'radial' \| 'angular', angle: number, stops: [{color: rgba, position: number}] }` | Multi-color gradient backgrounds (up to 10 stops). |
| **Background Blur** | `bg_blur` | `number` (px) | Applies a glassmorphism blur effect to the background. |

## Animation Properties

HighLevel supports entrance animations configured at the element level, allowing for dynamic page loads.

| Schema Key | Accepted Values | Description |
| :--- | :--- | :--- |
| `animation_type` | `none`, `fade_in`, `slide_left`, `slide_right`, `slide_up`, `slide_down`, `bounce`, `zoom_in` | The type of entrance animation. |
| `animation_duration` | `number` (0.1 to 3.0) | Duration of the animation in seconds. |
| `animation_delay` | `number` (0.0 to 5.0) | Delay before the animation starts in seconds. Element remains hidden until delay finishes. |
| `animation_easing` | `linear`, `ease_in`, `ease_out`, `ease_in_out` | The timing function for the animation curve. |
| `animation_scale` | `number` (0.5 to 2.0) | Scale multiplier applied during the animation. |

## Layout Container Elements

The structural foundation of any HighLevel page relies on Sections, Rows, and Columns.

| Container Type | Schema Key | Accepted Values | Description |
| :--- | :--- | :--- | :--- |
| **Section** | `allow_sticky` | `boolean` | Allows the section to stick to the top on scroll. |
| **Section** | `bg_media_type` | `color`, `image`, `video`, `gradient` | Determines the type of background applied. |
| **Section** | `video_options` | `fit`, `fill`, `cover` | Controls how video backgrounds scale (if media type is video). |
| **Section** | `video_loop` | `boolean` | Whether the background video loops continuously. |
| **Section** | `bg_opacity` | `none`, `light_fade`, `half_fade`, `heavy_fade` | Overlay opacity for images or videos. |
| **Row** | `column_layout` | `string` | Defines the row structure (e.g., `1-col`, `2-col`, `3-col`, `left-sidebar`). |
| **Column** | `width_percentage` | `number` | The relative width of the column within the row (e.g., 33.33 for a 3-col layout). |

## Basic Elements

Basic elements include typography, images, videos, and buttons.

| Element Type | Schema Key | Accepted Values | Description |
| :--- | :--- | :--- | :--- |
| **Typography** | `text` | `string` | HTML string containing the text and inline formatting. |
| **Typography** | `font_family` | `string` | Google Fonts name or custom font name. |
| **Typography** | `font_size` | `number` (px) | Size of the text. |
| **Typography** | `font_weight` | `normal`, `bold`, `100`-`900` | Weight or thickness of the font. |
| **Typography** | `text_color` | `rgba()`, `hex` | Primary color of the text. |
| **Typography** | `text_align` | `left`, `center`, `right`, `justify` | Alignment of the text block. |
| **Bullet List** | `list_items` | Array of objects | `[{ text: string, icon: string }]` where icon is a FontAwesome class. |
| **Bullet List** | `list_item_spacing`| `number` (px) | Vertical space between list items. |
| **Rich Text** | `content` | `string` | HTML payload containing paragraphs, headings, blockquotes, and code blocks. |
| **Button** | `button_text` | `string` | Primary text displayed on the button. |
| **Button** | `action_type` | `open_popup`, `go_to_url`, `scroll_to_element`, `submit_form` | The action triggered when the button is clicked. |
| **Button** | `action_url` | `string` | The destination URL (required if action type is `go_to_url`). |
| **Button** | `hover_bg_color` | `rgba()`, `hex` | Background color when hovered. |
| **Image** | `image_url` | `string` | Source URL of the image. |
| **Image** | `image_action` | `none`, `open_popup`, `go_to_url` | Action triggered upon clicking the image. |
| **Video** | `video_type` | `youtube`, `vimeo`, `wistia`, `html5` | The hosting source of the video. |
| **Video** | `video_url` | `string` | URL or ID of the video. |
| **Video** | `autoplay` | `boolean` | Whether the video plays automatically on load. |

## Form and Interactive Elements

These elements capture user data and handle transactions.

| Element Type | Schema Key | Accepted Values | Description |
| :--- | :--- | :--- | :--- |
| **Form** | `form_id` | `string` | UUID of the HighLevel form to embed. |
| **Form** | `redirect_action` | `use_form_settings`, `go_to_next_step`, `go_to_url` | Action taken after successful form submission. |
| **Order Form** | `step_1_title` | `string` | Title for the first step of a two-step order form. |
| **Order Form** | `enable_order_bump`| `boolean` | Toggles the display of an order bump offer. |
| **Calendar** | `calendar_id` | `string` | UUID of the HighLevel calendar to embed. |
| **Custom HTML**| `custom_code` | `string` | Raw HTML, CSS (`<style>`), or JS (`<script>`) payload. |

## Advanced Widget Elements

Widgets provide complex functionality like carousels, timers, and dynamic menus.

| Widget Type | Schema Key | Accepted Values | Description |
| :--- | :--- | :--- | :--- |
| **Image Slider** | `slides` | Array of objects | `[{ image_url: string, action_url: string }]` defining each slide. |
| **Image Slider** | `autoplay` | `boolean` | Whether the carousel transitions automatically. |
| **Countdown** | `timer_type` | `fixed`, `evergreen`, `daily_recurring` | The behavior model of the countdown timer. |
| **Countdown** | `end_date` | `ISO 8601 Date String` | The target date for fixed timers. |
| **Countdown** | `expire_action` | `redirect_url`, `show_hide_elements` | What happens when the timer reaches zero. |
| **Navigation** | `menu_items` | Array of objects | `[{ title: string, link: string, type: 'standard' \| 'mega_menu' }]`. |
| **Pricing Table**| `plans` | Array of objects | `[{ title: string, price: string, features: [string] }]`. |
| **Social Icons** | `networks` | Array of objects | `[{ network: string, url: string }]` defining social links. |
| **FAQ** | `items` | Array of objects | `[{ question: string, answer: string }]` for accordion panels. |

## Popups

Popups exist outside the standard section hierarchy but share element properties. A page can have multiple popups configured.

| Schema Key | Accepted Values | Description |
| :--- | :--- | :--- |
| `popup_id` | `string` | Unique identifier for the popup. |
| `name` | `string` | Human-readable name for the popup. |
| `trigger_type` | `delay`, `exit_intent`, `click` | The condition that causes the popup to appear. |
| `delay_seconds` | `number` | Time in seconds before appearance (if trigger is delay). |
| `position` | `center`, `left`, `right`, `bottom` | Screen positioning of the popup modal. |
| `overlay_color` | `rgba()` | Color of the background overlay behind the popup. |
| `close_on_outside_click` | `boolean` | Whether clicking the overlay closes the popup. |
| `content` | Array of layout objects | Nested Sections, Rows, Columns, and Elements comprising the popup body. |

## Universal Elements (Global Linked Assets)

Universal elements are saved instances that synchronize across multiple pages and funnels.

| Schema Key | Accepted Values | Description |
| :--- | :--- | :--- |
| `universal_asset_id` | `string` | UUID linking the element to the global asset library. |
| `asset_type` | `element`, `section` | Indicates whether the asset is a single element or a full section. |

*Note: When rendering, the builder fetches the definition from the asset library using the `universal_asset_id`. Local overrides are generally not permitted unless the element is detached from the library.*

## Page Level Settings

These properties dictate the global behavior, SEO, and branding of the entire page.

| Schema Key | Accepted Values | Description |
| :--- | :--- | :--- |
| `page_title` | `string` | SEO Title tag for the page. |
| `page_description` | `string` | SEO Meta Description. |
| `social_image_url` | `string` | Open Graph (OG) image URL for social sharing. |
| `custom_css` | `string` | Global CSS payload applied to the entire page. |
| `tracking_code_head` | `string` | Custom scripts injected into the `<head>` tag. |
| `tracking_code_body` | `string` | Custom scripts injected into the `<body>` tag. |
| `typography_primary_font`| `string` | Global default font family for headings. |
| `typography_secondary_font`| `string` | Global default font family for paragraphs. |
| `color_palette` | Array of strings | Array of `rgba()` or `hex` values used in the global brand board. |
