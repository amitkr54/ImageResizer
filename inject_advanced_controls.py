import os

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'

# HTML for all new controls
controls_html = """
                                <div id="watermark-controls" class="control-section hidden">
                                    <h3 class="section-label">Watermark Settings</h3>
                                    <div class="input-block">
                                        <label>Watermark Text</label>
                                        <input type="text" id="watermark-text" placeholder="Enter watermark text" value="© Your Name">
                                    </div>
                                    <div class="input-block">
                                        <label>Position</label>
                                        <select id="watermark-position">
                                            <option value="bottom-right">Bottom Right</option>
                                            <option value="bottom-left">Bottom Left</option>
                                            <option value="top-right">Top Right</option>
                                            <option value="top-left">Top Left</option>
                                            <option value="center">Center</option>
                                        </select>
                                    </div>
                                    <div class="input-block">
                                        <label>Opacity (%)</label>
                                        <input type="range" id="watermark-opacity" min="10" max="100" value="50">
                                        <span id="opacity-value">50%</span>
                                    </div>
                                    <div class="input-block">
                                        <label>Font Size</label>
                                        <input type="range" id="watermark-fontsize" min="10" max="100" value="30">
                                        <span id="fontsize-value">30px</span>
                                    </div>
                                </div>

                                <div id="metadata-controls" class="control-section hidden">
                                    <h3 class="section-label">Image Metadata</h3>
                                    <div id="metadata-display" style="background: rgba(15, 23, 42, 0.6); padding: 1rem; border-radius: 8px; font-size: 0.9rem; line-height: 1.8; max-height: 400px; overflow-y: auto;">
                                        <p style="color: var(--text-secondary);">Upload an image to view metadata...</p>
                                    </div>
                                </div>

                                <div id="signature-controls" class="control-section hidden">
                                    <h3 class="section-label">Signature Settings</h3>
                                    <div style="background: rgba(15, 23, 42, 0.6); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                                        <canvas id="signature-canvas" width="400" height="200" style="background: white; border-radius: 8px; cursor: crosshair; display: block; width: 100%;"></canvas>
                                    </div>
                                    <div style="display: flex; gap: 10px; margin-bottom: 1rem;">
                                        <button id="btn-clear-signature" class="btn-outline" style="flex: 1;"><i class="fas fa-eraser"></i> Clear</button>
                                        <button id="btn-download-signature" class="btn-primary" style="flex: 1;"><i class="fas fa-download"></i> Save Signature</button>
                                    </div>
                                    <div class="input-block">
                                        <label>Pen Size</label>
                                        <input type="range" id="signature-pensize" min="1" max="10" value="3">
                                        <span id="pensize-value">3px</span>
                                    </div>
                                </div>
"""

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'id="watermark-controls"' in content:
        print(f"Skipping {os.path.basename(filepath)} (controls already exist)")
        return

    # Find insertion point
    target_str = '<div class="action-footer">'
    if target_str in content:
        new_content = content.replace(target_str, controls_html + "\n" + target_str)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Injected advanced controls into {os.path.basename(filepath)}")
    else:
        print(f"Could not find insertion point in {os.path.basename(filepath)}")

if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith(".html"):
             process_file(os.path.join(tools_dir, filename))

print("\n✅ Control injection complete!")
