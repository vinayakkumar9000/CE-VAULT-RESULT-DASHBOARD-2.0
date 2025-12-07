#!/usr/bin/env python3
"""
Rebuild all_students.json from individual student JSON files and existing app format data.
"""

import json
from pathlib import Path


def rebuild_all_students_json(result_dir="result"):
    """
    Rebuild all_students.json from all individual JSON files.
    Uses existing students_app_format.json for student names and registration numbers.
    """
    result_path = Path(result_dir)
    
    # Load existing student info from students_app_format.json
    app_format_file = result_path / "students_app_format.json"
    existing_students = {}
    
    if app_format_file.exists():
        with open(app_format_file, 'r', encoding='utf-8') as f:
            app_data = json.load(f)
            for student in app_data:
                existing_students[student['rollNumber']] = {
                    'name': student['name'],
                    'regNumber': student['regNumber']
                }
        print(f"Loaded info for {len(existing_students)} existing students")
    
    # Get all JSON files except all_students.json and students_app_format.json
    json_files = [f for f in result_path.glob("*.json") 
                  if f.stem not in ['all_students', 'students_app_format']]
    
    print(f"Found {len(json_files)} student JSON files")
    
    all_students_data = []
    
    for json_file in sorted(json_files):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                subjects = json.load(f)
            
            # Extract roll number from filename
            roll_number = json_file.stem
            
            # Get student info from existing data or generate placeholder
            if roll_number in existing_students:
                name = existing_students[roll_number]['name']
                reg_number = existing_students[roll_number]['regNumber']
            else:
                # For new students, generate placeholder that convert script will update
                name = f"STUDENT {roll_number[-3:]}"
                reg_number = roll_number.replace("21127152", "127152")
            
            # Create data structure
            student_data = {
                "roll_number": roll_number,
                "registration_number": reg_number,
                "name": name,
                "subjects": subjects
            }
            
            all_students_data.append(student_data)
            
        except Exception as e:
            print(f"Error processing {json_file}: {e}")
    
    # Write combined data file
    combined_file = result_path / "all_students.json"
    with open(combined_file, 'w', encoding='utf-8') as f:
        json.dump(all_students_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Rebuilt all_students.json with {len(all_students_data)} students")
    print(f"✓ Combined data saved to {combined_file}")
    
    # Print roll number range
    roll_numbers = sorted([int(s['roll_number']) for s in all_students_data])
    print(f"✓ Roll numbers range: {min(roll_numbers)} to {max(roll_numbers)}")
    
    return all_students_data


if __name__ == "__main__":
    students_data = rebuild_all_students_json()
