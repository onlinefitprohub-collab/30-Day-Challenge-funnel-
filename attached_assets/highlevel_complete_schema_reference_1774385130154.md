# HighLevel Page Builder — Complete Developer Schema Reference

> **Purpose:** This document provides an exhaustive, developer-grade reference for every element, container, property, value type, default, and constraint in the HighLevel Funnel & Website Page Builder. It is intended to give a developer building a HighLevel-compatible page everything they need to replicate the builder's output faithfully.

---

## Table of Contents

1. [Page Architecture & Nesting Hierarchy](#1-page-architecture--nesting-hierarchy)
2. [Page-Level Settings](#2-page-level-settings)
3. [Common Base Properties (Shared by All Elements & Containers)](#3-common-base-properties)
4. [Advanced Styling Properties (Shared)](#4-advanced-styling-properties)
5. [Animation Properties (Shared)](#5-animation-properties)
6. [Layout Containers](#6-layout-containers)
   - 6.1 Section
   - 6.2 Row
   - 6.3 Column
7. [Basic Elements](#7-basic-elements)
   - 7.1 Headline / Sub Headline
   - 7.2 Paragraph
   - 7.3 Rich Text
   - 7.4 Bullet List
   - 7.5 Image
   - 7.6 Video
   - 7.7 Button
   - 7.8 Divider / Separator
   - 7.9 Spacer
   - 7.10 Custom HTML / Code Block
8. [Form & Conversion Elements](#8-form--conversion-elements)
   - 8.1 Form (Embed)
   - 8.2 Survey (Embed)
   - 8.3 Order Form (Two-Step)
   - 8.4 Calendar (Embed)
9. [Advanced Widget Elements](#9-advanced-widget-elements)
   - 9.1 Image Slider
   - 9.2 Countdown Timer
   - 9.3 Pricing Table
   - 9.4 Testimonials
   - 9.5 Social Media Icons
   - 9.6 Number Counter
   - 9.7 Logo Showcase
   - 9.8 Photo Gallery
   - 9.9 Blog Post Feed
   - 9.10 QR Code
   - 9.11 Navigation Menu
   - 9.12 FAQ / Accordion
   - 9.13 Progress Bar
   - 9.14 Map
10. [Interactive Behavior](#10-interactive-behavior)
    - 10.1 Show / Hide Element on Button Click
    - 10.2 Scroll to Element / Section
    - 10.3 Popup
11. [Universal (Global) Elements](#11-universal-global-elements)
12. [Responsive & Mobile Overrides](#12-responsive--mobile-overrides)
13. [Global Page Styles & Brand Board](#13-global-page-styles--brand-board)

---

## 1. Page Architecture & Nesting Hierarchy

Every HighLevel page is structured as a strict tree. Understanding this hierarchy is mandatory before placing any element.

```
Page
└── Section (full-width horizontal band)
    └── Row (horizontal flex container inside section)
        └── Column (vertical flex cell inside row)
            └── Element (leaf node — text, image, button, widget, etc.)
```

**Rules:**
- Elements **cannot** be placed directly inside a Section or Page — they must be inside a Column.
- Columns **cannot** exist outside a Row.
- Rows **cannot** exist outside a Section.
- Nesting depth beyond Column → Element is not supported natively (except via Custom HTML).
- A Row can contain 1–6 Columns. Column widths within a Row must sum to 100%.

---

## 2. Page-Level Settings

These settings live in the **SEO Meta Data** panel and **Page Settings** panel at the top of the builder. They are not elements but are required for a complete page definition.

### 2.1 SEO & Meta Properties

| Property | Type | Max Length | Notes |
|---|---|---|---|
| `seo_title` | `string` | 60 chars recommended | Rendered as `<title>` tag |
| `seo_description` | `string` | 160 chars recommended | Rendered as `<meta name="description">` |
| `seo_keywords` | `string` | Comma-separated | Rendered as `<meta name="keywords">` |
| `og_title` | `string` | 60 chars | Open Graph title for social sharing |
| `og_description` | `string` | 160 chars | Open Graph description |
| `og_image_url` | `string (URL)` | — | Open Graph image (1200×630px recommended) |
| `canonical_url` | `string (URL)` | — | Prevents duplicate content indexing |
| `robots_meta` | `string` | — | e.g. `noindex`, `nofollow`, `noindex, nofollow` |
| `author` | `string` | — | Author meta tag value |
| `favicon_url` | `string (URL)` | — | `.ico`, `.png`, or `.svg` |
| `lang_attribute` | `string` | 2–5 chars | HTML `lang` attribute, e.g. `en`, `en-US` |
| `custom_meta_tags` | `array of objects` | Up to many | Each object: `{ name: string, content: string }` |

### 2.2 Custom Code Injection

| Property | Type | Notes |
|---|---|---|
| `head_tracking_code` | `string (HTML/JS)` | Injected inside `<head>` — for pixels, analytics |
| `body_tracking_code` | `string (HTML/JS)` | Injected at end of `<body>` |
| `footer_code` | `string (HTML/JS)` | Additional footer scripts |

### 2.3 Page Behavior Settings

| Property | Type | Default | Notes |
|---|---|---|---|
| `page_background_color` | `string (hex/rgba)` | `#ffffff` | Page-level background |
| `page_font_family` | `string` | Inherited from brand board | Global font override |
| `page_max_width` | `number (px)` | `1170` | Max content width |
| `hide_nav` | `boolean` | `false` | Hides navigation on funnel steps |

---

## 3. Common Base Properties

These properties are available on **every** element and container (Section, Row, Column, and all leaf elements) unless explicitly noted otherwise.

### 3.1 Visibility

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `visible_desktop` | `boolean` | `true` / `false` | `true` | Show/hide on desktop |
| `visible_mobile` | `boolean` | `true` / `false` | `true` | Show/hide on mobile |

> **Important:** Setting both `visible_desktop` and `visible_mobile` to `false` hides the element from the canvas. It can still be accessed via the Layers panel and targeted by Show/Hide button actions.

### 3.2 Spacing (Padding & Margin)

All spacing values accept a number and a unit. Units supported: `px`, `%`, `em`, `rem`, `vh`, `vw`, `auto`.

| Property | Type | Default | Notes |
|---|---|---|---|
| `padding_top` | `number + unit` | `0px` | Inner top spacing |
| `padding_right` | `number + unit` | `0px` | Inner right spacing |
| `padding_bottom` | `number + unit` | `0px` | Inner bottom spacing |
| `padding_left` | `number + unit` | `0px` | Inner left spacing |
| `margin_top` | `number + unit` | `0px` | Outer top spacing |
| `margin_right` | `number + unit` | `auto` | Outer right spacing |
| `margin_bottom` | `number + unit` | `0px` | Outer bottom spacing |
| `margin_left` | `number + unit` | `auto` | Outer left spacing |

Each of these has a corresponding mobile override: `padding_top_mobile`, `margin_bottom_mobile`, etc.

### 3.3 Container Size

| Property | Type | Units | Default | Notes |
|---|---|---|---|---|
| `width` | `number + unit` | `px`, `%`, `em`, `rem`, `vw`, `auto` | `auto` | Element width |
| `height` | `number + unit` | `px`, `%`, `em`, `rem`, `vh`, `auto` | `auto` | Element height |
| `width_mobile` | `number + unit` | Same as above | `auto` | Mobile-specific width |
| `height_mobile` | `number + unit` | Same as above | `auto` | Mobile-specific height |

> Negative values and `0` are not supported for width/height. Use `auto` to revert to natural size.

### 3.4 Identification & Custom Styling

| Property | Type | Notes |
|---|---|---|
| `element_id` | `string` | Auto-generated unique ID. Used as CSS selector for scroll-to and show/hide targeting. Format: `#section_abc12` |
| `custom_css_class` | `string` | User-defined CSS class name(s), space-separated |
| `custom_css_id` | `string` | User-defined CSS ID for custom targeting |

---

## 4. Advanced Styling Properties

These properties are available in the **Advanced** tab of the right-hand sidebar for most elements and containers.

### 4.1 Border

| Property | Type | Values | Default |
|---|---|---|---|
| `border_style` | `string` | `none`, `solid`, `dashed`, `dotted`, `double` | `none` |
| `border_width_top` | `number (px)` | `0–100` | `0` |
| `border_width_right` | `number (px)` | `0–100` | `0` |
| `border_width_bottom` | `number (px)` | `0–100` | `0` |
| `border_width_left` | `number (px)` | `0–100` | `0` |
| `border_color` | `string (hex/rgba)` | Any valid color | `#000000` |
| `border_radius_top_left` | `number (px)` | `0–500` | `0` |
| `border_radius_top_right` | `number (px)` | `0–500` | `0` |
| `border_radius_bottom_right` | `number (px)` | `0–500` | `0` |
| `border_radius_bottom_left` | `number (px)` | `0–500` | `0` |

### 4.2 Box Shadow

Multiple box shadows can be stacked on a single element. Each shadow object has the following structure:

| Property | Type | Values | Default |
|---|---|---|---|
| `shadow_type` | `string` | `outer`, `inner` | `outer` |
| `shadow_x` | `number (px)` | Any integer | `0` |
| `shadow_y` | `number (px)` | Any integer | `4` |
| `shadow_blur` | `number (px)` | `0–100` | `10` |
| `shadow_spread` | `number (px)` | Any integer | `0` |
| `shadow_color` | `string (hex/rgba)` | Any valid color | `rgba(0,0,0,0.25)` |

### 4.3 Text Shadow (Typography Elements Only)

| Property | Type | Values | Default |
|---|---|---|---|
| `text_shadow_x` | `number (px)` | Any integer | `0` |
| `text_shadow_y` | `number (px)` | Any integer | `2` |
| `text_shadow_blur` | `number (px)` | `0–100` | `4` |
| `text_shadow_color` | `string (hex/rgba)` | Any valid color | `rgba(0,0,0,0.3)` |

### 4.4 Background (Containers: Section, Row, Column)

Backgrounds are applied at the container level. Three background types are available, selectable via tabs:

**Color Background:**

| Property | Type | Values | Default |
|---|---|---|---|
| `bg_type` | `string` | `color`, `image`, `video` | `color` |
| `bg_color` | `string (hex/rgba)` | Any valid color | `transparent` |
| `bg_gradient_enabled` | `boolean` | `true` / `false` | `false` |
| `bg_gradient_type` | `string` | `linear`, `radial`, `angular` | `linear` |
| `bg_gradient_angle` | `number (degrees)` | `0–360` | `90` (N/A for radial) |
| `bg_gradient_stops` | `array of objects` | Max 10 stops | `[]` |
| `bg_blur_enabled` | `boolean` | `true` / `false` | `false` |
| `bg_blur_intensity` | `number (px)` | `0–100` | `10` |

Each gradient stop object: `{ color: "hex/rgba", position: 0–100 }` (position is a percentage along the gradient).

**Image Background:**

| Property | Type | Values | Default |
|---|---|---|---|
| `bg_image_url` | `string (URL)` | — | `""` |
| `bg_image_position` | `string` | `center center`, `top left`, `top center`, `top right`, `center left`, `center right`, `bottom left`, `bottom center`, `bottom right` | `center center` |
| `bg_image_size` | `string` | `cover`, `contain`, `auto`, `100% 100%` | `cover` |
| `bg_image_repeat` | `string` | `no-repeat`, `repeat`, `repeat-x`, `repeat-y` | `no-repeat` |
| `bg_image_attachment` | `string` | `scroll`, `fixed` (parallax) | `scroll` |
| `bg_overlay_color` | `string (hex/rgba)` | Any valid color | `transparent` |
| `bg_overlay_opacity` | `number` | `0–1` | `0` |

**Video Background:**

| Property | Type | Values | Default |
|---|---|---|---|
| `bg_video_url` | `string (URL)` | YouTube, Vimeo, or direct `.mp4` URL | `""` |
| `bg_video_fit` | `string` | `fill`, `cover`, `contain` | `cover` |
| `bg_video_autoplay` | `boolean` | `true` / `false` | `true` |
| `bg_video_loop` | `boolean` | `true` / `false` | `true` |
| `bg_video_muted` | `boolean` | `true` / `false` | `true` |
| `bg_video_overlay_color` | `string (hex/rgba)` | Any valid color | `transparent` |
| `bg_video_overlay_opacity` | `number` | `0–1` | `0` |
| `bg_video_fallback_image` | `string (URL)` | Shown on mobile (video BG disabled on mobile) | `""` |

---

## 5. Animation Properties

Animation settings are available in the **Animations** tab of the right-hand sidebar for any element. Only one entrance animation can be applied per element.

### 5.1 Entrance Animation

| Property | Type | Values | Default |
|---|---|---|---|
| `animation_enabled` | `boolean` | `true` / `false` | `false` |
| `animation_type` | `string` | See table below | `none` |
| `animation_scale` | `number` | `0.5–2.0` (step 0.1) | `1.0` |
| `animation_duration` | `number (seconds)` | `0.1–3.0` (step 0.1) | `0.5` |
| `animation_delay` | `number (seconds)` | `0–5.0` (step 0.1) | `0` |
| `animation_easing` | `string` | `linear`, `ease_in`, `ease_out`, `ease_in_out` | `ease_out` |

**Available Animation Types:**

| Category | Values |
|---|---|
| Fade | `fade_in`, `fade_in_up`, `fade_in_down`, `fade_in_left`, `fade_in_right` |
| Slide | `slide_in_up`, `slide_in_down`, `slide_in_left`, `slide_in_right` |
| Bounce | `bounce_in`, `bounce_in_up`, `bounce_in_down`, `bounce_in_left`, `bounce_in_right` |
| Zoom | `zoom_in`, `zoom_in_up`, `zoom_in_down`, `zoom_in_left`, `zoom_in_right` |
| Flip | `flip_in_x`, `flip_in_y` |
| Rotate | `rotate_in`, `rotate_in_down_left`, `rotate_in_down_right` |
| Special | `pulse`, `shake`, `wobble`, `swing`, `jello`, `heartbeat` |

> **Delay behavior:** Elements remain fully hidden during the configured delay period and only become visible once the animation begins. This prevents flash-of-content issues.

---

## 6. Layout Containers

### 6.1 Section

A Section is the outermost layout container — a full-width horizontal band spanning the page.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `section_id` | `string` | Auto-generated | — | Used as CSS selector for scroll-to |
| `full_width` | `boolean` | `true` / `false` | `false` | Stretches content to viewport edge |
| `content_max_width` | `number (px)` | `600–2560` | `1170` | Max inner content width |
| `min_height` | `number + unit` | `px`, `vh` | `auto` | Minimum section height |
| `sticky` | `boolean` | `true` / `false` | `false` | Sticks section to top on scroll |
| `column_gap` | `number (px)` | `0–100` | `0` | Gap between columns inside rows |
| `row_gap` | `number (px)` | `0–100` | `0` | Gap between rows inside section |
| `overflow` | `string` | `visible`, `hidden` | `visible` | Clips child elements if `hidden` |
| `z_index` | `number` | Any integer | `0` | Stacking order |
| All background properties | — | See §4.4 | — | Color, image, or video background |
| All base properties | — | See §3 | — | Padding, margin, visibility, etc. |

### 6.2 Row

A Row is a horizontal flex container inside a Section. It holds one or more Columns.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `column_layout` | `string` | `1`, `1-1`, `1-1-1`, `1-1-1-1`, `2-1`, `1-2`, `1-2-1`, `3-1`, `1-3`, `2-1-1`, `1-1-2` | `1` | Preset column width ratios |
| `vertical_align` | `string` | `top`, `middle`, `bottom`, `stretch` | `top` | Vertical alignment of columns |
| `reverse_on_mobile` | `boolean` | `true` / `false` | `false` | Reverses column order on mobile |
| `stack_on_mobile` | `boolean` | `true` / `false` | `true` | Stacks columns vertically on mobile |
| All background properties | — | See §4.4 | — | |
| All base properties | — | See §3 | — | |

### 6.3 Column

A Column is a vertical flex cell inside a Row. It holds elements.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `width_percent` | `number` | `8.33–100` | Determined by row layout | Must sum to 100% with sibling columns |
| `width_percent_mobile` | `number` | `8.33–100` | `100` | Mobile column width |
| `vertical_align` | `string` | `top`, `middle`, `bottom` | `top` | Vertical alignment of content |
| `horizontal_align` | `string` | `left`, `center`, `right` | `left` | Horizontal alignment of content |
| All background properties | — | See §4.4 | — | |
| All base properties | — | See §3 | — | |

---

## 7. Basic Elements

### 7.1 Headline / Sub Headline

Used for H1–H6 heading text. "Headline" defaults to H1/H2; "Sub Headline" defaults to H3/H4.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `text` | `string` | Any text | `"Headline"` | Supports inline HTML |
| `heading_tag` | `string` | `h1`, `h2`, `h3`, `h4`, `h5`, `h6` | `h2` (Headline), `h3` (Sub Headline) | Semantic HTML tag |
| `font_family` | `string` | Any loaded font name | Inherited from global | |
| `font_weight` | `string` | `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, `bold`, `normal` | `700` | |
| `font_size` | `number (px)` | `8–200` | `36` | |
| `font_size_mobile` | `number (px)` | `8–200` | `28` | |
| `font_color` | `string (hex/rgba)` | Any valid color | `#000000` | |
| `text_align` | `string` | `left`, `center`, `right`, `justify` | `left` | |
| `text_align_mobile` | `string` | Same as above | `center` | |
| `line_height` | `number` | `0.5–5.0` | `1.4` | Unitless multiplier |
| `letter_spacing` | `number (px)` | `-10–50` | `0` | |
| `text_transform` | `string` | `none`, `uppercase`, `lowercase`, `capitalize` | `none` | |
| `link_url` | `string (URL)` | — | `""` | Makes entire heading a hyperlink |
| `link_target` | `string` | `_self`, `_blank` | `_self` | |
| All base properties | — | See §3 | — | |
| All advanced styling | — | See §4 | — | Shadow, border, animation |

### 7.2 Paragraph

Used for body text blocks.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `text` | `string` | Any text | `"Paragraph text..."` | Supports inline HTML and links |
| `font_family` | `string` | Any loaded font | Inherited | |
| `font_weight` | `string` | `100`–`900`, `bold`, `normal` | `400` | |
| `font_size` | `number (px)` | `8–100` | `16` | |
| `font_size_mobile` | `number (px)` | `8–100` | `14` | |
| `font_color` | `string (hex/rgba)` | Any valid color | `#333333` | |
| `text_align` | `string` | `left`, `center`, `right`, `justify` | `left` | |
| `line_height` | `number` | `0.5–5.0` | `1.6` | |
| `letter_spacing` | `number (px)` | `-10–50` | `0` | |
| `text_transform` | `string` | `none`, `uppercase`, `lowercase`, `capitalize` | `none` | |
| All base properties | — | See §3 | — | |
| All advanced styling | — | See §4 | — | |

### 7.3 Rich Text

A more powerful text element supporting headings, quotes, code blocks, nested lists, and text highlighting within a single element.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `content` | `string (HTML)` | Full HTML content | `""` | Supports H1–H6, p, blockquote, code, pre, ul, ol, li, mark, strong, em, a |
| `font_family` | `string` | Any loaded font | Inherited | |
| `font_size` | `number (px)` | `8–100` | `16` | Base font size |
| `font_color` | `string (hex/rgba)` | Any valid color | `#333333` | Base text color |
| `line_height` | `number` | `0.5–5.0` | `1.6` | |
| `list_item_spacing` | `number (px)` | `0–100` | `8` | Vertical gap between list items |
| `text_align` | `string` | `left`, `center`, `right`, `justify` | `left` | |

**Supported List Types:**

| List Type | Marker Options |
|---|---|
| Unordered | `disc` (•), `circle` (○), `square` (■) |
| Ordered | `decimal` (1 2 3), `lower-alpha` (a b c), `upper-alpha` (A B C), `lower-roman` (i ii iii), `upper-roman` (I II III) |

**Markdown/Keyboard Shortcuts (in editor):**

| Shortcut | Result |
|---|---|
| `>` + Enter | Block quote |
| `` ` `` text `` ` `` | Inline code |
| ` ``` ` + Enter | Full code block |
| `*` + Space | Unordered list |
| `Tab` | Indent list (nested) |
| `Shift+Tab` | Outdent list |

### 7.4 Bullet List

A dedicated list element with custom icon/marker support.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `items` | `array of strings` | — | `["Item 1", "Item 2"]` | Each item is a text string |
| `list_type` | `string` | `unordered`, `ordered`, `icon` | `icon` | |
| `icon_type` | `string` | `check`, `arrow`, `star`, `dot`, `custom` | `check` | Used when `list_type` = `icon` |
| `icon_color` | `string (hex/rgba)` | Any valid color | `#000000` | |
| `icon_size` | `number (px)` | `8–100` | `16` | |
| `font_family` | `string` | Any loaded font | Inherited | |
| `font_size` | `number (px)` | `8–100` | `16` | |
| `font_color` | `string (hex/rgba)` | Any valid color | `#333333` | |
| `line_height` | `number` | `0.5–5.0` | `1.6` | |
| `list_item_spacing` | `number (px)` | `0–100` | `8` | Vertical gap between items |
| `text_align` | `string` | `left`, `center`, `right` | `left` | |
| All base properties | — | See §3 | — | |

### 7.5 Image

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `src` | `string (URL)` | — | `""` | Image source URL |
| `alt_text` | `string` | — | `""` | SEO and accessibility alt text |
| `image_width` | `number (px)` or `%` | — | `auto` | Rendered width |
| `image_height` | `number (px)` or `%` | — | `auto` | Rendered height |
| `object_fit` | `string` | `fill`, `contain`, `cover`, `none`, `scale-down` | `contain` | |
| `alignment` | `string` | `left`, `center`, `right` | `center` | |
| `lazy_load` | `boolean` | `true` / `false` | `true` | Defers loading until in viewport |
| `click_action` | `string` | `none`, `open_url`, `open_popup`, `open_lightbox` | `none` | |
| `click_url` | `string (URL)` | — | `""` | Used when `click_action` = `open_url` |
| `open_in_new_tab` | `boolean` | `true` / `false` | `false` | |
| `popup_id` | `string` | — | `""` | Used when `click_action` = `open_popup` |
| `caption` | `string` | — | `""` | Optional caption text below image |
| All base properties | — | See §3 | — | |
| All advanced styling | — | See §4 | — | Border, shadow, animation |

### 7.6 Video

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `video_type` | `string` | `youtube`, `vimeo`, `wistia`, `html5`, `hosted` | `youtube` | |
| `video_url` | `string (URL)` | — | `""` | YouTube/Vimeo/Wistia URL or direct `.mp4` URL |
| `autoplay` | `boolean` | `true` / `false` | `false` | |
| `loop` | `boolean` | `true` / `false` | `false` | |
| `muted` | `boolean` | `true` / `false` | `false` | Required for autoplay in most browsers |
| `controls` | `boolean` | `true` / `false` | `true` | Show/hide player controls |
| `thumbnail_url` | `string (URL)` | — | `""` | Custom thumbnail image |
| `start_time` | `number (seconds)` | `0–86400` | `0` | Start playback at this timestamp |
| `aspect_ratio` | `string` | `16:9`, `4:3`, `1:1`, `9:16` | `16:9` | |
| `width` | `number (px)` or `%` | — | `100%` | |
| All base properties | — | See §3 | — | |
| All advanced styling | — | See §4 | — | Border, shadow, animation |

### 7.7 Button

The Button element is one of the most configurable elements in the builder.

**General Properties:**

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `label` | `string` | — | `"Click Here"` | Primary button text |
| `sub_text` | `string` | — | `""` | Secondary text below label |
| `icon_left` | `string` | Icon name or URL | `""` | Icon displayed left of label |
| `icon_right` | `string` | Icon name or URL | `""` | Icon displayed right of label |
| `full_width` | `boolean` | `true` / `false` | `false` | Stretches button to column width |
| `alignment` | `string` | `left`, `center`, `right` | `center` | |

**Styling Properties:**

| Property | Type | Values | Default |
|---|---|---|---|
| `bg_color` | `string (hex/rgba)` | Any valid color | `#FF6B00` |
| `text_color` | `string (hex/rgba)` | Any valid color | `#ffffff` |
| `font_family` | `string` | Any loaded font | Inherited |
| `font_size` | `number (px)` | `8–100` | `18` |
| `font_weight` | `string` | `100`–`900` | `700` |
| `border_radius` | `number (px)` | `0–500` | `4` |
| `padding_top` | `number (px)` | `0–200` | `16` |
| `padding_right` | `number (px)` | `0–200` | `32` |
| `padding_bottom` | `number (px)` | `0–200` | `16` |
| `padding_left` | `number (px)` | `0–200` | `32` |

**Hover State Properties:**

| Property | Type | Default |
|---|---|---|
| `hover_bg_color` | `string (hex/rgba)` | Darkened version of `bg_color` |
| `hover_text_color` | `string (hex/rgba)` | Same as `text_color` |
| `hover_border_color` | `string (hex/rgba)` | Same as `border_color` |
| `hover_transition_duration` | `number (seconds)` | `0.3` |

**Button Action (Link To) — `button_action` property:**

| Action Value | Description | Additional Properties Required |
|---|---|---|
| `url` | Navigate to a URL | `action_url: string`, `open_in_new_tab: boolean` |
| `phone` | Click-to-call | `phone_number: string` |
| `sms` | Click-to-text | `sms_number: string`, `sms_body: string` |
| `email` | Click-to-email | `email_address: string`, `email_subject: string` |
| `submit_form` | Submit the form on the page | — |
| `next_step` | Go to next funnel step | — |
| `open_popup` | Open a popup | `popup_id: string` |
| `close_popup` | Close the current popup | — |
| `scroll_to_element` | Smooth scroll to section | `scroll_target_id: string` (CSS selector) |
| `show_elements` | Show hidden elements | `show_element_ids: array of strings` |
| `hide_elements` | Hide visible elements | `hide_element_ids: array of strings` |
| `download_file` | Download a file | `file_url: string` |
| `upsell` | Accept upsell on order form | — |
| `downsell` | Decline upsell | — |
| `calendar` | Open calendar booking | `calendar_id: string` |
| `custom_js` | Execute custom JavaScript | `custom_js_code: string` |

### 7.8 Divider / Separator

| Property | Type | Values | Default |
|---|---|---|---|
| `line_style` | `string` | `solid`, `dashed`, `dotted`, `double`, `none` | `solid` |
| `line_color` | `string (hex/rgba)` | Any valid color | `#cccccc` |
| `line_width` | `number (%)` | `1–100` | `100` |
| `line_thickness` | `number (px)` | `1–50` | `1` |
| `alignment` | `string` | `left`, `center`, `right` | `center` |
| All base properties | — | See §3 | — |

### 7.9 Spacer

| Property | Type | Values | Default |
|---|---|---|---|
| `height` | `number (px)` | `0–500` | `40` |
| `height_mobile` | `number (px)` | `0–500` | `20` |
| `visible_desktop` | `boolean` | `true` / `false` | `true` |
| `visible_mobile` | `boolean` | `true` / `false` | `true` |

### 7.10 Custom HTML / Code Block

| Property | Type | Notes |
|---|---|---|
| `html_content` | `string (HTML)` | Raw HTML, CSS, and JavaScript |
| `execute_scripts` | `boolean` | Whether `<script>` tags are executed on render |

---

## 8. Form & Conversion Elements

### 8.1 Form (Embed)

Embeds a HighLevel Form created in the Forms builder.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `form_id` | `string` | HighLevel Form ID | `""` | Required |
| `redirect_type` | `string` | `url`, `next_step`, `same_page`, `popup` | `next_step` | On submit action |
| `redirect_url` | `string (URL)` | — | `""` | Used when `redirect_type` = `url` |
| `popup_id` | `string` | — | `""` | Used when `redirect_type` = `popup` |
| `inline_message` | `string` | — | `""` | Message shown on same page after submit |
| `double_opt_in` | `boolean` | `true` / `false` | `false` | |
| `style_override` | `boolean` | `true` / `false` | `false` | Use custom CSS for form styling |

**Form Field Schema (per field inside the Form builder):**

| Property | Type | Values | Notes |
|---|---|---|---|
| `field_type` | `string` | `text`, `email`, `phone`, `textarea`, `select`, `radio`, `checkbox`, `date`, `file`, `hidden`, `signature`, `address`, `full_name`, `first_name`, `last_name` | |
| `label` | `string` | — | Display label |
| `placeholder` | `string` | — | Placeholder text |
| `required` | `boolean` | `true` / `false` | |
| `default_value` | `string` | — | Pre-filled value |
| `options` | `array of strings` | — | For `select`, `radio`, `checkbox` |
| `custom_css_class` | `string` | — | |
| `width` | `string` | `full`, `half` | Field width in the form grid |
| `field_name` | `string` | — | CRM field mapping key |

### 8.2 Survey (Embed)

Embeds a HighLevel Survey. Properties are identical to Form Embed (§8.1) with `survey_id` replacing `form_id`.

### 8.3 Order Form (Two-Step)

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `product_id` | `string` | HighLevel Product ID | `""` | Required |
| `step_1_label` | `string` | — | `"Contact Info"` | Label for step 1 tab |
| `step_2_label` | `string` | — | `"Payment Info"` | Label for step 2 tab |
| `show_order_summary` | `boolean` | `true` / `false` | `true` | |
| `coupon_enabled` | `boolean` | `true` / `false` | `false` | |
| `bump_offer_enabled` | `boolean` | `true` / `false` | `false` | Order bump below form |
| `bump_offer_product_id` | `string` | — | `""` | |
| `redirect_url` | `string (URL)` | — | `""` | On successful purchase |
| `upsell_page_id` | `string` | — | `""` | Next funnel step for upsell |

### 8.4 Calendar (Embed)

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `calendar_id` | `string` | HighLevel Calendar ID | `""` | Required |
| `style` | `string` | `inline`, `popup` | `inline` | |
| `redirect_url` | `string (URL)` | — | `""` | On booking confirmation |

---

## 9. Advanced Widget Elements

### 9.1 Image Slider

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `slides` | `array of objects` | — | `[]` | Each slide: `{ image_url, alt_text, caption, link_url, link_target }` |
| `transition_style` | `string` | `slide`, `fade` | `slide` | |
| `autoplay` | `boolean` | `true` / `false` | `true` | |
| `autoplay_speed` | `number (ms)` | `500–10000` | `3000` | |
| `loop` | `boolean` | `true` / `false` | `true` | |
| `show_arrows` | `boolean` | `true` / `false` | `true` | |
| `show_pagination` | `boolean` | `true` / `false` | `true` | Dot indicators |
| `pause_on_hover` | `boolean` | `true` / `false` | `true` | |
| `image_fit` | `string` | `cover`, `contain`, `fill` | `cover` | |
| `aspect_ratio` | `string` | `16:9`, `4:3`, `1:1`, `3:2`, `custom` | `16:9` | |
| `custom_height` | `number (px)` | — | `400` | Used when `aspect_ratio` = `custom` |
| All base properties | — | See §3 | — | |

### 9.2 Countdown Timer

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `timer_type` | `string` | `fixed`, `evergreen`, `daily` | `fixed` | |
| `end_date` | `string (ISO 8601)` | — | `""` | Used for `fixed` type |
| `end_time` | `string (HH:MM)` | — | `""` | Used for `fixed` and `daily` types |
| `timezone` | `string` | IANA timezone string | `"America/New_York"` | |
| `duration_minutes` | `number` | `1–525600` | `60` | Used for `evergreen` type |
| `evergreen_reset` | `string` | `never`, `on_revisit`, `on_session_end` | `never` | |
| `daily_reset_time` | `string (HH:MM)` | — | `"00:00"` | Used for `daily` type |
| `show_days` | `boolean` | `true` / `false` | `true` | |
| `show_hours` | `boolean` | `true` / `false` | `true` | |
| `show_minutes` | `boolean` | `true` / `false` | `true` | |
| `show_seconds` | `boolean` | `true` / `false` | `true` | |
| `label_days` | `string` | — | `"Days"` | |
| `label_hours` | `string` | — | `"Hours"` | |
| `label_minutes` | `string` | — | `"Minutes"` | |
| `label_seconds` | `string` | — | `"Seconds"` | |
| `number_color` | `string (hex/rgba)` | Any valid color | `#000000` | |
| `label_color` | `string (hex/rgba)` | Any valid color | `#666666` | |
| `bg_color` | `string (hex/rgba)` | Any valid color | `transparent` | Per-unit box background |
| `number_font_size` | `number (px)` | `12–200` | `48` | |
| `label_font_size` | `number (px)` | `8–100` | `14` | |
| `separator_char` | `string` | `":"`, `""` | `":"` | Character between units |
| `expire_action` | `string` | `none`, `redirect_url`, `show_element`, `hide_element` | `none` | |
| `expire_redirect_url` | `string (URL)` | — | `""` | Used when `expire_action` = `redirect_url` |
| `expire_element_id` | `string` | — | `""` | Used for show/hide on expire |
| All base properties | — | See §3 | — | |

### 9.3 Pricing Table

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `plans` | `array of objects` | — | `[]` | See plan object schema below |
| `columns` | `number` | `1–4` | `3` | Number of plan columns |
| `highlight_plan_index` | `number` | `0–3` | `1` | Which plan is visually highlighted |

**Plan Object Schema:**

| Property | Type | Default | Notes |
|---|---|---|---|
| `plan_name` | `string` | `"Basic"` | |
| `plan_price` | `string` | `"$0"` | Displayed as-is (string, not number) |
| `price_period` | `string` | `"/month"` | e.g. `/year`, `/one-time` |
| `description` | `string` | `""` | Short plan description |
| `features` | `array of strings` | `[]` | Each string is one feature line |
| `button_label` | `string` | `"Get Started"` | |
| `button_url` | `string (URL)` | `""` | |
| `button_color` | `string (hex/rgba)` | `#FF6B00` | |
| `is_highlighted` | `boolean` | `false` | Adds visual emphasis |
| `ribbon_text` | `string` | `""` | e.g. `"Most Popular"` — shown as a badge |
| `ribbon_color` | `string (hex/rgba)` | `#FF6B00` | |
| `highlight_color` | `string (hex/rgba)` | `#FF6B00` | Border/accent color for highlighted plan |

### 9.4 Testimonials

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `testimonials` | `array of objects` | — | `[]` | See testimonial object schema below |
| `layout` | `string` | `grid`, `carousel`, `list` | `grid` | |
| `columns` | `number` | `1–4` | `3` | Used for `grid` layout |
| `autoplay` | `boolean` | `true` / `false` | `false` | Used for `carousel` layout |
| `autoplay_speed` | `number (ms)` | `1000–10000` | `4000` | |
| `show_arrows` | `boolean` | `true` / `false` | `true` | |
| `show_pagination` | `boolean` | `true` / `false` | `true` | |

**Testimonial Object Schema:**

| Property | Type | Default | Notes |
|---|---|---|---|
| `author_name` | `string` | `"John Doe"` | |
| `author_title` | `string` | `""` | e.g. `"CEO, Acme Corp"` |
| `author_avatar_url` | `string (URL)` | `""` | |
| `quote` | `string` | `""` | The testimonial text |
| `star_rating` | `number` | `1–5` | `5` |
| `show_stars` | `boolean` | `true` / `false` | `true` |
| `star_color` | `string (hex/rgba)` | `#FFD700` | |
| `bg_color` | `string (hex/rgba)` | `#ffffff` | Card background |
| `text_color` | `string (hex/rgba)` | `#333333` | |

### 9.5 Social Media Icons

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `icons` | `array of objects` | — | `[]` | See icon object schema below |
| `display_type` | `string` | `icon_only`, `text_only`, `icon_and_text` | `icon_only` | |
| `icon_style` | `string` | `filled`, `outline`, `minimal` | `filled` | |
| `icon_shape` | `string` | `circle`, `square`, `rounded_square`, `none` | `circle` | |
| `icon_size` | `number (px)` | `16–100` | `32` | |
| `icon_color` | `string (hex/rgba)` | Any valid color or `brand` | `brand` | `brand` uses platform's official color |
| `icon_bg_color` | `string (hex/rgba)` | Any valid color | `transparent` | |
| `gap` | `number (px)` | `0–100` | `8` | Space between icons |
| `alignment` | `string` | `left`, `center`, `right` | `center` | |
| All base properties | — | See §3 | — | |

**Supported Platforms and Icon Object Schema:**

| Platform | `platform` value |
|---|---|
| Facebook | `facebook` |
| Instagram | `instagram` |
| Twitter / X | `twitter` |
| LinkedIn | `linkedin` |
| YouTube | `youtube` |
| TikTok | `tiktok` |
| Pinterest | `pinterest` |
| Snapchat | `snapchat` |
| WhatsApp | `whatsapp` |
| Telegram | `telegram` |
| Email | `email` |

Each icon object: `{ platform: string, url: string, open_in_new_tab: boolean }`

### 9.6 Number Counter

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `counters` | `array of objects` | — | `[]` | See counter object schema below |
| `columns` | `number` | `1–6` | `3` | |
| `animate_on_scroll` | `boolean` | `true` / `false` | `true` | Triggers count-up when in viewport |
| `animation_duration` | `number (seconds)` | `0.5–10` | `2` | Duration of count-up animation |

**Counter Object Schema:**

| Property | Type | Default | Notes |
|---|---|---|---|
| `start_value` | `number` | `0` | |
| `end_value` | `number` | `100` | |
| `prefix` | `string` | `""` | e.g. `"$"` |
| `suffix` | `string` | `""` | e.g. `"+"`, `"%"`, `"K"` |
| `decimal_places` | `number` | `0` | `0–4` |
| `label` | `string` | `""` | Text below the number |
| `number_color` | `string (hex/rgba)` | `#000000` | |
| `label_color` | `string (hex/rgba)` | `#666666` | |
| `number_font_size` | `number (px)` | `48` | |
| `label_font_size` | `number (px)` | `16` | |
| `icon_url` | `string (URL)` | `""` | Optional icon above number |

### 9.7 Logo Showcase

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `mode` | `string` | `ticker`, `carousel` | `ticker` | |
| `logos` | `array of objects` | — | `[]` | Each: `{ image_url, alt_text, link_url }` |
| **Ticker Mode Properties** | | | | |
| `scroll_speed` | `number` | `1–10` | `5` | |
| `smooth_scroll` | `boolean` | `true` / `false` | `true` | |
| `pause_on_hover` | `boolean` | `true` / `false` | `true` | |
| **Carousel Mode Properties** | | | | |
| `logos_per_slide` | `number` | `1–8` | `4` | |
| `auto_animation` | `boolean` | `true` / `false` | `true` | |
| `interval_timing` | `number (ms)` | `500–10000` | `3000` | |
| `infinite_loop` | `boolean` | `true` / `false` | `true` | |
| `pause_on_hover` | `boolean` | `true` / `false` | `true` | |
| `animation_style` | `string` | `slide`, `fade` | `slide` | |
| `show_arrows` | `boolean` | `true` / `false` | `true` | |
| `show_pagination` | `boolean` | `true` / `false` | `false` | |
| **Shared Properties** | | | | |
| `logo_spacing` | `number (px)` | `0–100` | `20` | Space between logos |
| `logo_height` | `number (px)` | `20–200` | `60` | Max logo height |
| `grayscale` | `boolean` | `true` / `false` | `false` | Renders logos in grayscale |
| All base properties | — | See §3 | — | |

### 9.8 Photo Gallery

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `images` | `array of objects` | — | `[]` | See image object schema below |
| `layout` | `string` | `grid`, `masonry_vertical`, `masonry_horizontal` | `grid` | |
| `columns` | `number` | `1–6` | `3` | |
| `columns_mobile` | `number` | `1–3` | `1` | |
| `spacing` | `number (px)` | `0–50` | `8` | Gap between images |
| `lightbox_enabled` | `boolean` | `true` / `false` | `true` | |
| `heading` | `string` | — | `""` | Optional heading above gallery |
| `lazy_load` | `boolean` | `true` / `false` | `true` | |
| All base properties | — | See §3 | — | |

**Gallery Image Object Schema:**

| Property | Type | Default | Notes |
|---|---|---|---|
| `image_url` | `string (URL)` | `""` | |
| `alt_text` | `string` | `""` | |
| `caption` | `string` | `""` | |
| `description` | `string` | `""` | Shown in lightbox |
| `click_action` | `string` | `lightbox` | `lightbox` or `url` |
| `click_url` | `string (URL)` | `""` | Used when `click_action` = `url` |
| `open_in_new_tab` | `boolean` | `false` | |
| `watermark_enabled` | `boolean` | `false` | |
| `watermark_text` | `string` | `""` | |
| `watermark_position` | `string` | `bottom_right` | `top_left`, `top_right`, `bottom_left`, `bottom_right`, `center` |

### 9.9 Blog Post Feed

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `blog_site_id` | `string` | HighLevel Blog ID | `""` | Required |
| `display_style` | `string` | `grid`, `list`, `featured` | `grid` | |
| `sort_by` | `string` | `recent`, `recent_by_category`, `recent_by_author` | `recent` | |
| `category_filter` | `array of strings` | Category IDs | `[]` | Used when `sort_by` = `recent_by_category` |
| `author_filter` | `string` | Author ID | `""` | Used when `sort_by` = `recent_by_author` |
| `posts_per_page` | `number` | `1–50` | `6` | |
| `show_pagination` | `boolean` | `true` / `false` | `true` | |
| `show_featured_image` | `boolean` | `true` / `false` | `true` | |
| `show_excerpt` | `boolean` | `true` / `false` | `true` | |
| `show_author` | `boolean` | `true` / `false` | `true` | |
| `show_date` | `boolean` | `true` / `false` | `true` | |
| `show_category` | `boolean` | `true` / `false` | `true` | |
| `button_text` | `string` | — | `"Read More"` | |
| `button_color` | `string (hex/rgba)` | Any valid color | `#FF6B00` | |
| `button_text_color` | `string (hex/rgba)` | Any valid color | `#ffffff` | |
| All base properties | — | See §3 | — | |

### 9.10 QR Code

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `qr_code_id` | `string` | HighLevel QR Code ID | `""` | Selected from QR library |
| `destination_url` | `string (URL)` | — | `""` | Read-only display of QR destination |
| `size` | `number (px)` | `50–500` | `200` | Rendered QR code size |
| `alignment` | `string` | `left`, `center`, `right` | `center` | |
| All base properties | — | See §3 | — | |

### 9.11 Navigation Menu

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `logo_url` | `string (URL)` | — | `""` | |
| `logo_alt_text` | `string` | — | `""` | |
| `logo_width` | `number (px)` | `20–500` | `150` | |
| `logo_link_url` | `string (URL)` | — | `"/"` | |
| `menu_items` | `array of objects` | — | `[]` | See menu item schema below |
| `layout` | `string` | `horizontal`, `vertical` | `horizontal` | |
| `alignment` | `string` | `left`, `center`, `right`, `space_between` | `space_between` | |
| `sticky` | `boolean` | `true` / `false` | `false` | Sticks to top on scroll |
| `sticky_bg_color` | `string (hex/rgba)` | Any valid color | `#ffffff` | Background when sticky |
| `text_color` | `string (hex/rgba)` | Any valid color | `#000000` | |
| `hover_color` | `string (hex/rgba)` | Any valid color | `#FF6B00` | |
| `active_color` | `string (hex/rgba)` | Any valid color | `#FF6B00` | |
| `font_size` | `number (px)` | `8–100` | `16` | |
| `font_weight` | `string` | `100`–`900` | `500` | |
| `mobile_menu_style` | `string` | `hamburger`, `full_screen`, `slide_in` | `hamburger` | |
| `mobile_breakpoint` | `number (px)` | `320–1200` | `768` | Breakpoint to switch to mobile menu |
| `bg_color` | `string (hex/rgba)` | Any valid color | `#ffffff` | Nav bar background |
| All base properties | — | See §3 | — | |

**Menu Item Object Schema:**

| Property | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | `"Menu Item"` | |
| `go_to` | `string` | `url` | `url`, `scroll_to_element`, `phone`, `email` |
| `url` | `string (URL)` | `""` | |
| `open_in_new_tab` | `boolean` | `false` | |
| `css_selector` | `string` | `""` | Used when `go_to` = `scroll_to_element` |
| `children` | `array of menu items` | `[]` | Sub-menu items (mega menu support) |
| `icon` | `string` | `""` | Optional icon |
| `is_button` | `boolean` | `false` | Renders as a CTA button |
| `button_color` | `string (hex/rgba)` | `#FF6B00` | Used when `is_button` = `true` |

### 9.12 FAQ / Accordion

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `items` | `array of objects` | — | `[]` | See FAQ item schema below |
| `allow_multiple_open` | `boolean` | `true` / `false` | `false` | |
| `default_open_index` | `number` | `-1` to n | `-1` | `-1` = all closed by default |
| `icon_type` | `string` | `plus_minus`, `chevron`, `arrow`, `none` | `plus_minus` | |
| `icon_position` | `string` | `left`, `right` | `right` | |
| `header_bg_color` | `string (hex/rgba)` | Any valid color | `#f5f5f5` | |
| `header_text_color` | `string (hex/rgba)` | Any valid color | `#000000` | |
| `header_font_size` | `number (px)` | `8–100` | `18` | |
| `content_bg_color` | `string (hex/rgba)` | Any valid color | `#ffffff` | |
| `content_text_color` | `string (hex/rgba)` | Any valid color | `#333333` | |
| `content_font_size` | `number (px)` | `8–100` | `16` | |
| `border_color` | `string (hex/rgba)` | Any valid color | `#dddddd` | |
| All base properties | — | See §3 | — | |

**FAQ Item Object Schema:**

| Property | Type | Notes |
|---|---|---|
| `question` | `string` | Header/question text |
| `answer` | `string (HTML)` | Body/answer content (supports rich text) |
| `is_open` | `boolean` | Whether this item is open by default |

### 9.13 Progress Bar

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `label` | `string` | — | `"Progress"` | |
| `value` | `number` | `0–100` | `75` | Fill percentage |
| `show_percentage` | `boolean` | `true` / `false` | `true` | |
| `animate_on_scroll` | `boolean` | `true` / `false` | `true` | |
| `animation_duration` | `number (seconds)` | `0.5–5` | `1.5` | |
| `bar_color` | `string (hex/rgba)` | Any valid color | `#FF6B00` | |
| `track_color` | `string (hex/rgba)` | Any valid color | `#eeeeee` | |
| `bar_height` | `number (px)` | `4–50` | `20` | |
| `bar_radius` | `number (px)` | `0–100` | `10` | |
| `label_color` | `string (hex/rgba)` | Any valid color | `#000000` | |
| `label_font_size` | `number (px)` | `8–100` | `16` | |
| All base properties | — | See §3 | — | |

### 9.14 Map

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `address` | `string` | — | `""` | Full address string |
| `zoom_level` | `number` | `1–21` | `14` | Google Maps zoom level |
| `map_type` | `string` | `roadmap`, `satellite`, `hybrid`, `terrain` | `roadmap` | |
| `show_marker` | `boolean` | `true` / `false` | `true` | |
| `marker_label` | `string` | — | `""` | |
| `height` | `number (px)` | `100–1000` | `400` | |
| `width` | `string` | `%` or `px` | `100%` | |
| All base properties | — | See §3 | — | |

---

## 10. Interactive Behavior

### 10.1 Show / Hide Element on Button Click

This is a **Button Action** (see §7.7), not a standalone element. The target element must be configured first.

**Configuration on the target element (element to be shown/hidden):**

| Property | Type | Values | Notes |
|---|---|---|---|
| `visible_desktop` | `boolean` | `true` / `false` | Set to `false` to hide initially |
| `visible_mobile` | `boolean` | `true` / `false` | Set to `false` to hide initially |

**Configuration on the Button element:**

| Property | Type | Values | Notes |
|---|---|---|---|
| `button_action` | `string` | `show_elements` or `hide_elements` | |
| `show_element_ids` | `array of strings` | CSS selector IDs | Elements to show on click |
| `hide_element_ids` | `array of strings` | CSS selector IDs | Elements to hide on click |

**Supported targets for show/hide:** Any element, Section, Row, or Column (identified by their `element_id`).

**Editing hidden elements:** Use the **Layers Panel** (top-left icon in builder) to select and restore visibility of elements hidden from both views.

### 10.2 Scroll to Element / Section

This is a **Button Action** or **Navigation Menu Item** configuration.

| Property | Type | Values | Notes |
|---|---|---|---|
| `button_action` | `string` | `scroll_to_element` | Set on button |
| `scroll_target_id` | `string` | CSS selector (e.g. `#section_abc12`) | The target section's `element_id` |

**How to get the CSS selector:** Select the target section → Advanced tab → copy the **CSS Selector** field value.

**Scroll behavior:** Always smooth scroll. No additional configuration required. Works on same page only (cross-page scroll not supported).

**Method via URL:** Append CSS selector to page URL: `https://yourdomain.com/page#section_abc12`

### 10.3 Popup

Popups are page-level overlay containers. Multiple popups can exist per page.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `popup_id` | `string` | Auto-generated | — | Referenced by button actions |
| `trigger_type` | `string` | `button_click`, `time_delay`, `exit_intent`, `scroll_percent` | `button_click` | |
| `trigger_delay_seconds` | `number` | `0–300` | `5` | Used when `trigger_type` = `time_delay` |
| `trigger_scroll_percent` | `number` | `0–100` | `50` | Used when `trigger_type` = `scroll_percent` |
| `show_once_per_session` | `boolean` | `true` / `false` | `true` | |
| `show_overlay` | `boolean` | `true` / `false` | `true` | |
| `overlay_color` | `string (hex/rgba)` | Any valid color | `rgba(0,0,0,0.7)` | |
| `close_on_overlay_click` | `boolean` | `true` / `false` | `true` | |
| `show_close_button` | `boolean` | `true` / `false` | `true` | |
| `position` | `string` | `center`, `top`, `bottom`, `left`, `right`, `top_left`, `top_right`, `bottom_left`, `bottom_right` | `center` | |
| `width` | `number (px)` or `%` | — | `600px` | |
| `max_width` | `number (px)` | — | `90%` | |
| `bg_color` | `string (hex/rgba)` | Any valid color | `#ffffff` | |
| `border_radius` | `number (px)` | `0–100` | `8` | |
| `animation_in` | `string` | `fade`, `slide_up`, `slide_down`, `zoom_in`, `none` | `fade` | |
| `content` | `array` | Sections/Rows/Columns/Elements | `[]` | Full page builder tree inside popup |

---

## 11. Universal (Global) Elements

Universal Elements are linked instances of a saved element template that update everywhere simultaneously when edited.

| Property | Type | Notes |
|---|---|---|
| `universal_asset_id` | `string` | ID of the global template. All instances share this ID. |
| `is_universal` | `boolean` | `true` if this element is a linked global instance |
| `override_allowed` | `boolean` | Whether local overrides are permitted on this instance |

**Supported element types for Universal:** Any element type, but most commonly used for Navigation Menus, Footers, and CTA sections.

**Behavior:** Editing any instance of a Universal Element propagates changes to all other instances across all pages and funnel steps that use the same `universal_asset_id`.

---

## 12. Responsive & Mobile Overrides

HighLevel uses a two-breakpoint responsive system: **Desktop** (≥768px) and **Mobile** (<768px). There is no native tablet breakpoint.

**Properties that support mobile overrides** (append `_mobile` to the property name):

| Base Property | Mobile Override |
|---|---|
| `font_size` | `font_size_mobile` |
| `text_align` | `text_align_mobile` |
| `padding_top/right/bottom/left` | `padding_top_mobile` etc. |
| `margin_top/right/bottom/left` | `margin_top_mobile` etc. |
| `width` | `width_mobile` |
| `height` | `height_mobile` |
| `columns` (gallery, counter, etc.) | `columns_mobile` |
| `visible_desktop` | `visible_mobile` |
| `width_percent` (Column) | `width_percent_mobile` |

**Row-level mobile behavior:**

| Property | Type | Default | Notes |
|---|---|---|---|
| `stack_on_mobile` | `boolean` | `true` | Stacks columns vertically on mobile |
| `reverse_on_mobile` | `boolean` | `false` | Reverses column order on mobile |

**Mobile breakpoint:** `768px` (fixed, not configurable per page).

---

## 13. Global Page Styles & Brand Board

The Brand Board defines global defaults that cascade to all elements unless overridden locally.

| Property | Type | Notes |
|---|---|---|
| `primary_color` | `string (hex)` | Main brand color — used as default for buttons, accents |
| `secondary_color` | `string (hex)` | Secondary accent color |
| `text_color` | `string (hex)` | Default body text color |
| `heading_color` | `string (hex)` | Default heading text color |
| `link_color` | `string (hex)` | Default hyperlink color |
| `body_font_family` | `string` | Default font for paragraphs and body text |
| `heading_font_family` | `string` | Default font for headings |
| `body_font_size` | `number (px)` | Default body font size |
| `heading_font_size_h1` | `number (px)` | Default H1 size |
| `heading_font_size_h2` | `number (px)` | Default H2 size |
| `heading_font_size_h3` | `number (px)` | Default H3 size |
| `page_background_color` | `string (hex)` | Default page background |
| `button_color` | `string (hex)` | Default button background |
| `button_text_color` | `string (hex)` | Default button text color |
| `button_border_radius` | `number (px)` | Default button corner radius |

**Custom Fonts:** Custom fonts can be loaded via Google Fonts URL or uploaded font files. Once loaded, the font name becomes available in all `font_family` properties.

---

*Document compiled from HighLevel official support documentation. Last updated: March 2026.*

*Sources: [HighLevel Support Portal](https://help.gohighlevel.com), official feature release notes, and developer documentation.*
