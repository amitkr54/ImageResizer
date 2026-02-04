import os
import re

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'
index_file = r'c:\Users\Admin\Desktop\Image Resizer\index.html'

nav_regex = re.compile(r'<nav class="top-nav">.*?</nav>', re.DOTALL)

# The new Navigation HTML
new_nav_html = """<nav class="top-nav">
                    <!-- Image Resizer -->
                    <div class="nav-dropdown">
                        <a href="{prefix}resize-pixel.html" class="top-nav-item"><i class="fas fa-expand-arrows-alt"></i> Image Resizer <i class="fas fa-chevron-down" style="font-size: 0.7em; margin-left: 5px;"></i></a>
                        <div class="dropdown-menu">
                            <a href="{prefix}resize-pixel.html"><i class="fas fa-vector-square"></i> Resize by Pixel</a>
                            <a href="{prefix}resize-cm.html"><i class="fas fa-ruler-combined"></i> Resize in cm</a>
                            <a href="{prefix}resize-mm.html"><i class="fas fa-ruler"></i> Resize in mm</a>
                            <a href="{prefix}resize-in.html"><i class="fas fa-expand"></i> Resize in Inch</a>
                            <a href="{prefix}crop-image.html"><i class="fas fa-crop-alt"></i> Crop Image</a>
                            <a href="{prefix}rotate-image.html"><i class="fas fa-redo"></i> Rotate Image</a>
                        </div>
                    </div>

                    <!-- Compressor -->
                    <div class="nav-dropdown">
                        <a href="{prefix}compress-20kb.html" class="top-nav-item"><i class="fas fa-compress"></i> Compressor <i class="fas fa-chevron-down" style="font-size: 0.7em; margin-left: 5px;"></i></a>
                        <div class="dropdown-menu">
                            <a href="{prefix}resize-kb.html"><i class="fas fa-file-export"></i> Reduce to KB</a>
                            <a href="{prefix}compress-20kb.html"><i class="fas fa-compress-arrows-alt"></i> Compress to 20KB</a>
                            <a href="{prefix}compress-50kb.html"><i class="fas fa-compress-arrows-alt"></i> Compress to 50KB</a>
                            <a href="{prefix}compress-100kb.html"><i class="fas fa-compress-arrows-alt"></i> Compress to 100KB</a>
                        </div>
                    </div>

                    <!-- ID Photos -->
                    <div class="nav-dropdown">
                        <a href="{prefix}passport-photo.html" class="top-nav-item"><i class="fas fa-id-card"></i> ID Photos <i class="fas fa-chevron-down" style="font-size: 0.7em; margin-left: 5px;"></i></a>
                        <div class="dropdown-menu">
                            <a href="{prefix}passport-photo.html"><i class="fas fa-passport"></i> Passport Maker</a>
                            <a href="{prefix}id-35x45.html"><i class="fas fa-portrait"></i> 35x45 mm</a>
                            <a href="{prefix}id-2x2.html"><i class="fas fa-portrait"></i> 2x2 Inch</a>
                            <a href="{prefix}pan-card.html"><i class="fas fa-address-card"></i> PAN Card</a>
                        </div>
                    </div>

                    <!-- PDF Tools -->
                    <div class="nav-dropdown">
                        <a href="{prefix}merge-pdf.html" class="top-nav-item"><i class="fas fa-file-pdf"></i> PDF Tools <i class="fas fa-chevron-down" style="font-size: 0.7em; margin-left: 5px;"></i></a>
                        <div class="dropdown-menu">
                            <a href="{prefix}merge-pdf.html"><i class="fas fa-file-medical"></i> Merge PDF</a>
                            <a href="{prefix}compress-pdf.html"><i class="fas fa-file-contract"></i> Compress PDF</a>
                            <a href="{prefix}convert-pdf.html"><i class="fas fa-file-import"></i> Image to PDF</a>
                        </div>
                    </div>

                    <!-- Social Media -->
                    <div class="nav-dropdown">
                        <a href="{prefix}instagram-no-crop.html" class="top-nav-item"><i class="fab fa-instagram"></i> Social <i class="fas fa-chevron-down" style="font-size: 0.7em; margin-left: 5px;"></i></a>
                        <div class="dropdown-menu">
                            <a href="{prefix}instagram-no-crop.html"><i class="fab fa-instagram"></i> Instagram</a>
                            <a href="{prefix}whatsapp-dp.html"><i class="fab fa-whatsapp"></i> WhatsApp DP</a>
                            <a href="{prefix}youtube-banner.html"><i class="fab fa-youtube"></i> YouTube Banner</a>
                        </div>
                    </div>
                </nav>"""

def process_file(filepath):
    # Determine basic prefix based on location
    # Index is in root, tools are in /tools
    filename = os.path.basename(filepath)
    prefix = "tools/" if filename == "index.html" else ""
    
    # If file is index.html, we need to adjust links inside the template
    # CURRENT TEMPLATE USES RELATIVE LINKS assuming we are inside tools/
    # If we are in index.html, "resize-pixel.html" becomes "tools/resize-pixel.html"
    
    # Wait! All tool files are in /tools. Index is in root.
    # The links in my nav_html above are relative to the current file.
    # If I am in /tools/foo.html, href="resize-pixel.html" works.
    # If I am in /index.html, href="tools/resize-pixel.html" is needed.
    
    current_nav = new_nav_html.format(prefix=prefix)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if nav_regex.search(content):
        new_content = nav_regex.sub(current_nav, content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")
    else:
        print(f"Nav not found in {filename}")

# Process Index
process_file(index_file)

# Process Tools
if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith(".html"):
             process_file(os.path.join(tools_dir, filename))
