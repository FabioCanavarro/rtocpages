import os
import zipfile
import re
import shutil

def modify_epub(input_epub, output_epub):
    temp_epub = input_epub + ".tmp"
    with zipfile.ZipFile(input_epub, 'r') as zin, zipfile.ZipFile(temp_epub, 'w') as zout:
        for item in zin.infolist():
            content = zin.read(item.filename)
            # Check if this is a chapter file like EPUB/chapter-12.xhtml
            m = re.search(r'EPUB/chapter-(\d+)\.xhtml$', item.filename)
            if m:
                ch_num = m.group(1)
                html_str = content.decode('utf-8', errors='ignore')
                comment_html = f'''
<div class="chapter-comments-link" style="margin-top: 3em; padding-top: 1.5em; border-top: 1px dashed rgba(150, 150, 150, 0.4); text-align: center; font-family: sans-serif;">
  <p style="margin-bottom: 0.8em; font-size: 14px; color: #888888;">Cultivator Discussion &amp; Reader Comments</p>
  <a href="https://rtocpages.vercel.app/read/{ch_num}#comments" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">💬 Join Chapter {ch_num} Comments &amp; Discussion</a>
</div>
'''
                if '</body>' in html_str and 'class="chapter-comments-link"' not in html_str:
                    html_str = html_str.replace('</body>', f'{comment_html}</body>')
                content = html_str.encode('utf-8')
            zout.writestr(item, content)
            
    if os.path.exists(temp_epub):
        shutil.move(temp_epub, output_epub)
        print(f"Successfully updated {output_epub} with chapter comment links!")

if __name__ == "__main__":
    epub_root = "A_Regressors_Tale_of_Cultivation.epub"
    epub_public = os.path.join("public", "A_Regressors_Tale_of_Cultivation.epub")
    
    modify_epub(epub_root, epub_root)
    if os.path.exists("public"):
        shutil.copyfile(epub_root, epub_public)
        print(f"Copied updated EPUB to {epub_public}")
