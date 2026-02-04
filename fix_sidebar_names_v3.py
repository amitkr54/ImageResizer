import os
import re

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'
index_file = r'c:\Users\Admin\Desktop\Image Resizer\index.html'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    
    # Replace "Compress to" with "Compress Image to"
    # But avoid double "Image Image" if I mess up.
    # We look for "<span>Compress to"
    
    # We want "Compress Image to Custom Size"
    new_content = re.sub(r'<span>\s*Compress to Custom Size\s*</span>', '<span>Compress Image to Custom Size</span>', new_content, flags=re.DOTALL | re.IGNORECASE)

    # We want "Compress Image to 10KB" etc.
    # Using regex to catch all number variations
    new_content = re.sub(r'<span>\s*Compress to\s*(\d+KB)\s*</span>', r'<span>Compress Image to \1</span>', new_content, flags=re.DOTALL | re.IGNORECASE)
    
    # Also fix the JPEG one if it wasn't caught before or if I need to be sure.
    # The previous script changed "JPEG to 10KB" to "Compress to 10KB".
    # So the regex above should catch it.

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {os.path.basename(filepath)}")

process_file(index_file)
if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith(".html"):
             process_file(os.path.join(tools_dir, filename))
