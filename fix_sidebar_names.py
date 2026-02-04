import os
import re

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'
index_file = r'c:\Users\Admin\Desktop\Image Resizer\index.html'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    
    # regex for "JPEG to 10KB"
    # It might have newlines or spaces.
    # The source viewed showed: <span>JPEG to\n 10KB</span>
    new_content = re.sub(r'<span>\s*JPEG to\s*10KB\s*</span>', '<span>Compress to 10KB</span>', new_content, flags=re.DOTALL | re.IGNORECASE)
    
    # regex for "Reduce Image Size (KB)"
    new_content = re.sub(r'<span>\s*Reduce Image Size\s*\(\s*KB\s*\)\s*</span>', '<span>Compress to Custom Size</span>', new_content, flags=re.DOTALL | re.IGNORECASE)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {os.path.basename(filepath)}")

process_file(index_file)
if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith(".html"):
             process_file(os.path.join(tools_dir, filename))
