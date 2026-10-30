with open('frontend/src/components/office/EmployeeInspectorCard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "import { X, ShieldCheck, Eye, Terminal, Edit3, Trash2, Zap, Award, CheckCircle2 } from 'lucide-react';",
    "import { X, ShieldCheck, Eye, Terminal, Edit3, Trash2, Zap, Award, CheckCircle2, MessageSquare } from 'lucide-react';"
)

text = text.replace(
    "  onDeleteEmployee: (empId: string) => void;\n}",
    "  onDeleteEmployee: (empId: string) => void;\n  onTalkToEmployee?: (emp: OfficeEmployeeData) => void;\n}"
)

text = text.replace(
    "  onOpenEdit,\n  onDeleteEmployee\n}) => {",
    "  onOpenEdit,\n  onDeleteEmployee,\n  onTalkToEmployee\n}) => {"
)

target = "      {/* Follow Camera Action Button */}"
replacement = """      {/* Talk in Punjabi / Indian Voice Button */}
      {onTalkToEmployee && (
        <button
          onClick={() => {
            gameAudio.playClick();
            onTalkToEmployee(employee);
          }}
          className="w-full py-2 mb-2 rounded-xl text-xs font-mono font-black transition shadow-lg flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 shadow-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.6)] active:scale-95"
        >
          <MessageSquare className="w-4 h-4" />
          <span>TALK (PUNJABI / INDIAN VOICE)</span>
        </button>
      )}

      {/* Follow Camera Action Button */}"""

if target in text:
    text = text.replace(target, replacement)
    with open('frontend/src/components/office/EmployeeInspectorCard.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated EmployeeInspectorCard.tsx successfully')
else:
    print('Target not found')
