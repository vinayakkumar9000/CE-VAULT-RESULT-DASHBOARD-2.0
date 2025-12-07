#!/usr/bin/env python3
"""
Preload Hint Injector
Adds <link rel="preload"> tags to index.html for main CSS and JS bundles.
This improves initial load performance without modifying source files.
"""

import argparse
import re
import sys
from pathlib import Path


def inject_preload_hints(html_file):
    """
    Inject preload hints into the built index.html file.
    Scans for CSS and JS files and adds appropriate preload tags.
    """
    html_path = Path(html_file)
    
    if not html_path.exists():
        print(f"Error: HTML file '{html_file}' does not exist", file=sys.stderr)
        sys.exit(1)
    
    # Read the HTML file
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Extract CSS and JS file references
    css_files = re.findall(r'href="([^"]*\.css)"', html_content)
    js_files = re.findall(r'src="([^"]*\.js)"', html_content)
    
    if not css_files and not js_files:
        print("Warning: No CSS or JS files found to preload")
        return
    
    # Build preload tags
    preload_tags = []
    
    # Add preload for CSS files
    for css_file in css_files:
        preload_tags.append(f'    <link rel="preload" href="{css_file}" as="style">')
    
    # Add preload for JS files (only the main bundle, not module preloads)
    main_js_files = [js for js in js_files if '/assets/' in js and not js.endswith('-legacy.js')]
    for js_file in main_js_files[:1]:  # Only preload the main bundle
        preload_tags.append(f'    <link rel="modulepreload" href="{js_file}">')
    
    if not preload_tags:
        print("No suitable files found for preloading")
        return
    
    preload_html = '\n'.join(preload_tags)
    
    # Find the </head> tag and insert preload tags before it
    if '</head>' not in html_content:
        print("Error: No </head> tag found in HTML file", file=sys.stderr)
        sys.exit(1)
    
    # Insert preload tags before </head>
    html_content = html_content.replace('</head>', f'{preload_html}\n  </head>')
    
    # Write back to file
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✓ Injected {len(preload_tags)} preload hint(s) into {html_file}")
    for tag in preload_tags:
        print(f"  {tag.strip()}")


def main():
    parser = argparse.ArgumentParser(
        description='Inject preload hints into built HTML file'
    )
    parser.add_argument(
        'html_file',
        help='Path to index.html file (e.g., dist/index.html)'
    )
    
    args = parser.parse_args()
    
    try:
        inject_preload_hints(args.html_file)
        sys.exit(0)
    except Exception as e:
        print(f"Fatal error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
