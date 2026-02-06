import os
from datetime import datetime

# Directories and files
tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'
output_file = r'c:\Users\Admin\Desktop\Image Resizer\sitemap.xml'
base_url = 'https://imageresizer.signageworks.in'

# Priority and change frequency settings
priorities = {
    'index.html': '1.0',
    'default': '0.8',
    'compress': '0.9',  # Compress tools are popular
    'resize': '0.9',    # Resize tools are core
    'instagram': '0.85',
    'watermark': '0.85',
    'image-to-pdf': '0.9'
}

def get_priority(filename):
    """Determine priority based on filename"""
    for key, priority in priorities.items():
        if key in filename:
            return priority
    return priorities['default']

def get_changefreq(filename):
    """Determine change frequency"""
    if filename == 'index.html':
        return 'weekly'
    return 'monthly'

# Get current date for lastmod
current_date = datetime.now().strftime('%Y-%m-%d')

# Start building sitemap
sitemap_entries = []

# Add homepage
sitemap_entries.append({
    'loc': f'{base_url}/',
    'lastmod': current_date,
    'changefreq': 'weekly',
    'priority': '1.0'
})

# Add all tool pages
if os.path.exists(tools_dir):
    for filename in sorted(os.listdir(tools_dir)):
        if filename.endswith('.html'):
            sitemap_entries.append({
                'loc': f'{base_url}/tools/{filename}',
                'lastmod': current_date,
                'changefreq': get_changefreq(filename),
                'priority': get_priority(filename)
            })

# Generate XML
xml_content = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
'''

for entry in sitemap_entries:
    xml_content += f'''  <url>
    <loc>{entry['loc']}</loc>
    <lastmod>{entry['lastmod']}</lastmod>
    <changefreq>{entry['changefreq']}</changefreq>
    <priority>{entry['priority']}</priority>
  </url>
'''

xml_content += '</urlset>'

# Write sitemap
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(xml_content)

print(f"✅ Sitemap generated successfully!")
print(f"📄 Total URLs: {len(sitemap_entries)}")
print(f"📁 Location: {output_file}")
print(f"\n⚠️ IMPORTANT: Update base_url in the script to your actual domain!")
print(f"   Current: {base_url}")
