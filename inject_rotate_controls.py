import os

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'

# The HTML to inject
controls_html = """
                                <div id="rotate-controls" class="control-section hidden">
                                    <h3 class="section-label">Rotate Image</h3>
                                    <div class="toggle-row" style="gap: 10px;">
                                        <button id="btn-rotate-left" class="btn-outline" style="flex:1; justify-content: center;"><i class="fas fa-undo"></i> -90°</button>
                                        <button id="btn-rotate-right" class="btn-outline" style="flex:1; justify-content: center;"><i class="fas fa-redo"></i> +90°</button>
                                    </div>
                                    <input type="hidden" id="rotate-val" value="0">
                                </div>
"""

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'id="rotate-controls"' in content:
        print(f"Skipping {os.path.basename(filepath)} (controls already exist)")
        return

    # Find insertion point: <div class="action-footer">
    target_str = '<div class="action-footer">'
    if target_str in content:
        new_content = content.replace(target_str, controls_html + "\n" + target_str)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Injected rotate controls into {os.path.basename(filepath)}")
    else:
        print(f"Could not find insertion point in {os.path.basename(filepath)}")

if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith(".html"):
             process_file(os.path.join(tools_dir, filename))
