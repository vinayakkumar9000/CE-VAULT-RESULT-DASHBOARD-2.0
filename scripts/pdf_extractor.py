#!/usr/bin/env python3
"""
PDF Extractor for CI/CD Pipeline
Extracts student data from PDFs and generates results.json in the expected format.
"""

import argparse
import json
import os
import sys
from pathlib import Path

# Import the existing extraction logic
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from extract_pdf_data import extract_student_info_from_pdf, extract_subjects_from_pdf


def extract_to_results_json(input_dir, output_file):
    """
    Extract data from all PDFs in input_dir and write to output_file in results.json format.
    
    Format:
    [
        {
            "roll": "211271524001",
            "name": "STUDENT NAME",
            "subjects": [
                {
                    "name": "SUBJECT NAME",
                    "marks_internal": 20,
                    "marks_final": 45,
                    "marks_total": 65,
                    "max_marks": 100,
                    "grade": "B"
                }
            ]
        }
    ]
    """
    input_path = Path(input_dir)
    
    if not input_path.exists():
        print(f"Error: Input directory '{input_dir}' does not exist", file=sys.stderr)
        sys.exit(1)
    
    pdf_files = list(input_path.glob("*.pdf"))
    
    if not pdf_files:
        print(f"Warning: No PDF files found in '{input_dir}'", file=sys.stderr)
        # Create empty results file
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump([], f, indent=2)
        return
    
    print(f"Found {len(pdf_files)} PDF files to process")
    
    all_results = []
    processed_count = 0
    error_count = 0
    
    for pdf_file in sorted(pdf_files):
        try:
            print(f"Processing: {pdf_file.name}")
            
            # Extract student info
            student_info = extract_student_info_from_pdf(pdf_file)
            
            # Extract subjects
            subjects = extract_subjects_from_pdf(pdf_file)
            
            if not subjects:
                print(f"  Warning: No subjects found in {pdf_file.name}")
                error_count += 1
                continue
            
            roll_number = student_info.get('roll_number', '')
            if not roll_number:
                # Try to extract from filename
                roll_number = pdf_file.stem
            
            # Transform subjects to expected format
            transformed_subjects = []
            for subj in subjects:
                try:
                    # Convert marks to integers or None
                    marks_internal = None
                    marks_final = None
                    marks_total = None
                    max_marks = None
                    
                    if subj.get('marks_internal'):
                        marks_internal = int(subj['marks_internal'])
                    
                    if subj.get('marks_final'):
                        marks_final = int(subj['marks_final'])
                    
                    if subj.get('marks_total'):
                        marks_total = int(subj['marks_total'])
                    
                    if subj.get('total_marks'):
                        max_marks = int(subj['total_marks'])
                    
                    transformed_subjects.append({
                        "name": subj['subject_name'],
                        "marks_internal": marks_internal,
                        "marks_final": marks_final,
                        "marks_total": marks_total,
                        "max_marks": max_marks,
                        "grade": subj['grade']
                    })
                except (ValueError, KeyError) as e:
                    print(f"  Warning: Error processing subject {subj.get('subject_name', 'Unknown')}: {e}")
                    continue
            
            # Create result entry
            result_entry = {
                "roll": roll_number,
                "name": student_info.get('name', ''),
                "subjects": transformed_subjects
            }
            
            all_results.append(result_entry)
            processed_count += 1
            print(f"  ✓ Processed {len(transformed_subjects)} subjects for roll {roll_number}")
            
        except Exception as e:
            print(f"  Error processing {pdf_file.name}: {e}", file=sys.stderr)
            error_count += 1
            continue
    
    # Write output file
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Successfully processed {processed_count} students")
    if error_count > 0:
        print(f"⚠ {error_count} files had errors")
    print(f"✓ Results written to {output_file}")
    
    return processed_count


def main():
    parser = argparse.ArgumentParser(
        description='Extract student results from PDFs for CI/CD pipeline'
    )
    parser.add_argument(
        '--input_dir',
        required=True,
        help='Directory containing PDF files'
    )
    parser.add_argument(
        '--output_file',
        required=True,
        help='Output JSON file path (e.g., data/extracted/results.json)'
    )
    
    args = parser.parse_args()
    
    try:
        count = extract_to_results_json(args.input_dir, args.output_file)
        sys.exit(0)
    except Exception as e:
        print(f"Fatal error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
