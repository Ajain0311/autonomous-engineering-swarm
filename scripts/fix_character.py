path = 'frontend/src/components/office/HumanoidCharacter.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('      cursor="pointer"\n', '')
c = c.replace('      cursor="pointer"\r\n', '')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print('Removed cursor prop from HumanoidCharacter.tsx')
