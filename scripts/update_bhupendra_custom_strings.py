with open('frontend/src/components/office/ChotuKumarDialogueModal.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Exact hilarious lazy phrases requested by user:
# "oye chips daa packet mangao ree", "oye veere tu fir aa gya kam krne di aissii di tesii me to sone jaa rahia hu munde"
lazy_custom_strings = """    // ==================== SPECIAL LAZY BA (BHUPENDRA JINGAR) ====================
    if (isBhupendra) {
      if (lang === 'punjabi') {
        if (qIndex === 0) {
          return `Oye veere tu fir aa gya! Kam krne di aissii di tesii, main te sone jaa reha aan munde! Oye canteen to chips daa packet mangao ree koi kadak chai naal, fir vekhaange ki kam karna ae! Tu vi sofa te lamme pe jaa Manoj veere!`;
        }
        if (qIndex === 1) {
          return `Oye Manoj veere, chips chabaunde-chabaunde progress dassan? Dev munde matha maar rahe ne code ch, main te aalsi mood vich AC di thandi hawa le reha aan. Requirement kal banau, aaj rest day ghoshit karo!`;
        }
        if (qIndex === 2) {
          return `Blocker da ki puchhda ae veere! Sannu neend aa rahi ae te canteen ch chips khatam ho gaye, sabto wadda blocker ehi ae! Kam taan hunda rahuga, tu tension chhad de!`;
        }
        return `Oye chips daa packet mangao ree koi pehla!`;
      } else {
        if (qIndex === 0) {
          return `Oye Manoj bhai tu fir aa gaya! Kaam karne ki aisi ki taisi, main to sone ja raha hu bhai! Oye koi chips ka packet mangao re kadak chai ke saath! Itni thandi hawa me kaun kaam kare yaar, aish karo!`;
        }
        if (qIndex === 1) {
          return `Manoj bhai sab chill chal raha hai. Munde code ghaseet rahe hain, main to chips kha raha hu mast. Sprint planning kal subah karenge, abhi neend ka time hai!`;
        }
        if (qIndex === 2) {
          return `Blocker bas ek hi hai Manoj bhai: mujhe neend aa rahi hai aur canteen me chips khatam ho gaye! Baki sab rab ke bharose mast chal raha hai!`;
        }
        return `Oye chips ka packet mangao ree koi!`;
      }
    }"""

old_target_start = text.find('// ==================== SPECIAL LAZY BA (BHUPENDRA JINGAR) ====================')
old_target_end = text.find('    // Detect if employee is currently resting at the Executive Lounge Sofa or Restrooms')

text = text[:old_target_start] + lazy_custom_strings + "\n\n" + text[old_target_end:]

with open('frontend/src/components/office/ChotuKumarDialogueModal.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated ChotuKumarDialogueModal.tsx with exact hilarious chips and sleepy strings!')
