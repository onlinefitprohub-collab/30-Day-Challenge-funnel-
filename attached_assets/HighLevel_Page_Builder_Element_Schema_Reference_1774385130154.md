# HighLevel Page Builder Element Schema Reference

## 1. Introduction
HighLevel's page builder (used for both Funnels and Websites) employs a hierarchical structure to build web pages. This document provides a comprehensive reference of the element schema, including layout containers, basic elements, advanced widgets, and their associated properties. It is designed to give you exactly what you need to know when creating pages specifically for the HighLevel ecosystem [1].

## 2. Layout Hierarchy
The foundation of any HighLevel page follows a strict nesting hierarchy: **Sections > Rows > Columns > Elements**. You must have at least one section, one row, and one column to add an element.

| Container | Description | Key Properties |
| :--- | :--- | :--- |
| **Section** | The outermost container that spans the width of the page. | **Background** (Color, Image, Video), **Spacing** (Padding, Margin), **Visibility** (Desktop, Mobile), **Width** (Full width, Wide, Medium, Small). |
| **Row** | Nested within Sections, Rows determine the horizontal layout structure. | **Columns** (1 to 6 column layouts), **Spacing** (Padding, Margin), **Background** (Color, Image). |
| **Column** | Nested within Rows, Columns hold the actual elements. | **Width** (Percentage-based width for responsive design), **Spacing** (Padding, Margin), **Background** (Color, Image). |

## 3. Basic Elements
Basic elements are the core building blocks of your page, encompassing text, media, and simple interactive components.

| Element | Description | Key Properties |
| :--- | :--- | :--- |
| **Typography** | Includes Headline, Sub Headline, and Paragraph elements for displaying text. | **Content** (Text content), **Typography** (Font family, size, weight, line height, letter spacing, text transform, text shadow), **Color** (Text color, bold color, italic color, link color), **Spacing** (Padding, Margin), **Alignment** (Left, Center, Right, Justify). |
| **Bullet List** | Used for creating unordered lists with custom icons. | **List Style** (Icon selection, icon color), **Typography & Spacing** (Same as standard typography elements). |
| **Image** | Displays an image from a URL or the Media Library. | **Source** (Image URL/Media Library), **Sizing** (Width, Height in pixels or percentage), **Action** (Click action: Open popup, URL, Scroll to element), **Styling** (Image radius, border, shadow, opacity). |
| **Video** | Embeds a video player into the page. | **Source** (YouTube, Vimeo, Wistia, Custom Embed, HTML5), **Settings** (Autoplay, Controls, Mute, Loop), **Thumbnail** (Custom thumbnail image). |
| **Button** | A clickable element that triggers an action. | **Text** (Button text, Sub-text), **Action** (Open popup, Go to URL, Scroll to element, Submit form, Call, SMS, Email, One click upsell), **Styling** (Background color, text color, typography, border radius, border width/color, shadow, hover effects), **Icon** (Left or right icon). |
| **Form** | Embeds a form created in the HighLevel Form Builder. | **Selection** (Choose an existing form), **Action** (Redirect action after submission), **Styling** (Inherits form builder styles, but allows overrides for container spacing and background). |

## 4. Advanced & Widget Elements
Advanced elements provide specialized functionality and dynamic content presentation.

| Element | Description | Key Properties |
| :--- | :--- | :--- |
| **Image Slider** | Displays multiple images in a sliding carousel. | **Slide Settings** (Image URL, Heading, Description, Button), **Slider Options** (Autoplay, Autoplay interval, Pause on hover, Infinite loop), **Navigation** (Show arrows, Show dots), **Animation** (Slide or Fade transition). |
| **Countdown Timer** | Adds urgency with a counting timer (End Date/Time, Evergreen, Daily). | **Settings** (Target date/time, Timezone, Language), **Action on Expire** (Redirect to URL, Show/Hide elements), **Styling** (Block/Inline style, Label text, Colors, Font sizes). |
| **Pricing Table** | Displays pricing plans and features side-by-side. | **Plan Settings** (Title, Price, Currency, Frequency, Features list, Button text/link), **Highlighting** (Ribbon/Badge), **Styling** (Card background, border, shadow, typography per section). |
| **Testimonials** | Showcases customer reviews and ratings. | **Review Settings** (Author name, Role/Company, Avatar image, Review text, Star rating), **Styling** (Background color, Text color, Avatar size, Star color). |
| **Social Media Icons** | Links to various social platforms [2]. | **Platforms** (Facebook, Instagram, X, LinkedIn, YouTube, TikTok, Google Plus, Whatsapp, Mail, Website, Pinterest), **Display Type** (Icon Only, Text Only, Icon & Text), **Styling** (Icon size, alignment, spacing, colors). |
| **QR Code** | Renders a scannable code linked to a destination [3]. | **Destination** (Funnel/website page, calendar, form, survey, payment link, or external URL), **Styling** (Size, alignment, on-canvas control). |
| **Number Counter** | Transforms numerical values into lively, count-up animations [5]. | **Counters** (Multiple metrics per widget), **Values** (Start value, End value, Prefix, Suffix), **Layout** (Number of columns, Space between counters), **Animation** (Duration), **Styling** (Colors, borders, typography, optional icons/images). |
| **Logo Showcase** | Displays multiple logos in a ticker or carousel [6]. | **Mode** (Ticker or Carousel), **Settings** (Logos per slide, Scroll Speed, Auto-Animation, Pause on Hover, Infinite Loop), **Styling** (Spacing between logos, grayscale/color filters, custom alt text). |
| **Photos Gallery** | Creates professional-looking, customizable image galleries [7]. | **Layout** (Grid, Vertical Masonry, Horizontal Masonry), **Settings** (Column count, Spacing, Lightbox support, Click actions), **Styling** (Captions, Descriptions, Watermarks). |
| **Blog Post** | Pulls published blog content into a funnel or website page [8]. | **Source** (Choose Blog Site), **Filtering** (Sort by Recent, Category, or Author), **Pagination** (Number of posts to feature), **Styling** (Display style, Button options). |

## 5. Universal Elements
Universal Elements are single elements you save to the Saved Assets library so they remain linked wherever they're used. When a linked Universal Element is updated on one page, the changes automatically reflect across all pages where it is placed. This is highly useful for global components like Headers and Footers.

## 6. Common Element Properties
Almost all elements share a set of common configuration options found in the Advanced settings tab.

| Property | Description |
| :--- | :--- |
| **Padding & Margin** | Fine-tune spacing inside (padding) and outside (margin) the element boundary [1]. |
| **Visibility** | Toggle element display for Desktop only, Mobile only, or both [1]. |
| **Custom CSS Class** | Assign a class name for custom styling via the page's Custom CSS settings. |
| **Animations** | Control how elements enter or behave on hover [4]. Includes **Styles** (Fade, Slide, Bounce, etc.) and **Settings** (Scale, Duration, Delay, Easing). |

## 7. References
[1] [HighLevel Support: Websites Overview](https://help.gohighlevel.com/support/solutions/articles/155000001633-websites-overview)
[2] [HighLevel Support: Social Media Icons](https://help.gohighlevel.com/support/solutions/articles/155000001313-social-media-icons)
[3] [HighLevel Support: QR Code Element](https://help.gohighlevel.com/support/solutions/articles/155000006568-qr-code-element-in-page-builder)
[4] [HighLevel Support: Animation Customizations](https://help.gohighlevel.com/support/solutions/articles/155000005657-animation-customizations-in-funnels-websites)
[5] [HighLevel Support: Number Counter Widget](https://help.gohighlevel.com/support/solutions/articles/155000005664-funnels-websites-number-counter-widget)
[6] [HighLevel Support: Logo Showcase Element](https://help.gohighlevel.com/support/solutions/articles/155000005538-how-to-use-the-logo-showcase-element)
[7] [HighLevel Support: Photos Gallery Element](https://help.gohighlevel.com/support/solutions/articles/155000004134-funnels-websites-photos-gallery-element)
[8] [HighLevel Support: Blog Post Element](https://help.gohighlevel.com/support/solutions/articles/155000002776-add-blog-post-element-in-funnel-step-or-website-page)
