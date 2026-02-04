import os

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'

# HTML for Instagram background color control
controls_html = """
                                <div id="instagram-bg-controls" class="control-section hidden">
                                    <h3 class="section-label">Instagram Background</h3>
                                    <div class="input-block">
                                        <label>Background Color (for letterboxing)</label>
                                        <div style="display: flex; gap: 10px; align-items: center;">
                                            <input type="color" id="instagram-bg-color" value="#ffffff" style="height: 40px; width: 60px; border: none; border-radius: 8px; cursor: pointer;">
                                            <span id="bg-color-label" style="color: var(--text-secondary); font-size: 0.9rem;">#ffffff (White)</span>
                                        </div>
                                        <div style="display: flex; gap: 5px; margin-top: 10px;">
                                            <button type="button" class="btn-outline" style="flex: 1; font-size: 0.85rem;" onclick="document.getElementById('instagram-bg-color').value='#ffffff'; document.getElementById('bg-color-label').textContent='#ffffff (White)'">White</button>
                                            <button type="button" class="btn-outline" style="flex: 1; font-size: 0.85rem;" onclick="document.getElementById('instagram-bg-color').value='#000000'; document.getElementById('bg-color-label').textContent='#000000 (Black)'">Black</button>
                                            <button type="button" class="btn-outline" style="flex: 1; font-size: 0.85rem;" onclick="document.getElementById('instagram-bg-color').value='#f3f4f6'; document.getElementById('bg-color-label').textContent='#f3f4f6 (Gray)'">Gray</button>
                                        </div>
                                    </div>
                                </div>
"""

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'id="instagram-bg-controls"' in content:
        print(f"Skipping {os.path.basename(filepath)} (controls already exist)")
        return

    # Find insertion point
    target_str = '<div class="action-footer">'
    if target_str in content:
        new_content = content.replace(target_str, controls_html + "\n" + target_str)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Injected Instagram controls into {os.path.basename(filepath)}")
    else:
        print(f"Could not find insertion point in {os.path.basename(filepath)}")

if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith(".html"):
             process_file(os.path.join(tools_dir, filename))

print("\n✅ Instagram background controls injection complete!")
