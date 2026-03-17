==28/02/2022 23:13==

Parent: [[👨‍💻Leetcode]]
Tags: #leetcode 

[[Maximum Subarray]]

```cpp

class Solution {
public:
    int maxSubArray(vector<int>& nums) {

       // if (nums.size() == 0) { return 0; }
        
        int maxsum = nums[0]; // in the beginning, maximum sum is the first element
        int sum = nums[0]; // in the beginning, local sum is the first element
        int len = nums.size(); // assigning the length of the vector to var 'len'

        // iterating from second element to last element in the vector
        for(int i = 1; i < len; i++) { 
            if(sum < 0) { sum = nums[i]; } // if the local sum is a negative number, then we assign sum to the element at index i
            else { sum += nums[i]; } // if the local sum is greater than 0, then we assign sum to the summation of itself with the element at index i
            maxsum = max(maxsum, sum); // we set maxsum to the maximum of maxsum and sum in each iteration
        }
        return maxsum; // we return the maximum sum of the sub array
    }
};

```


```cpp

#include <iostream>

using namespace std;


// Maximum sub array elements

int main() {
    
    int arr[100], n, first, last, c;
    cin >> n;
    
    for(int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    int sum = arr[0];
    int maxSum = arr[0];
    
    for(int i = 1; i < n; i++) {
        if(sum < 0) {
            sum = arr[i];
        }
        else {
            sum+=arr[i];
            last = i;
            c++;
        } 
        maxSum = maxSum > sum? maxSum : sum;
    }
    
    // cout << maxSum;
    
    for(int i = last - c; i <= last; i++) {
        cout << arr[i] << ' ';
    }
}



```
### <u>Explanation:</u>
---
- 