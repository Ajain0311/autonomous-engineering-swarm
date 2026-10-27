"""Directed Acyclic Graph (DAG) for Task Dependencies."""
from typing import Dict, List, Set, Optional

class CyclicDependencyError(Exception):
    """Raised when a cyclic dependency is detected in the task graph."""
    pass

class TaskDAG:
    def __init__(self):
        # task_id -> list of dependencies (upstream task IDs required before this task can run)
        self.dependencies: Dict[str, Set[str]] = {}
        # task_id -> list of dependents (downstream task IDs that depend on this task)
        self.dependents: Dict[str, Set[str]] = {}
        self.tasks: Dict[str, dict] = {}

    def add_task(self, task_id: str, task_data: Optional[dict] = None, deps: Optional[List[str]] = None):
        if task_id not in self.dependencies:
            self.dependencies[task_id] = set()
        if task_id not in self.dependents:
            self.dependents[task_id] = set()
            
        self.tasks[task_id] = task_data or {"id": task_id}
        
        if deps:
            for dep in deps:
                self.add_dependency(task_id, dep)

    def add_dependency(self, task_id: str, depends_on: str):
        """Specifies that task_id requires depends_on to be finished first."""
        if task_id not in self.dependencies:
            self.dependencies[task_id] = set()
        if task_id not in self.dependents:
            self.dependents[task_id] = set()
            
        if depends_on not in self.dependencies:
            self.dependencies[depends_on] = set()
        if depends_on not in self.dependents:
            self.dependents[depends_on] = set()
            
        self.dependencies[task_id].add(depends_on)
        self.dependents[depends_on].add(task_id)
        
        # Verify no cycles introduced
        if self.detect_cycles():
            # Rollback
            self.dependencies[task_id].remove(depends_on)
            self.dependents[depends_on].remove(task_id)
            raise CyclicDependencyError(f"Adding dependency {task_id} -> {depends_on} creates a cycle")

    def detect_cycles(self) -> bool:
        """Uses DFS with node coloring (0=unvisited, 1=visiting, 2=visited)."""
        visited = {t: 0 for t in self.dependencies}

        def dfs(node: str) -> bool:
            visited[node] = 1  # Gray (visiting)
            for neighbor in self.dependencies.get(node, set()):
                if visited.get(neighbor) == 1:
                    return True  # Cycle detected
                if visited.get(neighbor) == 0:
                    if dfs(neighbor):
                        return True
            visited[node] = 2  # Black (visited)
            return False

        for task_id in self.dependencies:
            if visited[task_id] == 0:
                if dfs(task_id):
                    return True
        return False

    def topological_sort(self) -> List[str]:
        """Returns topological ordering of tasks from roots (no deps) to leaves."""
        if self.detect_cycles():
            raise CyclicDependencyError("Cannot sort graph with cyclic dependencies")
            
        in_degree = {t: len(self.dependencies.get(t, set())) for t in self.dependencies}
        queue = [t for t, deg in in_degree.items() if deg == 0]
        order = []

        while queue:
            curr = queue.pop(0)
            order.append(curr)
            for downstream in self.dependents.get(curr, set()):
                in_degree[downstream] -= 1
                if in_degree[downstream] == 0:
                    queue.append(downstream)

        if len(order) != len(self.dependencies):
            raise CyclicDependencyError("Graph contains unreachable nodes or cycle")
            
        return order

    def get_ready_tasks(self, completed_task_ids: Set[str], active_or_processed_ids: Set[str]) -> List[str]:
        """
        Returns list of tasks whose dependencies are ALL present in completed_task_ids,
        and which have not yet been dispatched / completed.
        """
        ready = []
        for task_id, deps in self.dependencies.items():
            if task_id in active_or_processed_ids:
                continue
            if deps.issubset(completed_task_ids):
                ready.append(task_id)
        return ready
