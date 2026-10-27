path = 'backend/app/core/orchestrator.py'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

old = '''    def _resolve_worker_agent(self, task: Task) -> tuple[str, str, str]:
        title = task.title.lower()
        if "design" in title or "ui/ux" in title or "screen" in title or "ux" in title:
            return ("UI/UX Design Engineer (Speed & Usability)", "agent-esha", "agent-giriraj")
        elif "frontend" in title or "ui" in title:
            return ("Frontend Engineer", "agent-maan", "agent-giriraj")
        elif "qa" in title or "test" in title:
            return ("Tester, reporting to QA", "agent-ashish", "agent-abhishek")'''

new = '''    def _resolve_worker_agent(self, task: Task) -> tuple[str, str, str]:
        title = task.title.lower()
        if "design" in title or "ui/ux" in title or "screen" in title or "ux" in title:
            return ("UI/UX Design Engineer (Speed & Usability)", "agent-esha", "agent-giriraj")
        elif "qa" in title or "test" in title:
            return ("Tester, reporting to QA", "agent-ashish", "agent-abhishek")
        elif "frontend" in title or " ui " in title or title.endswith(" ui") or title.startswith("ui "):
            return ("Frontend Engineer", "agent-maan", "agent-giriraj")'''

c = c.replace(old, new)
with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print('Updated _resolve_worker_agent')
