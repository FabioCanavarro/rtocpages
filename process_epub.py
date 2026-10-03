import os
import zipfile
import re
import json
import shutil
from html.parser import HTMLParser

class HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        
    def handle_data(self, data):
        self.text.append(data)
        
    def get_text(self):
        return "".join(self.text)

def clean_html_content(raw_html):
    # Extract body content if present
    match = re.search(r'<body[^>]*>(.*?)</body>', raw_html, re.DOTALL | re.IGNORECASE)
    if match:
        content = match.group(1)
    else:
        content = raw_html
    return content.strip()

def process_epub(epub_path, target_public_dir):
    print(f"Opening EPUB at: {epub_path}")
    os.makedirs(target_public_dir, exist_ok=True)
    
    epub_data_dir = os.path.join(target_public_dir, "epub_data")
    chapters_dir = os.path.join(epub_data_dir, "chapters")
    os.makedirs(chapters_dir, exist_ok=True)

    # 1. Copy epub file to public for download
    download_target = os.path.join(target_public_dir, "A_Regressors_Tale_of_Cultivation.epub")
    if not os.path.exists(download_target) or os.path.getsize(download_target) != os.path.getsize(epub_path):
        print("Copying EPUB to public download location...")
        shutil.copyfile(epub_path, download_target)

    with zipfile.ZipFile(epub_path, 'r') as z:
        file_list = z.namelist()
        print(f"Total entries in EPUB: {len(file_list)}")

        # 2. Extract cover image
        cover_entries = [f for f in file_list if 'cover.jpg' in f.lower() or 'cover.png' in f.lower()]
        if cover_entries:
            cover_data = z.read(cover_entries[0])
            with open(os.path.join(target_public_dir, "cover.jpg"), "wb") as f:
                f.write(cover_data)
            with open(os.path.join(epub_data_dir, "cover.jpg"), "wb") as f:
                f.write(cover_data)
            print("Extracted cover image.")

        # 3. Process chapter files
        chapter_entries = [f for f in file_list if re.search(r'EPUB/chapter-\d+\.xhtml$', f)]
        
        # Sort chapters numerically
        def extract_num(filename):
            m = re.search(r'chapter-(\d+)\.xhtml', filename)
            return int(m.group(1)) if m else 999999

        chapter_entries.sort(key=extract_num)
        print(f"Found {len(chapter_entries)} chapters.")

        toc = []
        total_words = 0

        for idx, entry_name in enumerate(chapter_entries):
            raw_content = z.read(entry_name).decode('utf-8', errors='ignore')
            num = extract_num(entry_name)

            # Find title
            title_match = re.search(r'<h[1-3][^>]*>(.*?)</h[1-3]>', raw_content, re.DOTALL | re.IGNORECASE)
            if not title_match:
                title_match = re.search(r'<title[^>]*>(.*?)</title>', raw_content, re.DOTALL | re.IGNORECASE)
            
            if title_match:
                parser = HTMLTextExtractor()
                parser.feed(title_match.group(1))
                title = parser.get_text().strip()
                title = re.sub(r'\s+', ' ', title)
            else:
                title = f"Chapter {num}"

            # Clean body html
            body_html = clean_html_content(raw_content)

            # Text preview & word count
            parser = HTMLTextExtractor()
            parser.feed(body_html)
            plain_text = parser.get_text()
            words = len(plain_text.split())
            total_words += words

            preview = plain_text.strip()[:180].replace('\n', ' ')
            preview = re.sub(r'\s+', ' ', preview) + "..."

            ch_id = f"chapter-{num}"
            ch_data = {
                "id": ch_id,
                "num": num,
                "title": title,
                "wordCount": words,
                "content": body_html
            }

            # Save individual chapter json
            with open(os.path.join(chapters_dir, f"{ch_id}.json"), "w", encoding="utf-8") as f:
                json.dump(ch_data, f, ensure_ascii=False)

            toc.append({
                "id": ch_id,
                "num": num,
                "title": title,
                "wordCount": words,
                "preview": preview
            })

            if (idx + 1) % 100 == 0 or idx + 1 == len(chapter_entries):
                print(f"Processed {idx + 1}/{len(chapter_entries)} chapters...")

        # Save TOC index
        with open(os.path.join(epub_data_dir, "toc.json"), "w", encoding="utf-8") as f:
            json.dump(toc, f, ensure_ascii=False)

        # Save overall metadata
        metadata = {
            "title": "A Regressor's Tale of Cultivation",
            "originalTitle": "회차진행자: 회귀자의 신선기",
            "author": "Pluto (해날)",
            "translator": "Netherworld / Dao Translators",
            "totalChapters": len(chapter_entries),
            "totalWords": total_words,
            "fileSizeMB": round(os.path.getsize(epub_path) / (1024 * 1024), 2),
            "description": "Seo Eun-hyun finds himself trapped in an endless cycle of regression in a brutal cultivation world. With no legendary cheat abilities or innate talent, he must rely on sheer perseverance, martial mastery, and unyielding will across centuries of rebirth to defy destiny.",
            "cover": "/cover.jpg"
        }

        with open(os.path.join(epub_data_dir, "metadata.json"), "w", encoding="utf-8") as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2)

        print("EPUB Processing Complete!")

if __name__ == "__main__":
    epub_file = "A_Regressors_Tale_of_Cultivation.epub"
    target_public = "public"
    if os.path.exists("app_bootstrap"):
        target_public = os.path.join("app_bootstrap", "public")
    process_epub(epub_file, target_public)
