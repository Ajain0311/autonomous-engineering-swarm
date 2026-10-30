# 1. Update seeder and tests in backend
with open('backend/app/demo/seeder.py', 'r', encoding='utf-8') as f:
    seeder = f.read()
seeder = seeder.replace('"name": "Kathan Jain"', '"name": "Himanshu Lala"')
with open('backend/app/demo/seeder.py', 'w', encoding='utf-8') as f:
    f.write(seeder)

with open('backend/tests/test_office_lifecycle.py', 'r', encoding='utf-8') as f:
    tests = f.read()
tests = tests.replace('"Kathan Jain"', '"Himanshu Lala"')
with open('backend/tests/test_office_lifecycle.py', 'w', encoding='utf-8') as f:
    f.write(tests)

print('Updated backend seeder and test files with Himanshu Lala successfully')
