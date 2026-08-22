import json
import os

def build_problems(raw_data):
    problems = []
    for row in raw_data:
        cat_id, order, p_id, title, diff, vis, desc, code, ex_in, ex_out, test_in, test_out = row
        problems.append({
            "id": p_id,
            "slug": p_id.replace("_", "-"),
            "title": title,
            "difficulty": diff,
            "category_id": cat_id,
            "description": desc,
            "constraints": ["Data fits in memory", "Standard constraints apply"],
            "examples": [
                {
                    "input": ex_in,
                    "output": str(ex_out),
                    "explanation": "Example case."
                }
            ],
            "test_cases": [
                {
                    "input": test_in,
                    "expectedOutput": test_out
                }
            ],
            "starter_code_python": code,
            "visualization_type": vis,
            "display_order": order
        })
    return problems

RAW_PROBLEMS = [
    # ARRAYS & HASHING
    ["arrays-hashing", 1, "arrays_two_sum", "Two Sum", "easy", "array-hashmap", "Given an array of integers nums and a target, return indices of the two numbers that add up to target.", "def two_sum(nums, target):\n    pass", "nums = [2,7,11,15], target = 9", "[0, 1]", {"nums": [2,7,11,15], "target": 9}, [0, 1]],
    ["arrays-hashing", 2, "arrays_contains_duplicate", "Contains Duplicate", "easy", "array-hashmap", "Given an integer array nums, return true if any value appears at least twice in the array.", "def contains_duplicate(nums):\n    pass", "nums = [1,2,3,1]", "True", {"nums": [1,2,3,1]}, True],
    ["arrays-hashing", 3, "arrays_valid_anagram", "Valid Anagram", "easy", "hashmap", "Given two strings s and t, return true if t is an anagram of s, and false otherwise.", "def is_anagram(s, t):\n    pass", "s = 'anagram', t = 'nagaram'", "True", {"s": "anagram", "t": "nagaram"}, True],
    ["arrays-hashing", 4, "arrays_group_anagrams", "Group Anagrams", "medium", "array-hashmap", "Given an array of strings strs, group the anagrams together. You can return the answer in any order.", "def group_anagrams(strs):\n    pass", "strs = ['eat','tea','tan','ate','nat','bat']", "[['bat'],['nat','tan'],['ate','eat','tea']]", {"strs": ["eat","tea","tan","ate","nat","bat"]}, [["bat"],["nat","tan"],["ate","eat","tea"]]],
    ["arrays-hashing", 5, "arrays_top_k_frequent", "Top K Frequent Elements", "medium", "frequency-map", "Given an integer array nums and an integer k, return the k most frequent elements.", "def top_k_frequent(nums, k):\n    pass", "nums = [1,1,1,2,2,3], k = 2", "[1, 2]", {"nums": [1,1,1,2,2,3], "k": 2}, [1, 2]],

    # TWO POINTERS
    ["two-pointers", 1, "tp_valid_palindrome", "Valid Palindrome", "easy", "two-pointers", "A phrase is a palindrome if it reads the same forward and backward.", "def is_palindrome(s):\n    pass", "s = 'A man, a plan, a canal: Panama'", "True", {"s": "A man, a plan, a canal: Panama"}, True],
    ["two-pointers", 2, "tp_two_sum_ii", "Two Sum II", "medium", "two-pointers", "Given a 1-indexed array of integers sorted in non-decreasing order, find two numbers that add up to a target.", "def two_sum_ii(numbers, target):\n    pass", "numbers = [2,7,11,15], target = 9", "[1, 2]", {"numbers": [2,7,11,15], "target": 9}, [1, 2]],
    ["two-pointers", 3, "tp_remove_duplicates", "Remove Duplicates", "easy", "two-pointers", "Remove duplicates from a sorted array in-place such that each element appears only once.", "def remove_duplicates(nums):\n    pass", "nums = [1,1,2]", "2, nums=[1,2]", {"nums": [1,1,2]}, 2],
    ["two-pointers", 4, "tp_container_most_water", "Container With Most Water", "medium", "two-pointers", "Given an array of heights, find two lines that together with the x-axis form a container that holds the most water.", "def max_area(height):\n    pass", "height = [1,8,6,2,5,4,8,3,7]", "49", {"height": [1,8,6,2,5,4,8,3,7]}, 49],
    ["two-pointers", 5, "tp_three_sum", "Three Sum", "medium", "two-pointers", "Given an array nums, return all triplets [nums[i], nums[j], nums[k]] such that they add up to 0.", "def three_sum(nums):\n    pass", "nums = [-1,0,1,2,-1,-4]", "[[-1,-1,2],[-1,0,1]]", {"nums": [-1,0,1,2,-1,-4]}, [[-1,-1,2],[-1,0,1]]],

    # SLIDING WINDOW
    ["sliding-window", 1, "sw_max_avg_subarray", "Max Average Subarray", "easy", "window", "Find a contiguous subarray of length k that has the maximum average value.", "def find_max_average(nums, k):\n    pass", "nums = [1,12,-5,-6,50,3], k = 4", "12.75", {"nums": [1,12,-5,-6,50,3], "k": 4}, 12.75],
    ["sliding-window", 2, "sw_longest_substring", "Longest Substring No Repeat", "medium", "window", "Find the length of the longest substring without repeating characters.", "def length_of_longest_substring(s):\n    pass", "s = 'abcabcbb'", "3", {"s": "abcabcbb"}, 3],
    ["sliding-window", 3, "sw_min_size_subarray", "Minimum Size Subarray Sum", "medium", "window", "Return the minimal length of a subarray whose sum is greater than or equal to target.", "def min_sub_array_len(target, nums):\n    pass", "target = 7, nums = [2,3,1,2,4,3]", "2", {"target": 7, "nums": [2,3,1,2,4,3]}, 2],
    ["sliding-window", 4, "sw_permutation_string", "Permutation in String", "medium", "window", "Return true if s2 contains a permutation of s1.", "def check_inclusion(s1, s2):\n    pass", "s1 = 'ab', s2 = 'eidbaooo'", "True", {"s1": "ab", "s2": "eidbaooo"}, True],
    ["sliding-window", 5, "sw_min_window", "Minimum Window Substring", "hard", "window", "Given strings s and t, return the minimum window substring of s such that every character in t is included.", "def min_window(s, t):\n    pass", "s = 'ADOBECODEBANC', t = 'ABC'", "'BANC'", {"s": "ADOBECODEBANC", "t": "ABC"}, "BANC"],

    # STACK
    ["stack", 1, "stk_valid_parentheses", "Valid Parentheses", "easy", "stack", "Given a string containing brackets, determine if the input string is valid.", "def is_valid(s):\n    pass", "s = '()[]{}'", "True", {"s": "()[]{}"}, True],
    ["stack", 2, "stk_min_stack", "Min Stack", "medium", "stack", "Design a stack that supports push, pop, top, and retrieving the minimum element.", "class MinStack:\n    def __init__(self):\n        pass", "Push 1, Push 2", "None", {"ops": ["push"]}, None],
    ["stack", 3, "stk_eval_rpn", "Evaluate Reverse Polish Notation", "medium", "stack", "Evaluate the value of an arithmetic expression in RPN.", "def eval_rpn(tokens):\n    pass", "tokens = ['2','1','+','3','*']", "9", {"tokens": ["2","1","+","3","*"]}, 9],
    ["stack", 4, "stk_daily_temp", "Daily Temperatures", "medium", "stack", "Return an array answering how many days you have to wait after the ith day to get a warmer temperature.", "def daily_temperatures(temperatures):\n    pass", "temp = [73,74,75,71,69,72,76,73]", "[1,1,4,2,1,1,0,0]", {"temperatures": [73,74,75,71,69,72,76,73]}, [1,1,4,2,1,1,0,0]],
    ["stack", 5, "stk_largest_rect", "Largest Rectangle in Histogram", "hard", "stack", "Given an array of integers representing the histogram's bar height, return the area of the largest rectangle.", "def largest_rectangle_area(heights):\n    pass", "heights = [2,1,5,6,2,3]", "10", {"heights": [2,1,5,6,2,3]}, 10],

    # BINARY SEARCH
    ["binary-search", 1, "bs_binary_search", "Binary Search", "easy", "array", "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.", "def search(nums, target):\n    pass", "nums = [-1,0,3,5,9,12], target = 9", "4", {"nums": [-1,0,3,5,9,12], "target": 9}, 4],
    ["binary-search", 2, "bs_search_insert", "Search Insert Position", "easy", "array", "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be.", "def search_insert(nums, target):\n    pass", "nums = [1,3,5,6], target = 5", "2", {"nums": [1,3,5,6], "target": 5}, 2],
    ["binary-search", 3, "bs_first_bad", "First Bad Version", "easy", "array", "You have n versions [1, 2, ..., n] and you want to find out the first bad one.", "def first_bad_version(n):\n    pass", "n = 5, bad = 4", "4", {"n": 5}, 4],
    ["binary-search", 4, "bs_search_rotated", "Search in Rotated Sorted Array", "medium", "array", "Search for a target value in a rotated sorted array.", "def search(nums, target):\n    pass", "nums = [4,5,6,7,0,1,2], target = 0", "4", {"nums": [4,5,6,7,0,1,2], "target": 0}, 4],
    ["binary-search", 5, "bs_find_min", "Find Minimum in Rotated Sorted Array", "medium", "array", "Find the minimum element in a rotated sorted array.", "def find_min(nums):\n    pass", "nums = [3,4,5,1,2]", "1", {"nums": [3,4,5,1,2]}, 1],

    # LINKED LIST
    ["linked-list", 1, "ll_reverse", "Reverse Linked List", "easy", "linked-list", "Reverse a singly linked list.", "def reverse_list(head):\n    pass", "head = [1,2,3,4,5]", "[5,4,3,2,1]", {"head": [1,2,3,4,5]}, [5,4,3,2,1]],
    ["linked-list", 2, "ll_merge", "Merge Two Sorted Lists", "easy", "linked-list", "Merge two sorted linked lists and return it as a sorted list.", "def merge_two_lists(list1, list2):\n    pass", "list1 = [1,2,4], list2 = [1,3,4]", "[1,1,2,3,4,4]", {"list1": [1,2,4], "list2": [1,3,4]}, [1,1,2,3,4,4]],
    ["linked-list", 3, "ll_cycle", "Linked List Cycle", "easy", "linked-list", "Given head, the head of a linked list, determine if the linked list has a cycle in it.", "def has_cycle(head):\n    pass", "head = [3,2,0,-4], pos = 1", "True", {"head": [3,2,0,-4]}, True],
    ["linked-list", 4, "ll_remove_nth", "Remove Nth Node From End", "medium", "linked-list", "Given the head of a linked list, remove the nth node from the end of the list and return its head.", "def remove_nth_from_end(head, n):\n    pass", "head = [1,2,3,4,5], n = 2", "[1,2,3,5]", {"head": [1,2,3,4,5], "n": 2}, [1,2,3,5]],
    ["linked-list", 5, "ll_reorder", "Reorder Linked List", "medium", "linked-list", "You are given the head of a singly linked-list. Reorder the list in-place.", "def reorder_list(head):\n    pass", "head = [1,2,3,4]", "[1,4,2,3]", {"head": [1,2,3,4]}, [1,4,2,3]],

    # TREES
    ["trees", 1, "tree_max_depth", "Maximum Depth of Binary Tree", "easy", "binary-tree", "Given the root of a binary tree, return its maximum depth.", "def max_depth(root):\n    pass", "root = [3,9,20,None,None,15,7]", "3", {"root": [3,9,20,None,None,15,7]}, 3],
    ["trees", 2, "tree_same", "Same Tree", "easy", "binary-tree", "Given the roots of two binary trees p and q, write a function to check if they are the same or not.", "def is_same_tree(p, q):\n    pass", "p = [1,2,3], q = [1,2,3]", "True", {"p": [1,2,3], "q": [1,2,3]}, True],
    ["trees", 3, "tree_invert", "Invert Binary Tree", "easy", "binary-tree", "Given the root of a binary tree, invert the tree, and return its root.", "def invert_tree(root):\n    pass", "root = [4,2,7,1,3,6,9]", "[4,7,2,9,6,3,1]", {"root": [4,2,7,1,3,6,9]}, [4,7,2,9,6,3,1]],
    ["trees", 4, "tree_level_order", "Level Order Traversal", "medium", "binary-tree", "Given the root of a binary tree, return the level order traversal of its nodes' values.", "def level_order(root):\n    pass", "root = [3,9,20,None,None,15,7]", "[[3],[9,20],[15,7]]", {"root": [3,9,20,None,None,15,7]}, [[3],[9,20],[15,7]]],
    ["trees", 5, "tree_valid_bst", "Validate Binary Search Tree", "medium", "binary-tree", "Given the root of a binary tree, determine if it is a valid binary search tree (BST).", "def is_valid_bst(root):\n    pass", "root = [2,1,3]", "True", {"root": [2,1,3]}, True],

    # TRIES
    ["trie", 1, "trie_implement", "Implement Trie", "medium", "trie", "A trie (prefix tree) is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.", "class Trie:\n    def __init__(self):\n        pass", "insert('apple'), search('apple')", "True", {"ops": []}, True],
    ["trie", 2, "trie_search_word", "Search Word", "medium", "trie", "Implement a search function for a Trie.", "def search(word):\n    pass", "word = 'hello'", "True", {"word": "hello"}, True],
    ["trie", 3, "trie_starts_with", "Starts With Prefix", "medium", "trie", "Returns true if there is a previously inserted string word that has the prefix prefix.", "def starts_with(prefix):\n    pass", "prefix = 'app'", "True", {"prefix": "app"}, True],
    ["trie", 4, "trie_word_dict", "Word Dictionary Wildcard", "medium", "trie", "Design a data structure that supports adding new words and finding if a string matches any previously added string, where '.' can match any letter.", "class WordDictionary:\n    pass", "addWord('bad'), search('b..')", "True", {"ops": []}, True],
    ["trie", 5, "trie_word_search_ii", "Word Search II", "hard", "trie", "Given an m x n board of characters and a list of strings words, return all words on the board.", "def find_words(board, words):\n    pass", "board=[...], words=['oath']", "['oath']", {"board": [["o","a"],["t","h"]], "words": ["oath"]}, ["oath"]],

    # BACKTRACKING
    ["backtracking", 1, "bt_subsets", "Subsets", "medium", "decision-tree", "Given an integer array nums of unique elements, return all possible subsets.", "def subsets(nums):\n    pass", "nums = [1,2,3]", "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]", {"nums": [1,2,3]}, [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]],
    ["backtracking", 2, "bt_permutations", "Permutations", "medium", "decision-tree", "Given an array nums of distinct integers, return all the possible permutations.", "def permute(nums):\n    pass", "nums = [1,2,3]", "[[1,2,3],[1,3,2],...]", {"nums": [1,2,3]}, [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]],
    ["backtracking", 3, "bt_combo_sum", "Combination Sum", "medium", "decision-tree", "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations.", "def combination_sum(candidates, target):\n    pass", "cands=[2,3,6,7], target=7", "[[2,2,3],[7]]", {"candidates": [2,3,6,7], "target": 7}, [[2,2,3],[7]]],
    ["backtracking", 4, "bt_generate_paren", "Generate Parentheses", "medium", "decision-tree", "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.", "def generate_parenthesis(n):\n    pass", "n = 3", "['((()))','(()())',...]", {"n": 3}, ["((()))","(()())","(())()","()(())","()()()"]],
    ["backtracking", 5, "bt_n_queens", "N-Queens", "hard", "decision-tree", "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.", "def solve_n_queens(n):\n    pass", "n = 4", "[[...]]", {"n": 4}, []],

    # GRAPHS
    ["graphs", 1, "graph_dfs", "Graph DFS Traversal", "easy", "graph", "Perform a depth-first search on a graph.", "def dfs(graph, start):\n    pass", "graph={...}, start=0", "[0,1,2]", {"graph": {}, "start": 0}, []],
    ["graphs", 2, "graph_bfs", "Graph BFS Traversal", "easy", "graph", "Perform a breadth-first search on a graph.", "def bfs(graph, start):\n    pass", "graph={...}, start=0", "[0,1,2]", {"graph": {}, "start": 0}, []],
    ["graphs", 3, "graph_num_islands", "Number of Islands", "medium", "graph", "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.", "def num_islands(grid):\n    pass", "grid=[['1','1','0']...]", "1", {"grid": [["1","1","0"]]}, 1],
    ["graphs", 4, "graph_clone", "Clone Graph", "medium", "graph", "Return a deep copy (clone) of a graph.", "def clone_graph(node):\n    pass", "adjList=[[2,4],[1,3]...]", "[[2,4],[1,3]...]", {"node": None}, None],
    ["graphs", 5, "graph_course_schedule", "Course Schedule", "medium", "graph", "There are a total of numCourses courses you have to take. Return true if you can finish all courses.", "def can_finish(numCourses, prerequisites):\n    pass", "numCourses=2, pre=[[1,0]]", "True", {"numCourses": 2, "prerequisites": [[1,0]]}, True],

    # ADVANCED GRAPHS
    ["advanced-graphs", 1, "ag_network_delay", "Network Delay Time", "medium", "weighted-graph", "You are given a network of n nodes. Return the minimum time it takes for all nodes to receive a signal.", "def network_delay_time(times, n, k):\n    pass", "times=[[2,1,1]...], n=4, k=2", "2", {"times": [[2,1,1],[2,3,1],[3,4,1]], "n": 4, "k": 2}, 2],
    ["advanced-graphs", 2, "ag_dijkstra", "Dijkstra Shortest Path", "medium", "weighted-graph", "Implement Dijkstra's algorithm to find the shortest path from a source node to all other nodes in a weighted graph.", "def dijkstra(graph, start):\n    pass", "graph={...}", "{'A':0, 'B':2}", {"graph": {}, "start": "A"}, {}],
    ["advanced-graphs", 3, "ag_mst", "Minimum Spanning Tree", "medium", "weighted-graph", "Find the minimum spanning tree of a weighted undirected graph.", "def mst(n, edges):\n    pass", "n=3, edges=[[0,1,5]...]", "10", {"n": 3, "edges": []}, 10],
    ["advanced-graphs", 4, "ag_union_find", "Union Find Components", "medium", "graph", "Given n nodes and a list of edges, find the number of connected components.", "def count_components(n, edges):\n    pass", "n=5, edges=[[0,1],[1,2]...]", "2", {"n": 5, "edges": [[0,1],[1,2],[3,4]]}, 2],
    ["advanced-graphs", 5, "ag_cheapest_flight", "Cheapest Path With Stops", "hard", "weighted-graph", "Find the cheapest price from src to dst with up to k stops.", "def find_cheapest_price(n, flights, src, dst, k):\n    pass", "n=3, flights=[...], src=0, dst=2, k=1", "200", {"n": 3, "flights": [], "src": 0, "dst": 2, "k": 1}, 200],

    # HEAP
    ["heap", 1, "heap_kth_largest", "Kth Largest Element", "medium", "binary-tree", "Find the kth largest element in an unsorted array.", "def find_kth_largest(nums, k):\n    pass", "nums=[3,2,1,5,6,4], k=2", "5", {"nums": [3,2,1,5,6,4], "k": 2}, 5],
    ["heap", 2, "heap_last_stone", "Last Stone Weight", "easy", "binary-tree", "You are given an array of integers stones where stones[i] is the weight of the ith stone. Play the game and return the last stone weight.", "def last_stone_weight(stones):\n    pass", "stones=[2,7,4,1,8,1]", "1", {"stones": [2,7,4,1,8,1]}, 1],
    ["heap", 3, "heap_k_closest", "K Closest Points", "medium", "binary-tree", "Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin.", "def k_closest(points, k):\n    pass", "points=[[1,3],[-2,2]], k=1", "[[-2,2]]", {"points": [[1,3],[-2,2]], "k": 1}, [[-2,2]]],
    ["heap", 4, "heap_task_scheduler", "Task Scheduler", "medium", "binary-tree", "Given a characters array tasks, return the least number of units of times that the CPU will take to finish all the given tasks.", "def least_interval(tasks, n):\n    pass", "tasks=['A','A','A','B','B','B'], n=2", "8", {"tasks": ["A","A","A","B","B","B"], "n": 2}, 8],
    ["heap", 5, "heap_merge_k", "Merge K Sorted Lists", "hard", "binary-tree", "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.", "def merge_k_lists(lists):\n    pass", "lists=[[1,4,5],[1,3,4],[2,6]]", "[1,1,2,3,4,4,5,6]", {"lists": [[1,4,5],[1,3,4],[2,6]]}, [1,1,2,3,4,4,5,6]],

    # INTERVALS
    ["intervals", 1, "int_merge", "Merge Intervals", "medium", "intervals", "Given an array of intervals, merge all overlapping intervals.", "def merge(intervals):\n    pass", "intervals=[[1,3],[2,6],[8,10],[15,18]]", "[[1,6],[8,10],[15,18]]", {"intervals": [[1,3],[2,6],[8,10],[15,18]]}, [[1,6],[8,10],[15,18]]],
    ["intervals", 2, "int_insert", "Insert Interval", "medium", "intervals", "Insert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals.", "def insert(intervals, newInterval):\n    pass", "intervals=[[1,3],[6,9]], newInterval=[2,5]", "[[1,5],[6,9]]", {"intervals": [[1,3],[6,9]], "newInterval": [2,5]}, [[1,5],[6,9]]],
    ["intervals", 3, "int_non_overlap", "Non-Overlapping Intervals", "medium", "intervals", "Given an array of intervals, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.", "def erase_overlap_intervals(intervals):\n    pass", "intervals=[[1,2],[2,3],[3,4],[1,3]]", "1", {"intervals": [[1,2],[2,3],[3,4],[1,3]]}, 1],
    ["intervals", 4, "int_meeting", "Meeting Rooms", "medium", "intervals", "Given an array of meeting time intervals, determine if a person could attend all meetings.", "def can_attend_meetings(intervals):\n    pass", "intervals=[[0,30],[5,10],[15,20]]", "False", {"intervals": [[0,30],[5,10],[15,20]]}, False],
    ["intervals", 5, "int_min_meeting", "Minimum Meeting Rooms", "medium", "intervals", "Given an array of meeting time intervals, return the minimum number of conference rooms required.", "def min_meeting_rooms(intervals):\n    pass", "intervals=[[0,30],[5,10],[15,20]]", "2", {"intervals": [[0,30],[5,10],[15,20]]}, 2],

    # GREEDY
    ["greedy", 1, "greedy_max_sub", "Maximum Subarray", "medium", "array", "Given an integer array nums, find the subarray with the largest sum, and return its sum.", "def max_sub_array(nums):\n    pass", "nums=[-2,1,-3,4,-1,2,1,-5,4]", "6", {"nums": [-2,1,-3,4,-1,2,1,-5,4]}, 6],
    ["greedy", 2, "greedy_jump", "Jump Game", "medium", "array", "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.", "def can_jump(nums):\n    pass", "nums=[2,3,1,1,4]", "True", {"nums": [2,3,1,1,4]}, True],
    ["greedy", 3, "greedy_gas", "Gas Station", "medium", "array", "Given two integer arrays gas and cost, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1.", "def can_complete_circuit(gas, cost):\n    pass", "gas=[1,2,3,4,5], cost=[3,4,5,1,2]", "3", {"gas": [1,2,3,4,5], "cost": [3,4,5,1,2]}, 3],
    ["greedy", 4, "greedy_partition", "Partition Labels", "medium", "array", "You are given a string s. We want to partition the string into as many parts as possible so that each letter appears in at most one part.", "def partition_labels(s):\n    pass", "s='ababcbacadefegdehijhklij'", "[9,7,8]", {"s": "ababcbacadefegdehijhklij"}, [9,7,8]],
    ["greedy", 5, "greedy_candy", "Candy Distribution", "hard", "array", "There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings. Return the minimum number of candies you need to have to distribute the candies to the children.", "def candy(ratings):\n    pass", "ratings=[1,0,2]", "5", {"ratings": [1,0,2]}, 5],

    # DP
    ["dp", 1, "dp_climbing", "Climbing Stairs", "easy", "dp-array", "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?", "def climb_stairs(n):\n    pass", "n=2", "2", {"n": 2}, 2],
    ["dp", 2, "dp_house_robber", "House Robber", "medium", "dp-array", "You are a professional robber planning to rob houses along a street. Determine the maximum amount of money you can rob tonight without alerting the police.", "def rob(nums):\n    pass", "nums=[1,2,3,1]", "4", {"nums": [1,2,3,1]}, 4],
    ["dp", 3, "dp_coin_change", "Coin Change", "medium", "dp-array", "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.", "def coin_change(coins, amount):\n    pass", "coins=[1,2,5], amount=11", "3", {"coins": [1,2,5], "amount": 11}, 3],
    ["dp", 4, "dp_lis", "Longest Increasing Subsequence", "medium", "dp-array", "Given an integer array nums, return the length of the longest strictly increasing subsequence.", "def length_of_lis(nums):\n    pass", "nums=[10,9,2,5,3,7,101,18]", "4", {"nums": [10,9,2,5,3,7,101,18]}, 4],
    ["dp", 5, "dp_lcs", "Longest Common Subsequence", "medium", "dp-table", "Given two strings text1 and text2, return the length of their longest common subsequence.", "def longest_common_subsequence(text1, text2):\n    pass", "text1='abcde', text2='ace'", "3", {"text1": "abcde", "text2": "ace"}, 3],

    # BIT MANIPULATION
    ["bit-manipulation", 1, "bit_single", "Single Number", "easy", "array", "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.", "def single_number(nums):\n    pass", "nums=[2,2,1]", "1", {"nums": [2,2,1]}, 1],
    ["bit-manipulation", 2, "bit_one_bits", "Number of 1 Bits", "easy", "array", "Write a function that takes the binary representation of an unsigned integer and returns the number of '1' bits it has.", "def hamming_weight(n):\n    pass", "n=11", "3", {"n": 11}, 3],
    ["bit-manipulation", 3, "bit_counting", "Counting Bits", "easy", "array", "Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.", "def count_bits(n):\n    pass", "n=2", "[0,1,1]", {"n": 2}, [0,1,1]],
    ["bit-manipulation", 4, "bit_reverse", "Reverse Bits", "easy", "array", "Reverse bits of a given 32 bits unsigned integer.", "def reverse_bits(n):\n    pass", "n=43261596", "964176192", {"n": 43261596}, 964176192],
    ["bit-manipulation", 5, "bit_sum", "Sum Without Plus Operator", "medium", "array", "Given two integers a and b, return the sum of the two integers without using the operators + and -.", "def get_sum(a, b):\n    pass", "a=1, b=2", "3", {"a": 1, "b": 2}, 3]
]

if __name__ == "__main__":
    out = build_problems(RAW_PROBLEMS)
    with open('/home/billa/Sriram_repos/DSA_Debugger/backend/app/db/problems.json', 'w') as f:
        json.dump(out, f, indent=4)
    print("Created problems.json")
