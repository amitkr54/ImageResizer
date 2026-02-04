import os
import re

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'

# Define the regex patterns and replacements
# 1. Remove logo from sidebar
sidebar_pattern = re.compile(r'<div class="logo" onclick="window\.location\.href=\'\.\./index\.html\'" style="cursor:pointer;">\s*<i class="fas fa-expand-arrows-alt"></i>\s*<span>Image Resizer Pro</span>\s*</div>\s*', re.DOTALL)
sidebar_replacement = ''

# 2. Update top bar (replace h1 with logo)
# We capture the button part to keep it, and replace the h1 part
topbar_pattern = re.compile(r'(<div class="top-left">\s*<button id="menu-toggle" class="btn-icon-top"><i class="fas fa-bars"></i></button>)\s*<h1 id="view-title">.*?</h1>', re.DOTALL)
topbar_replacement = r'\1\n                    <div class="logo" onclick="window.location.href=\'../index.html\'">\n                        <i class="fas fa-expand-arrows-alt"></i>\n                        <span>Image Resizer Pro</span>\n                    </div>'

count = 0

if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith(".html"):
            filepath = os.path.join(tools_dir, filename)
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            
            # Apply sidebar change
            new_content = sidebar_pattern.sub(sidebar_replacement, new_content)
            
            # Apply topbar change
            new_content = topbar_pattern.sub(topbar_replacement, new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")
                count += 1
            else:
                print(f"No changes needed for {filename}")

print(f"Total files updated: {count}")
