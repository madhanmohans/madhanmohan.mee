## ♟️ Adding Chess Rating Chart at the end of the Github README

1. Clone this repo
2. Create a virtualenv `virtualenv chess`
3. Install requirements `pip install -r chess-rating/requirements.txt`
4. Create a bash scipt in ```.local/bin/``` and name it chess.sh 
5. Copy this 👇 to chess.sh 

```bash
#!/usr/bin/env sh

# setting readme_PATH to the path of the cloned repo
readme_PATH=<PATH OF THE CLONED REPO> 

# changing directory to readme_PATH
cd $readme_PATH 

# first, pulling from remote repo to avoid conflict 
git pull 

# gives the number of lines of the output of 'git diff origin/main' command
CHANGES_EXIST=$(git diff origin/main | wc -l) 

# exits the script if there are no changes
if [ $CHANGES_EXIST -eq 0 ]; then 

exit 0

fi

# activating the virtual environment
. chess/bin/activate 

# Removing the last 23 lines (the chart)
head -n -23 README.md > tmp.txt && mv tmp.txt README.md 

# Run the python script, and append the output(chart) to README.md
python3 chess-rating/rating_chart.py >> README.md; 

# Pushing to github with commit message being date and time of commit
git add .; git commit -q -m "Updated on `date +'%d-%m-%Y %H:%M:%S'`"; git push origin main -q 
```
6. Run crontab -e in the terminal.
7. Add this line at the end ```@weekly /home/<username>/.local/bin/chess >/dev/null 2>&1```
    - ctrl(command) + x to save,
    - 'Y' to confirm,
    - Enter to exit.
---
### NOTES:
- Inspiration: [sciencepal](https://github.com/sciencepal/sciencepal) 👐
- Create issues to improve the workflow 🤘