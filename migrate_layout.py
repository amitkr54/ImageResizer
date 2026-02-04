import os
import re

tools_dir = r'c:\Users\Admin\Desktop\Image Resizer\tools'

# 1. Regex to extract the Header
header_pattern = re.compile(r'<header class="top-bar">.*?</header>', re.DOTALL)

# 2. Regex to extract the Sidebar
sidebar_pattern = re.compile(r'<aside class="sidebar">.*?</aside>', re.DOTALL)

# 3. Regex to extract the Main Content
# We need to be careful here. The main content is inside <main class="main-content">...</main>
# But in the OLD structure, <header> is INSIDE <main>.
# So we need to grab <main> content MINUS the header.
main_pattern = re.compile(r'<main class="main-content">\s*<header class="top-bar">.*?</header>(.*?)</main>', re.DOTALL)

# Template for the clean structure
html_template = """<!DOCTYPE html>
<html lang="en">
{head_section}
<body data-tool="{tool_id}" data-tool-title="{tool_title}">
    <div class="app-container">
        {header_content}

        <div class="app-body">
            {sidebar_content}

            <main class="main-content">
{main_body_content}
            </main>
        </div>
    </div>
    {scripts_section}
</body>
</html>"""

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract Head
    head_match = re.search(r'(<head>.*?</head>)', content, re.DOTALL)
    if not head_match: return
    head_section = head_match.group(1)

    # Extract Data Attributes from Body
    body_tag_match = re.search(r'<body (.*?)>', content)
    body_attrs = body_tag_match.group(1) if body_tag_match else ''
    
    # Extract Header (It is currently inside main, so we find it there)
    header_match = header_pattern.search(content)
    if not header_match: return
    header_content = header_match.group(0)

    # Extract Sidebar
    sidebar_match = sidebar_pattern.search(content)
    if not sidebar_match: return
    sidebar_content = sidebar_match.group(0)

    # Extract Main Body (everything inside main except header)
    main_match = main_pattern.search(content)
    if not main_match: 
        # Fallback if header is already moved or different structure
        return
    main_body_content = main_match.group(1)

    # Extract Scripts (at the end)
    scripts_match = re.search(r'(<div id="loader".*?</html>)', content, re.DOTALL)
    if not scripts_match:
         # Try to find just scripts if loader is missing
         scripts_match = re.search(r'(<script.*?>.*?</script>.*</body>)', content, re.DOTALL)
    
    scripts_section = scripts_match.group(1) if scripts_match else ""
    # Remove </body> and </html> from scripts section if captured
    scripts_section = scripts_section.replace('</body>', '').replace('</html>', '')

    # Get tool ID and Title from regex or simply reuse the body tag
    tool_id_match = re.search(r'data-tool="([^"]+)"', body_attrs)
    tool_title_match = re.search(r'data-tool-title="([^"]+)"', body_attrs)
    
    tool_id = tool_id_match.group(1) if tool_id_match else ""
    tool_title = tool_title_match.group(1) if tool_title_match else ""

    new_html = html_template.format(
        head_section=head_section,
        tool_id=tool_id,
        tool_title=tool_title,
        header_content=header_content,
        sidebar_content=sidebar_content,
        main_body_content=main_body_content,
        scripts_section=scripts_section
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f"Migrated {os.path.basename(filepath)}")

if os.path.exists(tools_dir):
    for filename in os.listdir(tools_dir):
        if filename.endswith(".html"):
             process_file(os.path.join(tools_dir, filename))
