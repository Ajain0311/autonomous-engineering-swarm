path = 'frontend/src/services/api.ts'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

agent_methods = '''  createAgent: async (payload: { name: string; role: string; parent_id?: string | null; department?: string; model?: string }): Promise<Agent> => {
    const res = await fetch(`${API_BASE}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  updateAgent: async (agentId: string, payload: { name?: string; role?: string; parent_id?: string | null; department?: string; status?: string; model?: string }): Promise<Agent> => {
    const res = await fetch(`${API_BASE}/agents/${agentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  deleteAgent: async (agentId: string) => {
    const res = await fetch(`${API_BASE}/agents/${agentId}`, {
      method: 'DELETE'
    });
    return res.json();
  },
'''

c = c.replace('  getProjects: async () => {', agent_methods + '\n  getProjects: async () => {')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print('Added createAgent, updateAgent, deleteAgent to api.ts')
