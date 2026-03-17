==28/02/2022 23:13==

Parent: [[👨‍💻Leetcode]]
Tags: #leetcode 

[[Find all numbers disappeared in an array]]

```cpp

class Solution {
	public:
		vector<int> findDisappearedNumbers(vector<int>& nums) {
        
        vector<int> result;
        int len = nums.size();
        
        for(int i = 0; i < len; i ++) {
            
            int m = abs(nums[i]) - 1;
            
            nums[m] = nums[m] > 0? -nums[m]: nums[m];
            
            
        }
        
        for(int i = 0; i < len; i++) {
            
            if(nums[i] > 0) result.push_back(i+1); 
            
        }
        
        return result;
        
    }



};

```


### <u>Explanation:</u>
<div class="videoWrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/8i-f24YFWC4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>


