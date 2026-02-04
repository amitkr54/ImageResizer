import os

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'

# The HTML to inject
controls_html = """
                                <div id="flip-controls" class="control-section hidden">
                                    <h3 class="section-label">Flip Direction</h3>
                                    <div class="toggle-row" style="gap: 10px;">
                                        <button id="btn-flip-h" class="btn-outline" style="flex:1; justify-content: center;"><i class="fas fa-arrows-alt-h"></i> Horizontal</button>
                                        <button id="btn-flip-v" class="btn-outline" style="flex:1; justify-content: center;"><i class="fas fa-arrows-alt-v"></i> Vertical</button>
                                    </div>
                                    <input type="hidden" id="flip-h-val" value="1">
                                    <input type="hidden" id="flip-v-val" value="1">
                                </div>

                                <div id="crop-controls" class="control-section hidden">
                                    <h3 class="section-label">Crop Image</h3>
                                    <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:10px;">Crop functionality is currently limited to single image processing.</p>
                                    <!-- Placeholder for crop logic -->
                                </div>
"""

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if controls already exist to avoid double injection
    if 'id="flip-controls"' in content:
        print(f"Skipping {os.path.basename(filepath)} (controls already exist)")
        return

    # Find insertion point: <div class="action-footer">
    target_str = '<div class="action-footer">'
    if target_str in content:
        new_content = content.replace(target_str, controls_html + "\n" + target_str)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Injected controls into {os.path.basename(filepath)}")
    else:
        print(f"Could not find insertion point in {os.path.basename(filepath)}")

if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith(".html"):
             process_file(os.path.join(tools_dir, filename))
