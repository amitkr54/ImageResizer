const fs = require('fs');
const path = require('path');

const toolsDir = path.join(process.cwd(), 'tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(toolsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove logo from sidebar-header
    content = content.replace(/<div class="logo" onclick="window.location.href='..\/index.html'" style="cursor:pointer;">[\s\S]*?<\/div>/, "");

    // 2. Add logo to top-bar and remove h1
    const newHeaderLeft = \`
                <div class="top-left">
                    <button id="menu-toggle" class="btn-icon-top"><i class="fas fa-bars"></i></button>
                    <div class="logo" onclick="window.location.href='../index.html'">
                        <i class="fas fa-expand-arrows-alt"></i>
                        <span>Image Resizer Pro</span>
                    </div>
                </div>\`;

    content = content.replace(/<div class="top-left">[\s\S]*?<\/div>/, newHeaderLeft);

    fs.writeFileSync(filePath, content);
    console.log(\`Updated: \${file}\`);
});
