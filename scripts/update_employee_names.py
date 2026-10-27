# 1. Update seeder.py
with open('backend/app/demo/seeder.py', 'r', encoding='utf-8') as f:
    seeder = f.read()

seeder = seeder.replace('"name": "Sanjay"', '"name": "Sanjay Sahlot"')
seeder = seeder.replace('"name": "Sahlot Giriraj Mali"', '"name": "Giriraj Mali"')
seeder = seeder.replace('Sahlot Giriraj Mali', 'Giriraj Mali')

with open('backend/app/demo/seeder.py', 'w', encoding='utf-8') as f:
    f.write(seeder)
print('Updated seeder.py')

# 2. Update orchestrator.py
with open('backend/app/core/orchestrator.py', 'r', encoding='utf-8') as f:
    orch = f.read()

orch = orch.replace('Sahlot Giriraj Mali', 'Giriraj Mali')
orch = orch.replace('Sanjay assigned', 'Sanjay Sahlot assigned')

with open('backend/app/core/orchestrator.py', 'w', encoding='utf-8') as f:
    f.write(orch)
print('Updated orchestrator.py')

# 3. Update test_office_lifecycle.py
with open('backend/tests/test_office_lifecycle.py', 'r', encoding='utf-8') as f:
    test_code = f.read()

test_code = test_code.replace('("agent-sanjay", "Sanjay"', '("agent-sanjay", "Sanjay Sahlot"')
test_code = test_code.replace('("agent-giriraj", "Sahlot Giriraj Mali"', '("agent-giriraj", "Giriraj Mali"')
test_code = test_code.replace('Sahlot Giriraj Mali', 'Giriraj Mali')

with open('backend/tests/test_office_lifecycle.py', 'w', encoding='utf-8') as f:
    f.write(test_code)
print('Updated test_office_lifecycle.py')
