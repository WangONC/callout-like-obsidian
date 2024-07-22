# Callout

**Callout** is used to generate callouts similar to those in Obsidian on web pages.

Download and open demo.html to view the effect
  
## Usage

1. Add `<script src="callout.js"></script>` to your website
2. Add a quotation with `<blockquote>` tag to your website
3. Add a `<p>...</p>` tag inside a `<blockquote>` tag as a title, with the text prefix "![INFO] " in front of the title(space is required)
4. If the DOM changes after initialization and new callouts are added, simply call `document.Callout.createBlockquotes()`.

## Example

```html
<!-- some code... -->
<script src="callout.js"></script>
<!-- some code... -->
<blockquote><p>[!Info] Watch out!<p>
    <p>This is a warning message.</p>
</blockquote>
<!-- some code... -->
```

The title can include other HTML tags

```html
<!-- some code... -->
<script src="callout.js"></script>
<!-- some code... -->
<blockquote><p>[!Info] Watch<br>out!<p>
    <p>This is a warning message.</p>
</blockquote>
<!-- some code... -->
```

The remaining part will serve as the main content of the callout.（Even including other callouts.）

```html
<!-- some code... -->
<script src="callout.js"></script>
<!-- some code... -->
<blockquote><p>[!NOTE]- This is a note</p>
This is the content of the note callout.
<blockquote><p>[!TIP]- Nested Tip</p>
This is a nested tip inside the note.
<blockquote><p>[!WARNING] Double Nested Warning</p>
This is a double nested warning inside the tip.
</blockquote>
</blockquote>
</blockquote>
<!-- some code... -->
```

If no title text is entered, the default title is displayed as the callout type.

```html
<!-- some code... -->
<script src="callout.js"></script>
<!-- some code... -->
<blockquote><p>[!Info]<p>
    <p>This is a warning message.</p>
</blockquote>
<!-- some code... -->
```

It doesn't replace quotations with pure `<blockquote>` tags, like...

```html
<blockquote>This is a regular blockquote</blockquote>
```

and

```html
<blockquote><p>This is a regular blockquote<p></blockquote>
```

## More

### Foldable callouts

You can make a callout foldable by adding a plus (+) or a minus (-) directly after the type identifier.
A plus sign expands the callout by default, and a minus sign collapses it instead.

```html
    <blockquote><p>[!SUCCESS]+ Watch out!</p>
    This is a warning message.
    This is a warning message.
    This is a warning message.
    </blockquote>

    <blockquote><p>[!TIP]- Pro Tip</p>
    Here's a helpful tip for you.
    </blockquote>
```

### Customize callouts

You can specify the title color, background color, and icon of the callout by adding `[!TITLE R,G,B,A]`, `[!BACKGROUND R,G,B,A]`, and `[!ICON icon_name]` respectively before or after the type. The icon can only be selected from FontAwesome. See https://fontawesome.com/icons for options.

```html
    <blockquote><p>[!TITLE 150,0,0,0.8][!INFO][!BACKGROUND 0,170,0,0.25][!ICON fa-solid fa-shield-halved] Custom Color</p>
This callout has a custom color.
    </blockquote>
```

### Supported types

The same as Obsidian.

- note (blue)
- abstract, summary, tldr (green)
- info (blue)
- todo (blue)
- tip, hint, important (sky blue)
- success, check, done (green)
- question, help, faq (yellow)
- warning, caution, attention (orange)
- failure, fail, missing (red)
- danger, error (red)
- bug (red)
- example (purple)
- quote, cite (grey)

