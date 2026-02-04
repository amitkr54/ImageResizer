import os

root_dir = r'c:\Users\Admin\Desktop\Image Resizer'
tools_dir = os.path.join(root_dir, 'tools')

def update_data_tool(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update data-tool attribute and nav links
    new_content = content.replace('data-tool="convert-pdf"', 'data-tool="image-to-pdf"')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ Updated data-tool in {os.path.basename(filepath)}")

# Update all tool pages
if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith('.html'):
            update_data_tool(os.path.join(tools_dir, filename))

print("\n🚀 Data-tool update complete!")
