"""Tests for DAG construction, cycle detection, and ready-task scheduling."""
import pytest
from app.core.dag import TaskDAG, CyclicDependencyError

def test_dag_topological_sort():
    dag = TaskDAG()
    dag.add_task("TASK-001")
    dag.add_task("TASK-002", deps=["TASK-001"])
    dag.add_task("TASK-003", deps=["TASK-001"])
    dag.add_task("TASK-004", deps=["TASK-002", "TASK-003"])

    order = dag.topological_sort()
    assert order[0] == "TASK-001"
    assert order.index("TASK-002") < order.index("TASK-004")
    assert order.index("TASK-003") < order.index("TASK-004")

def test_dag_cycle_rejection():
    dag = TaskDAG()
    dag.add_task("A")
    dag.add_task("B", deps=["A"])
    dag.add_task("C", deps=["B"])

    with pytest.raises(CyclicDependencyError):
        # Adding C -> A would form a cycle A -> B -> C -> A
        dag.add_dependency("A", "C")

def test_dag_get_ready_tasks():
    dag = TaskDAG()
    dag.add_task("T1")
    dag.add_task("T2", deps=["T1"])
    dag.add_task("T3", deps=["T1"])
    dag.add_task("T4", deps=["T2", "T3"])

    # Initially only T1 is ready
    ready = dag.get_ready_tasks(completed_task_ids=set(), active_or_processed_ids=set())
    assert ready == ["T1"]

    # When T1 completes, T2 and T3 become ready simultaneously
    ready = dag.get_ready_tasks(completed_task_ids={"T1"}, active_or_processed_ids={"T1"})
    assert set(ready) == {"T2", "T3"}

    # T4 becomes ready only when both T2 and T3 complete
    ready = dag.get_ready_tasks(completed_task_ids={"T1", "T2"}, active_or_processed_ids={"T1", "T2"})
    assert ready == ["T3"]

    ready = dag.get_ready_tasks(completed_task_ids={"T1", "T2", "T3"}, active_or_processed_ids={"T1", "T2", "T3"})
    assert ready == ["T4"]
