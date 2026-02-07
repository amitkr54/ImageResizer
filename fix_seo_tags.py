import os
import glob

def fix_files():
    # Remove the accidentally injected string from all HTML files
    for file_path in glob.glob("tools/*.html") + ["index.html"]:
        if not os.path.exists(file_path):
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # The bug appears as escaped characters or literal \n in the source sometimes
        targets = [
            '\\n    &lt;!-- SEO Tags --&gt;\\n',
            '\n    &lt;!-- SEO Tags --&gt;\n',
            '\\n    <!-- SEO Tags -->\\n',
            '&lt;!-- SEO Tags --&gt;',
        ]
        
        new_content = content
        for target in targets:
            new_content = new_content.replace(target, '')
        
        if content != new_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed {file_path}")

if __name__ == "__main__":
    fix_files()
