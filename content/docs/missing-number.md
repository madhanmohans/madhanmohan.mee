==28/02/2022 23:13==

Parent: [[👨‍💻Leetcode]]
Tags: #leetcode 

[[Missing Number]]

```cpp

class Solution {
	public:
		int missingNumber(vector<int>& nums) {
        
        int len = nums.size();
        
        for(int i = 0; i < len; i ++) {
            
            int m;
            
            m = (nums[i] == 0)? nums[i]: abs(nums[i] - 1); 
            nums[m] = nums[m] > 0? -nums[m]: nums[m];
            
        }
        
        for(int i = 0; i < len; i++) {
            
            if(nums[i] > 0){
                return i + 1;
            }
        }
            
        for(int i =0; i < len; i++) {
            if(nums[i] == 0) return i + 1;
        
            }
      
        
        return 0;  
    }
};

```


### <u>Explanation:</u>
<div class="videoWrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/WnPLSRLSANE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
---
