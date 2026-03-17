==28/02/2022 23:13==

Parent: [[👨‍💻Leetcode]]
Tags: #leetcode 

## ==Contains Duplicate:==

```cpp

class Solution {
	public:
		 bool containsDuplicate(vector<int>& nums) {
        
        sort(nums.begin(), nums.end());
        for(int i = 0; i < nums.size()-1; i ++) if(nums[i] == nums[i+1]) return true;
        return false;
        }
};

```

---
## ==References:==


### <u>Explanation:</u>
<div class="videoWrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/3OamzN90kPg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
---
