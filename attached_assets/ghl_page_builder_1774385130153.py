"""
HighLevel Funnel Page Builder — Replit-Ready Python Script
==========================================================
Generates a complete, styled HTML funnel page using the HighLevel
page builder schema. Every element type, property, default value,
and constraint from the official schema reference is implemented.

Usage:
    python ghl_page_builder.py

Output:
    funnel_page.html  — open in any browser or deploy directly

Architecture:
    1. Schema Data Models  — dataclasses for every element/container
    2. CSS Generator       — converts schema properties to inline CSS
    3. Element Renderers   — one render function per element type
    4. PageBuilder Engine  — walks the tree and assembles the HTML
    5. Demo Page           — a complete sample funnel page definition
"""

from __future__ import annotations
import uuid
import textwrap
from dataclasses import dataclass, field
from typing import Optional
from pathlib import Path


# ==============================================================================
# SECTION 1 — SCHEMA DATA MODELS
# ==============================================================================

# ------------------------------------------------------------------------------
# 1a. Shared Sub-Objects
# ------------------------------------------------------------------------------

@dataclass
class BoxShadow:
    """A single box-shadow layer. Multiple can be stacked on one element."""
    x: int = 0
    y: int = 4
    blur: int = 10
    spread: int = 0
    color: str = "rgba(0,0,0,0.25)"
    shadow_type: str = "outer"   # "outer" | "inner"


@dataclass
class TextShadow:
    x: int = 0
    y: int = 2
    blur: int = 4
    color: str = "rgba(0,0,0,0.3)"


@dataclass
class Border:
    style: str = "none"          # none | solid | dashed | dotted | double
    width_top: int = 0
    width_right: int = 0
    width_bottom: int = 0
    width_left: int = 0
    color: str = "#000000"
    radius_tl: int = 0           # top-left
    radius_tr: int = 0           # top-right
    radius_br: int = 0           # bottom-right
    radius_bl: int = 0           # bottom-left


@dataclass
class GradientStop:
    color: str = "#ffffff"
    position: int = 0            # 0–100 (percentage along gradient)


@dataclass
class Background:
    """Unified background model for Section, Row, Column."""
    bg_type: str = "color"       # "color" | "image" | "video"

    # Color / Gradient
    bg_color: str = "transparent"
    gradient_enabled: bool = False
    gradient_type: str = "linear"   # linear | radial | angular
    gradient_angle: int = 90
    gradient_stops: list = field(default_factory=list)  # list[GradientStop]
    blur_enabled: bool = False
    blur_intensity: int = 10        # px

    # Image background
    image_url: str = ""
    image_position: str = "center center"
    image_size: str = "cover"       # cover | contain | auto | 100% 100%
    image_repeat: str = "no-repeat"
    image_attachment: str = "scroll"  # scroll | fixed (parallax)
    overlay_color: str = "transparent"
    overlay_opacity: float = 0.0

    # Video background
    video_url: str = ""
    video_fit: str = "cover"        # fill | cover | contain
    video_autoplay: bool = True
    video_loop: bool = True
    video_muted: bool = True
    video_overlay_color: str = "transparent"
    video_overlay_opacity: float = 0.0
    video_fallback_image: str = ""


@dataclass
class Animation:
    enabled: bool = False
    anim_type: str = "fade_in"
    # Types: fade_in, fade_in_up, fade_in_down, fade_in_left, fade_in_right,
    #        slide_in_up, slide_in_down, slide_in_left, slide_in_right,
    #        bounce_in, bounce_in_up, zoom_in, zoom_in_up, flip_in_x,
    #        flip_in_y, rotate_in, pulse, shake, wobble, heartbeat
    scale: float = 1.0             # 0.5–2.0
    duration: float = 0.5          # seconds (0.1–3.0)
    delay: float = 0.0             # seconds (0–5.0)
    easing: str = "ease_out"       # linear | ease_in | ease_out | ease_in_out


# ------------------------------------------------------------------------------
# 1b. Base Properties (shared by ALL elements and containers)
# ------------------------------------------------------------------------------

@dataclass
class BaseProps:
    """
    Properties shared by every element and container in the HighLevel schema.
    All spacing units: px | % | em | rem | vh | vw | auto
    """
    element_id: str = field(default_factory=lambda: f"el_{uuid.uuid4().hex[:8]}")
    custom_css_class: str = ""
    custom_css_id: str = ""

    # Visibility
    visible_desktop: bool = True
    visible_mobile: bool = True

    # Padding (desktop)
    padding_top: str = "0px"
    padding_right: str = "0px"
    padding_bottom: str = "0px"
    padding_left: str = "0px"

    # Padding (mobile overrides)
    padding_top_mobile: str = ""
    padding_right_mobile: str = ""
    padding_bottom_mobile: str = ""
    padding_left_mobile: str = ""

    # Margin (desktop)
    margin_top: str = "0px"
    margin_right: str = "0px"
    margin_bottom: str = "0px"
    margin_left: str = "0px"

    # Margin (mobile overrides)
    margin_top_mobile: str = ""
    margin_right_mobile: str = ""
    margin_bottom_mobile: str = ""
    margin_left_mobile: str = ""

    # Container size
    width: str = "auto"
    height: str = "auto"
    width_mobile: str = "auto"
    height_mobile: str = "auto"

    # Advanced styling
    border: Optional[Border] = None
    box_shadows: list = field(default_factory=list)   # list[BoxShadow]
    animation: Optional[Animation] = None


# ------------------------------------------------------------------------------
# 1c. Layout Containers
# ------------------------------------------------------------------------------

@dataclass
class Section(BaseProps):
    """
    Full-width horizontal band. Outermost layout container.
    Properties: full_width, content_max_width, min_height, sticky,
                column_gap, row_gap, overflow, z_index, background
    """
    full_width: bool = False
    content_max_width: int = 1170       # px
    min_height: str = "auto"            # px or vh
    sticky: bool = False
    column_gap: int = 0                 # px — gap between columns
    row_gap: int = 0                    # px — gap between rows
    overflow: str = "visible"           # visible | hidden
    z_index: int = 0
    background: Background = field(default_factory=Background)
    rows: list = field(default_factory=list)   # list[Row]

    # Override padding defaults for sections
    padding_top: str = "60px"
    padding_right: str = "20px"
    padding_bottom: str = "60px"
    padding_left: str = "20px"


@dataclass
class Row(BaseProps):
    """
    Horizontal flex container inside a Section. Holds 1–6 Columns.
    Column widths within a Row must sum to 100%.
    """
    # Preset column layouts: "1" | "1-1" | "1-1-1" | "1-1-1-1" |
    #   "2-1" | "1-2" | "1-2-1" | "3-1" | "1-3" | "2-1-1" | "1-1-2"
    column_layout: str = "1"
    vertical_align: str = "top"         # top | middle | bottom | stretch
    reverse_on_mobile: bool = False
    stack_on_mobile: bool = True
    background: Background = field(default_factory=Background)
    columns: list = field(default_factory=list)   # list[Column]


@dataclass
class Column(BaseProps):
    """
    Vertical flex cell inside a Row. Holds elements.
    width_percent must sum to 100% with sibling columns.
    """
    width_percent: float = 100.0        # 8.33–100
    width_percent_mobile: float = 100.0
    vertical_align: str = "top"         # top | middle | bottom
    horizontal_align: str = "left"      # left | center | right
    background: Background = field(default_factory=Background)
    elements: list = field(default_factory=list)   # list of element dataclasses


# ------------------------------------------------------------------------------
# 1d. Basic Elements
# ------------------------------------------------------------------------------

@dataclass
class Headline(BaseProps):
    """H1–H6 heading text element."""
    text: str = "Your Headline Here"
    heading_tag: str = "h2"             # h1 | h2 | h3 | h4 | h5 | h6
    font_family: str = ""               # "" = inherit from global
    font_weight: str = "700"
    font_size: str = "36px"
    font_size_mobile: str = "28px"
    font_color: str = "#000000"
    text_align: str = "left"            # left | center | right | justify
    text_align_mobile: str = "center"
    line_height: float = 1.4
    letter_spacing: str = "0px"
    text_transform: str = "none"        # none | uppercase | lowercase | capitalize
    link_url: str = ""
    link_target: str = "_self"          # _self | _blank
    text_shadow: Optional[TextShadow] = None


@dataclass
class Paragraph(BaseProps):
    """Body text block."""
    text: str = "Your paragraph text goes here."
    font_family: str = ""
    font_weight: str = "400"
    font_size: str = "16px"
    font_size_mobile: str = "14px"
    font_color: str = "#333333"
    text_align: str = "left"
    text_align_mobile: str = "left"
    line_height: float = 1.6
    letter_spacing: str = "0px"
    text_transform: str = "none"
    text_shadow: Optional[TextShadow] = None


@dataclass
class RichText(BaseProps):
    """
    Advanced text element supporting H1–H6, blockquote, code,
    nested lists (disc/circle/square, decimal/alpha/roman), and highlights.
    """
    content: str = "<p>Rich text content here.</p>"   # Raw HTML
    font_family: str = ""
    font_size: str = "16px"
    font_color: str = "#333333"
    line_height: float = 1.6
    list_item_spacing: str = "8px"
    text_align: str = "left"


@dataclass
class BulletList(BaseProps):
    """Dedicated list element with custom icon/marker support."""
    items: list = field(default_factory=lambda: ["Item 1", "Item 2", "Item 3"])
    list_type: str = "icon"             # unordered | ordered | icon
    icon_type: str = "check"            # check | arrow | star | dot | custom
    icon_color: str = "#000000"
    icon_size: str = "16px"
    font_family: str = ""
    font_size: str = "16px"
    font_color: str = "#333333"
    line_height: float = 1.6
    list_item_spacing: str = "8px"
    text_align: str = "left"


@dataclass
class Image(BaseProps):
    """Image element with click actions and responsive sizing."""
    src: str = ""
    alt_text: str = ""
    image_width: str = "100%"
    image_height: str = "auto"
    object_fit: str = "contain"         # fill | contain | cover | none | scale-down
    alignment: str = "center"           # left | center | right
    lazy_load: bool = True
    click_action: str = "none"          # none | open_url | open_popup | open_lightbox
    click_url: str = ""
    open_in_new_tab: bool = False
    popup_id: str = ""
    caption: str = ""


@dataclass
class Video(BaseProps):
    """Video element supporting YouTube, Vimeo, Wistia, HTML5, and hosted."""
    video_type: str = "youtube"         # youtube | vimeo | wistia | html5 | hosted
    video_url: str = ""
    autoplay: bool = False
    loop: bool = False
    muted: bool = False
    controls: bool = True
    thumbnail_url: str = ""
    start_time: int = 0                 # seconds
    aspect_ratio: str = "16:9"          # 16:9 | 4:3 | 1:1 | 9:16
    vid_width: str = "100%"


@dataclass
class Button(BaseProps):
    """
    Button element with 14 action types, hover states, and full styling.
    """
    label: str = "Click Here"
    sub_text: str = ""
    icon_left: str = ""
    icon_right: str = ""
    full_width: bool = False
    alignment: str = "center"           # left | center | right

    # Styling
    bg_color: str = "#FF6B00"
    text_color: str = "#ffffff"
    font_family: str = ""
    font_size: str = "18px"
    font_weight: str = "700"
    border_radius: str = "4px"
    padding_top: str = "16px"
    padding_right: str = "32px"
    padding_bottom: str = "16px"
    padding_left: str = "32px"

    # Hover states
    hover_bg_color: str = ""            # "" = auto-darken bg_color
    hover_text_color: str = ""
    hover_border_color: str = ""
    hover_transition_duration: float = 0.3

    # Action — button_action values:
    # url | phone | sms | email | submit_form | next_step | open_popup |
    # close_popup | scroll_to_element | show_elements | hide_elements |
    # download_file | upsell | downsell | calendar | custom_js
    button_action: str = "url"
    action_url: str = "#"
    open_in_new_tab: bool = False
    phone_number: str = ""
    sms_number: str = ""
    sms_body: str = ""
    email_address: str = ""
    email_subject: str = ""
    popup_id: str = ""
    scroll_target_id: str = ""          # CSS selector e.g. "#section_abc12"
    show_element_ids: list = field(default_factory=list)
    hide_element_ids: list = field(default_factory=list)
    file_url: str = ""
    custom_js_code: str = ""


@dataclass
class Divider(BaseProps):
    """Horizontal rule / separator element."""
    line_style: str = "solid"           # solid | dashed | dotted | double | none
    line_color: str = "#cccccc"
    line_width: str = "100%"            # percentage of column width
    line_thickness: str = "1px"
    alignment: str = "center"


@dataclass
class Spacer(BaseProps):
    """Empty vertical space element."""
    height: str = "40px"
    height_mobile: str = "20px"


@dataclass
class CustomHTML(BaseProps):
    """Raw HTML / CSS / JavaScript block."""
    html_content: str = "<!-- Custom HTML here -->"
    execute_scripts: bool = True


# ------------------------------------------------------------------------------
# 1e. Form & Conversion Elements
# ------------------------------------------------------------------------------

@dataclass
class FormField:
    """Schema for a single field inside a HighLevel Form."""
    field_type: str = "text"
    # text | email | phone | textarea | select | radio | checkbox |
    # date | file | hidden | signature | address | full_name |
    # first_name | last_name
    label: str = "Field Label"
    placeholder: str = ""
    required: bool = False
    default_value: str = ""
    options: list = field(default_factory=list)   # for select/radio/checkbox
    custom_css_class: str = ""
    width: str = "full"                 # full | half
    field_name: str = ""                # CRM field mapping key


@dataclass
class FormEmbed(BaseProps):
    """Embeds a HighLevel Form by ID."""
    form_id: str = ""
    redirect_type: str = "next_step"    # url | next_step | same_page | popup
    redirect_url: str = ""
    popup_id: str = ""
    inline_message: str = "Thank you! We'll be in touch soon."
    double_opt_in: bool = False
    style_override: bool = False
    # For demo rendering, we include inline fields:
    fields: list = field(default_factory=list)   # list[FormField]
    submit_button_label: str = "Submit"
    submit_button_color: str = "#FF6B00"
    submit_button_text_color: str = "#ffffff"


@dataclass
class OrderForm(BaseProps):
    """Two-step order form element."""
    product_id: str = ""
    product_name: str = "Product Name"
    product_price: str = "$97"
    step_1_label: str = "Contact Info"
    step_2_label: str = "Payment Info"
    show_order_summary: bool = True
    coupon_enabled: bool = False
    bump_offer_enabled: bool = False
    bump_offer_product_id: str = ""
    bump_offer_name: str = ""
    bump_offer_price: str = ""
    redirect_url: str = ""


@dataclass
class CalendarEmbed(BaseProps):
    """Embeds a HighLevel Calendar booking widget."""
    calendar_id: str = ""
    calendar_name: str = "Book a Call"
    style: str = "inline"               # inline | popup
    redirect_url: str = ""


# ------------------------------------------------------------------------------
# 1f. Advanced Widget Elements
# ------------------------------------------------------------------------------

@dataclass
class SliderSlide:
    image_url: str = ""
    alt_text: str = ""
    caption: str = ""
    link_url: str = ""
    link_target: str = "_self"


@dataclass
class ImageSlider(BaseProps):
    """Image carousel/slider widget."""
    slides: list = field(default_factory=list)   # list[SliderSlide]
    transition_style: str = "slide"     # slide | fade
    autoplay: bool = True
    autoplay_speed: int = 3000          # ms (500–10000)
    loop: bool = True
    show_arrows: bool = True
    show_pagination: bool = True
    pause_on_hover: bool = True
    image_fit: str = "cover"            # cover | contain | fill
    aspect_ratio: str = "16:9"          # 16:9 | 4:3 | 1:1 | 3:2 | custom
    custom_height: str = "400px"        # used when aspect_ratio = "custom"


@dataclass
class CountdownTimer(BaseProps):
    """
    Countdown timer widget.
    timer_type: fixed | evergreen | daily
    """
    timer_type: str = "fixed"
    end_date: str = "2026-12-31"        # ISO 8601 date
    end_time: str = "23:59"             # HH:MM
    timezone: str = "America/New_York"
    duration_minutes: int = 60          # for evergreen type
    evergreen_reset: str = "never"      # never | on_revisit | on_session_end
    daily_reset_time: str = "00:00"     # for daily type
    show_days: bool = True
    show_hours: bool = True
    show_minutes: bool = True
    show_seconds: bool = True
    label_days: str = "Days"
    label_hours: str = "Hours"
    label_minutes: str = "Minutes"
    label_seconds: str = "Seconds"
    number_color: str = "#000000"
    label_color: str = "#666666"
    bg_color: str = "transparent"
    number_font_size: str = "48px"
    label_font_size: str = "14px"
    separator_char: str = ":"
    expire_action: str = "none"         # none | redirect_url | show_element | hide_element
    expire_redirect_url: str = ""
    expire_element_id: str = ""


@dataclass
class PricingPlan:
    plan_name: str = "Basic"
    plan_price: str = "$0"
    price_period: str = "/month"
    description: str = ""
    features: list = field(default_factory=list)   # list of strings
    button_label: str = "Get Started"
    button_url: str = "#"
    button_color: str = "#FF6B00"
    is_highlighted: bool = False
    ribbon_text: str = ""
    ribbon_color: str = "#FF6B00"
    highlight_color: str = "#FF6B00"


@dataclass
class PricingTable(BaseProps):
    """Multi-column pricing table widget."""
    plans: list = field(default_factory=list)   # list[PricingPlan]
    columns: int = 3                    # 1–4
    highlight_plan_index: int = 1


@dataclass
class Testimonial:
    author_name: str = "John Doe"
    author_title: str = ""
    author_avatar_url: str = ""
    quote: str = "This product changed my life!"
    star_rating: int = 5               # 1–5
    show_stars: bool = True
    star_color: str = "#FFD700"
    bg_color: str = "#ffffff"
    text_color: str = "#333333"


@dataclass
class Testimonials(BaseProps):
    """Testimonials widget with grid, carousel, or list layout."""
    testimonials: list = field(default_factory=list)   # list[Testimonial]
    layout: str = "grid"               # grid | carousel | list
    columns: int = 3                   # 1–4
    autoplay: bool = False
    autoplay_speed: int = 4000
    show_arrows: bool = True
    show_pagination: bool = True


@dataclass
class SocialIcon:
    platform: str = "facebook"
    # facebook | instagram | twitter | linkedin | youtube |
    # tiktok | pinterest | snapchat | whatsapp | telegram | email
    url: str = "#"
    open_in_new_tab: bool = True


@dataclass
class SocialIcons(BaseProps):
    """Social media icons row."""
    icons: list = field(default_factory=list)   # list[SocialIcon]
    display_type: str = "icon_only"     # icon_only | text_only | icon_and_text
    icon_style: str = "filled"          # filled | outline | minimal
    icon_shape: str = "circle"          # circle | square | rounded_square | none
    icon_size: str = "32px"
    icon_color: str = "brand"           # "brand" = platform's official color
    icon_bg_color: str = "transparent"
    gap: str = "8px"
    alignment: str = "center"


@dataclass
class CounterItem:
    start_value: float = 0
    end_value: float = 100
    prefix: str = ""
    suffix: str = "+"
    decimal_places: int = 0
    label: str = "Happy Clients"
    number_color: str = "#000000"
    label_color: str = "#666666"
    number_font_size: str = "48px"
    label_font_size: str = "16px"
    icon_url: str = ""


@dataclass
class NumberCounter(BaseProps):
    """Animated count-up number counter widget."""
    counters: list = field(default_factory=list)   # list[CounterItem]
    columns: int = 3                   # 1–6
    animate_on_scroll: bool = True
    animation_duration: float = 2.0    # seconds


@dataclass
class LogoItem:
    image_url: str = ""
    alt_text: str = ""
    link_url: str = ""


@dataclass
class LogoShowcase(BaseProps):
    """Logo ticker or carousel widget."""
    mode: str = "ticker"               # ticker | carousel
    logos: list = field(default_factory=list)   # list[LogoItem]
    # Ticker
    scroll_speed: int = 5              # 1–10
    smooth_scroll: bool = True
    # Carousel
    logos_per_slide: int = 4
    auto_animation: bool = True
    interval_timing: int = 3000
    infinite_loop: bool = True
    animation_style: str = "slide"     # slide | fade
    show_arrows: bool = True
    show_pagination: bool = False
    # Shared
    logo_spacing: str = "20px"
    logo_height: str = "60px"
    grayscale: bool = False
    pause_on_hover: bool = True


@dataclass
class GalleryImage:
    image_url: str = ""
    alt_text: str = ""
    caption: str = ""
    description: str = ""
    click_action: str = "lightbox"     # lightbox | url
    click_url: str = ""
    open_in_new_tab: bool = False
    watermark_enabled: bool = False
    watermark_text: str = ""
    watermark_position: str = "bottom_right"


@dataclass
class PhotoGallery(BaseProps):
    """Photo gallery with grid/masonry layout and lightbox."""
    images: list = field(default_factory=list)   # list[GalleryImage]
    layout: str = "grid"               # grid | masonry_vertical | masonry_horizontal
    columns: int = 3                   # 1–6
    columns_mobile: int = 1
    spacing: str = "8px"
    lightbox_enabled: bool = True
    heading: str = ""
    lazy_load: bool = True


@dataclass
class BlogPostFeed(BaseProps):
    """Dynamic blog post feed widget."""
    blog_site_id: str = ""
    display_style: str = "grid"        # grid | list | featured
    sort_by: str = "recent"            # recent | recent_by_category | recent_by_author
    category_filter: list = field(default_factory=list)
    author_filter: str = ""
    posts_per_page: int = 6
    show_pagination: bool = True
    show_featured_image: bool = True
    show_excerpt: bool = True
    show_author: bool = True
    show_date: bool = True
    show_category: bool = True
    button_text: str = "Read More"
    button_color: str = "#FF6B00"
    button_text_color: str = "#ffffff"


@dataclass
class QRCode(BaseProps):
    """QR code element linked to a HighLevel QR asset."""
    qr_code_id: str = ""
    destination_url: str = ""
    size: str = "200px"
    alignment: str = "center"


@dataclass
class MenuItem:
    label: str = "Menu Item"
    go_to: str = "url"                 # url | scroll_to_element | phone | email
    url: str = "#"
    open_in_new_tab: bool = False
    css_selector: str = ""
    children: list = field(default_factory=list)   # list[MenuItem] for sub-menus
    icon: str = ""
    is_button: bool = False
    button_color: str = "#FF6B00"


@dataclass
class NavigationMenu(BaseProps):
    """Full navigation bar with mega menu support."""
    logo_url: str = ""
    logo_alt_text: str = "Logo"
    logo_width: str = "150px"
    logo_link_url: str = "/"
    menu_items: list = field(default_factory=list)   # list[MenuItem]
    layout: str = "horizontal"         # horizontal | vertical
    alignment: str = "space_between"   # left | center | right | space_between
    sticky: bool = False
    sticky_bg_color: str = "#ffffff"
    text_color: str = "#000000"
    hover_color: str = "#FF6B00"
    active_color: str = "#FF6B00"
    font_size: str = "16px"
    font_weight: str = "500"
    mobile_menu_style: str = "hamburger"  # hamburger | full_screen | slide_in
    mobile_breakpoint: str = "768px"
    nav_bg_color: str = "#ffffff"


@dataclass
class FAQItem:
    question: str = "What is your question?"
    answer: str = "<p>Your answer goes here.</p>"
    is_open: bool = False


@dataclass
class FAQAccordion(BaseProps):
    """FAQ / Accordion widget."""
    items: list = field(default_factory=list)   # list[FAQItem]
    allow_multiple_open: bool = False
    default_open_index: int = -1       # -1 = all closed
    icon_type: str = "plus_minus"      # plus_minus | chevron | arrow | none
    icon_position: str = "right"       # left | right
    header_bg_color: str = "#f5f5f5"
    header_text_color: str = "#000000"
    header_font_size: str = "18px"
    content_bg_color: str = "#ffffff"
    content_text_color: str = "#333333"
    content_font_size: str = "16px"
    border_color: str = "#dddddd"


@dataclass
class ProgressBar(BaseProps):
    """Animated progress bar widget."""
    label: str = "Progress"
    value: int = 75                    # 0–100
    show_percentage: bool = True
    animate_on_scroll: bool = True
    animation_duration: float = 1.5
    bar_color: str = "#FF6B00"
    track_color: str = "#eeeeee"
    bar_height: str = "20px"
    bar_radius: str = "10px"
    label_color: str = "#000000"
    label_font_size: str = "16px"


@dataclass
class MapEmbed(BaseProps):
    """Google Maps embed element."""
    address: str = "New York, NY"
    zoom_level: int = 14               # 1–21
    map_type: str = "roadmap"          # roadmap | satellite | hybrid | terrain
    show_marker: bool = True
    marker_label: str = ""
    map_height: str = "400px"
    map_width: str = "100%"


# ------------------------------------------------------------------------------
# 1g. Popup Container
# ------------------------------------------------------------------------------

@dataclass
class Popup:
    """Page-level overlay popup container."""
    popup_id: str = field(default_factory=lambda: f"popup_{uuid.uuid4().hex[:8]}")
    trigger_type: str = "button_click"  # button_click | time_delay | exit_intent | scroll_percent
    trigger_delay_seconds: int = 5
    trigger_scroll_percent: int = 50
    show_once_per_session: bool = True
    show_overlay: bool = True
    overlay_color: str = "rgba(0,0,0,0.7)"
    close_on_overlay_click: bool = True
    show_close_button: bool = True
    position: str = "center"           # center | top | bottom | left | right | corners
    width: str = "600px"
    max_width: str = "90%"
    bg_color: str = "#ffffff"
    border_radius: str = "8px"
    animation_in: str = "fade"         # fade | slide_up | slide_down | zoom_in | none
    sections: list = field(default_factory=list)   # list[Section] — full builder tree


# ------------------------------------------------------------------------------
# 1h. Page Settings
# ------------------------------------------------------------------------------

@dataclass
class PageSettings:
    """Top-level page configuration and SEO metadata."""
    # SEO
    seo_title: str = "Page Title"
    seo_description: str = ""
    seo_keywords: str = ""
    og_title: str = ""
    og_description: str = ""
    og_image_url: str = ""
    canonical_url: str = ""
    robots_meta: str = ""              # e.g. "noindex, nofollow"
    author: str = ""
    favicon_url: str = ""
    lang_attribute: str = "en"
    custom_meta_tags: list = field(default_factory=list)  # [{name, content}]

    # Code injection
    head_tracking_code: str = ""       # injected in <head>
    body_tracking_code: str = ""       # injected at end of <body>

    # Page behavior
    page_background_color: str = "#ffffff"
    page_font_family: str = "Inter, sans-serif"
    page_max_width: int = 1170         # px

    # Brand Board / Global Styles
    primary_color: str = "#FF6B00"
    secondary_color: str = "#1A1A2E"
    text_color: str = "#333333"
    heading_color: str = "#000000"
    link_color: str = "#FF6B00"
    body_font_family: str = "Inter, sans-serif"
    heading_font_family: str = "Inter, sans-serif"
    body_font_size: str = "16px"
    heading_font_size_h1: str = "48px"
    heading_font_size_h2: str = "36px"
    heading_font_size_h3: str = "28px"
    button_color: str = "#FF6B00"
    button_text_color: str = "#ffffff"
    button_border_radius: str = "4px"


# ------------------------------------------------------------------------------
# 1i. Top-Level Page Object
# ------------------------------------------------------------------------------

@dataclass
class FunnelPage:
    """The root object representing a complete HighLevel funnel page."""
    settings: PageSettings = field(default_factory=PageSettings)
    sections: list = field(default_factory=list)   # list[Section]
    popups: list = field(default_factory=list)     # list[Popup]


# ==============================================================================
# SECTION 2 — CSS GENERATOR
# Converts schema property objects into CSS strings
# ==============================================================================

EASING_MAP = {
    "linear": "linear",
    "ease_in": "ease-in",
    "ease_out": "ease-out",
    "ease_in_out": "ease-in-out",
}

ANIMATION_KEYFRAMES = {
    "fade_in":         "ghl-fade-in",
    "fade_in_up":      "ghl-fade-in-up",
    "fade_in_down":    "ghl-fade-in-down",
    "fade_in_left":    "ghl-fade-in-left",
    "fade_in_right":   "ghl-fade-in-right",
    "slide_in_up":     "ghl-slide-in-up",
    "slide_in_down":   "ghl-slide-in-down",
    "slide_in_left":   "ghl-slide-in-left",
    "slide_in_right":  "ghl-slide-in-right",
    "zoom_in":         "ghl-zoom-in",
    "zoom_in_up":      "ghl-zoom-in-up",
    "bounce_in":       "ghl-bounce-in",
    "bounce_in_up":    "ghl-bounce-in-up",
    "flip_in_x":       "ghl-flip-in-x",
    "flip_in_y":       "ghl-flip-in-y",
    "rotate_in":       "ghl-rotate-in",
    "pulse":           "ghl-pulse",
    "shake":           "ghl-shake",
    "wobble":          "ghl-wobble",
    "heartbeat":       "ghl-heartbeat",
}

SOCIAL_COLORS = {
    "facebook":  "#1877F2",
    "instagram": "#E1306C",
    "twitter":   "#1DA1F2",
    "linkedin":  "#0A66C2",
    "youtube":   "#FF0000",
    "tiktok":    "#000000",
    "pinterest": "#E60023",
    "snapchat":  "#FFFC00",
    "whatsapp":  "#25D366",
    "telegram":  "#2CA5E0",
    "email":     "#888888",
}

SOCIAL_ICONS_SVG = {
    "facebook":  "f",
    "instagram": "ig",
    "twitter":   "tw",
    "linkedin":  "in",
    "youtube":   "yt",
    "tiktok":    "tt",
    "pinterest": "pt",
    "snapchat":  "sc",
    "whatsapp":  "wa",
    "telegram":  "tg",
    "email":     "@",
}


def _css_spacing(prefix: str, top: str, right: str, bottom: str, left: str) -> str:
    """Returns a CSS shorthand spacing string if all sides are equal, else individual properties."""
    if top == right == bottom == left:
        return f"{prefix}: {top};"
    parts = []
    if top:    parts.append(f"{prefix}-top: {top};")
    if right:  parts.append(f"{prefix}-right: {right};")
    if bottom: parts.append(f"{prefix}-bottom: {bottom};")
    if left:   parts.append(f"{prefix}-left: {left};")
    return " ".join(parts)


def css_from_base(props: BaseProps, extra: dict = None) -> str:
    """
    Generates inline CSS from BaseProps.
    extra: dict of additional {property: value} pairs.
    """
    rules = []

    # Padding
    rules.append(_css_spacing(
        "padding",
        props.padding_top, props.padding_right,
        props.padding_bottom, props.padding_left
    ))

    # Margin
    rules.append(_css_spacing(
        "margin",
        props.margin_top, props.margin_right,
        props.margin_bottom, props.margin_left
    ))

    # Size
    if props.width and props.width != "auto":
        rules.append(f"width: {props.width};")
    if props.height and props.height != "auto":
        rules.append(f"height: {props.height};")

    # Border
    if props.border and props.border.style != "none":
        b = props.border
        rules.append(f"border-style: {b.style};")
        rules.append(f"border-color: {b.color};")
        if b.width_top == b.width_right == b.width_bottom == b.width_left:
            rules.append(f"border-width: {b.width_top}px;")
        else:
            rules.append(f"border-width: {b.width_top}px {b.width_right}px {b.width_bottom}px {b.width_left}px;")
        if b.radius_tl == b.radius_tr == b.radius_br == b.radius_bl:
            rules.append(f"border-radius: {b.radius_tl}px;")
        else:
            rules.append(f"border-radius: {b.radius_tl}px {b.radius_tr}px {b.radius_br}px {b.radius_bl}px;")

    # Box shadows
    if props.box_shadows:
        shadows = []
        for s in props.box_shadows:
            inset = "inset " if s.shadow_type == "inner" else ""
            shadows.append(f"{inset}{s.x}px {s.y}px {s.blur}px {s.spread}px {s.color}")
        rules.append(f"box-shadow: {', '.join(shadows)};")

    # Animation
    if props.animation and props.animation.enabled:
        a = props.animation
        kf = ANIMATION_KEYFRAMES.get(a.anim_type, "ghl-fade-in")
        easing = EASING_MAP.get(a.easing, "ease-out")
        rules.append(f"animation: {kf} {a.duration}s {easing} {a.delay}s both;")

    # Extra rules
    if extra:
        for k, v in extra.items():
            if v:
                rules.append(f"{k}: {v};")

    return " ".join(r for r in rules if r.strip())


def css_from_background(bg: Background) -> str:
    """Generates CSS background properties from a Background object."""
    rules = []

    if bg.bg_type == "color":
        if bg.gradient_enabled and bg.gradient_stops:
            stops = ", ".join(
                f"{s.color} {s.position}%" for s in bg.gradient_stops
            )
            if bg.gradient_type == "linear":
                rules.append(f"background: linear-gradient({bg.gradient_angle}deg, {stops});")
            elif bg.gradient_type == "radial":
                rules.append(f"background: radial-gradient(circle, {stops});")
            elif bg.gradient_type == "angular":
                rules.append(f"background: conic-gradient(from {bg.gradient_angle}deg, {stops});")
        else:
            rules.append(f"background-color: {bg.bg_color};")
        if bg.blur_enabled:
            rules.append(f"backdrop-filter: blur({bg.blur_intensity}px);")

    elif bg.bg_type == "image" and bg.image_url:
        rules.append(f"background-image: url('{bg.image_url}');")
        rules.append(f"background-position: {bg.image_position};")
        rules.append(f"background-size: {bg.image_size};")
        rules.append(f"background-repeat: {bg.image_repeat};")
        rules.append(f"background-attachment: {bg.image_attachment};")

    return " ".join(rules)


def mobile_css_from_base(props: BaseProps) -> str:
    """Generates mobile-override CSS rules."""
    rules = []
    overrides = [
        ("padding-top",    props.padding_top_mobile),
        ("padding-right",  props.padding_right_mobile),
        ("padding-bottom", props.padding_bottom_mobile),
        ("padding-left",   props.padding_left_mobile),
        ("margin-top",     props.margin_top_mobile),
        ("margin-right",   props.margin_right_mobile),
        ("margin-bottom",  props.margin_bottom_mobile),
        ("margin-left",    props.margin_left_mobile),
        ("width",          props.width_mobile if props.width_mobile != "auto" else ""),
        ("height",         props.height_mobile if props.height_mobile != "auto" else ""),
    ]
    for prop, val in overrides:
        if val:
            rules.append(f"{prop}: {val};")
    return " ".join(rules)


# ==============================================================================
# SECTION 3 — ELEMENT RENDERERS
# Each function takes a schema object and returns an HTML string
# ==============================================================================

def render_headline(el: Headline) -> str:
    style = css_from_base(el, {
        "color": el.font_color,
        "font-size": el.font_size,
        "font-weight": el.font_weight,
        "text-align": el.text_align,
        "line-height": str(el.line_height),
        "letter-spacing": el.letter_spacing,
        "text-transform": el.text_transform,
        "font-family": el.font_family if el.font_family else "inherit",
    })
    if el.text_shadow:
        ts = el.text_shadow
        style += f" text-shadow: {ts.x}px {ts.y}px {ts.blur}px {ts.color};"

    tag = el.heading_tag
    css_class = f"ghl-headline {el.custom_css_class}".strip()
    css_id = f' id="{el.custom_css_id}"' if el.custom_css_id else f' id="{el.element_id}"'

    content = el.text
    if el.link_url:
        content = f'<a href="{el.link_url}" target="{el.link_target}" style="color:inherit;text-decoration:none;">{el.text}</a>'

    mobile_style = ""
    if el.font_size_mobile:
        mobile_style = f"#{el.element_id} {{ font-size: {el.font_size_mobile}; text-align: {el.text_align_mobile}; }}"

    return f'<{tag}{css_id} class="{css_class}" style="{style}">{content}</{tag}>'


def render_paragraph(el: Paragraph) -> str:
    style = css_from_base(el, {
        "color": el.font_color,
        "font-size": el.font_size,
        "font-weight": el.font_weight,
        "text-align": el.text_align,
        "line-height": str(el.line_height),
        "letter-spacing": el.letter_spacing,
        "text-transform": el.text_transform,
        "font-family": el.font_family if el.font_family else "inherit",
    })
    if el.text_shadow:
        ts = el.text_shadow
        style += f" text-shadow: {ts.x}px {ts.y}px {ts.blur}px {ts.color};"

    css_class = f"ghl-paragraph {el.custom_css_class}".strip()
    return f'<p id="{el.element_id}" class="{css_class}" style="{style}">{el.text}</p>'


def render_rich_text(el: RichText) -> str:
    style = css_from_base(el, {
        "color": el.font_color,
        "font-size": el.font_size,
        "text-align": el.text_align,
        "line-height": str(el.line_height),
        "font-family": el.font_family if el.font_family else "inherit",
    })
    css_class = f"ghl-rich-text {el.custom_css_class}".strip()
    return f'<div id="{el.element_id}" class="{css_class}" style="{style}">{el.content}</div>'


def render_bullet_list(el: BulletList) -> str:
    icon_map = {
        "check": "&#10003;",
        "arrow": "&#8594;",
        "star":  "&#9733;",
        "dot":   "&#8226;",
    }
    icon_char = icon_map.get(el.icon_type, "&#10003;")

    items_html = ""
    for item in el.items:
        if el.list_type == "icon":
            items_html += (
                f'<li style="margin-bottom:{el.list_item_spacing};display:flex;align-items:flex-start;gap:8px;">'
                f'<span style="color:{el.icon_color};font-size:{el.icon_size};flex-shrink:0;">{icon_char}</span>'
                f'<span>{item}</span></li>'
            )
        else:
            items_html += f'<li style="margin-bottom:{el.list_item_spacing};">{item}</li>'

    tag = "ol" if el.list_type == "ordered" else "ul"
    list_style = "none" if el.list_type == "icon" else ""
    style = css_from_base(el, {
        "color": el.font_color,
        "font-size": el.font_size,
        "text-align": el.text_align,
        "line-height": str(el.line_height),
        "list-style": list_style,
        "padding-left": "0" if el.list_type == "icon" else "20px",
        "font-family": el.font_family if el.font_family else "inherit",
    })
    css_class = f"ghl-bullet-list {el.custom_css_class}".strip()
    return f'<{tag} id="{el.element_id}" class="{css_class}" style="{style}">{items_html}</{tag}>'


def render_image(el: Image) -> str:
    style = css_from_base(el, {
        "text-align": el.alignment,
        "display": "block",
    })
    img_style = f"width:{el.image_width};height:{el.image_height};object-fit:{el.object_fit};display:block;"
    if el.alignment == "center":
        img_style += "margin:0 auto;"
    elif el.alignment == "right":
        img_style += "margin-left:auto;"

    lazy = 'loading="lazy"' if el.lazy_load else ""
    img_tag = f'<img src="{el.src}" alt="{el.alt_text}" style="{img_style}" {lazy}/>'

    if el.caption:
        img_tag += f'<p style="text-align:{el.alignment};font-size:14px;color:#666;margin-top:8px;">{el.caption}</p>'

    if el.click_action == "open_url" and el.click_url:
        target = "_blank" if el.open_in_new_tab else "_self"
        img_tag = f'<a href="{el.click_url}" target="{target}">{img_tag}</a>'
    elif el.click_action == "open_popup" and el.popup_id:
        img_tag = f'<a href="#" onclick="ghlOpenPopup(\'{el.popup_id}\');return false;">{img_tag}</a>'

    css_class = f"ghl-image {el.custom_css_class}".strip()
    return f'<div id="{el.element_id}" class="{css_class}" style="{style}">{img_tag}</div>'


def render_video(el: Video) -> str:
    ratio_map = {"16:9": "56.25%", "4:3": "75%", "1:1": "100%", "9:16": "177.78%"}
    padding_bottom = ratio_map.get(el.aspect_ratio, "56.25%")

    style = css_from_base(el, {"width": el.vid_width})
    css_class = f"ghl-video {el.custom_css_class}".strip()

    wrapper_style = f"position:relative;padding-bottom:{padding_bottom};height:0;overflow:hidden;"
    iframe_style = "position:absolute;top:0;left:0;width:100%;height:100%;border:0;"

    if el.video_type in ("youtube", "vimeo", "wistia") and el.video_url:
        params = []
        if el.autoplay: params.append("autoplay=1")
        if el.loop:     params.append("loop=1")
        if el.muted:    params.append("mute=1")
        if not el.controls: params.append("controls=0")
        if el.start_time:   params.append(f"start={el.start_time}")
        query = "&".join(params)

        if el.video_type == "youtube":
            vid_id = el.video_url.split("v=")[-1].split("&")[0] if "v=" in el.video_url else el.video_url.split("/")[-1]
            src = f"https://www.youtube.com/embed/{vid_id}?{query}"
        elif el.video_type == "vimeo":
            vid_id = el.video_url.split("/")[-1]
            src = f"https://player.vimeo.com/video/{vid_id}?{query}"
        else:
            src = el.video_url

        embed = f'<div style="{wrapper_style}"><iframe src="{src}" style="{iframe_style}" allowfullscreen></iframe></div>'
    else:
        controls_attr = "controls" if el.controls else ""
        autoplay_attr = "autoplay" if el.autoplay else ""
        loop_attr = "loop" if el.loop else ""
        muted_attr = "muted" if el.muted else ""
        poster_attr = f'poster="{el.thumbnail_url}"' if el.thumbnail_url else ""
        embed = (
            f'<div style="{wrapper_style}">'
            f'<video style="{iframe_style}" {controls_attr} {autoplay_attr} {loop_attr} {muted_attr} {poster_attr}>'
            f'<source src="{el.video_url}"></video></div>'
        )

    return f'<div id="{el.element_id}" class="{css_class}" style="{style}">{embed}</div>'


def render_button(el: Button) -> str:
    hover_bg = el.hover_bg_color or _darken_color(el.bg_color)
    btn_style = (
        f"display:inline-block;"
        f"background-color:{el.bg_color};"
        f"color:{el.text_color};"
        f"font-size:{el.font_size};"
        f"font-weight:{el.font_weight};"
        f"font-family:{el.font_family if el.font_family else 'inherit'};"
        f"border-radius:{el.border_radius};"
        f"padding:{el.padding_top} {el.padding_right} {el.padding_bottom} {el.padding_left};"
        f"text-decoration:none;cursor:pointer;border:none;"
        f"transition:background-color {el.hover_transition_duration}s ease;"
        f"{'width:100%;text-align:center;' if el.full_width else ''}"
    )
    wrapper_style = f"text-align:{el.alignment};"
    if el.full_width:
        wrapper_style += "display:block;"

    # Build href / onclick based on action
    href = "#"
    onclick = ""
    target = "_blank" if el.open_in_new_tab else "_self"

    if el.button_action == "url":
        href = el.action_url
    elif el.button_action == "phone":
        href = f"tel:{el.phone_number}"
    elif el.button_action == "sms":
        href = f"sms:{el.sms_number}{'?body=' + el.sms_body if el.sms_body else ''}"
    elif el.button_action == "email":
        href = f"mailto:{el.email_address}{'?subject=' + el.email_subject if el.email_subject else ''}"
    elif el.button_action == "open_popup":
        onclick = f"ghlOpenPopup('{el.popup_id}');return false;"
    elif el.button_action == "close_popup":
        onclick = "ghlClosePopup();return false;"
    elif el.button_action == "scroll_to_element":
        onclick = f"ghlScrollTo('{el.scroll_target_id}');return false;"
    elif el.button_action == "show_elements":
        ids = json.dumps(el.show_element_ids)
        onclick = f"ghlShowElements({ids});return false;"
    elif el.button_action == "hide_elements":
        ids = json.dumps(el.hide_element_ids)
        onclick = f"ghlHideElements({ids});return false;"
    elif el.button_action == "download_file":
        href = el.file_url
        target = "_blank"
    elif el.button_action == "custom_js":
        onclick = el.custom_js_code

    label_html = el.label
    if el.icon_left:
        label_html = f'<span style="margin-right:8px;">{el.icon_left}</span>{label_html}'
    if el.icon_right:
        label_html = f'{label_html}<span style="margin-left:8px;">{el.icon_right}</span>'
    if el.sub_text:
        label_html += f'<br><small style="font-weight:400;font-size:0.75em;opacity:0.85;">{el.sub_text}</small>'

    onclick_attr = f' onclick="{onclick}"' if onclick else ""
    css_class = f"ghl-button {el.custom_css_class}".strip()
    outer_style = css_from_base(el)

    return (
        f'<div id="{el.element_id}" class="{css_class}" style="{outer_style}{wrapper_style}">'
        f'<a href="{href}" target="{target}" style="{btn_style}"{onclick_attr}'
        f' onmouseover="this.style.backgroundColor=\'{hover_bg}\'"'
        f' onmouseout="this.style.backgroundColor=\'{el.bg_color}\'">'
        f'{label_html}</a></div>'
    )


def _darken_color(hex_color: str) -> str:
    """Darkens a hex color by ~15% for hover states."""
    try:
        hex_color = hex_color.lstrip("#")
        if len(hex_color) != 6:
            return hex_color
        r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
        r = max(0, int(r * 0.85))
        g = max(0, int(g * 0.85))
        b = max(0, int(b * 0.85))
        return f"#{r:02x}{g:02x}{b:02x}"
    except Exception:
        return hex_color


def render_divider(el: Divider) -> str:
    style = css_from_base(el, {"text-align": el.alignment})
    hr_style = (
        f"border:none;border-top:{el.line_thickness} {el.line_style} {el.line_color};"
        f"width:{el.line_width};margin:0 auto;"
    )
    css_class = f"ghl-divider {el.custom_css_class}".strip()
    return f'<div id="{el.element_id}" class="{css_class}" style="{style}"><hr style="{hr_style}"/></div>'


def render_spacer(el: Spacer) -> str:
    return (
        f'<div id="{el.element_id}" class="ghl-spacer" '
        f'style="height:{el.height};display:block;" '
        f'data-mobile-height="{el.height_mobile}"></div>'
    )


def render_custom_html(el: CustomHTML) -> str:
    return f'<div id="{el.element_id}" class="ghl-custom-html">{el.html_content}</div>'


def render_form(el: FormEmbed) -> str:
    fields_html = ""
    for f in el.fields:
        label_html = f'<label style="display:block;margin-bottom:4px;font-weight:600;font-size:14px;">{f.label}{"*" if f.required else ""}</label>'
        inp_style = "width:100%;padding:10px 14px;border:1px solid #ddd;border-radius:4px;font-size:16px;box-sizing:border-box;margin-bottom:16px;"

        if f.field_type == "textarea":
            inp = f'<textarea placeholder="{f.placeholder}" {"required" if f.required else ""} style="{inp_style}min-height:120px;resize:vertical;"></textarea>'
        elif f.field_type == "select":
            opts = "".join(f'<option value="{o}">{o}</option>' for o in f.options)
            inp = f'<select {"required" if f.required else ""} style="{inp_style}">{opts}</select>'
        elif f.field_type in ("radio", "checkbox"):
            inp = "".join(
                f'<label style="display:inline-flex;align-items:center;gap:6px;margin-right:16px;">'
                f'<input type="{f.field_type}" name="{f.field_name}" value="{o}"> {o}</label>'
                for o in f.options
            )
        elif f.field_type == "hidden":
            inp = f'<input type="hidden" name="{f.field_name}" value="{f.default_value}">'
            label_html = ""
        else:
            inp_type = {"email": "email", "phone": "tel", "date": "date"}.get(f.field_type, "text")
            inp = f'<input type="{inp_type}" placeholder="{f.placeholder}" {"required" if f.required else ""} style="{inp_style}">'

        width_style = "width:48%;display:inline-block;vertical-align:top;" if f.width == "half" else "width:100%;"
        fields_html += f'<div style="{width_style}">{label_html}{inp}</div>'

    btn_style = (
        f"background-color:{el.submit_button_color};color:{el.submit_button_text_color};"
        f"border:none;padding:14px 32px;font-size:18px;font-weight:700;border-radius:4px;"
        f"cursor:pointer;width:100%;margin-top:8px;"
    )
    form_style = css_from_base(el, {"background": "#f9f9f9", "padding": "32px", "border-radius": "8px"})
    css_class = f"ghl-form {el.custom_css_class}".strip()

    return (
        f'<div id="{el.element_id}" class="{css_class}" style="{form_style}">'
        f'<form onsubmit="return false;">'
        f'{fields_html}'
        f'<button type="submit" style="{btn_style}">{el.submit_button_label}</button>'
        f'</form></div>'
    )


def render_order_form(el: OrderForm) -> str:
    style = css_from_base(el)
    css_class = f"ghl-order-form {el.custom_css_class}".strip()
    tab_style = "padding:12px 24px;border:none;background:#eee;cursor:pointer;font-weight:600;font-size:14px;"
    active_tab = "background:#FF6B00;color:#fff;"
    inp_style = "width:100%;padding:10px 14px;border:1px solid #ddd;border-radius:4px;font-size:16px;box-sizing:border-box;margin-bottom:12px;"

    return f'''<div id="{el.element_id}" class="{css_class}" style="{style}border:1px solid #ddd;border-radius:8px;overflow:hidden;">
  <div style="display:flex;border-bottom:1px solid #ddd;">
    <button style="{tab_style}{active_tab}">{el.step_1_label}</button>
    <button style="{tab_style}">{el.step_2_label}</button>
  </div>
  <div style="padding:32px;">
    {"<div style='background:#f5f5f5;border-radius:6px;padding:16px;margin-bottom:24px;'><strong>Order Summary:</strong> " + el.product_name + " — " + el.product_price + "</div>" if el.show_order_summary else ""}
    <input type="text" placeholder="First Name" style="{inp_style}">
    <input type="text" placeholder="Last Name" style="{inp_style}">
    <input type="email" placeholder="Email Address" style="{inp_style}">
    <input type="tel" placeholder="Phone Number" style="{inp_style}">
    <button style="background:#FF6B00;color:#fff;border:none;padding:14px 32px;font-size:18px;font-weight:700;border-radius:4px;cursor:pointer;width:100%;">
      Continue to Payment &rarr;
    </button>
  </div>
</div>'''


def render_calendar(el: CalendarEmbed) -> str:
    style = css_from_base(el)
    css_class = f"ghl-calendar {el.custom_css_class}".strip()
    return (
        f'<div id="{el.element_id}" class="{css_class}" style="{style}">'
        f'<div style="background:#f5f5f5;border:2px dashed #ccc;border-radius:8px;padding:40px;text-align:center;">'
        f'<p style="font-size:18px;font-weight:600;color:#555;">📅 {el.calendar_name}</p>'
        f'<p style="color:#888;font-size:14px;">Calendar ID: {el.calendar_id or "Not set"}</p>'
        f'<p style="color:#aaa;font-size:12px;">HighLevel Calendar widget renders here at runtime.</p>'
        f'</div></div>'
    )


def render_image_slider(el: ImageSlider) -> str:
    style = css_from_base(el)
    css_class = f"ghl-slider {el.custom_css_class}".strip()
    slider_id = el.element_id

    slides_html = ""
    for i, slide in enumerate(el.slides):
        display = "block" if i == 0 else "none"
        img_html = f'<img src="{slide.image_url}" alt="{slide.alt_text}" style="width:100%;height:100%;object-fit:{el.image_fit};">'
        if slide.link_url:
            img_html = f'<a href="{slide.link_url}" target="{slide.link_target}">{img_html}</a>'
        caption_html = f'<div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);color:#fff;padding:12px;text-align:center;">{slide.caption}</div>' if slide.caption else ""
        slides_html += f'<div class="ghl-slide" style="display:{display};position:relative;">{img_html}{caption_html}</div>'

    ratio_map = {"16:9": "56.25%", "4:3": "75%", "1:1": "100%", "3:2": "66.67%"}
    pb = ratio_map.get(el.aspect_ratio, el.custom_height)
    container_style = f"position:relative;overflow:hidden;padding-bottom:{pb};" if "%" in pb else f"position:relative;overflow:hidden;height:{pb};"

    arrows_html = ""
    if el.show_arrows:
        arrow_style = "position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.5);color:#fff;border:none;padding:12px 16px;cursor:pointer;font-size:20px;z-index:10;"
        arrows_html = (
            f'<button onclick="ghlSliderPrev(\'{slider_id}\')" style="{arrow_style}left:0;">&#8249;</button>'
            f'<button onclick="ghlSliderNext(\'{slider_id}\')" style="{arrow_style}right:0;">&#8250;</button>'
        )

    dots_html = ""
    if el.show_pagination and el.slides:
        dots = "".join(
            f'<span onclick="ghlSliderGoto(\'{slider_id}\',{i})" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:{"#fff" if i==0 else "rgba(255,255,255,0.5)"};margin:0 4px;cursor:pointer;"></span>'
            for i in range(len(el.slides))
        )
        dots_html = f'<div style="position:absolute;bottom:12px;left:0;right:0;text-align:center;">{dots}</div>'

    autoplay_js = f"setInterval(function(){{ghlSliderNext('{slider_id}');}},{el.autoplay_speed});" if el.autoplay else ""

    return f'''<div id="{slider_id}" class="{css_class}" style="{style}">
  <div style="{container_style}">
    {slides_html}
    {arrows_html}
    {dots_html}
  </div>
  <script>
    (function(){{
      var slides = document.querySelectorAll("#{slider_id} .ghl-slide");
      var current = 0;
      window.ghlSliderNext = window.ghlSliderNext || function(id){{
        var s = document.querySelectorAll("#"+id+" .ghl-slide");
        if(!s.length) return;
        s[current].style.display="none";
        current = (current+1)%s.length;
        s[current].style.display="block";
      }};
      window.ghlSliderPrev = window.ghlSliderPrev || function(id){{
        var s = document.querySelectorAll("#"+id+" .ghl-slide");
        if(!s.length) return;
        s[current].style.display="none";
        current = (current-1+s.length)%s.length;
        s[current].style.display="block";
      }};
      window.ghlSliderGoto = window.ghlSliderGoto || function(id,i){{
        var s = document.querySelectorAll("#"+id+" .ghl-slide");
        if(!s.length) return;
        s[current].style.display="none";
        current=i; s[current].style.display="block";
      }};
      {autoplay_js}
    }})();
  </script>
</div>'''


def render_countdown_timer(el: CountdownTimer) -> str:
    style = css_from_base(el)
    css_class = f"ghl-countdown {el.custom_css_class}".strip()
    timer_id = el.element_id

    unit_style = (
        f"display:inline-block;text-align:center;min-width:80px;padding:16px;"
        f"background:{el.bg_color};margin:0 4px;border-radius:8px;"
    )
    num_style = f"display:block;font-size:{el.number_font_size};font-weight:700;color:{el.number_color};line-height:1;"
    lbl_style = f"display:block;font-size:{el.label_font_size};color:{el.label_color};margin-top:4px;"

    units = []
    if el.show_days:    units.append(("days",    el.label_days))
    if el.show_hours:   units.append(("hours",   el.label_hours))
    if el.show_minutes: units.append(("minutes", el.label_minutes))
    if el.show_seconds: units.append(("seconds", el.label_seconds))

    units_html = ""
    for key, lbl in units:
        units_html += (
            f'<span style="{unit_style}">'
            f'<span id="{timer_id}-{key}" style="{num_style}">00</span>'
            f'<span style="{lbl_style}">{lbl}</span>'
            f'</span>'
        )
        if key != units[-1][0] and el.separator_char:
            units_html += f'<span style="font-size:{el.number_font_size};font-weight:700;color:{el.number_color};vertical-align:top;padding-top:16px;">{el.separator_char}</span>'

    end_date_js = f'new Date("{el.end_date}T{el.end_time}:00").getTime()'

    return f'''<div id="{timer_id}" class="{css_class}" style="{style}text-align:center;">
  <div style="display:inline-flex;align-items:flex-start;flex-wrap:wrap;justify-content:center;">
    {units_html}
  </div>
  <script>
    (function(){{
      var end = {end_date_js};
      function pad(n){{ return n<10?"0"+n:n; }}
      function tick(){{
        var now = new Date().getTime();
        var diff = Math.max(0, end - now);
        var d = Math.floor(diff/86400000);
        var h = Math.floor((diff%86400000)/3600000);
        var m = Math.floor((diff%3600000)/60000);
        var s = Math.floor((diff%60000)/1000);
        var el_d = document.getElementById("{timer_id}-days");
        var el_h = document.getElementById("{timer_id}-hours");
        var el_m = document.getElementById("{timer_id}-minutes");
        var el_s = document.getElementById("{timer_id}-seconds");
        if(el_d) el_d.textContent = pad(d);
        if(el_h) el_h.textContent = pad(h);
        if(el_m) el_m.textContent = pad(m);
        if(el_s) el_s.textContent = pad(s);
        if(diff <= 0 && "{el.expire_action}" === "redirect_url" && "{el.expire_redirect_url}") {{
          window.location.href = "{el.expire_redirect_url}";
        }}
      }}
      tick();
      setInterval(tick, 1000);
    }})();
  </script>
</div>'''


def render_pricing_table(el: PricingTable) -> str:
    style = css_from_base(el)
    css_class = f"ghl-pricing-table {el.custom_css_class}".strip()
    col_width = f"{100/max(el.columns,1):.2f}%"

    plans_html = ""
    for i, plan in enumerate(el.plans):
        is_highlight = plan.is_highlighted or (i == el.highlight_plan_index)
        card_style = (
            f"flex:0 0 {col_width};max-width:{col_width};box-sizing:border-box;"
            f"border:2px solid {'#FF6B00' if is_highlight else '#ddd'};"
            f"border-radius:8px;padding:32px 24px;text-align:center;position:relative;"
            f"background:{'#fff8f5' if is_highlight else '#fff'};"
            f"{'box-shadow:0 8px 32px rgba(255,107,0,0.15);transform:scale(1.03);' if is_highlight else ''}"
        )
        ribbon_html = ""
        if plan.ribbon_text:
            ribbon_html = (
                f'<div style="position:absolute;top:-1px;right:16px;background:{plan.ribbon_color};'
                f'color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:0 0 6px 6px;">'
                f'{plan.ribbon_text}</div>'
            )
        features_html = "".join(
            f'<li style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:15px;">&#10003; {feat}</li>'
            for feat in plan.features
        )
        btn_style = (
            f"display:inline-block;background:{plan.button_color};color:#fff;"
            f"padding:12px 28px;border-radius:4px;text-decoration:none;font-weight:700;margin-top:24px;"
        )
        plans_html += f'''<div style="{card_style}">
  {ribbon_html}
  <h3 style="font-size:22px;font-weight:700;margin:0 0 8px;">{plan.plan_name}</h3>
  <p style="color:#888;font-size:14px;margin:0 0 16px;">{plan.description}</p>
  <div style="font-size:48px;font-weight:800;color:{'#FF6B00' if is_highlight else '#000'};">{plan.plan_price}</div>
  <div style="color:#888;font-size:14px;margin-bottom:24px;">{plan.price_period}</div>
  <ul style="list-style:none;padding:0;margin:0;text-align:left;">{features_html}</ul>
  <a href="{plan.button_url}" style="{btn_style}">{plan.button_label}</a>
</div>'''

    return (
        f'<div id="{el.element_id}" class="{css_class}" style="{style}">'
        f'<div style="display:flex;flex-wrap:wrap;gap:24px;justify-content:center;">'
        f'{plans_html}</div></div>'
    )


def render_testimonials(el: Testimonials) -> str:
    style = css_from_base(el)
    css_class = f"ghl-testimonials {el.custom_css_class}".strip()
    col_width = f"{100/max(el.columns,1):.2f}%"

    cards_html = ""
    for t in el.testimonials:
        stars_html = ""
        if t.show_stars:
            stars = "".join(
                f'<span style="color:{t.star_color if i < t.star_rating else "#ddd"};">&#9733;</span>'
                for i in range(5)
            )
            stars_html = f'<div style="margin-bottom:12px;">{stars}</div>'

        avatar_html = ""
        if t.author_avatar_url:
            avatar_html = f'<img src="{t.author_avatar_url}" alt="{t.author_name}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;margin-right:12px;">'

        card_style = (
            f"flex:0 0 {col_width};max-width:{col_width};box-sizing:border-box;"
            f"background:{t.bg_color};color:{t.text_color};"
            f"border-radius:8px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,0.08);"
        )
        cards_html += f'''<div style="{card_style}">
  {stars_html}
  <p style="font-size:16px;line-height:1.6;margin:0 0 20px;font-style:italic;">&ldquo;{t.quote}&rdquo;</p>
  <div style="display:flex;align-items:center;">
    {avatar_html}
    <div>
      <strong style="display:block;font-size:15px;">{t.author_name}</strong>
      <span style="font-size:13px;color:#888;">{t.author_title}</span>
    </div>
  </div>
</div>'''

    return (
        f'<div id="{el.element_id}" class="{css_class}" style="{style}">'
        f'<div style="display:flex;flex-wrap:wrap;gap:24px;">{cards_html}</div></div>'
    )


def render_social_icons(el: SocialIcons) -> str:
    style = css_from_base(el, {"text-align": el.alignment})
    css_class = f"ghl-social-icons {el.custom_css_class}".strip()

    icons_html = ""
    for icon in el.icons:
        color = SOCIAL_COLORS.get(icon.platform, "#888") if el.icon_color == "brand" else el.icon_color
        label = icon.platform.capitalize()
        char = SOCIAL_ICONS_SVG.get(icon.platform, "?")

        shape_radius = {"circle": "50%", "square": "0", "rounded_square": "8px", "none": "0"}.get(el.icon_shape, "50%")
        icon_box_style = (
            f"display:inline-flex;align-items:center;justify-content:center;"
            f"width:{el.icon_size};height:{el.icon_size};"
            f"background:{'transparent' if el.icon_bg_color == 'transparent' else el.icon_bg_color};"
            f"background-color:{color if el.icon_style == 'filled' else 'transparent'};"
            f"color:{'#fff' if el.icon_style == 'filled' else color};"
            f"border-radius:{shape_radius};"
            f"{'border:2px solid ' + color + ';' if el.icon_style == 'outline' else ''}"
            f"font-weight:700;font-size:14px;text-decoration:none;"
        )
        target = "_blank" if icon.open_in_new_tab else "_self"
        content = char
        if el.display_type == "text_only":
            content = label
        elif el.display_type == "icon_and_text":
            content = f"{char} {label}"

        icons_html += f'<a href="{icon.url}" target="{target}" title="{label}" style="{icon_box_style}margin:{el.gap};">{content}</a>'

    return f'<div id="{el.element_id}" class="{css_class}" style="{style}">{icons_html}</div>'


def render_number_counter(el: NumberCounter) -> str:
    style = css_from_base(el)
    css_class = f"ghl-counter {el.custom_css_class}".strip()
    col_width = f"{100/max(el.columns,1):.2f}%"

    counters_html = ""
    for i, c in enumerate(el.counters):
        counter_id = f"{el.element_id}-counter-{i}"
        icon_html = f'<img src="{c.icon_url}" style="height:40px;margin-bottom:12px;">' if c.icon_url else ""
        counters_html += f'''<div style="flex:0 0 {col_width};max-width:{col_width};box-sizing:border-box;text-align:center;padding:16px;">
  {icon_html}
  <div id="{counter_id}" style="font-size:{c.number_font_size};font-weight:800;color:{c.number_color};">{c.prefix}{int(c.start_value)}{c.suffix}</div>
  <div style="font-size:{c.label_font_size};color:{c.label_color};margin-top:8px;">{c.label}</div>
</div>
<script>
(function(){{
  var start={c.start_value}, end={c.end_value}, dur={el.animation_duration*1000};
  var el=document.getElementById("{counter_id}");
  if(!el) return;
  var startTime=null;
  function step(ts){{
    if(!startTime) startTime=ts;
    var prog=Math.min((ts-startTime)/dur,1);
    var val=start+(end-start)*prog;
    el.textContent="{c.prefix}"+val.toFixed({c.decimal_places})+"{c.suffix}";
    if(prog<1) requestAnimationFrame(step);
  }}
  if({str(el.animate_on_scroll).lower()}){{
    var obs=new IntersectionObserver(function(entries){{
      entries.forEach(function(e){{ if(e.isIntersecting) requestAnimationFrame(step); }});
    }});
    obs.observe(el);
  }} else {{ requestAnimationFrame(step); }}
}})();
</script>'''

    return (
        f'<div id="{el.element_id}" class="{css_class}" style="{style}">'
        f'<div style="display:flex;flex-wrap:wrap;">{counters_html}</div></div>'
    )


def render_logo_showcase(el: LogoShowcase) -> str:
    style = css_from_base(el)
    css_class = f"ghl-logo-showcase {el.custom_css_class}".strip()

    logos_html = "".join(
        f'<div style="display:inline-block;padding:0 {el.logo_spacing};flex-shrink:0;">'
        f'<img src="{logo.image_url}" alt="{logo.alt_text}" style="height:{el.logo_height};{"filter:grayscale(100%);" if el.grayscale else ""}object-fit:contain;">'
        f'</div>'
        for logo in el.logos
    )

    if el.mode == "ticker":
        ticker_id = el.element_id + "-track"
        speed = (11 - el.scroll_speed) * 5  # invert: speed 10 = 5s, speed 1 = 50s
        return f'''<div id="{el.element_id}" class="{css_class}" style="{style}overflow:hidden;">
  <div id="{ticker_id}" style="display:flex;width:max-content;animation:ghl-ticker {speed}s linear infinite;">
    {logos_html}{logos_html}
  </div>
</div>'''
    else:
        return (
            f'<div id="{el.element_id}" class="{css_class}" style="{style}">'
            f'<div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;">'
            f'{logos_html}</div></div>'
        )


def render_photo_gallery(el: PhotoGallery) -> str:
    style = css_from_base(el)
    css_class = f"ghl-gallery {el.custom_css_class}".strip()
    col_width = f"{100/max(el.columns,1):.2f}%"

    heading_html = f'<h3 style="text-align:center;margin-bottom:24px;">{el.heading}</h3>' if el.heading else ""

    images_html = ""
    for img in el.images:
        lazy = 'loading="lazy"' if el.lazy_load else ""
        img_style = f"width:100%;height:200px;object-fit:cover;display:block;border-radius:4px;"
        img_tag = f'<img src="{img.image_url}" alt="{img.alt_text}" style="{img_style}" {lazy}>'

        if el.lightbox_enabled and img.click_action == "lightbox":
            img_tag = f'<a href="{img.image_url}" target="_blank" style="display:block;">{img_tag}</a>'
        elif img.click_action == "url" and img.click_url:
            target = "_blank" if img.open_in_new_tab else "_self"
            img_tag = f'<a href="{img.click_url}" target="{target}" style="display:block;">{img_tag}</a>'

        caption_html = f'<p style="font-size:13px;color:#666;margin:6px 0 0;text-align:center;">{img.caption}</p>' if img.caption else ""
        images_html += f'<div style="flex:0 0 {col_width};max-width:{col_width};box-sizing:border-box;padding:{el.spacing};">{img_tag}{caption_html}</div>'

    return (
        f'<div id="{el.element_id}" class="{css_class}" style="{style}">'
        f'{heading_html}'
        f'<div style="display:flex;flex-wrap:wrap;margin:-{el.spacing};">{images_html}</div></div>'
    )


def render_faq_accordion(el: FAQAccordion) -> str:
    style = css_from_base(el)
    css_class = f"ghl-faq {el.custom_css_class}".strip()
    accordion_id = el.element_id

    icon_map = {"plus_minus": ("+", "−"), "chevron": ("›", "‹"), "arrow": ("▼", "▲"), "none": ("", "")}
    icon_open, icon_close = icon_map.get(el.icon_type, ("+", "−"))

    items_html = ""
    for i, item in enumerate(el.items):
        is_open = item.is_open or (i == el.default_open_index)
        item_id = f"{accordion_id}-item-{i}"
        header_style = (
            f"background:{el.header_bg_color};color:{el.header_text_color};"
            f"font-size:{el.header_font_size};padding:16px 20px;"
            f"cursor:pointer;display:flex;justify-content:space-between;align-items:center;"
            f"border-bottom:1px solid {el.border_color};"
        )
        content_style = (
            f"background:{el.content_bg_color};color:{el.content_text_color};"
            f"font-size:{el.content_font_size};padding:{'16px 20px' if is_open else '0 20px'};"
            f"max-height:{'1000px' if is_open else '0'};overflow:hidden;"
            f"transition:max-height 0.3s ease,padding 0.3s ease;"
        )
        icon_pos = "right" if el.icon_position == "right" else "left"
        icon_html = f'<span id="{item_id}-icon" style="font-size:20px;font-weight:300;">{"−" if is_open else "+"}</span>'
        header_content = f'{icon_html}<span>{item.question}</span>' if icon_pos == "left" else f'<span>{item.question}</span>{icon_html}'

        items_html += f'''<div style="border:1px solid {el.border_color};border-radius:4px;margin-bottom:8px;overflow:hidden;">
  <div style="{header_style}" onclick="ghlToggleFAQ('{item_id}')">
    {header_content}
  </div>
  <div id="{item_id}-content" style="{content_style}">{item.answer}</div>
</div>'''

    return f'''<div id="{accordion_id}" class="{css_class}" style="{style}">
  {items_html}
  <script>
  window.ghlToggleFAQ = window.ghlToggleFAQ || function(id){{
    var content = document.getElementById(id+"-content");
    var icon = document.getElementById(id+"-icon");
    if(!content) return;
    var isOpen = content.style.maxHeight !== "0px" && content.style.maxHeight !== "";
    content.style.maxHeight = isOpen ? "0" : "1000px";
    content.style.padding = isOpen ? "0 20px" : "16px 20px";
    if(icon) icon.textContent = isOpen ? "+" : "−";
  }};
  </script>
</div>'''


def render_progress_bar(el: ProgressBar) -> str:
    style = css_from_base(el)
    css_class = f"ghl-progress {el.custom_css_class}".strip()
    bar_id = el.element_id + "-bar"

    pct_span = f'<span style="font-size:{el.label_font_size};color:{el.label_color};">{el.value}%</span>' if el.show_percentage else ''
    label_html = f'<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="font-size:{el.label_font_size};color:{el.label_color};font-weight:600;">{el.label}</span>{pct_span}</div>'

    return f'''<div id="{el.element_id}" class="{css_class}" style="{style}">
  {label_html}
  <div style="background:{el.track_color};border-radius:{el.bar_radius};height:{el.bar_height};overflow:hidden;">
    <div id="{bar_id}" style="height:100%;width:0%;background:{el.bar_color};border-radius:{el.bar_radius};transition:width {el.animation_duration}s ease;"></div>
  </div>
  <script>
  (function(){{
    var bar = document.getElementById("{bar_id}");
    if(!bar) return;
    function animate(){{ bar.style.width = "{el.value}%"; }}
    if({str(el.animate_on_scroll).lower()}){{
      var obs = new IntersectionObserver(function(e){{ e.forEach(function(x){{ if(x.isIntersecting) animate(); }}); }});
      obs.observe(bar);
    }} else {{ setTimeout(animate, 100); }}
  }})();
  </script>
</div>'''


def render_map(el: MapEmbed) -> str:
    style = css_from_base(el)
    css_class = f"ghl-map {el.custom_css_class}".strip()
    encoded = el.address.replace(" ", "+")
    src = f"https://maps.google.com/maps?q={encoded}&z={el.zoom_level}&output=embed"
    return (
        f'<div id="{el.element_id}" class="{css_class}" style="{style}">'
        f'<iframe src="{src}" width="{el.map_width}" height="{el.map_height}" '
        f'style="border:0;display:block;" allowfullscreen loading="lazy"></iframe></div>'
    )


def render_navigation(el: NavigationMenu) -> str:
    nav_style = (
        f"background:{el.nav_bg_color};padding:0 20px;"
        f"{'position:sticky;top:0;z-index:1000;' if el.sticky else ''}"
    )
    logo_html = ""
    if el.logo_url:
        logo_html = f'<a href="{el.logo_link_url}"><img src="{el.logo_url}" alt="{el.logo_alt_text}" style="height:50px;width:{el.logo_width};object-fit:contain;"></a>'
    else:
        logo_html = f'<a href="{el.logo_link_url}" style="font-size:22px;font-weight:800;color:{el.text_color};text-decoration:none;">{el.logo_alt_text or "Logo"}</a>'

    items_html = ""
    for item in el.menu_items:
        if item.is_button:
            items_html += f'<a href="{item.url}" style="background:{item.button_color};color:#fff;padding:8px 20px;border-radius:4px;text-decoration:none;font-weight:700;margin-left:8px;">{item.label}</a>'
        else:
            items_html += f'<a href="{item.url}" style="color:{el.text_color};text-decoration:none;font-size:{el.font_size};font-weight:{el.font_weight};padding:0 16px;line-height:70px;">{item.label}</a>'

    return f'''<nav id="{el.element_id}" class="ghl-nav" style="{nav_style}">
  <div style="max-width:1170px;margin:0 auto;display:flex;justify-content:{el.alignment.replace("_","-")};align-items:center;height:70px;">
    {logo_html}
    <div class="ghl-nav-items" style="display:flex;align-items:center;">{items_html}</div>
  </div>
</nav>'''


# ==============================================================================
# SECTION 4 — PAGE BUILDER ENGINE
# Walks the FunnelPage tree and assembles the final HTML document
# ==============================================================================

# Map element types to their render functions
ELEMENT_RENDERERS = {
    Headline:       render_headline,
    Paragraph:      render_paragraph,
    RichText:       render_rich_text,
    BulletList:     render_bullet_list,
    Image:          render_image,
    Video:          render_video,
    Button:         render_button,
    Divider:        render_divider,
    Spacer:         render_spacer,
    CustomHTML:     render_custom_html,
    FormEmbed:      render_form,
    OrderForm:      render_order_form,
    CalendarEmbed:  render_calendar,
    ImageSlider:    render_image_slider,
    CountdownTimer: render_countdown_timer,
    PricingTable:   render_pricing_table,
    Testimonials:   render_testimonials,
    SocialIcons:    render_social_icons,
    NumberCounter:  render_number_counter,
    LogoShowcase:   render_logo_showcase,
    PhotoGallery:   render_photo_gallery,
    FAQAccordion:   render_faq_accordion,
    ProgressBar:    render_progress_bar,
    MapEmbed:       render_map,
    NavigationMenu: render_navigation,
}


def render_element(el) -> str:
    """Dispatches to the correct renderer based on element type."""
    renderer = ELEMENT_RENDERERS.get(type(el))
    if renderer:
        return renderer(el)
    return f'<!-- Unknown element type: {type(el).__name__} -->'


def render_column(col: Column) -> str:
    bg_css = css_from_background(col.background)
    base_css = css_from_base(col)
    style = (
        f"flex:0 0 {col.width_percent:.4f}%;max-width:{col.width_percent:.4f}%;"
        f"box-sizing:border-box;"
        f"vertical-align:{col.vertical_align};"
        f"{bg_css} {base_css}"
    )
    css_class = f"ghl-column {col.custom_css_class}".strip()
    elements_html = "\n".join(render_element(el) for el in col.elements)
    return f'<div id="{col.element_id}" class="{css_class}" style="{style}">{elements_html}</div>'


def render_row(row: Row) -> str:
    bg_css = css_from_background(row.background)
    base_css = css_from_base(row)
    style = f"display:flex;flex-wrap:wrap;{bg_css} {base_css}"
    css_class = f"ghl-row {row.custom_css_class}".strip()
    columns_html = "\n".join(render_column(col) for col in row.columns)
    return f'<div id="{row.element_id}" class="{css_class}" style="{style}">{columns_html}</div>'


def render_section(section: Section) -> str:
    bg_css = css_from_background(section.background)
    base_css = css_from_base(section)
    outer_style = (
        f"width:100%;box-sizing:border-box;"
        f"{'position:sticky;top:0;z-index:100;' if section.sticky else ''}"
        f"overflow:{section.overflow};"
        f"z-index:{section.z_index};"
        f"{bg_css} {base_css}"
    )
    if section.background.bg_type == "video" and section.background.video_url:
        video_overlay = ""
        if section.background.video_overlay_opacity > 0:
            video_overlay = (
                f'<div style="position:absolute;top:0;left:0;right:0;bottom:0;'
                f'background:{section.background.video_overlay_color};'
                f'opacity:{section.background.video_overlay_opacity};z-index:1;"></div>'
            )
        outer_style += "position:relative;"

    inner_style = (
        f"max-width:{section.content_max_width}px;margin:0 auto;"
        f"{'min-height:' + section.min_height + ';' if section.min_height != 'auto' else ''}"
        f"column-gap:{section.column_gap}px;row-gap:{section.row_gap}px;"
    )
    if section.full_width:
        inner_style = inner_style.replace(f"max-width:{section.content_max_width}px;", "max-width:100%;")

    css_class = f"ghl-section {section.custom_css_class}".strip()
    rows_html = "\n".join(render_row(row) for row in section.rows)

    return (
        f'<section id="{section.element_id}" class="{css_class}" style="{outer_style}">'
        f'<div style="{inner_style}">{rows_html}</div>'
        f'</section>'
    )


def render_popup(popup: Popup) -> str:
    """Renders a popup as a hidden overlay div."""
    overlay_style = (
        f"display:none;position:fixed;top:0;left:0;right:0;bottom:0;"
        f"background:{popup.overlay_color};z-index:9999;"
        f"justify-content:center;align-items:center;"
    )
    modal_style = (
        f"background:{popup.bg_color};border-radius:{popup.border_radius};"
        f"width:{popup.width};max-width:{popup.max_width};"
        f"position:relative;overflow:auto;max-height:90vh;"
    )
    close_btn = ""
    if popup.show_close_button:
        close_btn = (
            '<button onclick="ghlClosePopup()" '
            'style="position:absolute;top:12px;right:16px;background:none;border:none;'
            'font-size:24px;cursor:pointer;color:#666;z-index:10;">&#10005;</button>'
        )
    sections_html = "\n".join(render_section(s) for s in popup.sections)

    trigger_js = ""
    if popup.trigger_type == "time_delay":
        trigger_js = f'setTimeout(function(){{ghlOpenPopup("{popup.popup_id}");}},{popup.trigger_delay_seconds*1000});'
    elif popup.trigger_type == "exit_intent":
        trigger_js = (
            f'document.addEventListener("mouseleave",function(e){{'
            f'if(e.clientY<0)ghlOpenPopup("{popup.popup_id}");'
            f'}},{{once:true}});'
        )
    elif popup.trigger_type == "scroll_percent":
        trigger_js = (
            f'window.addEventListener("scroll",function(){{'
            f'var pct=(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100;'
            f'if(pct>={popup.trigger_scroll_percent})ghlOpenPopup("{popup.popup_id}");'
            f'}},{{once:true}});'
        )

    overlay_click = f'if(event.target===this)ghlClosePopup();' if popup.close_on_overlay_click else ""

    return f'''<div id="{popup.popup_id}" style="{overlay_style}" onclick="{overlay_click}">
  <div style="{modal_style}">
    {close_btn}
    {sections_html}
  </div>
</div>
<script>
  window.ghlOpenPopup = function(id){{
    var el=document.getElementById(id);
    if(el){{el.style.display="flex";}}
  }};
  window.ghlClosePopup = function(){{
    document.querySelectorAll('[id^="popup_"]').forEach(function(el){{el.style.display="none";}});
  }};
  {trigger_js}
</script>'''


def build_global_css(settings: PageSettings) -> str:
    """Generates the global CSS block from PageSettings / Brand Board."""
    return f"""
<style>
  /* ── HighLevel Page Builder — Global Styles ── */
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}

  body {{
    font-family: {settings.body_font_family};
    font-size: {settings.body_font_size};
    color: {settings.text_color};
    background-color: {settings.page_background_color};
    line-height: 1.6;
  }}

  h1, h2, h3, h4, h5, h6 {{
    font-family: {settings.heading_font_family};
    color: {settings.heading_color};
  }}
  h1 {{ font-size: {settings.heading_font_size_h1}; }}
  h2 {{ font-size: {settings.heading_font_size_h2}; }}
  h3 {{ font-size: {settings.heading_font_size_h3}; }}

  a {{ color: {settings.link_color}; }}

  .ghl-button a:hover {{ opacity: 0.9; }}

  /* ── Animations ── */
  @keyframes ghl-fade-in        {{ from {{ opacity:0; }} to {{ opacity:1; }} }}
  @keyframes ghl-fade-in-up     {{ from {{ opacity:0; transform:translateY(30px); }} to {{ opacity:1; transform:translateY(0); }} }}
  @keyframes ghl-fade-in-down   {{ from {{ opacity:0; transform:translateY(-30px); }} to {{ opacity:1; transform:translateY(0); }} }}
  @keyframes ghl-fade-in-left   {{ from {{ opacity:0; transform:translateX(30px); }} to {{ opacity:1; transform:translateX(0); }} }}
  @keyframes ghl-fade-in-right  {{ from {{ opacity:0; transform:translateX(-30px); }} to {{ opacity:1; transform:translateX(0); }} }}
  @keyframes ghl-slide-in-up    {{ from {{ transform:translateY(100%); }} to {{ transform:translateY(0); }} }}
  @keyframes ghl-zoom-in        {{ from {{ opacity:0; transform:scale(0.8); }} to {{ opacity:1; transform:scale(1); }} }}
  @keyframes ghl-zoom-in-up     {{ from {{ opacity:0; transform:scale(0.8) translateY(30px); }} to {{ opacity:1; transform:scale(1) translateY(0); }} }}
  @keyframes ghl-bounce-in      {{ 0%{{opacity:0;transform:scale(0.3);}} 50%{{opacity:1;transform:scale(1.05);}} 70%{{transform:scale(0.9);}} 100%{{transform:scale(1);}} }}
  @keyframes ghl-flip-in-x      {{ from {{ opacity:0; transform:rotateX(90deg); }} to {{ opacity:1; transform:rotateX(0); }} }}
  @keyframes ghl-rotate-in      {{ from {{ opacity:0; transform:rotate(-200deg); }} to {{ opacity:1; transform:rotate(0); }} }}
  @keyframes ghl-pulse           {{ 0%,100%{{transform:scale(1);}} 50%{{transform:scale(1.05);}} }}
  @keyframes ghl-shake           {{ 0%,100%{{transform:translateX(0);}} 25%{{transform:translateX(-8px);}} 75%{{transform:translateX(8px);}} }}
  @keyframes ghl-heartbeat       {{ 0%,100%{{transform:scale(1);}} 14%{{transform:scale(1.3);}} 28%{{transform:scale(1);}} 42%{{transform:scale(1.3);}} 70%{{transform:scale(1);}} }}
  @keyframes ghl-ticker          {{ from {{ transform:translateX(0); }} to {{ transform:translateX(-50%); }} }}

  /* ── Responsive ── */
  @media (max-width: 768px) {{
    .ghl-column {{ flex: 0 0 100% !important; max-width: 100% !important; }}
    h1 {{ font-size: calc({settings.heading_font_size_h1} * 0.7) !important; }}
    h2 {{ font-size: calc({settings.heading_font_size_h2} * 0.75) !important; }}
    .ghl-nav-items {{ display: none; }}
  }}
</style>"""


def build_head(settings: PageSettings) -> str:
    """Generates the full <head> block from PageSettings."""
    meta_tags = ""
    for mt in settings.custom_meta_tags:
        meta_tags += f'<meta name="{mt.get("name","")}" content="{mt.get("content","")}">\n'

    og_tags = ""
    if settings.og_title:
        og_tags += f'<meta property="og:title" content="{settings.og_title}">\n'
    if settings.og_description:
        og_tags += f'<meta property="og:description" content="{settings.og_description}">\n'
    if settings.og_image_url:
        og_tags += f'<meta property="og:image" content="{settings.og_image_url}">\n'

    canonical = f'<link rel="canonical" href="{settings.canonical_url}">' if settings.canonical_url else ""
    favicon = f'<link rel="icon" href="{settings.favicon_url}">' if settings.favicon_url else ""
    robots = f'<meta name="robots" content="{settings.robots_meta}">' if settings.robots_meta else ""
    author = f'<meta name="author" content="{settings.author}">' if settings.author else ""

    google_fonts = (
        '<link rel="preconnect" href="https://fonts.googleapis.com">'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">'
    )

    return f"""<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{settings.seo_title}</title>
  <meta name="description" content="{settings.seo_description}">
  <meta name="keywords" content="{settings.seo_keywords}">
  {author}
  {robots}
  {og_tags}
  {canonical}
  {favicon}
  {meta_tags}
  {google_fonts}
  {build_global_css(settings)}
  {settings.head_tracking_code}
</head>"""


def build_interactive_js() -> str:
    """Returns the shared HighLevel interactive behavior JavaScript."""
    return """
<script>
  /* ── HighLevel Interactive Behaviors ── */

  /* Scroll to element */
  window.ghlScrollTo = function(selector) {
    var el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* Show elements */
  window.ghlShowElements = function(ids) {
    ids.forEach(function(id) {
      var el = document.getElementById(id) || document.querySelector(id);
      if (el) el.style.display = '';
    });
  };

  /* Hide elements */
  window.ghlHideElements = function(ids) {
    ids.forEach(function(id) {
      var el = document.getElementById(id) || document.querySelector(id);
      if (el) el.style.display = 'none';
    });
  };

  /* Popup open/close (also defined inline per popup, kept here as fallback) */
  window.ghlOpenPopup = window.ghlOpenPopup || function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  };
  window.ghlClosePopup = window.ghlClosePopup || function() {
    document.querySelectorAll('[id^="popup_"]').forEach(function(el) {
      el.style.display = 'none';
    });
  };

  /* Slider controls (also defined inline per slider, kept here as fallback) */
  window.ghlSliderNext = window.ghlSliderNext || function(id) {};
  window.ghlSliderPrev = window.ghlSliderPrev || function(id) {};
  window.ghlSliderGoto = window.ghlSliderGoto || function(id, i) {};

  /* FAQ toggle (also defined inline per accordion) */
  window.ghlToggleFAQ = window.ghlToggleFAQ || function(id) {};

  /* Mobile nav toggle */
  window.ghlToggleNav = function() {
    var nav = document.querySelector('.ghl-nav-items');
    if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  };
</script>"""


class PageBuilder:
    """
    Main engine that takes a FunnelPage object and renders it to HTML.

    Usage:
        page = FunnelPage(settings=..., sections=[...], popups=[...])
        builder = PageBuilder(page)
        html = builder.render()
        builder.save("funnel_page.html")
    """

    def __init__(self, page: FunnelPage):
        self.page = page

    def render(self) -> str:
        s = self.page.settings
        head = build_head(s)
        sections_html = "\n".join(render_section(sec) for sec in self.page.sections)
        popups_html = "\n".join(render_popup(p) for p in self.page.popups)
        interactive_js = build_interactive_js()

        return f"""<!DOCTYPE html>
<html lang="{s.lang_attribute}">
{head}
<body>
{sections_html}
{popups_html}
{interactive_js}
{s.body_tracking_code}
</body>
</html>"""

    def save(self, output_path: str = "funnel_page.html") -> str:
        html = self.render()
        Path(output_path).write_text(html, encoding="utf-8")
        print(f"[PageBuilder] Saved to: {output_path}")
        return output_path


# ==============================================================================
# SECTION 5 — DEMO FUNNEL PAGE
# A complete, real-world funnel page using every major element type.
# Modify this section to build your own pages.
# ==============================================================================

import json  # needed for show/hide element IDs in button renderer


def build_demo_funnel() -> FunnelPage:
    """
    Builds a complete demo funnel page: a coaching / course sales funnel.
    Demonstrates every major element type and property in the schema.
    """

    # ── Page Settings & Brand Board ──────────────────────────────────────────
    settings = PageSettings(
        seo_title="Transform Your Business in 90 Days | Free Masterclass",
        seo_description="Join 10,000+ entrepreneurs who've scaled their business with our proven system. Register for the free live masterclass now.",
        seo_keywords="business coaching, online course, masterclass, entrepreneur",
        og_title="Free Masterclass: Scale Your Business in 90 Days",
        og_description="Join 10,000+ entrepreneurs. Register now — limited spots available.",
        og_image_url="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop",
        lang_attribute="en",
        page_background_color="#ffffff",
        body_font_family="'Inter', sans-serif",
        heading_font_family="'Inter', sans-serif",
        primary_color="#FF6B00",
        secondary_color="#1A1A2E",
        text_color="#333333",
        heading_color="#1A1A2E",
        link_color="#FF6B00",
        heading_font_size_h1="52px",
        heading_font_size_h2="38px",
        heading_font_size_h3="26px",
        button_color="#FF6B00",
        button_text_color="#ffffff",
        button_border_radius="6px",
    )

    # ── POPUP: Exit Intent Lead Magnet ───────────────────────────────────────
    exit_popup = Popup(
        popup_id="popup_exit_intent",
        trigger_type="exit_intent",
        show_once_per_session=True,
        overlay_color="rgba(0,0,0,0.75)",
        close_on_overlay_click=True,
        show_close_button=True,
        position="center",
        width="560px",
        bg_color="#ffffff",
        border_radius="12px",
        animation_in="zoom_in",
        sections=[
            Section(
                padding_top="40px", padding_right="40px",
                padding_bottom="40px", padding_left="40px",
                rows=[Row(columns=[Column(elements=[
                    Headline(
                        text="Wait! Don't Leave Empty-Handed",
                        heading_tag="h3",
                        font_size="26px",
                        text_align="center",
                        font_color="#1A1A2E",
                    ),
                    Paragraph(
                        text="Download our free <strong>90-Day Business Blueprint</strong> — the exact roadmap our students use to hit $10K/month.",
                        text_align="center",
                        padding_top="12px",
                        padding_bottom="20px",
                    ),
                    FormEmbed(
                        fields=[
                            FormField(field_type="email", label="Email Address", placeholder="Enter your best email", required=True),
                        ],
                        submit_button_label="Send Me the Blueprint →",
                        submit_button_color="#FF6B00",
                        redirect_type="same_page",
                        inline_message="Check your inbox! Your blueprint is on the way.",
                        padding_top="0px", padding_right="0px",
                        padding_bottom="0px", padding_left="0px",
                    ),
                ])])]
            )
        ]
    )

    # ── SECTION 1: Navigation Bar ────────────────────────────────────────────
    nav_section = Section(
        padding_top="0px", padding_right="0px",
        padding_bottom="0px", padding_left="0px",
        background=Background(bg_color="#1A1A2E"),
        rows=[Row(columns=[Column(elements=[
            NavigationMenu(
                logo_alt_text="BusinessScale",
                logo_link_url="/",
                nav_bg_color="#1A1A2E",
                text_color="#ffffff",
                hover_color="#FF6B00",
                font_size="15px",
                font_weight="500",
                sticky=True,
                sticky_bg_color="#1A1A2E",
                menu_items=[
                    MenuItem(label="About", url="#about"),
                    MenuItem(label="Results", url="#results"),
                    MenuItem(label="FAQ", url="#faq"),
                    MenuItem(label="Register Now →", url="#register", is_button=True, button_color="#FF6B00"),
                ],
            )
        ])])]
    )

    # ── SECTION 2: Hero ──────────────────────────────────────────────────────
    hero_section = Section(
        element_id="section_hero",
        background=Background(
            bg_type="color",
            bg_color="#1A1A2E",
            gradient_enabled=True,
            gradient_type="linear",
            gradient_angle=135,
            gradient_stops=[
                GradientStop(color="#1A1A2E", position=0),
                GradientStop(color="#2D2D5E", position=100),
            ]
        ),
        padding_top="100px", padding_right="20px",
        padding_bottom="100px", padding_left="20px",
        rows=[
            Row(
                column_layout="1-2",
                vertical_align="middle",
                columns=[
                    Column(
                        width_percent=40,
                        padding_right="40px",
                        elements=[
                            Headline(
                                text="Scale Your Business to $10K/Month in 90 Days",
                                heading_tag="h1",
                                font_size="52px",
                                font_size_mobile="32px",
                                font_color="#ffffff",
                                text_align="left",
                                line_height=1.15,
                                animation=Animation(enabled=True, anim_type="fade_in_right", duration=0.7),
                            ),
                            Spacer(height="20px"),
                            Paragraph(
                                text="Join our <strong>FREE live masterclass</strong> and discover the exact 3-step system that helped 10,000+ entrepreneurs break through the $10K ceiling — without burning out.",
                                font_color="#c8c8e0",
                                font_size="18px",
                                text_align="left",
                                animation=Animation(enabled=True, anim_type="fade_in_right", duration=0.7, delay=0.2),
                            ),
                            Spacer(height="32px"),
                            CountdownTimer(
                                timer_type="fixed",
                                end_date="2026-04-30",
                                end_time="23:59",
                                number_color="#FF6B00",
                                label_color="#aaaacc",
                                bg_color="rgba(255,255,255,0.08)",
                                number_font_size="40px",
                                label_font_size="12px",
                                expire_action="redirect_url",
                                expire_redirect_url="/registration-closed",
                            ),
                            Spacer(height="32px"),
                            Button(
                                label="Reserve My Free Spot →",
                                sub_text="Only 47 spots remaining — act now",
                                bg_color="#FF6B00",
                                text_color="#ffffff",
                                font_size="20px",
                                border_radius="8px",
                                padding_top="18px", padding_right="40px",
                                padding_bottom="18px", padding_left="40px",
                                button_action="scroll_to_element",
                                scroll_target_id="#section_register",
                                box_shadows=[BoxShadow(x=0, y=8, blur=24, spread=0, color="rgba(255,107,0,0.4)")],
                                animation=Animation(enabled=True, anim_type="fade_in_up", duration=0.6, delay=0.4),
                            ),
                        ]
                    ),
                    Column(
                        width_percent=60,
                        elements=[
                            Video(
                                video_type="youtube",
                                video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                                controls=True,
                                aspect_ratio="16:9",
                                border=Border(style="solid", width_top=3, width_right=3, width_bottom=3, width_left=3, color="#FF6B00", radius_tl=12, radius_tr=12, radius_br=12, radius_bl=12),
                                animation=Animation(enabled=True, anim_type="fade_in_left", duration=0.8, delay=0.1),
                            )
                        ]
                    ),
                ]
            )
        ]
    )

    # ── SECTION 3: Social Proof Bar ──────────────────────────────────────────
    social_proof_section = Section(
        element_id="section_social_proof",
        background=Background(bg_color="#f8f8f8"),
        padding_top="40px", padding_right="20px",
        padding_bottom="40px", padding_left="20px",
        rows=[
            Row(columns=[
                Column(elements=[
                    Paragraph(
                        text="<strong>Trusted by entrepreneurs from:</strong>",
                        text_align="center",
                        font_color="#888888",
                        font_size="14px",
                        padding_bottom="20px",
                    ),
                    LogoShowcase(
                        mode="ticker",
                        scroll_speed=4,
                        logo_height="40px",
                        grayscale=True,
                        logos=[
                            LogoItem(image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/320px-Google_2015_logo.svg.png", alt_text="Google"),
                            LogoItem(image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png", alt_text="Amazon"),
                            LogoItem(image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/320px-Netflix_2015_logo.svg.png", alt_text="Netflix"),
                            LogoItem(image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Slack_Technologies_Logo.svg/320px-Slack_Technologies_Logo.svg.png", alt_text="Slack"),
                            LogoItem(image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/200px-Notion-logo.svg.png", alt_text="Notion"),
                        ]
                    ),
                ])
            ])
        ]
    )

    # ── SECTION 4: Number Counters ───────────────────────────────────────────
    stats_section = Section(
        element_id="section_about",
        background=Background(bg_color="#ffffff"),
        padding_top="80px", padding_right="20px",
        padding_bottom="80px", padding_left="20px",
        rows=[
            Row(columns=[Column(elements=[
                Headline(
                    text="The Results Speak for Themselves",
                    heading_tag="h2",
                    text_align="center",
                    font_color="#1A1A2E",
                    animation=Animation(enabled=True, anim_type="fade_in_up", duration=0.6),
                ),
                Spacer(height="48px"),
                NumberCounter(
                    columns=4,
                    animate_on_scroll=True,
                    animation_duration=2.0,
                    counters=[
                        CounterItem(end_value=10000, suffix="+", label="Students Enrolled", number_color="#FF6B00"),
                        CounterItem(end_value=94, suffix="%", label="Success Rate", number_color="#FF6B00"),
                        CounterItem(end_value=8.5, suffix="x", decimal_places=1, label="Average ROI", number_color="#FF6B00"),
                        CounterItem(end_value=90, suffix=" Days", label="To First Results", number_color="#FF6B00"),
                    ],
                ),
            ])])]
    )

    # ── SECTION 5: What You'll Learn ─────────────────────────────────────────
    learn_section = Section(
        background=Background(bg_color="#f8f8f8"),
        padding_top="80px", padding_right="20px",
        padding_bottom="80px", padding_left="20px",
        rows=[
            Row(columns=[Column(elements=[
                Headline(
                    text="What You'll Discover in This Masterclass",
                    heading_tag="h2",
                    text_align="center",
                    font_color="#1A1A2E",
                ),
                Spacer(height="12px"),
                Paragraph(
                    text="In just 90 minutes, you'll walk away with a clear, actionable roadmap.",
                    text_align="center",
                    font_color="#666666",
                    font_size="18px",
                ),
                Spacer(height="48px"),
            ])]),
            Row(
                column_layout="1-1-1",
                columns=[
                    Column(
                        padding_right="16px",
                        elements=[
                            CustomHTML(html_content="""
<div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 4px 20px rgba(0,0,0,0.08);height:100%;">
  <div style="font-size:40px;margin-bottom:16px;">🎯</div>
  <h3 style="font-size:20px;font-weight:700;color:#1A1A2E;margin-bottom:12px;">The 3-Step Scaling System</h3>
  <p style="color:#555;line-height:1.7;">The exact framework we use to take businesses from $0 to $10K/month predictably and repeatably.</p>
</div>"""),
                        ]
                    ),
                    Column(
                        padding_right="8px", padding_left="8px",
                        elements=[
                            CustomHTML(html_content="""
<div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 4px 20px rgba(0,0,0,0.08);height:100%;">
  <div style="font-size:40px;margin-bottom:16px;">💰</div>
  <h3 style="font-size:20px;font-weight:700;color:#1A1A2E;margin-bottom:12px;">High-Ticket Offer Creation</h3>
  <p style="color:#555;line-height:1.7;">How to package your expertise into a $3K–$10K offer that clients are eager to buy.</p>
</div>"""),
                        ]
                    ),
                    Column(
                        padding_left="16px",
                        elements=[
                            CustomHTML(html_content="""
<div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 4px 20px rgba(0,0,0,0.08);height:100%;">
  <div style="font-size:40px;margin-bottom:16px;">📈</div>
  <h3 style="font-size:20px;font-weight:700;color:#1A1A2E;margin-bottom:12px;">Automated Lead Generation</h3>
  <p style="color:#555;line-height:1.7;">Build a system that brings in qualified leads on autopilot — even while you sleep.</p>
</div>"""),
                        ]
                    ),
                ]
            ),
        ]
    )

    # ── SECTION 6: Testimonials ──────────────────────────────────────────────
    testimonials_section = Section(
        element_id="section_results",
        background=Background(bg_color="#ffffff"),
        padding_top="80px", padding_right="20px",
        padding_bottom="80px", padding_left="20px",
        rows=[
            Row(columns=[Column(elements=[
                Headline(
                    text="Real Results from Real Students",
                    heading_tag="h2",
                    text_align="center",
                    font_color="#1A1A2E",
                ),
                Spacer(height="48px"),
                Testimonials(
                    layout="grid",
                    columns=3,
                    testimonials=[
                        Testimonial(
                            author_name="Sarah Mitchell",
                            author_title="E-commerce Founder",
                            author_avatar_url="https://i.pravatar.cc/100?img=47",
                            quote="I went from $2K to $18K/month in just 11 weeks. The system is incredibly clear and the support is unmatched. Best investment I've ever made.",
                            star_rating=5,
                        ),
                        Testimonial(
                            author_name="James Okafor",
                            author_title="Business Coach",
                            author_avatar_url="https://i.pravatar.cc/100?img=12",
                            quote="I was skeptical at first, but the results don't lie. Signed my first $8K client within 30 days of implementing the framework.",
                            star_rating=5,
                        ),
                        Testimonial(
                            author_name="Priya Sharma",
                            author_title="Marketing Consultant",
                            author_avatar_url="https://i.pravatar.cc/100?img=32",
                            quote="The automated lead generation module alone was worth 10x the price. I now have a waitlist of clients. Absolutely life-changing.",
                            star_rating=5,
                        ),
                    ],
                ),
            ])])]
    )

    # ── SECTION 7: Pricing ───────────────────────────────────────────────────
    pricing_section = Section(
        background=Background(bg_color="#f8f8f8"),
        padding_top="80px", padding_right="20px",
        padding_bottom="80px", padding_left="20px",
        rows=[
            Row(columns=[Column(elements=[
                Headline(
                    text="Choose Your Path to $10K/Month",
                    heading_tag="h2",
                    text_align="center",
                    font_color="#1A1A2E",
                ),
                Spacer(height="48px"),
                PricingTable(
                    columns=3,
                    highlight_plan_index=1,
                    plans=[
                        PricingPlan(
                            plan_name="Starter",
                            plan_price="$497",
                            price_period="/one-time",
                            description="Perfect for beginners",
                            features=[
                                "Full Masterclass Recording",
                                "90-Day Blueprint PDF",
                                "Private Community Access",
                                "3 Group Coaching Calls",
                            ],
                            button_label="Get Started",
                            button_url="#register",
                        ),
                        PricingPlan(
                            plan_name="Accelerator",
                            plan_price="$997",
                            price_period="/one-time",
                            description="Most popular choice",
                            features=[
                                "Everything in Starter",
                                "1-on-1 Strategy Session",
                                "Done-For-You Templates",
                                "12 Months Community Access",
                                "Weekly Live Q&A Calls",
                            ],
                            button_label="Join Accelerator →",
                            button_url="#register",
                            is_highlighted=True,
                            ribbon_text="Most Popular",
                            ribbon_color="#FF6B00",
                        ),
                        PricingPlan(
                            plan_name="VIP Elite",
                            plan_price="$2,997",
                            price_period="/one-time",
                            description="For serious entrepreneurs",
                            features=[
                                "Everything in Accelerator",
                                "3 Private 1-on-1 Sessions",
                                "Done-With-You Funnel Build",
                                "Lifetime Community Access",
                                "Priority Email Support",
                            ],
                            button_label="Apply for VIP",
                            button_url="#register",
                        ),
                    ],
                ),
            ])])]
    )

    # ── SECTION 8: Registration Form ─────────────────────────────────────────
    register_section = Section(
        element_id="section_register",
        background=Background(
            bg_type="color",
            bg_color="#1A1A2E",
            gradient_enabled=True,
            gradient_type="linear",
            gradient_angle=135,
            gradient_stops=[
                GradientStop(color="#1A1A2E", position=0),
                GradientStop(color="#FF6B00", position=100),
            ]
        ),
        padding_top="80px", padding_right="20px",
        padding_bottom="80px", padding_left="20px",
        rows=[
            Row(
                column_layout="1-1",
                vertical_align="middle",
                columns=[
                    Column(
                        width_percent=50,
                        padding_right="40px",
                        elements=[
                            Headline(
                                text="Reserve Your Free Spot Now",
                                heading_tag="h2",
                                font_color="#ffffff",
                                text_align="left",
                                font_size="38px",
                            ),
                            Spacer(height="16px"),
                            BulletList(
                                items=[
                                    "Live masterclass — not a recording",
                                    "Q&A session with the instructor",
                                    "Free 90-Day Blueprint download",
                                    "No credit card required",
                                ],
                                icon_type="check",
                                icon_color="#FF6B00",
                                font_color="#c8c8e0",
                                font_size="17px",
                                list_item_spacing="12px",
                            ),
                            Spacer(height="32px"),
                            SocialIcons(
                                icons=[
                                    SocialIcon(platform="facebook", url="https://facebook.com"),
                                    SocialIcon(platform="instagram", url="https://instagram.com"),
                                    SocialIcon(platform="youtube", url="https://youtube.com"),
                                    SocialIcon(platform="linkedin", url="https://linkedin.com"),
                                ],
                                icon_style="filled",
                                icon_shape="circle",
                                icon_size="36px",
                                alignment="left",
                            ),
                        ]
                    ),
                    Column(
                        width_percent=50,
                        elements=[
                            FormEmbed(
                                fields=[
                                    FormField(field_type="first_name", label="First Name", placeholder="John", required=True, width="half"),
                                    FormField(field_type="last_name", label="Last Name", placeholder="Smith", required=True, width="half"),
                                    FormField(field_type="email", label="Email Address", placeholder="john@example.com", required=True),
                                    FormField(field_type="phone", label="Phone Number", placeholder="+1 (555) 000-0000"),
                                    FormField(
                                        field_type="select",
                                        label="Where are you in your business?",
                                        options=["Just starting out", "$1K–$5K/month", "$5K–$10K/month", "$10K+/month"],
                                        required=True,
                                    ),
                                ],
                                submit_button_label="Reserve My Free Spot →",
                                submit_button_color="#FF6B00",
                                redirect_type="url",
                                redirect_url="/thank-you",
                                border=Border(style="none"),
                                padding_top="0px", padding_right="0px",
                                padding_bottom="0px", padding_left="0px",
                            ),
                        ]
                    ),
                ]
            )
        ]
    )

    # ── SECTION 9: FAQ ───────────────────────────────────────────────────────
    faq_section = Section(
        element_id="section_faq",
        background=Background(bg_color="#ffffff"),
        padding_top="80px", padding_right="20px",
        padding_bottom="80px", padding_left="20px",
        rows=[
            Row(columns=[Column(
                width_percent=100,
                padding_right="20px", padding_left="20px",
                elements=[
                    Headline(
                        text="Frequently Asked Questions",
                        heading_tag="h2",
                        text_align="center",
                        font_color="#1A1A2E",
                    ),
                    Spacer(height="48px"),
                    FAQAccordion(
                        default_open_index=0,
                        icon_type="plus_minus",
                        items=[
                            FAQItem(
                                question="Is this masterclass really free?",
                                answer="<p>Yes, 100% free. There is no catch and no credit card required. We simply ask that you show up live and come prepared to take notes.</p>",
                                is_open=True,
                            ),
                            FAQItem(
                                question="How long is the masterclass?",
                                answer="<p>The live session runs approximately 90 minutes, including a 30-minute Q&A at the end where you can ask your specific questions.</p>",
                            ),
                            FAQItem(
                                question="What if I can't attend live?",
                                answer="<p>We do offer a replay for 48 hours after the live session, but we strongly recommend attending live to get the most value and participate in the Q&A.</p>",
                            ),
                            FAQItem(
                                question="Is this for beginners or experienced entrepreneurs?",
                                answer="<p>Both! The system works whether you're just starting out or already making $5K–$10K/month and want to break through to the next level.</p>",
                            ),
                            FAQItem(
                                question="What do I need to bring to the masterclass?",
                                answer="<p>Just a notepad and an open mind. We'll provide all materials, worksheets, and the 90-Day Blueprint PDF as a free download during the session.</p>",
                            ),
                        ],
                    ),
                ]
            )])]
    )

    # ── SECTION 10: Final CTA ────────────────────────────────────────────────
    final_cta_section = Section(
        background=Background(bg_color="#FF6B00"),
        padding_top="80px", padding_right="20px",
        padding_bottom="80px", padding_left="20px",
        rows=[
            Row(columns=[Column(elements=[
                Headline(
                    text="Your $10K/Month Business Starts Here",
                    heading_tag="h2",
                    font_color="#ffffff",
                    text_align="center",
                    font_size="42px",
                    animation=Animation(enabled=True, anim_type="zoom_in", duration=0.6),
                ),
                Spacer(height="16px"),
                Paragraph(
                    text="Don't let another month go by without making real progress. Reserve your free spot now.",
                    font_color="rgba(255,255,255,0.85)",
                    font_size="20px",
                    text_align="center",
                ),
                Spacer(height="32px"),
                Button(
                    label="Yes, Reserve My Free Spot →",
                    sub_text="Join 10,000+ entrepreneurs — no credit card needed",
                    bg_color="#ffffff",
                    text_color="#FF6B00",
                    font_size="20px",
                    font_weight="800",
                    border_radius="8px",
                    padding_top="20px", padding_right="48px",
                    padding_bottom="20px", padding_left="48px",
                    button_action="scroll_to_element",
                    scroll_target_id="#section_register",
                    alignment="center",
                    box_shadows=[BoxShadow(x=0, y=8, blur=32, spread=0, color="rgba(0,0,0,0.2)")],
                ),
            ])])]
    )

    # ── SECTION 11: Footer ───────────────────────────────────────────────────
    footer_section = Section(
        background=Background(bg_color="#111111"),
        padding_top="40px", padding_right="20px",
        padding_bottom="40px", padding_left="20px",
        rows=[
            Row(
                column_layout="1-1-1",
                columns=[
                    Column(
                        width_percent=33.33,
                        elements=[
                            Headline(
                                text="BusinessScale",
                                heading_tag="h4",
                                font_color="#ffffff",
                                font_size="20px",
                                text_align="left",
                            ),
                            Paragraph(
                                text="Helping entrepreneurs build scalable, profitable businesses since 2018.",
                                font_color="#888888",
                                font_size="14px",
                                text_align="left",
                                padding_top="8px",
                            ),
                        ]
                    ),
                    Column(
                        width_percent=33.33,
                        elements=[
                            Headline(
                                text="Quick Links",
                                heading_tag="h5",
                                font_color="#ffffff",
                                font_size="16px",
                                text_align="left",
                            ),
                            RichText(
                                content='<ul style="list-style:none;padding:0;margin-top:8px;"><li style="margin-bottom:8px;"><a href="#about" style="color:#888;text-decoration:none;font-size:14px;">About</a></li><li style="margin-bottom:8px;"><a href="#results" style="color:#888;text-decoration:none;font-size:14px;">Results</a></li><li style="margin-bottom:8px;"><a href="#faq" style="color:#888;text-decoration:none;font-size:14px;">FAQ</a></li><li><a href="#register" style="color:#FF6B00;text-decoration:none;font-size:14px;font-weight:700;">Register Free →</a></li></ul>',
                            ),
                        ]
                    ),
                    Column(
                        width_percent=33.33,
                        elements=[
                            Headline(
                                text="Follow Us",
                                heading_tag="h5",
                                font_color="#ffffff",
                                font_size="16px",
                                text_align="left",
                            ),
                            Spacer(height="8px"),
                            SocialIcons(
                                icons=[
                                    SocialIcon(platform="facebook", url="https://facebook.com"),
                                    SocialIcon(platform="instagram", url="https://instagram.com"),
                                    SocialIcon(platform="youtube", url="https://youtube.com"),
                                    SocialIcon(platform="twitter", url="https://twitter.com"),
                                ],
                                icon_style="outline",
                                icon_shape="circle",
                                icon_size="36px",
                                alignment="left",
                            ),
                        ]
                    ),
                ]
            ),
            Row(columns=[Column(elements=[
                Divider(line_color="#333333", padding_top="24px", padding_bottom="24px"),
                Paragraph(
                    text="© 2026 BusinessScale. All rights reserved. | <a href='/privacy' style='color:#888;'>Privacy Policy</a> | <a href='/terms' style='color:#888;'>Terms of Service</a>",
                    font_color="#666666",
                    font_size="13px",
                    text_align="center",
                ),
             ])]),
        ]
    )

    # ── Assemble the Page ────────────────────────────────────────────────────
    return FunnelPage(
        settings=settings,
        sections=[
            nav_section,
            hero_section,
            social_proof_section,
            stats_section,
            learn_section,
            testimonials_section,
            pricing_section,
            register_section,
            faq_section,
            final_cta_section,
            footer_section,
        ],
        popups=[exit_popup],
    )


# ==============================================================================
# SECTION 6 — ENTRY POINT
# ==============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("  HighLevel Funnel Page Builder")
    print("=" * 60)
    print()
    print("[1/3] Building funnel page schema...")
    page = build_demo_funnel()
    print(f"      Sections: {len(page.sections)}")
    print(f"      Popups:   {len(page.popups)}")

    print("[2/3] Rendering HTML...")
    builder = PageBuilder(page)
    output_file = "funnel_page.html"
    builder.save(output_file)

    html = Path(output_file).read_text(encoding="utf-8")
    size_kb = len(html.encode("utf-8")) / 1024
    print(f"      File size: {size_kb:.1f} KB")
    print(f"      HTML lines: {html.count(chr(10))}")

    print()
    print("[3/3] Done!")
    print(f"      Open '{output_file}' in your browser to preview the page.")
    print()
    print("  To customise this page:")
    print("  - Edit build_demo_funnel() to change content")
    print("  - Add/remove Sections, Rows, Columns, and Elements")
    print("  - Modify PageSettings for SEO, fonts, and brand colors")
    print("  - All schema properties are documented in the dataclasses above")
    print("=" * 60)
