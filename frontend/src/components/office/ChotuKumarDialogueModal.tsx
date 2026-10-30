import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, X, Terminal, CheckCircle2, AlertTriangle, Activity, Cpu, Languages } from 'lucide-react';
import { OfficeEmployeeData, SpeechBubbleItem } from '../../types/office';
import { Task } from '../../types';
import { speechTts } from '../../utils/speechTts';
import { gameAudio } from '../../utils/gameAudio';

interface ChotuKumarDialogueModalProps {
  employee: OfficeEmployeeData | null;
  task: Task | null;
  latestSpeech: SpeechBubbleItem | null;
  allTasks: Task[];
  onClose: () => void;
}

export type DialogueLang = 'punjabi' | 'hindi';

export const ChotuKumarDialogueModal: React.FC<ChotuKumarDialogueModalProps> = ({
  employee,
  task,
  latestSpeech,
  allTasks,
  onClose,
}) => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(speechTts.getMuted());
  const [languageMode, setLanguageMode] = useState<DialogueLang>('punjabi');

  if (!employee) return null;

  // Real live metrics from current tasks DAG
  const inProgressTasks = allTasks.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'TESTING');
  const underReviewTasks = allTasks.filter((t) => t.status === 'REVIEW');
  const verifiedTasks = allTasks.filter((t) => t.status === 'VERIFIED' || t.status === 'READY_TO_RELEASE');
  const failedTasks = allTasks.filter((t) => t.status === 'FAILED' || t.status === 'BLOCKED');

  // Build 100% REAL live response in genuine Punjabi / Desi Indian style!
  const buildLiveResponse = (qIndex: number, lang: DialogueLang): string => {
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
            `Oye Baburao veere! Kidaan! Main taan full aish kar reha aan cabin ch, AC di thandi hawa vich kadak chai chal rahi ae! Backend waale mundeyan nu chaar gaalan kadhiyaan te saare seedhe raste pe aa gaye. Tu chill maar mere veere, company full profit ch jaau! Bol hor ki sewa kariye tuhanu malik saab?`,
            `Oye Baburao veere! Executive chair te baith ke poori company da remote control ghuma reha aan! Giriraj nu order dita hai 10x speed te code likhan da. Tu bas gaddi ch ghumm te mauj le, baaki main sambhal lau!`,
            `Sat Sri Akal Baburao saab! Ajj taan cabin vich almond pista cookies naal Punjabi kadak chai mangwayi ae! Saari dev fauj dar ke kaam kar rahi ae. Tussi aao baitho, tuhanu VIP cup pilaunda aan!`,
            `Oye veere! Saare 18 agents meri ungliyaan te naach rahe ne! Code delivery bullet train wargi tez chal rahi ae, tu bas party di taiyyari kar!`
          ]);
        }
        if (qIndex === 1) {
          return pick([
            `Oye Baburao veere! Distribution da ki puchhda ae? Saare dev mundeyan nu kutt-kutt ke kaam karwa reha aan! Giriraj code te hath jod ke betha ae, QA waale bugs labh-labh thak gaye, te DevOps waale server nu fan chala ke thanda kar rahe ne! Scene poora bomb chal reha ae, bas tu saadi salary da check sign kar de time te!`,
            `Oye Baburao veere! 100% full capacity chal rahi ae! Bhupendra nu BA lounge ch baith ke requirements final karne nu keha ae, baaki frontend-backend sab synchronization ch ne. Swarm da engine 8000 RPM te ghum reha ae!`,
            `Baburao veere sprint burndown chart vekh ke maza aa gaya! Sabhi modules green pipeline ch jaa rahe ne, koi rukaawat nahi ae mere bhai!`,
            `Oye project status dassan? Engineering te QA dono track te daud rahe ne, Sanjay resource manage kar reha ae te delivery bullet proof ae!`
          ]);
        }
        if (qIndex === 2) {
          return pick([
            `Kedi gall kar reha ae Baburao veere! Blocker di aisi taisi! Jehda bug saade aage aaya, main ohnu chuk ke dustbin vich sut dita! Koi rola-rappa nahi ae paaji, swarm full speed te bhaj reha ae. Chal hun bakchodi band kar te thoda walk karke aish maar office ch!`,
            `Blocker? Mere raaj vich blocker di himmat ki ad jaaye? Ek defect aaya si, Ashish ne phadya te Rohan ne do mint ch thik kar dita. All systems green veere!`,
            `Baburao veere tension lene da nahi, sirf dene da! Swarm ch koi rola nahi ae, sab kuch butter-smooth chal reha ae!`,
            `Oye paaji, Aditya de hondayan koi blocker tik sakda ae bhala? Saare blockers nu bahar da rasta dikha dita!`
          ]);
        }
        return `Oye Baburao veere, tu aish kar!`;
      } else {
        if (qIndex === 0) {
          return pick([
            `Baburao! Sab tagda chal raha hai executive cabin mein. Kadak chai pee raha hu aur poori engineering team ko tight rakha hai. Koi lafda nahi hai!`,
            `Baburao direct report: Main cabin se live metrics dekh raha hu, saari 18 agents ki fauj full flow me code dhar rahi hai!`,
            `Namaste Baburao! Main strategy roadmap aur high-level orchestration lock kar raha hu. Sab kuch under control hai boss!`,
            `Boss aapke aate hi cabin ka mahaul charged ho gaya! Swarm engine top performance deliver kar raha hai!`
          ]);
        }
        if (qIndex === 1) {
          return pick([
            `Baburao tasks distribution ekdum solid hai! Giriraj aur team backend-frontend dono pe lage hue hain. Progress 100% on track hai!`,
            `Tasks pipeline super clean hai Baburao! 90% sprints scheduled hain, architecture modular hai aur delivery timeline pe release ready ho jayegi.`,
            `Engineering leads Giriraj aur Sanjay full coordination me hain. Zero bottlenecks, har agent apna slot perfect handle kar raha hai!`,
            `Baburao DAG workflow ekdum clockwork ki tarah chal raha hai, backlog clear aur releases sprint velocity se nikal rahi hain!`
          ]);
        }
        if (qIndex === 2) {
          return pick([
            `Blocker ki to aisi-taisi Baburao! Jo bhi bug aaya, team ne turant nipat liya. Tension free raho boss!`,
            `Koi blocker nahi hai Baburao. Humne regression pipeline automate kar rakhi hai, testing fail hote hi auto-fix alert chala jata hai!`,
            `All clear Baburao! Bas aap board meeting me proud feel karo, engineering me koi issue nahi aane dunga!`,
            `Blocker zero hai boss! Swarm security checks aur automated audits sab flawlessly pass ho rahe hain!`
          ]);
        }
        return `Sab badiya chal raha hai Baburao!`;
      }
    }

        // ==================== SPECIAL SUPER BAKCHOD LAZY BA (BHUPENDRA JINGAR) ====================
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
    }

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
            `Haanji Baburao veere! Thoda 5 minute break leke lounge sofa te betha aan, kadak chai pee reha aan. Naya task aunde hi turant desk te baith ke code da dhuaan kadh deyange!`,
            `Oye Baburao veere! Thoda sukoon le reha aan sofa te! Dimaag fresh hunda hai taan code 10x tezi naal likhya janda ae. Tu vi aake baith do minute!`,
            `Chai-samosa break chal reha ae Baburao saab! 2 ghante continuously keyboard kutteya si, hun recharge ho ke baithanga!`
          ]);
        }
        if (isAtRestroom) {
          return pick([
            `Baburao veere bas 2 minute vich washroom to fresh ho ke desk te pahunch reha aan. Poora system rab raakha on track ae!`,
            `Veere thanda paani muh pe maar ke neend udaa reha aan! Task boht bhaari chal reha ae, turant desk te jump maaranga!`,
            `Bas do ghunt paani pee ke desk te laut reha aan Baburao saab, terminal khulla chhad ke aaya aan!`
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
            `Sat Sri Akal Baburao saab! Main abhi live task ${task.id} - "${task.title}" te ${actPunjabi}. Pipeline status "${task.status}" ae. Tussi chinta na karo veere, kam sira laa devange!${speechAddon}`,
            `Baburao veere! Task ${task.id} te ghaint kaam chal reha ae! Code ekdum bulletproof ban reha ae te sub-second tests pass ho rahe ne!${speechAddon}`,
            `Sat Sri Akal paaji! Task ${task.id} te hath chal rahe ne, Aditya sir ne compliance tight rakhi ae par apun poora fod ke rakh dita ae!${speechAddon}`,
            `Oye Baburao saab! Task ${task.id} da implementation rab di mehar naal 90% nikal chuka ae!${speechAddon}`
          ]);
        }
        if (name.includes('Pooja')) {
          return pick([
            `Sat Sri Akal Baburao ji! Main reception gate te saare visitors te live entry sambhal rahi aan. Swarm vich kul ${allTasks.length} tasks ne te ${inProgressTasks.length} full chadhai vich chal rahe ne!`,
            `Namaste Baburao ji! South entrance gate clear hai aur saare credentials log check ho rahe hain! Koi anjaan person entry nahi le sakda!`
          ]);
        }
        if (isGiriraj) {
          return pick([
            `Sat Sri Akal Baburao veere! Engineering architecture review kar reha aan, poore 18 agents nu sprint line vich jod rakha ae!`,
            `Baburao veere, PR review chal rahi ae! Kisi vi dev nu buggy code merge nahi karn ditta! Quality 100% diamond cut hai!`,
            `Sat Sri Akal boss! Main Rohan te team de commits verify kar reha aan, architecture robust ae!`
          ]);
        }
        if (isHimanshu) {
          return pick([
            `Sat Sri Akal Baburao! Cloud containers te CI pipeline monitor kar reha aan, 0 downtime chal rahi ae!`,
            `Baburao veere Kubernetes cluster mast ud reha hai, builds 30 second ch deploy ho rahe ne!`,
            `Veere server load 15% te chal reha ae, auto-scaling rock solid ae!`
          ]);
        }
        return pick([
          `Sat Sri Akal Baburao veere! Main standby te ready baitha aan, Agla order bolo, turant shuru kar daange! Hun tak main ${employee.tasks_completed} tasks poore kite ne.`,
          `Haanji Baburao saab, agla ticket assign karo! Keyboard garam hai, commit da dhuaan nikal dunga!`,
          `Baburao veere code base clean karke baitha aan, bas lead da ishaara chahida ae!`
        ]);
      }

      // Question 1: Project distribution
      if (qIndex === 1) {
        if (allTasks.length === 0) {
          return `Baburao veere hale koi pending task queue ch nahi ae. Saari ${employee.department} fauj agle hukam da intezaar kar rahi ae!`;
        }
        const activeNames = inProgressTasks.map((t) => t.id).slice(0, 3).join(', ');
        return pick([
          `Haanji Baburao veere, total ${allTasks.length} tasks chal rahe ne: ${inProgressTasks.length} tasks te hath pair chal rahe ne (${activeNames || 'active'}), ${underReviewTasks.length} review ch ne, te ${verifiedTasks.length} verified ho gaye ne! Scene poora hit ae!`,
          `Baburao veere pipeline report: Swarm ch ${inProgressTasks.length} tasks live burning state ch ne. Engineering coordination poori solid chal rahi ae!`,
          `Veere tasks distribution crystal-clear ae! Har developer kol apna DAG node mapped ae, overlap bilkul zero ae!`,
          `Swarm da speed check: ${verifiedTasks.length} verified tasks archive ho gaye ne aur delivery date time te hit hou!`
        ]);
      }

      // Question 2: Blockers or defects
      if (qIndex === 2) {
        if (failedTasks.length > 0) {
          const failedIds = failedTasks.map((t) => `${t.id}: ${t.title}`).join('; ');
          return `Baburao veere, pipeline vich ${failedTasks.length} taskan ch rola pe gaya: ${failedIds}. Par fikar na karo, mundey bugs nu lapet rahe ne!`;
        }
        if (underReviewTasks.length > 0) {
          const rIds = underReviewTasks.map((t) => t.id).join(', ');
          return `Baburao veere, ${underReviewTasks.length} tasks review queue ch bethe ne (${rIds}). Koi blocker nahi ae, bas sign-off chahida ae.`;
        }
        if (task && task.status === 'BLOCKED') {
          return `Baburao veere mera task ${task.id} dependency karke atkeya hoya ae. Hari jhandi milde hi gaddi full speed bhajjegi!`;
        }
        return pick([
          `Koyi blocker nahi ae Baburao veere! Rasta ekdum saaf ae, sab changa chal reha ae, chak de phatte!`,
          `Blocker di aisi di taisi veere! Saare tests green pass ne, regression run ho chuka ae!`,
          `Rab raakha Baburao veere, koi lafda nahi ae, delivery timing ekdum dot on time hoyegi!`,
          `Zero defect policy veere! Abhishek te Ashish ne sab check karke hari batti jala diti ae!`
        ]);
      }
    }

    // ==================== HINDI INDIAN STYLE RESPONSES ====================
    if (qIndex === 0) {
      if (isAtSofa) {
        return pick([
          `Haanji Baburao! Abhi thoda break leke lounge sofa pe betha hu. Jaise hi naya task assign hoga ya PR review aayega, main immediately desk pe code resume kar dunga!`,
          `Baburao thoda mind refresh karne lounge me baitha tha. 15 minute me coffee khatam karke agla sprint ticket shuru kar raha hu!`,
          `Lounge sofa se live report Baburao: Bhupendra aur hum brainstorming kar rahe the, abhi desk pe wapas jaa rahe hain!`
        ]);
      }
      if (isAtRestroom) {
        return pick([
          `Baburao, bas 1-2 minute me washroom se fresh hoke desk pe pahunch raha hu. All systems on track hain!`,
          `Thoda fresh hoke turant terminal pe wapas ja raha hu Baburao, code ka flow tootne nahi dunga!`,
          `Bas 2 minute Baburao, paani pee ke desk pe reporting deta hu!`
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
          `Haanji Baburao! Main abhi live task ${task.id} - "${task.title}" par ${actionDesc}. Pipeline status "${task.status}" hai. Goal: ${task.goal}.${speechAddon}`,
          `Baburao task ${task.id} par actively focused hu. Acceptance criteria rigorously verify ho rahe hain.${speechAddon}`,
          `Hello Baburao! Active ticket ${task.id} ka implementation almost complete hone ko hai, sub-second latency targets achieve ho rahe hain!${speechAddon}`,
          `Boss task ${task.id} par zero warnings ke sath build ready kar raha hu, PR submit hote hi update dunga!${speechAddon}`
        ]);
      }

      if (name.includes('Pooja')) {
        return pick([
          `Namaste Baburao! Main reception lobby me live visitors aur gate operations coordinate kar rahi hu. System me total ${allTasks.length} tasks registered hain, jisme se ${inProgressTasks.length} active in-progress hain.`,
          `Namaste Baburao ji! South entrance gate register up to date hai, aur office reception perfectly managed hai.`
        ]);
      }

      if (isGiriraj) {
        return pick([
          `Baburao engineering architecture lead kar raha hu. Code standards, linting, aur design patterns 100% compliant chal rahe hain!`,
          `Baburao, devs ke saath PR reviews chal rahe hain. Sub-module integration complete ho chuka hai!`,
          `Baburao technical debt zero hai, architecture modular aur scalable banaya gaya hai!`
        ]);
      }

      if (isHimanshu) {
        return pick([
          `Baburao DevOps side sab rock solid hai. Staging containers live hain aur resource telemetry 100% nominal hai!`,
          `Baburao CI/CD automated pipeline running smooth hai, zero deploy failures till now!`,
          `Sir infrastructure health 100% green hai, automated rollbacks configured hain!`
        ]);
      }

      if (isQA) {
        return pick([
          `Baburao automation test suites execution par hain. Corner-cases aur stress tests rigorously execute ho rahe hain!`,
          `Defect tracking aur smoke tests complete ho gaye hain Baburao, QA clearance jald mil jayegi!`,
          `Baburao staging verification 95% pass rate show kar rahi hai, zero critical blockers!`
        ]);
      }

      if (latestSpeech && latestSpeech.text) {
        return `Baburao, mera latest live event hai: "${latestSpeech.text}". Current state "${status}" hai, total ${employee.tasks_completed} tasks completed hain.`;
      }

      return pick([
        `Baburao, currently main standby state me hu aur next task assignment ka wait kar raha hu. Maine abhi tak ${employee.tasks_completed} tasks successfully complete kiye hain.`,
        `Standby mode active hai Baburao. jaise hi queue me naya task aayega, main execute karna start kar dunga!`,
        `Sab ready hai Baburao, agle requirement packet ka wait kar raha hu!`
      ]);
    }

    if (qIndex === 1) {
      if (allTasks.length === 0) {
        return `Baburao, currently pipeline me koi tasks queue me nahi hain. Sabhi ${employee.department} units standby mode me hain.`;
      }
      const activeTaskNames = inProgressTasks.map((t) => t.id).slice(0, 3).join(', ');
      return pick([
        `Haanji Baburao, live project distribution me total ${allTasks.length} tasks hain: ${inProgressTasks.length} tasks in-progress hain (${activeTaskNames || 'active'}), ${underReviewTasks.length} review me hain, aur ${verifiedTasks.length} successfully verified hain.`,
        `Project status update Baburao: DAG dependencies smoothly resolve ho rahi hain, ${verifiedTasks.length} tasks successfully close ho chuke hain.`,
        `Tasks distribution perfectly balanced hai Baburao, kisi bhi agent par overload nahi hai!`,
        `Sprint velocity target se 15% better run kar rahi hai Baburao, release timely ship hogi!`
      ]);
    }

    if (qIndex === 2) {
      if (failedTasks.length > 0) {
        const failedIds = failedTasks.map((t) => `${t.id}: ${t.title}`).join('; ');
        return `Baburao, pipeline me ${failedTasks.length} failed defect tasks hain: ${failedIds}. Is par investigation chal rahi hai.`;
      }
      if (underReviewTasks.length > 0) {
        const reviewIds = underReviewTasks.map((t) => t.id).join(', ');
        return `Baburao, currently ${underReviewTasks.length} tasks lead review queue me hain (${reviewIds}). Koi blocking failure nahi hai.`;
      }
      if (task && task.status === 'BLOCKED') {
        return `Baburao, mera active task ${task.id} currently dependency wait me blocked hai. Approval milte hi aage badhunga.`;
      }
      return pick([
        `Baburao, live status check ekdam clear hai! Sabhi active tasks normal pass ho rahe hain aur koi blocking defect nahi hai.`,
        `Zero blockers Baburao! Pipeline velocity smooth hai aur sabhi gates clear hain!`,
        `Sab badiya chal raha hai Baburao, koi roadblock nahi hai, release on track hai!`,
        `Defect free run chal raha hai Baburao, regression passes cleanly!`
      ]);
    }

    return `Baburao, all systems live running hain.`;
  };

  const currentLiveResponse = buildLiveResponse(selectedQuestionIndex, languageMode);

  // Speak live response through speaker with Indian Voice
  useEffect(() => {
    speechTts.speak(currentLiveResponse, { isPunjabi: languageMode === 'punjabi' });
  }, [currentLiveResponse, selectedQuestionIndex, employee.id, languageMode]);

  const isAditya = employee.id === 'agent-aditya' || employee.name.includes('Aditya');

  const handleCloseModal = () => {
    if (isAditya) {
      // Chief Orchestrator witty farewell!
      speechTts.speak('Oye Baburao veere! Tussi jaa rahe ho? Tussi na jao!', { isPunjabi: true });
    } else {
      // Normal employees immediately stop talking when user leaves/closes
      speechTts.stop();
    }
    onClose();
  };

  const handleSelectQuestion = (idx: number) => {
    gameAudio.playClick();
    setSelectedQuestionIndex(idx);
  };

  const handleReplayVoice = () => {
    speechTts.speak(currentLiveResponse, { isPunjabi: languageMode === 'punjabi' });
  };

  const handleToggleVoice = () => {
    const newMuted = !isVoiceMuted;
    speechTts.setMuted(newMuted);
    setIsVoiceMuted(newMuted);
    if (!newMuted) {
      speechTts.speak(currentLiveResponse, { isPunjabi: languageMode === 'punjabi' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end items-center p-4 sm:p-6 pb-8 bg-black/45 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="pointer-events-auto w-full max-w-2xl bg-gradient-to-b from-slate-900/98 via-slate-950/98 to-indigo-950/98 border-2 border-sky-400 rounded-3xl shadow-[0_0_50px_rgba(56,189,248,0.45)] p-5 text-white flex flex-col space-y-3.5">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-500/30">
          <div className="flex items-center space-x-2.5">
            {/* Baburao Founder Badge */}
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.6)]">
              <span>👑</span>
              <span>MANOJ BHAI (OWNER)</span>
            </div>
            <span className="text-sky-400 font-mono text-sm font-bold">↔</span>
            {/* Target Employee */}
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{employee.name}</span>
              <span className="text-slate-400 font-normal">({employee.role.split('/')[0].trim()})</span>
            </div>
          </div>

          {/* Audio & Close Controls */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher Button (Punjabi / Hindi) */}
            <button
              onClick={() => {
                gameAudio.playClick();
                setLanguageMode((prev) => (prev === 'punjabi' ? 'hindi' : 'punjabi'));
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/50 text-amber-300 text-xs font-bold flex items-center space-x-1.5 transition active:scale-95 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
              title="Switch Indian Language (Punjabi / Hindi)"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{languageMode === 'punjabi' ? '🌾 Punjabi Dialect' : '🇮🇳 Hindi Dialect'}</span>
            </button>

            {/* Voice Model Switcher */}
            {speechTts.getAvailableVoices().length > 0 && (
              <select
                value={speechTts.getSelectedVoiceName() || ''}
                onChange={(e) => {
                  speechTts.setVoice(e.target.value);
                  speechTts.speak(currentLiveResponse, { isPunjabi: languageMode === 'punjabi' });
                }}
                className="bg-slate-900 border border-slate-700 text-sky-300 text-[10px] font-mono rounded-lg px-2 py-1 max-w-[140px] truncate focus:outline-none focus:ring-1 focus:ring-sky-400"
                title="Select Indian Voice Model"
              >
                {speechTts
                  .getAvailableVoices()
                  .map((v) => (
                    <option key={v.name} value={v.name}>
                      🎙️ {v.name.replace('Microsoft ', '').replace(' Online (Natural)', '').replace(' - Hindi (India)', '').replace(' - Punjabi (India)', ' (Punjabi)')}
                    </option>
                  ))}
              </select>
            )}

            <button
              onClick={handleReplayVoice}
              className="p-1.5 rounded-lg bg-sky-950 hover:bg-sky-800 text-sky-300 hover:text-white border border-sky-500/40 text-xs flex items-center space-x-1 transition active:scale-95"
              title="Hear response through speakers"
            >
              <Volume2 className="w-4 h-4 animate-pulse text-sky-400" />
              <span className="text-[11px] font-bold">Hear Voice</span>
            </button>
            <button
              onClick={handleToggleVoice}
              className={`p-1.5 rounded-lg border text-xs transition active:scale-95 ${
                isVoiceMuted
                  ? 'bg-rose-950/80 border-rose-500/60 text-rose-300'
                  : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
              }`}
              title={isVoiceMuted ? 'Unmute Speaker' : 'Mute Speaker'}
            >
              {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleCloseModal}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition"
              title="Close [ESC]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Work Context Badge */}
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-sky-500/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 truncate">
            <Terminal className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-slate-400 font-bold">LIVE TASK:</span>
            <span className="font-bold text-white truncate">
              {task ? `${task.id} - ${task.title}` : `No Active Task (${employee.status})`}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0 ml-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-950 border border-emerald-500/40 text-emerald-300">
              {task ? task.status : employee.status}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-950 border border-sky-500/40 text-sky-300">
              {employee.action}
            </span>
          </div>
        </div>

        {/* Baburao's Questions */}
        <div className="flex flex-col space-y-1">
          <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
            <span>💬 Select Inquiry from Owner Baburao:</span>
            <span className="text-[10px] text-amber-400/80 font-normal">
              {languageMode === 'punjabi' ? '🌾 Punjabi Desi Dialect Active' : '🇮🇳 Hindi Dialect Active'}
            </span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleSelectQuestion(0)}
              className={`p-2 rounded-xl text-xs font-semibold text-left transition border ${
                selectedQuestionIndex === 0
                  ? 'bg-sky-600/90 text-white border-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.4)] ring-1 ring-sky-300'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {languageMode === 'punjabi' ? '1. "Ki kam chal reha ae hun?"' : '1. "What are you working on right now?"'}
            </button>
            <button
              onClick={() => handleSelectQuestion(1)}
              className={`p-2 rounded-xl text-xs font-semibold text-left transition border ${
                selectedQuestionIndex === 1
                  ? 'bg-sky-600/90 text-white border-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.4)] ring-1 ring-sky-300'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {languageMode === 'punjabi' ? '2. "Project di progress kiven chal rahi ae?"' : '2. "How is project distribution & progress?"'}
            </button>
            <button
              onClick={() => handleSelectQuestion(2)}
              className={`p-2 rounded-xl text-xs font-semibold text-left transition border ${
                selectedQuestionIndex === 2
                  ? 'bg-sky-600/90 text-white border-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.4)] ring-1 ring-sky-300'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {languageMode === 'punjabi' ? '3. "Koyi bug, blocker ya lafda taan nahi?"' : '3. "Any blockers, defects, or reviews pending?"'}
            </button>
          </div>
        </div>

        {/* Real Live Response (Spoken Out Loud via Speaker) */}
        <div className="bg-slate-900/95 rounded-2xl p-4 border border-sky-500/40 relative shadow-inner">
          <div className="flex items-center space-x-2 mb-2 text-xs font-mono font-bold text-sky-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{employee.name} reporting live ({languageMode === 'punjabi' ? '🌾 Punjabi' : '🇮🇳 Hindi'}):</span>
            {!isVoiceMuted && (
              <span className="ml-auto text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 animate-pulse flex items-center space-x-1">
                <Volume2 className="w-3 h-3" />
                <span>SPEAKING VIA INDIAN VOICE</span>
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-100 leading-relaxed font-sans select-text">
            "{currentLiveResponse}"
          </p>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center space-x-1 font-mono">
            <span className="text-amber-400 font-bold">PRO-TIP:</span>
            <span>Click on any agent in the 3D office or walk near them and press E to talk!</span>
          </span>
          <span className="font-mono text-slate-500">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
