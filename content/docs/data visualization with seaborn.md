---
Created Time: ""
tags:
Parent:
---
```python
sns.set_style("dark")
# "darkgrid", "whitegrid", "dark", "white", and "ticks"

plt.figure(figsize=(12,6))
# controls the output size
``` 

### scatterplot
- just plot the data points between x and y (columns)  
### regplot
- with one regression line with hue column (categorical eg. yes/no)  
### lmplot
- 2 regression lines with hue column (categorical eg. yes/no)  
### swarmplot
- x = categorical, y = values (to decide on one over the other in x)
### histplot
- histogram (categorical) - args (x, data, hue)
### kdeplot
- smoothened histplot (shade=True)   
### jointplot
- 2d kde plot

---
## ==*References ==

![[Pasted image 20250924124206.png]]

![[Pasted image 20250924123721.png]]