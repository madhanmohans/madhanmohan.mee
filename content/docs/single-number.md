==28/02/2022 23:13==

Parent: [[👨‍💻Leetcode]]
Tags: #leetcode 

[[Single Number]]

```cpp

class Solution {
	public:
		int singleNumber(vector<int>& nums) {
        int result = 0;
       int len = nums.size();
       // vector<int>::iterator new_end;
        
        for(int i = 0; i < len; i ++) {
            result ^= nums[i];
        }
        
    return result;
    }
};

```


### <u>Explanation:</u>
<div class="videoWrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/qMPX1AOa83k" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>