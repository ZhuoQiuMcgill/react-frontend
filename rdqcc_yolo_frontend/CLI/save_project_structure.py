#!/usr/bin/env python3
import os
import sys
from pathlib import Path
from pathspec import PathSpec
from pathspec.patterns import GitWildMatchPattern


def get_file_structure(root_dir, gitignore_path, output_path):
    """
    Generate the file structure of the project, ignoring patterns from .gitignore,
    and save it to the output file.
    """
    root_path = Path(root_dir).resolve()
    output_path = Path(output_path).resolve()

    # Parse .gitignore file
    try:
        with open(gitignore_path, 'r') as f:
            gitignore_content = f.read()

        # Create a PathSpec object to match gitignore patterns
        gitignore_spec = PathSpec.from_lines(GitWildMatchPattern, gitignore_content.splitlines())
    except FileNotFoundError:
        print(f"Warning: .gitignore file not found at {gitignore_path}")
        gitignore_spec = PathSpec.from_lines(GitWildMatchPattern, [])

    # Create a dictionary to represent the file tree
    file_tree = {}

    # Collect all files and directories that are not ignored
    for path in sorted(root_path.rglob('*')):
        # Skip the output file itself
        if path == output_path:
            continue

        # Get the path relative to the root
        rel_path = path.relative_to(root_path)
        rel_path_str = str(rel_path).replace('\\', '/')  # Normalize separators

        # Check if the path is ignored
        is_dir = path.is_dir()
        if is_dir:
            check_path = rel_path_str + '/'
        else:
            check_path = rel_path_str

        if not gitignore_spec.match_file(check_path):
            # Build the path in the tree
            parts = rel_path.parts
            current = file_tree

            # Create the path in the tree
            for i, part in enumerate(parts):
                if i == len(parts) - 1:
                    # This is the file/dir name
                    if part not in current:
                        current[part] = {"is_dir": is_dir, "children": {}}
                else:
                    # This is a parent directory
                    if part not in current:
                        current[part] = {"is_dir": True, "children": {}}
                    current = current[part]["children"]

    # Write the file structure to the output file
    with open(output_path, 'w') as out_file:
        # Write the root directory
        root_name = root_path.name
        out_file.write(f"{root_name}/\n")

        # Recursive function to write the tree
        def write_tree(node, depth=1):
            # Get sorted keys (directories first, then files)
            keys = sorted(node.keys(), key=lambda k: (0 if node[k]["is_dir"] else 1, k))

            for key in keys:
                item = node[key]
                indent = '    ' * depth

                if item["is_dir"]:
                    out_file.write(f"{indent}{key}/\n")
                    write_tree(item["children"], depth + 1)
                else:
                    out_file.write(f"{indent}{key}\n")

        # Start writing from the root
        write_tree(file_tree)


def main():
    """Main function to run the script."""
    gitignore_path = os.path.join(os.getcwd(), '.gitignore')
    output_path = os.path.join(os.getcwd(), 'data', 'project_structure.txt')
    root_dir = os.path.join(os.getcwd())

    get_file_structure(root_dir, gitignore_path, output_path)
    print(f"File structure saved to {output_path}")


if __name__ == "__main__":
    main()
