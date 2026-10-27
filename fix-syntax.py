import re

def fix(path, pattern, repl):
    s = open(path, encoding="utf-8").read()
    new, n = re.subn(pattern, repl, s)
    open(path, "w", encoding="utf-8").write(new)
    print(f"{path}: {n} fix(es)")

# Login page: duplicated "return (" fragment
fix("src/app/login/page.tsx",
    r'<div className="pt-28\s+return \(\s*<div className="pt-28',
    '<div className="pt-28')

# Admin page: duplicated "const handleEditClick" line
fix("src/app/admin/page.tsx",
    r'const handleEditClick\s+const handleEditClick',
    'const handleEditClick')