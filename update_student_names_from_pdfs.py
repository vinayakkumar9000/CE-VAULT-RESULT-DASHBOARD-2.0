#!/usr/bin/env python3
"""
Update student names in all_students.json from PDF files.
"""

import pdfplumber
import json
import re
from pathlib import Path


def extract_student_info_from_pdf(pdf_path):
    """Extract student information from PDF."""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            page = pdf.pages[0]
            text = page.extract_text()
            
            info = {}
            
            # Extract registration number
            reg_match = re.search(r'Registration No\s*:\s*(\d+)', text)
            if reg_match:
                info['registration_number'] = reg_match.group(1)
            
            # Extract roll number
            roll_match = re.search(r'Roll No\s*:\s*(\d+)', text)
            if roll_match:
                info['roll_number'] = roll_match.group(1)
            
            # Extract name
            name_match = re.search(r'obtained by\s+([A-Z\s]+)\s+of', text)
            if name_match:
                info['name'] = name_match.group(1).strip()
            
            return info
    except Exception as e:
        print(f"Error extracting info from {pdf_path}: {e}")
        return {}


def update_student_names(result_dir="result"):
    """Update student names from PDF files."""
    result_path = Path(result_dir)
    
    # Load all_students.json
    all_students_file = result_path / "all_students.json"
    with open(all_students_file, 'r', encoding='utf-8') as f:
        all_students = json.load(f)
    
    print(f"Loaded {len(all_students)} students from all_students.json")
    
    # Find PDF files
    pdf_files = list(result_path.glob("*.pdf"))
    print(f"Found {len(pdf_files)} PDF files")
    
    # Extract info from PDFs
    pdf_info = {}
    for pdf_file in pdf_files:
        info = extract_student_info_from_pdf(pdf_file)
        if info and 'roll_number' in info:
            pdf_info[info['roll_number']] = info
            print(f"  Extracted: {info['roll_number']} - {info.get('name', 'N/A')}")
    
    # Update student names
    updated_count = 0
    for student in all_students:
        roll_number = student['roll_number']
        if roll_number in pdf_info:
            if student['name'].startswith('STUDENT '):
                student['name'] = pdf_info[roll_number].get('name', student['name'])
                student['registration_number'] = pdf_info[roll_number].get('registration_number', student['registration_number'])
                updated_count += 1
    
    # Save updated data
    with open(all_students_file, 'w', encoding='utf-8') as f:
        json.dump(all_students, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Updated {updated_count} student names")
    print(f"✓ Saved to {all_students_file}")


if __name__ == "__main__":
    update_student_names()
