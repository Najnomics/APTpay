#!/usr/bin/env python3

import os
import re

def fix_string_literals(file_path):
    """Fix string literals in Move files by converting b"..." to string::utf8(b"...")"""
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Add string import if not present
    if 'use std::string::{Self, String};' not in content and 'use std::string::String;' in content:
        content = content.replace('use std::string::String;', 'use std::string::{Self, String};')
    elif 'use std::string' not in content:
        # Add import after other std imports
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.strip().startswith('use std::') and 'string' not in line:
                continue
            elif line.strip() == '' or not line.strip().startswith('use std::'):
                lines.insert(i, '    use std::string::{Self, String};')
                break
        content = '\n'.join(lines)
    
    # Fix string literals: b"..." -> string::utf8(b"...")
    # But be careful not to double-fix already fixed ones
    pattern = r'(?<!string::utf8\()b"[^"]*"'
    matches = re.findall(pattern, content)
    
    for match in matches:
        if 'string::utf8(' + match + ')' not in content:
            content = content.replace(match, f'string::utf8({match})')
    
    with open(file_path, 'w') as f:
        f.write(content)
    
    print(f"Fixed string literals in {file_path}")

# Fix all Move source files
move_files = [
    '../contracts/sources/ComplianceModule.move',
    '../contracts/sources/ForexModule.move',
    '../contracts/sources/PayrollModule.move',
    '../contracts/sources/EventModule.move'
]

for file_path in move_files:
    if os.path.exists(file_path):
        fix_string_literals(file_path)
    else:
        print(f"File not found: {file_path}")
