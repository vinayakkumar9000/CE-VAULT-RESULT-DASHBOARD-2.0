#!/usr/bin/env python3
"""
Convert extracted PDF data to TypeScript format compatible with the application.
"""

import json
from pathlib import Path


def convert_subject_to_app_format(subject):
    """
    Convert extracted subject data to application format.
    
    Extracted format has:
    - subject_name, credits, total_marks, marks_internal, marks_final, marks_total, grade, category
    
    App format needs:
    - name, category, maxMarks, obtainedMarks, credits, grade, isBacklog
    """
    return {
        "name": subject["subject_name"],
        "category": subject["category"].title(),  # "THEORY" -> "Theory"
        "maxMarks": int(subject["total_marks"]) if subject["total_marks"] else 0,
        "obtainedMarks": int(subject["marks_total"]) if subject["marks_total"] else 0,
        "credits": float(subject["credits"]) if subject["credits"] else 0.0,
        "grade": subject["grade"],
        "isBacklog": False  # Default to False, can be updated based on grade or pass marks
    }


def load_all_students_data():
    """Load the all_students.json file"""
    data_file = Path("result/all_students.json")
    
    if not data_file.exists():
        print(f"Error: {data_file} not found")
        return []
    
    with open(data_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def calculate_semester_stats(subjects):
    """Calculate SGPA, total marks, etc. from subjects"""
    total_marks = sum(s["obtainedMarks"] for s in subjects)
    max_total_marks = sum(s["maxMarks"] for s in subjects)
    
    # Simple SGPA calculation (weighted by credits)
    total_grade_points = 0
    total_credits = 0
    
    grade_map = {
        "A+": 10, "A": 9, "B+": 8, "B": 7, 
        "C": 6, "D": 5, "E": 4, "F": 0
    }
    
    for s in subjects:
        grade_point = grade_map.get(s["grade"], 0)
        credits = s["credits"]
        total_grade_points += grade_point * credits
        total_credits += credits
    
    sgpa = round(total_grade_points / total_credits, 2) if total_credits > 0 else 0
    
    # Determine remarks
    if sgpa >= 8.5:
        remarks = "First Class with Distinction"
    elif sgpa >= 6.5:
        remarks = "First Class"
    elif sgpa >= 5.5:
        remarks = "Second Class"
    else:
        remarks = "Pass"
    
    # Check for backlogs
    backlog_count = sum(1 for s in subjects if s["isBacklog"])
    
    percentile = round((total_marks / max_total_marks * 100), 1) if max_total_marks > 0 else 0
    
    return {
        "sgpa": sgpa,
        "totalMarks": total_marks,
        "maxTotalMarks": max_total_marks,
        "remarks": remarks,
        "backlogCount": backlog_count,
        "percentile": percentile
    }


def generate_typescript_data():
    """Generate TypeScript-compatible data"""
    students_data = load_all_students_data()
    
    ts_students = []
    
    for idx, student_data in enumerate(students_data, 1):
        roll_number = student_data["roll_number"]
        name = student_data["name"]
        reg_number = student_data["registration_number"]
        
        # Convert subjects to app format
        subjects = [convert_subject_to_app_format(s) for s in student_data["subjects"]]
        
        # Calculate stats
        stats = calculate_semester_stats(subjects)
        
        # Create student object in app format
        student = {
            "id": str(idx),
            "rollNumber": roll_number,
            "regNumber": reg_number,
            "name": name,
            "course": "Diploma in Civil Engineering",
            "email": f"{name.lower().replace(' ', '.')}@college.edu",
            "contact": "+91 98765 43210",
            "currentSemester": 2,
            "results": [
                {
                    "semester": 2,
                    "session": "2024-2027",
                    "subjects": subjects,
                    "sgpa": stats["sgpa"],
                    "cgpa": stats["sgpa"],  # Same as SGPA for single semester
                    "totalMarks": stats["totalMarks"],
                    "maxTotalMarks": stats["maxTotalMarks"],
                    "remarks": stats["remarks"],
                    "backlogCount": stats["backlogCount"],
                    "publishedDate": "10/06/2025",
                    "percentile": stats["percentile"]
                }
            ]
        }
        
        ts_students.append(student)
    
    return ts_students


def write_typescript_file(students):
    """Write the students data to a TypeScript file"""
    output_file = Path("generatedData.ts")
    
    # Convert to JSON first
    json_str = json.dumps(students, indent=2)
    
    # Create TypeScript content
    ts_content = f"""// Auto-generated from PDF data - DO NOT EDIT MANUALLY
import {{ Student }} from './types';

export const GENERATED_STUDENTS: Student[] = {json_str};
"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f"✓ Generated {output_file} with {len(students)} students")
    
    # Also write as plain JSON for easier debugging
    json_file = Path("result/students_app_format.json")
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(students, f, indent=2)
    
    print(f"✓ Generated {json_file} for debugging")


if __name__ == "__main__":
    print("Converting extracted PDF data to application format...")
    students = generate_typescript_data()
    write_typescript_file(students)
    
    print(f"\n✓ Successfully converted {len(students)} students")
    print("\nSample student data:")
    if students:
        print(json.dumps(students[0], indent=2)[:500] + "...")
