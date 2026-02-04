import os
import re

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'
index_file = r'c:\Users\Admin\Desktop\Image Resizer\index.html'

link_html = """                <a href="compress-pdf.html" class="nav-item" data-tool="compress-pdf"><i
                        class="fas fa-file-contract"></i><span>Compress PDF</span></a>"""

# Check if reference link exists to insert after
reference_link_pattern = re.compile(r'(<a href="merge-pdf.html"[^>]*>.*?</a>)', re.DOTALL)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'compress-pdf.html' in content:
        print(f"Skipping {os.path.basename(filepath)} (already exists)")
        return

    # Insert after Merge PDF
    if reference_link_pattern.search(content):
        # We use a lambda to insert the new link after the match
        new_content = reference_link_pattern.sub(r'\1\n' + link_html, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {os.path.basename(filepath)}")
    else:
        print(f"Assuming manual insert needed for {os.path.basename(filepath)}")

# Update Index
process_file(index_file)

# Update Tools
if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith(".html") and filename != "compress-pdf.html":
             process_file(os.path.join(tools_dir, filename))
