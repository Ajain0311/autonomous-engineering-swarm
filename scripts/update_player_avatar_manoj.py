with open('frontend/src/components/office/PlayerAvatar.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "speechTts.speak('Oye Chotu veer! Tussi jaa rahe ho? Tussi na jao!', { isPunjabi: true });",
    "speechTts.speak('Oye Manoj veere! Tussi jaa rahe ho? Tussi na jao!', { isPunjabi: true });"
)

text = text.replace('CHOTU KUMAR (OWNER)', 'MANOJ BHAI (OWNER)')
text = text.replace('Chotu Kumar Owner Identification Badge', 'Manoj Bhai Owner Identification Badge')
text = text.replace('Chotu Kumar - Company Owner', 'Manoj Bhai - Company Owner')

with open('frontend/src/components/office/PlayerAvatar.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated PlayerAvatar.tsx successfully')
