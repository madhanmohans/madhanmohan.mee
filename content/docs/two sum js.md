1. create a hash map
2. iterate through the num array
3. get a complement (target - element)
4. if the complement is in hashmap
5. return the complement's index, and current element's index
6. else set the current element and its index in map

## anagram

s.split("").sort().join("")
t.split("").sort().join("")

compare these ===

merge sorted list

1. create a dummy node and set it to current
2. iterate through the two lists until they are empty
3. if list1.value is less list2 value, set the current.next to list1 and list1 to list1.next
4. else do the same for list2
5. increment the pointer current -> current.next
6. if current.next = list1 || list2 attach the list to teh current.next
```
current.next = list1 !== null ? list1 : list2;
```
7. return dummy.next;