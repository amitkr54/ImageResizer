import os

root_dir = r'c:\Users\Admin\Desktop\Image Resizer'
tools_dir = os.path.join(root_dir, 'tools')

def update_links(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update links
    new_content = content.replace('convert-pdf.html', 'image-to-pdf.html')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ Updated links in {os.path.basename(filepath)}")

# Update index.html
update_links(os.path.join(root_dir, 'index.html'))

# Update all tool pages
if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith('.html'):
            update_links(os.path.join(tools_dir, filename))

print("\n🚀 Navigation update complete!")
