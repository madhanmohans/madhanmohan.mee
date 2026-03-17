==28/02/2022 23:14==

Parent: [[👨‍💻Leetcode]]
Tags: #leetcode 

## ==Tribonacci Series:==

```cpp

class Solution {
	public:
	int tribonacci(int n) {
        int trib[n+1];
        if(n < 2) return n;
        if(n == 2) return 1;
        trib[0] = 0;
        trib[1] = 1;
        trib[2] = 1;
        for(int i = 3; i <= n; i++) {
            trib[i] = trib[i-1] + trib[i-2] + trib[i-3];
        }
        return trib[n];
    }
};

```

---
## ==References:==

### <u>Explanation:</u>
<div class="videoWrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/NCukkar171E" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
---
