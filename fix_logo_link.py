import os
import re

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'
index_file = r'c:\Users\Admin\Desktop\Image Resizer\index.html'

def process_file(filepath):
    filename = os.path.basename(filepath)
    is_root = filename == "index.html"
    link_target = "index.html" if is_root else "../index.html"

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content

    # Pattern 1: The standard one we saw in compress-20kb.html
    # <div class="logo" onclick="window.location.href='../index.html'">
    # We might see different variations of quote usage or path
    
    # We will search for the entire div opening tag and replace it with 'a' opening tag
    # And closing div with closing a
    
    # But regex replace is safer if we match the whole block? No, too risky.
    # Let's target the opening tag.
    
    # Variation 1: Single quotes for href
    pattern_sq = r'<div class="logo" onclick="window.location.href=\'([^\']+)\'">\s*<i class="fas fa-expand-arrows-alt"></i>\s*<span>Image Resizer Pro</span>\s*</div>'
     # Variation 2: Double quotes for everything
    pattern_dq = r'<div class="logo" onclick="window.location.href=\'([^\']+)\'">\s*<i class="fas fa-expand-arrows-alt"></i>\s*<span>Image Resizer Pro</span>\s*</div>'
    
    # Actually, simpler: just replace the opening tag if it matches the structure
    # And replace the first </div> after it with </a>
    
    # Let's construct the replacement block
    # We want to preserve the icon and span.
    
    replacement = f'<a href="{link_target}" class="logo">\n                        <i class="fas fa-expand-arrows-alt"></i>\n                        <span>Image Resizer Pro</span>\n                    </a>'
    
    # Regex to capture the whole logo block including potential whitespace
    # Note: re.DOTALL is essential
    
    # Pattern for tools (checking relative path)
    # <div class="logo" onclick="window.location.href=\'../index.html\'">...</div>
    
    # We can be a bit more generic: Find <div class="logo" ... > ... </div>
    
    regex = r'<div class="logo"\s+onclick="[^"]+">\s*<i class="fas fa-expand-arrows-alt"></i>\s*<span>Image Resizer Pro</span>\s*</div>'
    
    if re.search(regex, new_content, re.DOTALL):
        new_content = re.sub(regex, replacement, new_content, flags=re.DOTALL)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed logo in {filename}")
    else:
        # Check standard index.html case which might just be a div without onclick or with different path
        # In index.html, it might be window.location.href='index.html' or similar
        print(f"No logo match in {filename} (might be already fixed or different format)")

process_file(index_file)
if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith(".html"):
             process_file(os.path.join(tools_dir, filename))
