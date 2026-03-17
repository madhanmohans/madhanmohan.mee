==28/02/2022 23:13==

Parent: [[👨‍💻Leetcode]]
Tags: #leetcode 

[[Best time to buy and sell stocks]]

```cpp

class Solution {
	public:
		int maxProfit(vector<int>& prices) {
        
        int lsf = INT_MAX; // least so far
        int op = 0; // overall profit
        int pist = 0; // profit if sold today
        
        int len = prices.size();
        
        for(int i = 0; i < len; i ++) {
            
            if(prices[i] < lsf) {
                
                lsf = prices[i];
                
            }
            
            pist = prices[i] - lsf;
            
            if(op < pist) {
                op = pist;
            }
        }
        return op;
    }
};

```


### <u>Explanation:</u>
<div class="videoWrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/1pkOgXD63yU" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>

> - To find the best time to buy and sell stocks, we have to find past least price and future high price.
> - We start with setting the first element as the *least so far* and find *profit if sold today* by subtracting lsf from the price at the ith day.
> - We update the overall profit to pift when it is less than the pift.
> - Iterating this through all the elements, we find the max profit as op and we return it.
---
