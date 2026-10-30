import sys

new_func = """  const buildLiveResponse = (qIndex: number, lang: DialogueLang): string => {
    const name = employee.name;
    const action = employee.action;
    const status = employee.status;
    const isAditya = employee.id === 'agent-aditya' || employee.name.includes('Aditya');
    const isBhupendra = employee.id === 'agent-bhupendra' || employee.name.includes('Bhupendra');
    const isGiriraj = employee.id === 'agent-giriraj' || employee.name.includes('Giriraj');
    const isHimanshu = employee.id === 'agent-kathan' || employee.name.includes('Himanshu');
    const isSanjay = employee.id === 'agent-sanjay' || employee.name.includes('Sanjay');
    const isQA = employee.department === 'Quality Assurance' || employee.name.includes('Abhishek') || employee.name.includes('Ashish');

    // Pick pseudorandom index based on task / time so it feels fresh on each tap
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    // ==================== SPECIAL PUNJABI DIALOGUE (ADITYA JAIN - TOP AUTHORITY) ====================
    if (isAditya) {
      if (lang === 'punjabi') {
        if (qIndex === 0) {
          return pick([
            `Oye Manoj veere! Kidaan! Main taan full aish kar reha aan cabin ch, AC di thandi hawa vich kadak chai chal rahi ae! Backend waale mundeyan nu chaar gaalan kadhiyaan te saare seedhe raste pe aa gaye. Tu chill maar mere veere, company full profit ch jaau! Bol hor ki sewa kariye tuhanu malik saab?`,
            `Oye Manoj veere! Executive chair te baith ke poori company da remote control ghuma reha aan! Giriraj nu order dita hai 10x speed te code likhan da. Tu bas gaddi ch ghumm te mauj le, baaki main sambhal lau!`,
            `Sat Sri Akal Manoj saab! Ajj taan cabin vich almond pista cookies naal Punjabi kadak chai mangwayi ae! Saari dev fauj dar ke kaam kar rahi ae. Tussi aao baitho, tuhanu VIP cup pilaunda aan!`,
            `Oye veere! Saare 18 agents meri ungliyaan te naach rahe ne! Code delivery bullet train wargi tez chal rahi ae, tu bas party di taiyyari kar!`
          ]);
        }
        if (qIndex === 1) {
          return pick([
            `Oye Manoj veere! Distribution da ki puchhda ae? Saare dev mundeyan nu kutt-kutt ke kaam karwa reha aan! Giriraj code te hath jod ke betha ae, QA waale bugs labh-labh thak gaye, te DevOps waale server nu fan chala ke thanda kar rahe ne! Scene poora bomb chal reha ae, bas tu saadi salary da check sign kar de time te!`,
            `Oye Manoj veere! 100% full capacity chal rahi ae! Bhupendra nu BA lounge ch baith ke requirements final karne nu keha ae, baaki frontend-backend sab synchronization ch ne. Swarm da engine 8000 RPM te ghum reha ae!`,
            `Manoj veere sprint burndown chart vekh ke maza aa gaya! Sabhi modules green pipeline ch jaa rahe ne, koi rukaawat nahi ae mere bhai!`,
            `Oye project status dassan? Engineering te QA dono track te daud rahe ne, Sanjay resource manage kar reha ae te delivery bullet proof ae!`
          ]);
        }
        if (qIndex === 2) {
          return pick([
            `Kedi gall kar reha ae Manoj veere! Blocker di aisi taisi! Jehda bug saade aage aaya, main ohnu chuk ke dustbin vich sut dita! Koi rola-rappa nahi ae paaji, swarm full speed te bhaj reha ae. Chal hun bakchodi band kar te thoda walk karke aish maar office ch!`,
            `Blocker? Mere raaj vich blocker di himmat ki ad jaaye? Ek defect aaya si, Ashish ne phadya te Rohan ne do mint ch thik kar dita. All systems green veere!`,
            `Manoj veere tension lene da nahi, sirf dene da! Swarm ch koi rola nahi ae, sab kuch butter-smooth chal reha ae!`,
            `Oye paaji, Aditya de hondayan koi blocker tik sakda ae bhala? Saare blockers nu bahar da rasta dikha dita!`
          ]);
        }
        return `Oye Manoj veere, tu aish kar!`;
      } else {
        if (qIndex === 0) {
          return pick([
            `Manoj bhai! Sab tagda chal raha hai executive cabin mein. Kadak chai pee raha hu aur poori engineering team ko tight rakha hai. Koi lafda nahi hai!`,
            `Manoj bhai direct report: Main cabin se live metrics dekh raha hu, saari 18 agents ki fauj full flow me code dhar rahi hai!`,
            `Namaste Manoj bhai! Main strategy roadmap aur high-level orchestration lock kar raha hu. Sab kuch under control hai boss!`,
            `Boss aapke aate hi cabin ka mahaul charged ho gaya! Swarm engine top performance deliver kar raha hai!`
          ]);
        }
        if (qIndex === 1) {
          return pick([
            `Manoj bhai tasks distribution ekdum solid hai! Giriraj aur team backend-frontend dono pe lage hue hain. Progress 100% on track hai!`,
            `Tasks pipeline super clean hai Manoj bhai! 90% sprints scheduled hain, architecture modular hai aur delivery timeline pe release ready ho jayegi.`,
            `Engineering leads Giriraj aur Sanjay full coordination me hain. Zero bottlenecks, har agent apna slot perfect handle kar raha hai!`,
            `Manoj bhai DAG workflow ekdum clockwork ki tarah chal raha hai, backlog clear aur releases sprint velocity se nikal rahi hain!`
          ]);
        }
        if (qIndex === 2) {
          return pick([
            `Blocker ki to aisi-taisi Manoj bhai! Jo bhi bug aaya, team ne turant nipat liya. Tension free raho boss!`,
            `Koi blocker nahi hai Manoj bhai. Humne regression pipeline automate kar rakhi hai, testing fail hote hi auto-fix alert chala jata hai!`,
            `All clear Manoj bhai! Bas aap board meeting me proud feel karo, engineering me koi issue nahi aane dunga!`,
            `Blocker zero hai boss! Swarm security checks aur automated audits sab flawlessly pass ho rahe hain!`
          ]);
        }
        return `Sab badiya chal raha hai Manoj bhai!`;
      }
    }

    // ==================== SPECIAL LAZY BA (BHUPENDRA JINGAR) ====================
    if (isBhupendra) {
      if (lang === 'punjabi') {
        if (qIndex === 0) {
          return pick([
            `Oye veere tu fir aa gya! Kam krne di aissii di tesii, main te sone jaa reha aan munde! Oye canteen to chips daa packet mangao ree koi kadak chai naal, fir vekhaange ki kam karna ae! Tu vi sofa te lamme pe jaa Manoj veere!`,
            `Oye Manoj veere! Dimaag da dahi ho gaya requirements likh-likh ke. Main te 2 ghante di power nap len laga aan! Chips da packet khol te aish maar!`,
            `Sat Sri Akal Manoj veere! BA da kaam bada heavy hunda ae veere, sofa te baith ke sochna painda ae! Hukam karo ki sewa kariye?`,
            `Oye Manoj veere, main abhi chair te baith ke aankh band karke product envisioning kar reha si! Kam kal karenge!`
          ]);
        }
        if (qIndex === 1) {
          return pick([
            `Oye Manoj veere, chips chabaunde-chabaunde progress dassan? Dev munde matha maar rahe ne code ch, main te aalsi mood vich AC di thandi hawa le reha aan. Requirement kal banau, aaj rest day ghoshit karo!`,
            `Veere progress da ki ae, user story spreadsheet vich 50 ticketan khol ditiyan ne, ab dev baith ke ro rahe ne! Main mast chill kar reha aan.`,
            `Manoj veere, scope creep aa gaya si beech vich par maine ghuma ke back-log ch sut dita! Saara kaam rab de aasre on track ae!`,
            `Oye progress chhad Manoj veere, pehle canteen to aloo bhujia mangao fir dassanga agla feature!`
          ]);
        }
        if (qIndex === 2) {
          return pick([
            `Blocker da ki puchhda ae veere! Sannu neend aa rahi ae te canteen ch chips khatam ho gaye, sabto wadda blocker ehi ae! Kam taan hunda rahuga, tu tension chhad de!`,
            `Blocker ehi ae veere ki client roz naya dimaag chalaunda ae! Main kehta bhai pehle samosa party do fir specification sign karanga!`,
            `Koi technical blocker nahi ae Manoj veere, bas mera mouse thoda slow chal reha ae kyonki hath vich chips da tel lag gaya!`,
            `Sabto wadda blocker ae garmi! AC 16 te karao pehle, fir requirements speed fadegi!`
          ]);
        }
        return `Oye chips daa packet mangao ree koi pehla!`;
      } else {
        if (qIndex === 0) {
          return pick([
            `Oye Manoj bhai tu fir aa gaya! Kaam karne ki aisi ki taisi, main to sone ja raha hu bhai! Oye koi chips ka packet mangao re kadak chai ke saath! Itni thandi hawa me kaun kaam kare yaar, aish karo!`,
            `Manoj bhai BA requirements drafting chal rahi hai par aankhein band hone lagi hain! Thoda snacks order karwao tab energy aayegi!`,
            `Bhai main to lounge me relax kar raha hu. Product road-map to mann me ready hai, document kal likh dunga!`,
            `Manoj bhai dimaag ko aaram de raha hu, jab soch achhi hogi tabhi to specifications me dum aayega!`
          ]);
        }
        if (qIndex === 1) {
          return pick([
            `Manoj bhai sab chill chal raha hai. Munde code ghaseet rahe hain, main to chips kha raha hu mast. Sprint planning kal subah karenge, abhi neend ka time hai!`,
            `Tasks distribution mast hai Manoj bhai! Maine developers ko itne use cases de diye hain ki agle do hafte tak wo meri shakal nahi dekhna chahenge!`,
            `Progress 100% chill mode me hai Manoj bhai. Story points estimate kar diye hain, baaki bhagwan bharose!`,
            `Feature specs freeze kar diye hain Manoj bhai, ab devs ka khoon paseena bahega!`
          ]);
        }
        if (qIndex === 2) {
          return pick([
            `Blocker bas ek hi hai Manoj bhai: mujhe neend aa rahi hai aur canteen me chips khatam ho gaye! Baki sab rab ke bharose mast chal raha hai!`,
            `Blocker yehi hai bhai ki AC boht thanda chal raha hai, kambal mangwa do ek lounge sofa ke liye!`,
            `Technical blocker koi nahi hai Manoj bhai, Giriraj dekh raha hai. Meri taraf se bas appetite pending hai!`,
            `Koi blocker nahi hai bhai, bas meeting me bol dunga 'under BA evaluation', sab manage ho jayega!`
          ]);
        }
        return `Oye chips ka packet mangao ree koi!`;
      }
    }

    // Detect if employee is currently resting at the Executive Lounge Sofa or Restrooms
    const isAtSofa =
      employee.current_coords[0] >= -14.5 &&
      employee.current_coords[0] <= -10.5 &&
      employee.current_coords[2] >= 9.5 &&
      employee.current_coords[2] <= 11.5;
    const isAtRestroom = employee.current_coords[0] < -17 && employee.current_coords[2] > 13.5;

    // ==================== PUNJABI INDIAN STYLE RESPONSES (FOR ALL SWARM AGENTS) ====================
    if (lang === 'punjabi') {
      // Question 0: Currently working on
      if (qIndex === 0) {
        if (isAtSofa) {
          return pick([
            `Haanji Manoj veere! Thoda 5 minute break leke lounge sofa te betha aan, kadak chai pee reha aan. Naya task aunde hi turant desk te baith ke code da dhuaan kadh deyange!`,
            `Oye Manoj veere! Thoda sukoon le reha aan sofa te! Dimaag fresh hunda hai taan code 10x tezi naal likhya janda ae. Tu vi aake baith do minute!`,
            `Chai-samosa break chal reha ae Manoj saab! 2 ghante continuously keyboard kutteya si, hun recharge ho ke baithanga!`
          ]);
        }
        if (isAtRestroom) {
          return pick([
            `Manoj veere bas 2 minute vich washroom to fresh ho ke desk te pahunch reha aan. Poora system rab raakha on track ae!`,
            `Veere thanda paani muh pe maar ke neend udaa reha aan! Task boht bhaari chal reha ae, turant desk te jump maaranga!`,
            `Bas do ghunt paani pee ke desk te laut reha aan Manoj saab, terminal khulla chhad ke aaya aan!`
          ]);
        }
        if (task) {
          let actPunjabi = 'kam khich ke chal reha ae';
          if (action === 'CODE') actPunjabi = 'code likh reha aan te unit testing dab ke chal rahi ae';
          if (action === 'TEST') actPunjabi = 'QA te testing vich bugs di khulli phainti laa reha aan';
          if (action === 'DEFECT') actPunjabi = 'defect phad ke theek kar reha aan';
          if (action === 'PRESENT' || action === 'TALK') actPunjabi = 'lead naal baith ke review set kar reha aan';

          let speechAddon = '';
          if (latestSpeech && latestSpeech.text) {
            speechAddon = ` Taza update ae: "${latestSpeech.text}".`;
          }
          return pick([
            `Sat Sri Akal Manoj saab! Main abhi live task ${task.id} - "${task.title}" te ${actPunjabi}. Pipeline status "${task.status}" ae. Tussi chinta na karo veere, kam sira laa devange!${speechAddon}`,
            `Manoj veere! Task ${task.id} te ghaint kaam chal reha ae! Code ekdum bulletproof ban reha ae te sub-second tests pass ho rahe ne!${speechAddon}`,
            `Sat Sri Akal paaji! Task ${task.id} te hath chal rahe ne, Aditya sir ne compliance tight rakhi ae par apun poora fod ke rakh dita ae!${speechAddon}`,
            `Oye Manoj saab! Task ${task.id} da implementation rab di mehar naal 90% nikal chuka ae!${speechAddon}`
          ]);
        }
        if (name.includes('Pooja')) {
          return pick([
            `Sat Sri Akal Manoj ji! Main reception gate te saare visitors te live entry sambhal rahi aan. Swarm vich kul ${allTasks.length} tasks ne te ${inProgressTasks.length} full chadhai vich chal rahe ne!`,
            `Namaste Manoj ji! South entrance gate clear hai aur saare credentials log check ho rahe hain! Koi anjaan person entry nahi le sakda!`
          ]);
        }
        if (isGiriraj) {
          return pick([
            `Sat Sri Akal Manoj veere! Engineering architecture review kar reha aan, poore 18 agents nu sprint line vich jod rakha ae!`,
            `Manoj veere, PR review chal rahi ae! Kisi vi dev nu buggy code merge nahi karn ditta! Quality 100% diamond cut hai!`,
            `Sat Sri Akal boss! Main Rohan te team de commits verify kar reha aan, architecture robust ae!`
          ]);
        }
        if (isHimanshu) {
          return pick([
            `Sat Sri Akal Manoj bhai! Cloud containers te CI pipeline monitor kar reha aan, 0 downtime chal rahi ae!`,
            `Manoj veere Kubernetes cluster mast ud reha hai, builds 30 second ch deploy ho rahe ne!`,
            `Veere server load 15% te chal reha ae, auto-scaling rock solid ae!`
          ]);
        }
        return pick([
          `Sat Sri Akal Manoj veere! Main standby te ready baitha aan, Agla order bolo, turant shuru kar daange! Hun tak main ${employee.tasks_completed} tasks poore kite ne.`,
          `Haanji Manoj saab, agla ticket assign karo! Keyboard garam hai, commit da dhuaan nikal dunga!`,
          `Manoj veere code base clean karke baitha aan, bas lead da ishaara chahida ae!`
        ]);
      }

      // Question 1: Project distribution
      if (qIndex === 1) {
        if (allTasks.length === 0) {
          return `Manoj veere hale koi pending task queue ch nahi ae. Saari ${employee.department} fauj agle hukam da intezaar kar rahi ae!`;
        }
        const activeNames = inProgressTasks.map((t) => t.id).slice(0, 3).join(', ');
        return pick([
          `Haanji Manoj veere, total ${allTasks.length} tasks chal rahe ne: ${inProgressTasks.length} tasks te hath pair chal rahe ne (${activeNames || 'active'}), ${underReviewTasks.length} review ch ne, te ${verifiedTasks.length} verified ho gaye ne! Scene poora hit ae!`,
          `Manoj veere pipeline report: Swarm ch ${inProgressTasks.length} tasks live burning state ch ne. Engineering coordination poori solid chal rahi ae!`,
          `Veere tasks distribution crystal-clear ae! Har developer kol apna DAG node mapped ae, overlap bilkul zero ae!`,
          `Swarm da speed check: ${verifiedTasks.length} verified tasks archive ho gaye ne aur delivery date time te hit hou!`
        ]);
      }

      // Question 2: Blockers or defects
      if (qIndex === 2) {
        if (failedTasks.length > 0) {
          const failedIds = failedTasks.map((t) => `${t.id}: ${t.title}`).join('; ');
          return `Manoj veere, pipeline vich ${failedTasks.length} taskan ch rola pe gaya: ${failedIds}. Par fikar na karo, mundey bugs nu lapet rahe ne!`;
        }
        if (underReviewTasks.length > 0) {
          const rIds = underReviewTasks.map((t) => t.id).join(', ');
          return `Manoj veere, ${underReviewTasks.length} tasks review queue ch bethe ne (${rIds}). Koi blocker nahi ae, bas sign-off chahida ae.`;
        }
        if (task && task.status === 'BLOCKED') {
          return `Manoj veere mera task ${task.id} dependency karke atkeya hoya ae. Hari jhandi milde hi gaddi full speed bhajjegi!`;
        }
        return pick([
          `Koyi blocker nahi ae Manoj veere! Rasta ekdum saaf ae, sab changa chal reha ae, chak de phatte!`,
          `Blocker di aisi di taisi veere! Saare tests green pass ne, regression run ho chuka ae!`,
          `Rab raakha Manoj veere, koi lafda nahi ae, delivery timing ekdum dot on time hoyegi!`,
          `Zero defect policy veere! Abhishek te Ashish ne sab check karke hari batti jala diti ae!`
        ]);
      }
    }

    // ==================== HINDI INDIAN STYLE RESPONSES ====================
    if (qIndex === 0) {
      if (isAtSofa) {
        return pick([
          `Haanji Manoj bhai! Abhi thoda break leke lounge sofa pe betha hu. Jaise hi naya task assign hoga ya PR review aayega, main immediately desk pe code resume kar dunga!`,
          `Manoj bhai thoda mind refresh karne lounge me baitha tha. 15 minute me coffee khatam karke agla sprint ticket shuru kar raha hu!`,
          `Lounge sofa se live report Manoj bhai: Bhupendra aur hum brainstorming kar rahe the, abhi desk pe wapas jaa rahe hain!`
        ]);
      }
      if (isAtRestroom) {
        return pick([
          `Manoj bhai, bas 1-2 minute me washroom se fresh hoke desk pe pahunch raha hu. All systems on track hain!`,
          `Thoda fresh hoke turant terminal pe wapas ja raha hu Manoj bhai, code ka flow tootne nahi dunga!`,
          `Bas 2 minute Manoj bhai, paani pee ke desk pe reporting deta hu!`
        ]);
      }

      if (task) {
        let actionDesc = 'kaam kar raha hu';
        if (action === 'CODE') actionDesc = 'code implementation aur unit testing kar raha hu';
        if (action === 'TEST') actionDesc = 'QA staging test cases verify kar raha hu';
        if (action === 'DEFECT') actionDesc = 'test failure defect investigate and fix kar raha hu';
        if (action === 'PRESENT' || action === 'TALK') actionDesc = 'lead aur team ke saath review align kar raha hu';

        let speechAddon = '';
        if (latestSpeech && latestSpeech.text) {
          speechAddon = ` Mera latest live update hai: "${latestSpeech.text}".`;
        }

        return pick([
          `Haanji Manoj bhai! Main abhi live task ${task.id} - "${task.title}" par ${actionDesc}. Pipeline status "${task.status}" hai. Goal: ${task.goal}.${speechAddon}`,
          `Manoj bhai task ${task.id} par actively focused hu. Acceptance criteria rigorously verify ho rahe hain.${speechAddon}`,
          `Hello Manoj bhai! Active ticket ${task.id} ka implementation almost complete hone ko hai, sub-second latency targets achieve ho rahe hain!${speechAddon}`,
          `Boss task ${task.id} par zero warnings ke sath build ready kar raha hu, PR submit hote hi update dunga!${speechAddon}`
        ]);
      }

      if (name.includes('Pooja')) {
        return pick([
          `Namaste Manoj bhai! Main reception lobby me live visitors aur gate operations coordinate kar rahi hu. System me total ${allTasks.length} tasks registered hain, jisme se ${inProgressTasks.length} active in-progress hain.`,
          `Namaste Manoj ji! South entrance gate register up to date hai, aur office reception perfectly managed hai.`
        ]);
      }

      if (isGiriraj) {
        return pick([
          `Manoj bhai engineering architecture lead kar raha hu. Code standards, linting, aur design patterns 100% compliant chal rahe hain!`,
          `Manoj bhai, devs ke saath PR reviews chal rahe hain. Sub-module integration complete ho chuka hai!`,
          `Manoj bhai technical debt zero hai, architecture modular aur scalable banaya gaya hai!`
        ]);
      }

      if (isHimanshu) {
        return pick([
          `Manoj bhai DevOps side sab rock solid hai. Staging containers live hain aur resource telemetry 100% nominal hai!`,
          `Manoj bhai CI/CD automated pipeline running smooth hai, zero deploy failures till now!`,
          `Sir infrastructure health 100% green hai, automated rollbacks configured hain!`
        ]);
      }

      if (isQA) {
        return pick([
          `Manoj bhai automation test suites execution par hain. Corner-cases aur stress tests rigorously execute ho rahe hain!`,
          `Defect tracking aur smoke tests complete ho gaye hain Manoj bhai, QA clearance jald mil jayegi!`,
          `Manoj bhai staging verification 95% pass rate show kar rahi hai, zero critical blockers!`
        ]);
      }

      if (latestSpeech && latestSpeech.text) {
        return `Manoj bhai, mera latest live event hai: "${latestSpeech.text}". Current state "${status}" hai, total ${employee.tasks_completed} tasks completed hain.`;
      }

      return pick([
        `Manoj bhai, currently main standby state me hu aur next task assignment ka wait kar raha hu. Maine abhi tak ${employee.tasks_completed} tasks successfully complete kiye hain.`,
        `Standby mode active hai Manoj bhai. jaise hi queue me naya task aayega, main execute karna start kar dunga!`,
        `Sab ready hai Manoj bhai, agle requirement packet ka wait kar raha hu!`
      ]);
    }

    if (qIndex === 1) {
      if (allTasks.length === 0) {
        return `Manoj bhai, currently pipeline me koi tasks queue me nahi hain. Sabhi ${employee.department} units standby mode me hain.`;
      }
      const activeTaskNames = inProgressTasks.map((t) => t.id).slice(0, 3).join(', ');
      return pick([
        `Haanji Manoj bhai, live project distribution me total ${allTasks.length} tasks hain: ${inProgressTasks.length} tasks in-progress hain (${activeTaskNames || 'active'}), ${underReviewTasks.length} review me hain, aur ${verifiedTasks.length} successfully verified hain.`,
        `Project status update Manoj bhai: DAG dependencies smoothly resolve ho rahi hain, ${verifiedTasks.length} tasks successfully close ho chuke hain.`,
        `Tasks distribution perfectly balanced hai Manoj bhai, kisi bhi agent par overload nahi hai!`,
        `Sprint velocity target se 15% better run kar rahi hai Manoj bhai, release timely ship hogi!`
      ]);
    }

    if (qIndex === 2) {
      if (failedTasks.length > 0) {
        const failedIds = failedTasks.map((t) => `${t.id}: ${t.title}`).join('; ');
        return `Manoj bhai, pipeline me ${failedTasks.length} failed defect tasks hain: ${failedIds}. Is par investigation chal rahi hai.`;
      }
      if (underReviewTasks.length > 0) {
        const reviewIds = underReviewTasks.map((t) => t.id).join(', ');
        return `Manoj bhai, currently ${underReviewTasks.length} tasks lead review queue me hain (${reviewIds}). Koi blocking failure nahi hai.`;
      }
      if (task && task.status === 'BLOCKED') {
        return `Manoj bhai, mera active task ${task.id} currently dependency wait me blocked hai. Approval milte hi aage badhunga.`;
      }
      return pick([
        `Manoj bhai, live status check ekdam clear hai! Sabhi active tasks normal pass ho rahe hain aur koi blocking defect nahi hai.`,
        `Zero blockers Manoj bhai! Pipeline velocity smooth hai aur sabhi gates clear hain!`,
        `Sab badiya chal raha hai Manoj bhai, koi roadblock nahi hai, release on track hai!`,
        `Defect free run chal raha hai Manoj bhai, regression passes cleanly!`
      ]);
    }

    return `Manoj bhai, all systems live running hain.`;
  };
"""

with open('frontend/src/components/office/ChotuKumarDialogueModal.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = None
end_idx = None

for i, l in enumerate(lines):
    if 'const buildLiveResponse = (qIndex: number, lang: DialogueLang): string => {' in l:
        start_idx = i
    if start_idx is not None and 'const currentLiveResponse = buildLiveResponse(selectedQuestionIndex, languageMode);' in l:
        end_idx = i
        break

assert start_idx is not None and end_idx is not None

new_lines = lines[:start_idx] + [new_func + '\n'] + lines[end_idx:]

with open('frontend/src/components/office/ChotuKumarDialogueModal.tsx', 'w', encoding='utf-8', newline='\r\n') as f:
    f.writelines(new_lines)

print('Successfully spliced new buildLiveResponse!')
