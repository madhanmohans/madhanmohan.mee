==28/02/2022 23:14==

Parent: [[👨‍💻Leetcode]]
Tags: #leetcode #dynamicprogramming

## ==Fiboncacci Series:==

```cpp
// Dynamic programming approach (memoization)

class Solution {
public:
    int fib(int n) {
        if(n < 2) return n;
        int series[n+1];
        series[0] = 0;
        series[1] = 1;
        for(int i = 2; i <= n; i++) {
            series[i] = series[i-1] + series[i-2];
        }
    return series[n];
    }
};

// Recursive approach

class Solution {
public:
    int fib(int n) {
        if(n < 2) return n;
        return fib(n-1) + fib(n-2);
    }
};

```

---
## ==References:==

### <u>Explanation:</u>
<div class="videoWrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/dDokMfPpfu4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
Watch from [28:39](https://www.youtube.com/watch?v=Qc2ieXRgR0k&list=PLOtl7M3yp-DV69F32zdK7YJcNXpTunF2b&t=1718s)
---