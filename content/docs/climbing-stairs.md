==28/02/2022 23:13==

Parent: [[👨‍💻Leetcode]]
Tags: #leetcode 

```cpp

class Solution {
	public:
		int climbStairs(int n) {

        if(n <= 2) return n;
        return climbStairs(n-1) + climbStairs(n-2);
        
    }
};

```
### <u>Explanation:</u>
<div class="videoWrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/Y0lT9Fck7qI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
---
