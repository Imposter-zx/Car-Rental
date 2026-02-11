"""
Markdown to HTML Converter for Academic PFC Report
Converts the French academic report to HTML for PDF printing
"""

import os
import re

def convert_markdown_to_html():
    """Convert markdown file to HTML with academic styling"""
    
    # File paths
    md_file = r"C:\Users\HASSA\Desktop\Car Rental\Rapport_PFC_Gamil_Rent_Car.md"
    html_file = r"C:\Users\HASSA\Desktop\Car Rental\Rapport_PFC_Gamil_Rent_Car.html"
    
    # Check if markdown file exists
    if not os.path.exists(md_file):
        print(f"Error: Markdown file not found at {md_file}")
        return False
    
    # Read markdown content
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    print(f"Read {len(md_content)} characters from markdown file")
    
    # Simple markdown to HTML conversion
    html_body = md_content
    
    # Convert headers
    html_body = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html_body, flags=re.MULTILINE)
    
    # Convert bold
    html_body = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html_body)
    
    # Convert inline code
    html_body = re.sub(r'`([^`]+)`', r'<code>\1</code>', html_body)
    
    # Convert horizontal rules
    html_body = re.sub(r'^---$', r'<hr class="page-break">', html_body, flags=re.MULTILINE)
    
    # Convert lists
    html_body = re.sub(r'^- (.+)$', r'<li>\1</li>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'^\d+\. (.+)$', r'<li>\1</li>', html_body, flags=re.MULTILINE)
    
    # Convert checkmarks
    html_body = re.sub(r'✅', r'<span class="checkmark">✅</span>', html_body)
    html_body = re.sub(r'⏳', r'<span class="pending">⏳</span>', html_body)
    
    # Process line by line for better formatting
    lines = html_body.split('\n')
    processed_lines = []
    in_code_block = False
    code_block = []
    in_table = False
    table_lines = []
    in_list = False
    list_items = []
    
    for line in lines:
        # Handle code blocks
        if line.strip().startswith('```'):
            if in_code_block:
                # End code block
                processed_lines.append('<pre><code>' + '\n'.join(code_block) + '</code></pre>')
                code_block = []
                in_code_block = False
            else:
                # Start code block
                in_code_block = True
            continue
        
        if in_code_block:
            code_block.append(line)
            continue
        
        # Handle tables
        if '|' in line and line.strip().startswith('|'):
            if not in_table:
                in_table = True
                table_lines = []
            table_lines.append(line)
            continue
        elif in_table:
            # End of table
            processed_lines.append(convert_table(table_lines))
            table_lines = []
            in_table = False
        
        # Handle lists
        if line.strip().startswith('<li>'):
            if not in_list:
                in_list = True
                list_items = []
            list_items.append(line)
            continue
        elif in_list:
            # End of list
            processed_lines.append('<ul>')
            processed_lines.extend(list_items)
            processed_lines.append('</ul>')
            list_items = []
            in_list = False
        
        # Regular line processing
        if line.strip() and not line.strip().startswith('<'):
            processed_lines.append(f'<p>{line}</p>')
        else:
            processed_lines.append(line)
    
    html_body = '\n'.join(processed_lines)
    
    # Create full HTML document with academic styling
    html_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport PFC - Gamil Rent Car</title>
    <style>
        @page {{
            size: A4;
            margin: 2.5cm 2cm;
        }}
        
        @media print {{
            body {{
                margin: 0;
                padding: 0;
            }}
            .page-break {{
                page-break-before: always;
                border: none;
                margin: 0;
                padding: 0;
            }}
            h1 {{
                page-break-after: avoid;
            }}
            h2, h3 {{
                page-break-after: avoid;
            }}
            table {{
                page-break-inside: avoid;
            }}
            pre {{
                page-break-inside: avoid;
            }}
            .print-button {{
                display: none;
            }}
        }}
        
        body {{
            font-family: 'Times New Roman', 'Georgia', serif;
            line-height: 1.8;
            color: #000;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
            font-size: 12pt;
        }}
        
        h1 {{
            color: #000;
            text-align: center;
            margin-top: 40px;
            margin-bottom: 30px;
            font-size: 20pt;
            font-weight: bold;
            text-transform: uppercase;
        }}
        
        h2 {{
            color: #000;
            margin-top: 30px;
            margin-bottom: 15px;
            font-size: 16pt;
            font-weight: bold;
            border-bottom: 2px solid #000;
            padding-bottom: 5px;
        }}
        
        h3 {{
            color: #000;
            margin-top: 20px;
            margin-bottom: 12px;
            font-size: 14pt;
            font-weight: bold;
        }}
        
        p {{
            margin: 10px 0;
            text-align: justify;
            text-indent: 0;
        }}
        
        table {{
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            font-size: 11pt;
        }}
        
        th, td {{
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }}
        
        th {{
            background-color: #f0f0f0;
            font-weight: bold;
        }}
        
        code {{
            background-color: #f5f5f5;
            padding: 2px 5px;
            border: 1px solid #ddd;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
        }}
        
        pre {{
            background-color: #f5f5f5;
            padding: 15px;
            border: 1px solid #ddd;
            overflow-x: auto;
            margin: 15px 0;
            font-size: 10pt;
        }}
        
        pre code {{
            background-color: transparent;
            padding: 0;
            border: none;
        }}
        
        ul, ol {{
            margin: 10px 0;
            padding-left: 40px;
        }}
        
        li {{
            margin: 8px 0;
        }}
        
        hr {{
            border: none;
            border-top: 1px solid #000;
            margin: 30px 0;
        }}
        
        strong {{
            font-weight: bold;
            color: #000;
        }}
        
        .checkmark {{
            color: green;
            font-weight: bold;
        }}
        
        .pending {{
            color: orange;
            font-weight: bold;
        }}
        
        .print-button {{
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #E11D48;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14pt;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            z-index: 1000;
        }}
        
        .print-button:hover {{
            background-color: #9F1239;
        }}
        
        /* Academic formatting */
        .title-page {{
            text-align: center;
            margin-top: 100px;
        }}
        
        .sommaire {{
            margin-top: 50px;
        }}
        
        .sommaire li {{
            list-style: none;
            margin: 5px 0;
        }}
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">Imprimer en PDF (Ctrl+P)</button>
    
    {html_body}
    
    <script>
        // Auto-fix nested ul tags
        document.addEventListener('DOMContentLoaded', function() {{
            const uls = document.querySelectorAll('ul');
            uls.forEach(ul => {{
                if (ul.children.length === 1 && ul.children[0].tagName === 'UL') {{
                    ul.parentNode.replaceChild(ul.children[0], ul);
                }}
            }});
        }});
    </script>
</body>
</html>"""
    
    # Write HTML file
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"\n✓ Fichier HTML créé avec succès: {html_file}")
    print(f"\nPour convertir en PDF:")
    print(f"1. Ouvrez le fichier HTML dans votre navigateur")
    print(f"2. Appuyez sur Ctrl+P (ou cliquez sur 'Imprimer en PDF')")
    print(f"3. Sélectionnez 'Microsoft Print to PDF' comme imprimante")
    print(f"4. Cliquez sur 'Enregistrer'")
    
    return True

def convert_table(table_lines):
    """Convert markdown table to HTML table"""
    if not table_lines:
        return ""
    
    html = '<table>\n'
    
    for i, line in enumerate(table_lines):
        cells = [cell.strip() for cell in line.split('|')[1:-1]]
        
        # Skip separator line
        if all('-' in cell or not cell for cell in cells):
            continue
        
        # First row is header
        if i == 0:
            html += '<thead><tr>\n'
            for cell in cells:
                html += f'<th>{cell}</th>\n'
            html += '</tr></thead>\n<tbody>\n'
        else:
            html += '<tr>\n'
            for cell in cells:
                html += f'<td>{cell}</td>\n'
            html += '</tr>\n'
    
    html += '</tbody>\n</table>'
    return html

if __name__ == "__main__":
    convert_markdown_to_html()
