"""
Simple Markdown to HTML Converter for PDF printing
Converts the Car Rental Platform Analysis Report to HTML that can be printed to PDF
"""

import os
import re

def convert_markdown_to_html():
    """Convert markdown file to HTML with professional styling"""
    
    # File paths
    md_file = r"C:\Users\HASSA\.gemini\antigravity\brain\05946adb-cbfd-47e6-bbf6-dc3d2ee1c932\car_rental_platform_analysis.md"
    html_file = r"C:\Users\HASSA\Desktop\Car Rental\Gamil_Rent_Car_Analysis_Report.html"
    
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
    html_body = re.sub(r'^---$', r'<hr>', html_body, flags=re.MULTILINE)
    
    # Convert lists
    html_body = re.sub(r'^\- (.+)$', r'<li>\1</li>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'^\d+\. (.+)$', r'<li>\1</li>', html_body, flags=re.MULTILINE)
    
    # Wrap list items in ul tags (simple approach)
    html_body = re.sub(r'(<li>.*?</li>)', r'<ul>\1</ul>', html_body, flags=re.DOTALL)
    
    # Convert paragraphs (lines that aren't already tags)
    lines = html_body.split('\n')
    processed_lines = []
    in_code_block = False
    code_block = []
    in_table = False
    table_lines = []
    
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
        
        # Regular line processing
        if line.strip() and not line.strip().startswith('<'):
            processed_lines.append(f'<p>{line}</p>')
        else:
            processed_lines.append(line)
    
    html_body = '\n'.join(processed_lines)
    
    # Create full HTML document
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gamil Rent Car - Professional Analysis Report</title>
    <style>
        @page {{
            size: A4;
            margin: 2cm;
        }}
        
        @media print {{
            body {{
                margin: 0;
                padding: 0;
            }}
            h1 {{
                page-break-before: always;
            }}
            h1:first-of-type {{
                page-break-before: avoid;
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
        }}
        
        body {{
            font-family: 'Segoe UI', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }}
        
        h1 {{
            color: #E11D48;
            border-bottom: 3px solid #E11D48;
            padding-bottom: 10px;
            margin-top: 40px;
            margin-bottom: 20px;
            font-size: 28px;
        }}
        
        h1:first-of-type {{
            margin-top: 0;
            text-align: center;
            font-size: 32px;
        }}
        
        h2 {{
            color: #9F1239;
            margin-top: 30px;
            margin-bottom: 15px;
            border-bottom: 2px solid #ddd;
            padding-bottom: 8px;
            font-size: 22px;
        }}
        
        h3 {{
            color: #444;
            margin-top: 25px;
            margin-bottom: 12px;
            font-size: 18px;
        }}
        
        p {{
            margin: 10px 0;
            text-align: justify;
        }}
        
        table {{
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        
        th, td {{
            border: 1px solid #ddd;
            padding: 12px 8px;
            text-align: left;
        }}
        
        th {{
            background-color: #E11D48;
            color: white;
            font-weight: 600;
        }}
        
        tr:nth-child(even) {{
            background-color: #f9f9f9;
        }}
        
        tr:hover {{
            background-color: #f5f5f5;
        }}
        
        code {{
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', 'Consolas', monospace;
            font-size: 13px;
            color: #E11D48;
        }}
        
        pre {{
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border-left: 4px solid #E11D48;
            margin: 15px 0;
        }}
        
        pre code {{
            background-color: transparent;
            padding: 0;
            color: #333;
        }}
        
        ul, ol {{
            margin: 10px 0;
            padding-left: 30px;
        }}
        
        li {{
            margin: 5px 0;
        }}
        
        hr {{
            border: none;
            border-top: 2px solid #ddd;
            margin: 40px 0;
        }}
        
        strong {{
            color: #E11D48;
            font-weight: 600;
        }}
        
        blockquote {{
            border-left: 4px solid #E11D48;
            padding-left: 20px;
            margin: 20px 0;
            color: #666;
            font-style: italic;
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
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
        }}
        
        .print-button:hover {{
            background-color: #9F1239;
        }}
        
        @media print {{
            .print-button {{
                display: none;
            }}
        }}
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">Print to PDF (Ctrl+P)</button>
    
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
    
    print(f"\n✓ HTML file created successfully: {html_file}")
    print(f"\nTo convert to PDF:")
    print(f"1. Open the HTML file in your browser")
    print(f"2. Press Ctrl+P (or click the 'Print to PDF' button)")
    print(f"3. Select 'Save as PDF' as the printer")
    print(f"4. Click 'Save'")
    
    return True

def convert_table(table_lines):
    """Convert markdown table to HTML table"""
    if not table_lines:
        return ""
    
    html = '<table>\n'
    
    for i, line in enumerate(table_lines):
        cells = [cell.strip() for cell in line.split('|')[1:-1]]  # Remove empty first/last
        
        # Skip separator line (contains dashes)
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
