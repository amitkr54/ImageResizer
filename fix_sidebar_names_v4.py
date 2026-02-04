import os
import re

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'
index_file = r'c:\Users\Admin\Desktop\Image Resizer\index.html'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    
    # Resize by Pixel -> Resize Image by Pixel
    new_content = re.sub(r'<span>\s*Resize by\s*Pixel\s*</span>', '<span>Resize Image by Pixel</span>', new_content, flags=re.DOTALL | re.IGNORECASE)
    
    # Resize in Centimeters -> Resize Image in Centimeters
    new_content = re.sub(r'<span>\s*Resize in\s*Centimeters\s*</span>', '<span>Resize Image in Centimeters</span>', new_content, flags=re.DOTALL | re.IGNORECASE)
    
    # Resize in Millimeters -> Resize Image in Millimeters
    new_content = re.sub(r'<span>\s*Resize in\s*Millimeters\s*</span>', '<span>Resize Image in Millimeters</span>', new_content, flags=re.DOTALL | re.IGNORECASE)
    
    # Resize in Inches -> Resize Image in Inches
    new_content = re.sub(r'<span>\s*Resize in\s*Inches\s*</span>', '<span>Resize Image in Inches</span>', new_content, flags=re.DOTALL | re.IGNORECASE)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {os.path.basename(filepath)}")

process_file(index_file)
if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith(".html"):
             process_file(os.path.join(tools_dir, filename))
