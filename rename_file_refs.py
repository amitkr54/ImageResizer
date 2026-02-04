import os

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'
index_file = r'c:\Users\Admin\Desktop\Image Resizer\index.html'
old_file = 'resize-kb.html'
new_file = 'compress-custom.html'

def update_references(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace href
    new_content = content.replace(f'"{old_file}"', f'"{new_file}"') # for same dir
    new_content = new_content.replace(f'href="{old_file}"', f'href="{new_file}"') 
    new_content = new_content.replace(f'tools/{old_file}', f'tools/{new_file}')
    
    # Update data-tool in the file itself if we are processing the renamed file content
    # But since we are processing specific files, we can just replace 'data-tool="resize-kb"'
    if 'data-tool="resize-kb"' in new_content:
         new_content = new_content.replace('data-tool="resize-kb"', 'data-tool="compress-custom"')

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated references in {os.path.basename(filepath)}")

# Update Index
update_references(index_file)

# Update Tools
if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith(".html"):
             update_references(os.path.join(tools_dir, filename))

# Rename the file itself
old_path = os.path.join(tools_dir, old_file)
new_path = os.path.join(tools_dir, new_file)

if os.path.exists(old_path):
    # Read content to update data-tool inside it
    with open(old_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('data-tool="resize-kb"', 'data-tool="compress-custom"')
    # Also update self-references in nav if any escaped the loop (unlikely as we process all files)
    
    with open(new_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    os.remove(old_path)
    print(f"Renamed {old_file} to {new_file}")
else:
    print(f"File {old_file} not found (maybe already renamed?)")
