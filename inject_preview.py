import os

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'

# HTML for before/after preview
preview_html = """
                <!-- Before/After Preview -->
                <div id="before-after-preview" class="hidden" style="margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Preview Comparison</h3>
                    <div class="comparison-container" style="position: relative; max-width: 800px; margin: 0 auto; background: rgba(15, 23, 42, 0.6); border-radius: 12px; overflow: hidden;">
                        <div class="comparison-wrapper" style="position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden;">
                            <img id="preview-before" class="comparison-image" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain;">
                            <div class="comparison-clip" style="position: absolute; top: 0; right: 0; bottom: 0; left: 50%; overflow: hidden;">
                                <img id="preview-after" class="comparison-image" style="position: absolute; top: 0; left: 0; width: 200%; height: 100%; object-fit: contain; transform: translateX(-50%);">
                            </div>
                            <div class="comparison-slider" style="position: absolute; top: 0; bottom: 0; left: 50%; width: 3px; background: linear-gradient(to bottom, rgba(14, 165, 233, 0.8), rgba(59, 130, 246, 0.8)); cursor: ew-resize; z-index: 10;">
                                <div class="slider-handle" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: white; border: 3px solid #0ea5e9; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-arrows-alt-h" style="color: #0ea5e9; font-size: 16px;"></i>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                            <span><i class="fas fa-image"></i> Original</span>
                            <span>Processed <i class="fas fa-check-circle"></i></span>
                        </div>
                    </div>
                </div>
"""

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'id="before-after-preview"' in content:
        print(f"Skipping {os.path.basename(filepath)} (preview already exists)")
        return

    # Find insertion point: before results-area
    target_str = '<div id="results-area" class="hidden">'
    if target_str in content:
        new_content = content.replace(target_str, preview_html + "\n                " + target_str)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Injected before/after preview into {os.path.basename(filepath)}")
    else:
        print(f"Could not find insertion point in {os.path.basename(filepath)}")

if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith(".html"):
             process_file(os.path.join(tools_dir, filename))

print("\n✅ Before/After preview injection complete!")
