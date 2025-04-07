#!/bin/bash

# Get the list of staged files
staged_files=$(git diff --cached --name-only --diff-filter=ACMR)

# Initialize arrays for test and source files
test_files=()
source_files=()

# Filter files into appropriate arrays
while IFS= read -r file; do
    if [[ $file =~ \.(test|spec)\.(ts|tsx|js|jsx)$ ]]; then
        test_files+=("$file")
    elif [[ $file =~ \.(ts|tsx|js|jsx)$ ]]; then
        source_files+=("$file")
    fi
done <<< "$staged_files"

# Exit if no relevant files changed
if [ ${#test_files[@]} -eq 0 ] && [ ${#source_files[@]} -eq 0 ]; then
    echo "No relevant files changed. Skipping tests."
    exit 0
fi

# Build the test patterns array
test_patterns=()

# Add test files directly
for file in "${test_files[@]}"; do
    test_patterns+=("$file")
done

# Add corresponding test files for source files
for file in "${source_files[@]}"; do
    # Remove the extension
    file_without_ext=$(echo "$file" | sed -E 's/\.(ts|tsx|js|jsx)$//')
    # Add both possible test file patterns
    test_patterns+=("${file_without_ext}.test.*" "${file_without_ext}.spec.*")
done

# Run jest with the collected patterns
if [ ${#test_patterns[@]} -gt 0 ]; then
    jest_command="yarn jest --silent --findRelatedTests ${test_patterns[*]}"
    if ! eval "$jest_command"; then
        echo "Error running tests"
        exit 1
    fi
fi 