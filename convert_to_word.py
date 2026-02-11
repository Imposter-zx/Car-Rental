"""
Convert Markdown PFC Report to RTF (Rich Text Format)
RTF can be opened directly in Microsoft Word
"""

def markdown_to_rtf():
    """Convert the markdown report to RTF format"""
    
    md_file = r"C:\Users\HASSA\Desktop\Car Rental\Rapport_PFC_Gamil_Rent_Car.md"
    rtf_file = r"C:\Users\HASSA\Desktop\Car Rental\Rapport_PFC_Gamil_Rent_Car.rtf"
    
    # Read markdown
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # RTF header
    rtf_content = r"""{\rtf1\ansi\deff0
{\fonttbl
{\f0\froman Times New Roman;}
{\f1\fswiss Arial;}
{\f2\fmodern Courier New;}
}
{\colortbl;\red0\green0\blue0;\red225\green29\blue72;\red159\green18\blue57;}
{\stylesheet
{\s0\qj\fi0\li0\ri0\sb100\sa100\f0\fs24 Normal;}
{\s1\qc\sb240\sa120\b\f0\fs32 Heading 1;}
{\s2\ql\sb180\sa90\b\f0\fs28 Heading 2;}
{\s3\ql\sb120\sa60\b\f0\fs24 Heading 3;}
}
\paperw11906\paperh16838\margl1701\margr1701\margt1417\margb1417
"""
    
    # Process content line by line
    lines = content.split('\n')
    
    for line in lines:
        line = line.strip()
        
        if not line:
            rtf_content += r"\par" + "\n"
            continue
        
        # Headers
        if line.startswith('# '):
            text = line[2:].strip()
            rtf_content += r"\pard\s1\qc\sb240\sa120\b\fs32 " + escape_rtf(text) + r"\par" + "\n"
        elif line.startswith('## '):
            text = line[3:].strip()
            rtf_content += r"\pard\s2\ql\sb180\sa90\b\fs28 " + escape_rtf(text) + r"\par" + "\n"
        elif line.startswith('### '):
            text = line[4:].strip()
            rtf_content += r"\pard\s3\ql\sb120\sa60\b\fs24 " + escape_rtf(text) + r"\par" + "\n"
        
        # Horizontal rule
        elif line.startswith('---'):
            rtf_content += r"\page" + "\n"  # Page break
        
        # Lists
        elif line.startswith('- ') or line.startswith('* '):
            text = line[2:].strip()
            rtf_content += r"\pard\fi-360\li720\sb60\sa60 " + r"{\f1\bullet} " + escape_rtf(text) + r"\par" + "\n"
        
        elif line[0].isdigit() and '. ' in line:
            parts = line.split('. ', 1)
            if len(parts) == 2:
                num, text = parts
                rtf_content += r"\pard\fi-360\li720\sb60\sa60 " + num + r". " + escape_rtf(text) + r"\par" + "\n"
        
        # Code blocks
        elif line.startswith('```'):
            continue  # Skip code block markers
        
        # Tables (simple conversion)
        elif '|' in line and line.startswith('|'):
            # Skip table headers and separators for now
            continue
        
        # Bold text
        elif '**' in line:
            text = line
            while '**' in text:
                text = text.replace('**', r'{\b ', 1).replace('**', r'}', 1)
            rtf_content += r"\pard\s0\qj\sb100\sa100 " + escape_rtf(text) + r"\par" + "\n"
        
        # Regular paragraph
        else:
            rtf_content += r"\pard\s0\qj\sb100\sa100 " + escape_rtf(line) + r"\par" + "\n"
    
    # RTF footer
    rtf_content += r"}"
    
    # Write RTF file
    with open(rtf_file, 'w', encoding='utf-8') as f:
        f.write(rtf_content)
    
    print(f"✓ Fichier RTF créé: {rtf_file}")
    print(f"\nVous pouvez maintenant:")
    print(f"1. Ouvrir ce fichier directement dans Microsoft Word")
    print(f"2. Le modifier et le formater selon vos besoins")
    print(f"3. L'enregistrer au format .docx")
    
    return True

def escape_rtf(text):
    """Escape special RTF characters"""
    text = text.replace('\\', '\\\\')
    text = text.replace('{', '\\{')
    text = text.replace('}', '\\}')
    # Handle unicode characters
    result = ""
    for char in text:
        if ord(char) > 127:
            result += f"\\u{ord(char)}?"
        else:
            result += char
    return result

if __name__ == "__main__":
    markdown_to_rtf()
