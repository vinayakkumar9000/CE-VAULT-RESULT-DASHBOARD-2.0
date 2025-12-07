#!/usr/bin/env python3
"""
Extract subject-wise structured data from PDF mark sheets.
Generates JSON files for each student with detailed subject information.
"""

import pdfplumber
import json
import os
import re
from pathlib import Path


def parse_subject_line(line, category):
    """
    Parse a single subject line from the PDF text.
    Returns a dict with extracted fields or None if parsing fails.
    
    Line format example:
    ENVT. EDU. AND SUST. DEVELOP. 1.0 15 - 015 - 06 12 - 12 A
    APPLIED PHYSICS -A 3.0 30 70 100 28 40 18 43 61 C
    
    Structure: NAME CREDITS INT FIN TOTAL FIN TOTAL INT FIN TOTAL GRADE
    """
    # Split by single space and filter empty strings
    parts = [p.strip() for p in line.split() if p.strip()]
    
    if len(parts) < 5:
        return None
    
    try:
        # Grade is always the last element
        grade = parts[-1]
        
        # Marks total is second to last
        marks_total = parts[-2]
        
        # Working backwards from the end:
        # parts[-1] = GRADE
        # parts[-2] = TOTAL (marks obtained)
        # parts[-3] = FIN (marks obtained) or "-"
        # parts[-4] = INT (marks obtained)
        
        marks_final = parts[-3] if parts[-3] != "-" else ""
        marks_internal = parts[-4]
        
        # Now find the total_marks column
        # It's a 3-digit number in the FULL MARKS TOTAL column
        # Usually appears as 015, 025, 050, 100, 010
        total_marks = ""
        for i in range(len(parts) - 8, len(parts) - 5):
            if i >= 0 and i < len(parts):
                val = parts[i]
                if re.match(r'^\d{3}$', val):
                    total_marks = val
                    break
        
        # Credits is the first numeric value (like 1.0, 3.0, 0.5, 2.0)
        credits = ""
        subject_name_parts = []
        found_credits = False
        
        for i, part in enumerate(parts):
            if not found_credits and re.match(r'^\d+\.\d$', part):
                credits = part
                found_credits = True
                break
            subject_name_parts.append(part)
        
        subject_name = " ".join(subject_name_parts)
        
        # If marks_internal or marks_final is "-", make it empty
        if marks_internal == "-":
            marks_internal = ""
        if marks_final == "-":
            marks_final = ""
            
        return {
            "subject_name": subject_name,
            "credits": credits,
            "total_marks": total_marks,
            "marks_internal": marks_internal,
            "marks_final": marks_final,
            "marks_total": marks_total,
            "grade": grade,
            "category": category
        }
    except (IndexError, ValueError) as e:
        return None


def extract_subjects_from_pdf(pdf_path):
    """
    Extract all subjects from a PDF file.
    Returns a list of subject dictionaries.
    """
    subjects = []
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            page = pdf.pages[0]
            text = page.extract_text()
            
            lines = text.split('\n')
            current_category = None
            
            for line in lines:
                line = line.strip()
                
                # Detect section headers
                if "THEORY PAPERS" in line:
                    current_category = "THEORY"
                    continue
                elif "PRACTICAL PAPERS" in line:
                    current_category = "PRACTICAL"
                    continue
                elif "TERM WORK PAPERS" in line:
                    current_category = "TERM WORK"
                    continue
                elif line.startswith("---") or not line:
                    continue
                elif "SUBJECT" in line and "CREDITS" in line:
                    # Header line
                    continue
                elif "GRAND TOTAL" in line or "SGPA" in line or "REMARKS" in line:
                    # End of subject data
                    break
                
                # Parse subject line if we're in a category
                if current_category and line:
                    # Check if this line contains a grade at the end
                    if re.search(r'[A-E]\+?$', line):
                        subject = parse_subject_line(line, current_category)
                        if subject:
                            subjects.append(subject)
    
    except Exception as e:
        print(f"Error processing {pdf_path}: {e}")
        return []
    
    return subjects


def extract_student_info_from_pdf(pdf_path):
    """
    Extract student information from PDF.
    Returns dict with roll number, registration number, and name.
    """
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


def process_all_pdfs(result_dir="result"):
    """
    Process all PDF files in the result directory.
    Creates a JSON file for each PDF with extracted data.
    """
    result_path = Path(result_dir)
    pdf_files = list(result_path.glob("*.pdf"))
    
    print(f"Found {len(pdf_files)} PDF files to process")
    
    all_students_data = []
    
    for pdf_file in pdf_files:
        print(f"\nProcessing: {pdf_file.name}")
        
        # Extract student info
        student_info = extract_student_info_from_pdf(pdf_file)
        
        # Extract subjects
        subjects = extract_subjects_from_pdf(pdf_file)
        
        if subjects:
            roll_number = student_info.get('roll_number', pdf_file.stem)
            
            # Create data structure
            student_data = {
                "roll_number": roll_number,
                "registration_number": student_info.get('registration_number', ''),
                "name": student_info.get('name', ''),
                "subjects": subjects
            }
            
            all_students_data.append(student_data)
            
            # Write individual JSON file
            json_filename = result_path / f"{roll_number}.json"
            with open(json_filename, 'w', encoding='utf-8') as f:
                json.dump(subjects, f, indent=2, ensure_ascii=False)
            
            print(f"  ✓ Extracted {len(subjects)} subjects")
            print(f"  ✓ Saved to {json_filename}")
        else:
            print(f"  ✗ No subjects found")
    
    # Write combined data file
    combined_file = result_path / "all_students.json"
    with open(combined_file, 'w', encoding='utf-8') as f:
        json.dump(all_students_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Processed {len(all_students_data)} students")
    print(f"✓ Combined data saved to {combined_file}")
    
    return all_students_data


if __name__ == "__main__":
    students_data = process_all_pdfs()
    
    # Print sample data for verification
    if students_data:
        print("\n=== Sample Data (First Student) ===")
        print(json.dumps(students_data[0], indent=2))
