import re

# Correct raw string blocks for ChotuKumarDialogueModal
fixed_modal_bhup = """    // ==================== SPECIAL SUPER BAKCHOD LAZY BA (BHUPENDRA JINGAR) ====================
    if (isBhupendra) {
      if (lang === 'punjabi') {
        if (qIndex === 0) {
          return pick([
            `Arre Baburao veere! Utha le re baba utha le... mereko nahi re, eh backend waale Rohan te Giriraj nu utha! Main te table te lamme pe ke aish maar reha aan, samne Divisha bechari dimaag kharab kar rahi ae! Chips da packet khol te chill maar!`,
            `Oye Baburao veere! Tu fir aa gya meri neend kharab karan? Kam krne di aissii di tesii, main te sone jaa reha aan munde! Oye canteen to aloo patties te kadak chai mangao ree koi, fir vekhaange ki kam karna ae!`,
            `Baburao veere! Khopdi phod dega main agar 2 baje se pehle jagaya! BA da kaam dimaag chalaana nahi, meeting vich haan-haan bol ke samosa daban da hunda ae! Tu vi lamme pe jaa!`,
            `Oye Baburao! Divisha nu keh mere waste kadak chai leke aave, fir nawa feature likhanga! Pehle pet pooja, fir kaam dooja!`
          ]);
        }
        if (qIndex === 1) {
          return pick([
            `Oye Baburao veere, chips chabaunde-chabaunde progress dassan? 25 din me paisa double waali scheme laayi ae! Dev mundeyan nu 50 user story sut ditiyaan, hun sab matha phod rahe ne! Meri progress 100% full sleeping quota te ae!`,
            `Baburao veere progress da ki puchhda ae? Feature document kal likhanga, aaj mausam bada romantic ae, AC 16 te karke kambal de de re koi!`,
            `Scene poora bawaal chal reha ae Baburao! Saari company da bojh maine Giriraj te sut dita, apun to bas popcorn khaate hue drama enjoy kar reha ae!`,
            `Baburao! Main BA aan, requirement analyse karna mera kaam ae... abhi analyse karke pata chala ki agle do ghante rest lena company de hit vich ae!`
          ]);
        }
        if (qIndex === 2) {
          return pick([
            `Blocker da ki puchhda ae Baburao veere! Sannu neend aa rahi ae te canteen ch chips khatam ho gaye, sabto wadda blocker ehi ae! Kam taan hunda rahuga, tu tension chhad de!`,
            `Sabto wadda blocker tu hi ae Baburao! Aake baar baar bolta ae kya chal raha hai! Kuch nahi chal raha re baba, AC chal raha hai aur apun so raha hai!`,
            `Blocker? Divisha mere samne baith ke continuous keyboard thuk-thuk baja rahi ae, meri neend disturb ho rahi ae Baburao! Ehnu bolo thoda dheere type kare!`,
            `Koi blocker nahi ae Baburao! Jehda bug bolega ohdi khopdi tod dita jaayega! Bas tu mast reh!`
          ]);
        }
        return `Oye Baburao veere, chips daa packet mangao ree koi pehla!`;
      } else {
        if (qIndex === 0) {
          return pick([
            `Arre Baburao! Utha re baba utha, mereko nahi re, in dev walo ko utha! Main to Divisha ke samne wali table pe mast aada-tedha hokar so raha hu! Kaam gaya tel lene, pehle canteen se kadak chai aur chips mangwao!`,
            `Baburao tu fir aa gaya checking karne? Khopdi phod dunga agar neend kharab ki! Itni thandi AC me kaun document likhta hai yaar, aish karo mast!`,
            `Baburao mera role hai Chief Bakchod BA! Mera kaam hai baith ke philosophical sochna ki insaan kaam kyu karta hai! Ja tu bhi thoda sofa pe aaram maar!`,
            `Arre Baburao! Divisha subah se mujhe ghoor rahi hai kyuki maine sprint backlog me 500 naye task daal diye aur khud chaadar taan ke so gaya!`
          ]);
        }
        if (qIndex === 1) {
          return pick([
            `Baburao progress ekdam 25 din me paisa double chal rahi hai! Dev munde code ghaseet rahe hain, main to chips chaba raha hu mast! Sprint planning agle hafte karenge, abhi power nap on hai!`,
            `Baburao progress report sunoge? Giriraj ko bola architecture change karo, Rohan ko bola pura code scratch se likho... ab dono pareshan hain aur apun bindass aaram farmata hai!`,
            `Feature roadmap to ready hai Baburao, bas launch date 2030 ki daal di hai taaki koi jaldi na machaye! Chill bro!`,
            `Baburao progress itni tez chal rahi hai ki speedometer toot gaya! Ab thoda dahi-jalebi mangwao tab aage batata hu!`
          ]);
        }
        if (qIndex === 2) {
          return pick([
            `Blocker bas ek hi hai Baburao: mujhe neend aa rahi hai aur canteen me kurkure khatam ho gaye! Baki sab rab ke bharose mast chal raha hai!`,
            `Sabse bada blocker ye hai Baburao ki tum aake meri shanti bhang kar dete ho! Khopdi tod dunga agar agle 1 ghante tak koi task bola!`,
            `Blocker ye hai ki AC ka remote mil nahi raha aur room garam ho raha hai! Pehle technician bulao, code to automatic nikal aayega!`,
            `Technical blocker to Giriraj sambhalega Baburao, apun ka blocker bas yehi hai ki lunch ke baad aalsi pan 200% badh jata hai!`
          ]);
        }
        return `Oye Baburao! Chips ka packet mangao ree koi!`;
      }
    }"""

with open('frontend/src/components/office/ChotuKumarDialogueModal.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = "// ==================== SPECIAL SUPER BAKCHOD LAZY BA (BHUPENDRA JINGAR) ===================="
end_marker = "const isAtSofa ="

s_idx = text.find(start_marker)
e_idx = text.find(end_marker)

assert s_idx != -1 and e_idx != -1, f"Indices: {s_idx}, {e_idx}"

new_text = text[:s_idx] + fixed_modal_bhup + "\n\n    " + text[e_idx:]

with open('frontend/src/components/office/ChotuKumarDialogueModal.tsx', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(new_text)

print("Properly replaced Bhupendra section with backticks!")
