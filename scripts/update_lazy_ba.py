with open('frontend/src/components/office/ChotuKumarDialogueModal.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Make BA Bhupendra extra lazy in both Punjabi and Hindi!
lazy_punjabi_bhupendra = """    const isBhupendra = employee.id === 'agent-bhupendra' || employee.name.includes('Bhupendra');

    // ==================== SPECIAL LAZY BA (BHUPENDRA JINGAR) ====================
    if (isBhupendra) {
      if (lang === 'punjabi') {
        if (qIndex === 0) {
          return `Arey Manoj veere... kyu saadi neend kharab kar rahe ho! Main BA aan, mera kam bas sochna te thandi hawa lena ae. Client nu bol dita kal meeting karenge, aaj taan sofa te aaram farma reha aan. Tu vi chai pee te chill maar veere!`;
        }
        if (qIndex === 1) {
          return `Progress da ki ae Manoj veere, jiven chal rahi ae chalan do! Dev waale kutt rahe ne code nu, main taan bas PRD document copy-paste maarna ae. Hale aalsi mood chal reha ae, kal dekhaange!`;
        }
        if (qIndex === 2) {
          return `Blocker sabto wadda meri susti ae Manoj veere! Ek glass paani mangwa do pehla, fir sochaange requirements ki ne. Saara swarm set ae, tu fikar na kar!`;
        }
        return `Manoj veere, 5 minute son do bas!`;
      } else {
        if (qIndex === 0) {
          return `Arey Manoj bhai... itni subah-subah kaam ki baat mat karo yaar! Main Product BA hu, mera kaam AC me baith ke requirement sochna hai. Abhi chai pii raha hu, dev walo ko bol diya code karne. Thoda aaram karne do bhai!`;
        }
        if (qIndex === 1) {
          return `Manoj bhai sab chill chal raha hai. User stories maine chatGPT se nikal li thi, ab baki team jaane. Meri to neend poori nahi hui abhi tak!`;
        }
        if (qIndex === 2) {
          return `Sabse bada blocker to ye subah ka alash hai Manoj bhai! Baki to sab mast chal raha hai, koi tension nahi hai.`;
        }
        return `Thoda aish karne do Manoj bhai!`;
      }
    }
"""

target = "    // Detect if employee is currently resting at the Executive Lounge Sofa or Restrooms"
text = text.replace(target, lazy_punjabi_bhupendra + "\n    " + target)

with open('frontend/src/components/office/ChotuKumarDialogueModal.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated ChotuKumarDialogueModal.tsx with super lazy BA Bhupendra!')
