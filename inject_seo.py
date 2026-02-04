import os
import re

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'
index_file = r'c:\Users\Admin\Desktop\Image Resizer\index.html'

# Tool configurations with SEO data
tool_seo = {
    'resize-pixel.html': {
        'title': 'Resize Image by Pixels Online Free - Image Resizer Pro',
        'description': 'Free online tool to resize images by pixels. Adjust width and height with aspect ratio lock. Fast, easy, no signup required. Perfect for web, social media, and print.',
        'keywords': 'resize image by pixel, adjust image size, photo dimensions, pixel resizer',
        'h1': 'Resize Image by Pixels Online'
    },
    'compress-20kb.html': {
        'title': 'Compress Image to 20KB Online Free - JPG, PNG Compressor',
        'description': 'Compress images to exactly 20KB online for free. Perfect for resumes, job applications, and government forms. High-quality compression for JPG, PNG, WebP.',
        'keywords': 'compress image to 20kb, reduce image size, 20kb photo, resume photo compression',
        'h1': 'Compress Image to 20KB Online'
    },
    'flip-image.html': {
        'title': 'Flip Image Online Free - Horizontal & Vertical Flip Tool',
        'description': 'Free online image flipper. Mirror images horizontally or vertically with one click. Batch processing supported. No watermark, fast and easy.',
        'keywords': 'flip image, mirror image, horizontal flip, vertical flip, reverse image',
        'h1': 'Flip Image Online Free'
    },
    'rotate-image.html': {
        'title': 'Rotate Image Online Free - 90° Image Rotation Tool',
        'description': 'Rotate images 90 degrees left or right instantly. Free online image rotation tool with batch processing. Fix sideways photos in seconds.',
        'keywords': 'rotate image, 90 degree rotation, turn image, fix sideways photo',
        'h1': 'Rotate Image Online 90 Degrees'
    },
    'watermark-image.html': {
        'title': 'Add Watermark to Image Online Free - Text Watermark Tool',
        'description': 'Add text watermarks to images online for free. Customize position, opacity, and font size. Protect your photos with batch watermarking.',
        'keywords': 'add watermark, watermark image, photo copyright, protect images',
        'h1': 'Add Watermark to Images Online'
    },
    'instagram-no-crop.html': {
        'title': 'Instagram Image Resizer - No Crop, Perfect Fit | Free Tool',
        'description': 'Resize images for Instagram without cropping. Adds letterboxing for perfect 1080x1080 fit. Choose background color. No distortion, professional results.',
        'keywords': 'instagram image resize, no crop instagram, instagram photo resizer, 1080x1080',
        'h1': 'Instagram Image Resizer (No Crop)'
    },
    'image-to-pdf.html': {
        'title': 'Convert Images to PDF Free - Multiple Images to One PDF',
        'description': 'Convert JPG, PNG, WebP to PDF online for free. Merge multiple images into a single PDF document. Each image becomes a page. Fast and secure.',
        'keywords': 'image to pdf, convert jpg to pdf, multiple images to pdf, photo to pdf',
        'h1': 'Convert Images to PDF Online'
    },
    'passport-photo.html': {
        'title': 'Passport Photo Maker Online Free - ID Photo Creator',
        'description': 'Create passport photos online for free. Standard sizes for US, UK, India passports. 2x2 inch, 35x45mm, and custom dimensions. Print-ready quality.',
        'keywords': 'passport photo maker, id photo creator, visa photo, 2x2 photo',
        'h1': 'Passport Photo Maker Online Free'
    }
}

# Schema markup templates
def get_webapp_schema():
    return '''
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Image Resizer Pro",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Professional online image resizer with 35+ tools for free. Resize, compress, edit images instantly.",
  "featureList": [
    "Batch image resizing",
    "Compression to specific KB",
    "Watermark addition",
    "Image to PDF conversion",
    "Before/after preview",
    "35+ image tools"
  ],
  "browserRequirements": "Requires JavaScript",
  "screenshot": "https://yourdomain.com/screenshot.jpg"
}
</script>
'''

def get_howto_schema(tool_name, steps):
    return f'''
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to {tool_name}",
  "description": "Step-by-step guide to {tool_name.lower()} online",
  "step": [
    {','.join([f'{{"@type": "HowToStep", "name": "{step["name"]}", "text": "{step["text"]}"}}' for step in steps])}
  ]
}}
</script>
'''

def inject_meta_tags(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    filename = os.path.basename(filepath)
    
    # Get SEO data or use defaults
    if filename in tool_seo:
        seo = tool_seo[filename]
    else:
        # Generic fallback
        tool_name = filename.replace('.html', '').replace('-', ' ').title()
        seo = {
            'title': f'{tool_name} - Image Resizer Pro',
            'description': f'Free online {tool_name.lower()} tool. Fast, easy, no signup required.',
            'keywords': f'{tool_name.lower()}, image tool, photo editor',
            'h1': tool_name
        }
    
    # Check if meta tags already exist
    if '<meta name="description"' in content:
        print(f"⚠️ {filename} already has meta tags, skipping...")
        return
    
    # Find <head> and inject meta tags after it
    head_pattern = r'(<head>)'
    
    meta_tags = f'''<head>
    <!-- SEO Meta Tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{seo['title']}</title>
    <meta name="description" content="{seo['description']}">
    <meta name="keywords" content="{seo['keywords']}">
    <meta name="author" content="Image Resizer Pro">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="{seo['title']}">
    <meta property="og:description" content="{seo['description']}">
    <meta property="og:image" content="https://yourdomain.com/og-image.jpg">
    <meta property="og:url" content="https://yourdomain.com/tools/{filename}">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{seo['title']}">
    <meta name="twitter:description" content="{seo['description']}">
    <meta name="twitter:image" content="https://yourdomain.com/og-image.jpg">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://yourdomain.com/tools/{filename}">'''
    
    new_content = re.sub(head_pattern, meta_tags, content, count=1)
    
    # Add Schema markup before </head>
    schema = get_webapp_schema()
    new_content = new_content.replace('</head>', f'{schema}\n</head>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Added meta tags and schema to {filename}")

# Process all tool files
if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith('.html'):
            filepath = os.path.join(tools_dir, filename)
            inject_meta_tags(filepath)

# Process index.html
if os.path.exists(index_file):
    with open(index_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<meta name="description"' not in content:
        homepage_meta = '''<head>
    <!-- SEO Meta Tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Free Image Resizer Online - 35+ Tools | Image Resizer Pro</title>
    <meta name="description" content="Professional online image resizer with 35+ free tools. Resize, compress, watermark, flip, rotate images. Image to PDF converter. Batch processing. No signup required.">
    <meta name="keywords" content="image resizer, free image resizer, resize image online, compress image, image tools, photo editor online">
    <meta name="author" content="Image Resizer Pro">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Free Image Resizer Online - Image Resizer Pro">
    <meta property="og:description" content="Professional image resizing and editing tools. Resize, compress, watermark images for free. 35+ tools available.">
    <meta property="og:image" content="https://yourdomain.com/og-image.jpg">
    <meta property="og:url" content="https://yourdomain.com">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Free Image Resizer Online - Image Resizer Pro">
    <meta name="twitter:description" content="Professional image resizing and editing tools with 35+ features.">
    <meta name="twitter:image" content="https://yourdomain.com/og-image.jpg">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://yourdomain.com">'''
        
        new_content = re.sub(r'(<head>)', homepage_meta, content, count=1)
        new_content = new_content.replace('</head>', f'{get_webapp_schema()}\n</head>')
        
        with open(index_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✅ Added meta tags and schema to index.html")

print("\n🎉 SEO meta tags and schema markup injection complete!")
