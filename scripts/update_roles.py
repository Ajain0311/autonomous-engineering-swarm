import re

path = 'backend/app/demo/seeder.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '"name": "Esha Saini", "role": "UI/UX Designer"',
    '"name": "Esha Saini", "role": "UI/UX Designer / UI/UX Design Engineer"'
)
content = content.replace(
    '"name": "Bhupendra Jingar", "role": "Business Analyst"',
    '"name": "Bhupendra Jingar", "role": "Business Analyst / Product Analyst"'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated roles in seeder.py')
