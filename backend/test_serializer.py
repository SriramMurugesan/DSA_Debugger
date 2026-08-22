from app.execution.normalizer import serialize_state
from typing import Any, Dict

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def add(self, data):
        new_node = Node(data)
        if self.head is None:
            self.head = new_node
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = new_node

ll = LinkedList()
ll.add(10)
ll.add(20)

import json
vars_dict, mem_dict = serialize_state(locals())
print(json.dumps({"variables": vars_dict, "memory": mem_dict}, indent=2))
