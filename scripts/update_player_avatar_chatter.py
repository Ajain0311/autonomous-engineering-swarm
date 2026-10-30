with open('frontend/src/components/office/PlayerAvatar.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add random ambient chatter timer state
timer_init = """  const [isNearConfGate, setIsNearConfGate] = useState(false);
  const lastChatterTime = useRef<number>(0);
  const lastChatterEmployeeId = useRef<string | null>(null);"""

text = text.replace("  const [isNearConfGate, setIsNearConfGate] = useState(false);", timer_init)

# Inside useFrame near proximity check
ambient_chatter_code = """    // Ambient living office gossip when Manoj Bhai stands near any employee without opening dialogue
    const now = Date.now();
    if (closest && !activeDialogueEmployeeId && now - lastChatterTime.current > 12000) {
      lastChatterTime.current = now;
      lastChatterEmployeeId.current = closest.id;

      const isBhupendra = closest.id === 'agent-bhupendra' || closest.name.includes('Bhupendra');
      const isHimanshu = closest.id === 'agent-kathan' || closest.name.includes('Himanshu');
      const isGiriraj = closest.id === 'agent-giriraj' || closest.name.includes('Giriraj');
      const isSanjay = closest.id === 'agent-sanjay' || closest.name.includes('Sanjay');

      let funnyLine = '';
      if (isBhupendra) {
        funnyLine = 'Bhupendra dheere se: Arre Manoj bhai idhar hi khade hain, jaldi se document kholo warna bolenge alash kar raha hu!';
      } else if (isHimanshu) {
        funnyLine = 'Himanshu Lala: Bhai Manoj bhai aa gaye, CI build green dikha do jaldi!';
      } else if (isGiriraj) {
        funnyLine = 'Giriraj: Oye Sanjay, Manoj bhai check karne aaye hain, code window badi karo!';
      } else if (isSanjay) {
        funnyLine = 'Sanjay Sahlot: Haan bhai operations full tight hai, Manoj bhai ke aate hi sab serious ban jao!';
      } else {
        const casualGossip = [
          `Oye shhh... Manoj bhai pass me khade hain, kaam karte raho!`,
          `Bhai aaj lunch me kya mangwaya hai? Shhh Manoj bhai sun rahe hain!`,
          `Dekh-dekh Manoj bhai round pe nikle hain, screen pe graph khol de!`,
          `Abhi to chai pi ke aaya hu, Manoj bhai ne dekh liya to bolenge kaam nahi ho raha!`
        ];
        funnyLine = casualGossip[Math.floor(Math.random() * casualGossip.length)];
      }

      speechTts.speak(funnyLine, { isPunjabi: true, rate: 1.02 });
    }"""

text = text.replace("    setNearestEmployee(closest);", "    setNearestEmployee(closest);\n\n" + ambient_chatter_code)

with open('frontend/src/components/office/PlayerAvatar.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated PlayerAvatar.tsx with spontaneous living office ambient whispers!')
