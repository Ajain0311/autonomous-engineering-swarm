import re

agents_code = """AGENTS_CONFIG = [
    {"id": "agent-aditya", "name": "Aditya Jain", "role": "Chief Orchestrator / Top Authority", "parent_id": None},
    {"id": "agent-sanjay", "name": "Sanjay Sahlot", "role": "Operations Coordinator / Deputy Lead", "parent_id": "agent-aditya"},
    {"id": "agent-giriraj", "name": "Giriraj Mali", "role": "Senior Developer / Engineering Lead", "parent_id": "agent-aditya"},
    {"id": "agent-bhupendra", "name": "Bhupendra Jingar", "role": "Business Analyst / Product Analyst", "parent_id": "agent-aditya"},
    {"id": "agent-abhishek", "name": "Abhishek Hingar", "role": "QA Lead", "parent_id": "agent-giriraj"},
    {"id": "agent-ashish", "name": "Ashish Das", "role": "Tester, reporting to QA", "parent_id": "agent-abhishek"},
    {"id": "agent-rohan", "name": "Rohan Sharma", "role": "Developer", "parent_id": "agent-giriraj"},
    {"id": "agent-shaurya", "name": "Shaurya Jain", "role": "Developer", "parent_id": "agent-giriraj"},
    {"id": "agent-binod", "name": "Binod Kumar", "role": "Developer", "parent_id": "agent-giriraj"},
    {"id": "agent-mohit", "name": "Mohit Sharma", "role": "Developer", "parent_id": "agent-giriraj"},
    {"id": "agent-harshit-p", "name": "Harshit Purohit", "role": "DevOps Engineer", "parent_id": "agent-sanjay"},
    {"id": "agent-divisha", "name": "Divisha Joshi", "role": "Documentation Engineer", "parent_id": "agent-giriraj"},
    {"id": "agent-hemang", "name": "Hemang Tiwari", "role": "Code Review Engineer", "parent_id": "agent-giriraj"},
    {"id": "agent-esha", "name": "Esha Saini", "role": "UI/UX Designer / UI/UX Design Engineer", "parent_id": "agent-giriraj"},
    {"id": "agent-kratik", "name": "Kratik Jain", "role": "Backend Engineer", "parent_id": "agent-giriraj"},
    {"id": "agent-maan", "name": "Maan Singh", "role": "Frontend Engineer", "parent_id": "agent-giriraj"},
    {"id": "agent-harshit-m", "name": "Harshit Masta", "role": "Security Engineer", "parent_id": "agent-aditya"},
    {"id": "agent-kathan", "name": "Kathan Jain", "role": "Automation / CI Engineer", "parent_id": "agent-harshit-p"},
]"""

p = 'backend/app/demo/seeder.py'
with open(p, 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'AGENTS_CONFIG = \[.*?\]', agents_code, text, flags=re.DOTALL)
with open(p, 'w', encoding='utf-8') as f:
    f.write(text)

print('Successfully set AGENTS_CONFIG in seeder.py')
