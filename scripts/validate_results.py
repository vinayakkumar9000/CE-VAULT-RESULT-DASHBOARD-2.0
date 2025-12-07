#!/usr/bin/env python3
"""
Validation script for results.json
Validates extracted student results according to CI/CD requirements.
"""

import argparse
import json
import re
import sys
from pathlib import Path
from collections import Counter


def validate_results(results_file, roll_regex=None):
    """
    Validate results.json according to the following rules:
    1. Each entry must have a 'roll' matching the specified regex pattern
    2. No duplicate roll numbers
    3. Each mark value must be integer or null and in range 0-100
    4. At least one parsed record must exist
    
    If roll_regex is None, auto-detects pattern from first roll number.
    
    Returns: (is_valid, error_messages)
    """
    errors = []
    warnings = []
    
    # Check if file exists
    if not Path(results_file).exists():
        return False, [f"ERROR: Results file '{results_file}' does not exist"]
    
    # Load JSON
    try:
        with open(results_file, 'r', encoding='utf-8') as f:
            results = json.load(f)
    except json.JSONDecodeError as e:
        return False, [f"ERROR: Invalid JSON format: {e}"]
    except Exception as e:
        return False, [f"ERROR: Failed to read file: {e}"]
    
    # Rule 4: At least one record must exist
    if not results or len(results) == 0:
        return False, ["ERROR: No records found in results.json. At least one parsed record is required."]
    
    print(f"✓ Found {len(results)} student records")
    
    # Auto-detect roll pattern if not provided
    if roll_regex is None:
        # Get first roll number to detect pattern
        first_roll = str(results[0].get('roll', ''))
        if first_roll.startswith('21') and len(first_roll) >= 11:
            # Pattern: 21 followed by N digits
            digit_count = len(first_roll) - 2
            roll_regex = f'^21\\d{{{digit_count}}}$'
            print(f"Auto-detected roll pattern: {roll_regex} (from sample: {first_roll})")
        else:
            # Default fallback
            roll_regex = r'^21\d{9}$'
            print(f"Using default roll pattern: {roll_regex}")
    
    # Compile roll number regex
    try:
        roll_pattern = re.compile(roll_regex)
    except re.error as e:
        return False, [f"ERROR: Invalid roll number regex pattern '{roll_regex}': {e}"]
    
    # Track roll numbers for duplicate detection
    roll_numbers = []
    
    # Validate each entry
    for idx, entry in enumerate(results):
        entry_id = f"Entry #{idx + 1}"
        
        # Check required fields
        if 'roll' not in entry:
            errors.append(f"ERROR: {entry_id} missing 'roll' field")
            continue
        
        roll = entry['roll']
        roll_numbers.append(roll)
        entry_id = f"Roll {roll}"
        
        # Rule 1: Validate roll number format
        if not roll_pattern.match(str(roll)):
            errors.append(f"ERROR: {entry_id} has invalid roll number format. Expected pattern: {roll_regex}")
        
        # Check subjects field
        if 'subjects' not in entry:
            warnings.append(f"WARNING: {entry_id} missing 'subjects' field")
            continue
        
        subjects = entry['subjects']
        if not isinstance(subjects, list):
            errors.append(f"ERROR: {entry_id} 'subjects' must be a list")
            continue
        
        # Rule 3: Validate marks in each subject
        for subj_idx, subject in enumerate(subjects):
            subj_name = subject.get('name', f'Subject #{subj_idx + 1}')
            subj_id = f"{entry_id} - {subj_name}"
            
            # Check mark fields
            mark_fields = ['marks_internal', 'marks_final', 'marks_total', 'max_marks']
            for field in mark_fields:
                if field in subject:
                    value = subject[field]
                    
                    # Value must be integer or None/null
                    if value is not None:
                        if not isinstance(value, int):
                            try:
                                value = int(value)
                            except (ValueError, TypeError):
                                errors.append(
                                    f"ERROR: {subj_id} '{field}' must be an integer or null, got: {type(value).__name__}"
                                )
                                continue
                        
                        # Marks must be in range 0-100
                        if field != 'max_marks' and (value < 0 or value > 100):
                            errors.append(
                                f"ERROR: {subj_id} '{field}' value {value} out of range [0-100]"
                            )
    
    # Rule 2: Check for duplicate roll numbers
    roll_counter = Counter(roll_numbers)
    duplicates = [roll for roll, count in roll_counter.items() if count > 1]
    
    if duplicates:
        for dup_roll in duplicates:
            errors.append(f"ERROR: Duplicate roll number found: {dup_roll} (appears {roll_counter[dup_roll]} times)")
    else:
        print(f"✓ All roll numbers are unique")
    
    print(f"✓ Roll numbers match pattern: {roll_regex}")
    
    # Print warnings
    if warnings:
        print("\nWarnings:")
        for warning in warnings:
            print(f"  {warning}")
    
    # Return validation result
    is_valid = len(errors) == 0
    return is_valid, errors


def print_validation_report(is_valid, messages):
    """Print a formatted validation report."""
    if is_valid:
        print("\n" + "=" * 60)
        print("✓ VALIDATION PASSED")
        print("=" * 60)
        print("All validation checks passed successfully.")
        print("Results file is valid and ready for deployment.")
    else:
        print("\n" + "=" * 60)
        print("✗ VALIDATION FAILED")
        print("=" * 60)
        print(f"Found {len(messages)} error(s):\n")
        for msg in messages:
            print(f"  {msg}")
        print("\n" + "=" * 60)
        print("Please fix the errors above before proceeding with deployment.")


def main():
    parser = argparse.ArgumentParser(
        description='Validate results.json for CI/CD pipeline'
    )
    parser.add_argument(
        'results_file',
        help='Path to results.json file'
    )
    parser.add_argument(
        '--roll-regex',
        default=None,
        help='Regex pattern for valid roll numbers (default: auto-detect from first roll)'
    )
    
    args = parser.parse_args()
    
    print(f"Validating: {args.results_file}")
    if args.roll_regex:
        print(f"Roll number pattern: {args.roll_regex}")
    else:
        print("Roll number pattern: auto-detect")
    print("-" * 60)
    
    is_valid, messages = validate_results(args.results_file, args.roll_regex)
    
    print_validation_report(is_valid, messages)
    
    # Exit with appropriate code
    sys.exit(0 if is_valid else 1)


if __name__ == "__main__":
    main()
