---
Created: 2021-11-01T10:42
Type: Seminar
Reviewed: false
---
1. Data Acquisition 
2. Data Preparation
3. Cleaning 
4. Feature Engineering  
	1. ETL - Extract Transform Load -> Data Lakes/Data Warehouse  

- Hive, Google Dataset, Hugging face, Kaggle, UCA
- Data Cleaning Checklist:  
- Upto date data  
- Missing Values  
- Duplicates  
- Numerical outliers  
- Check IDs  
- Define valid output  

## Regression:  
Evaluation metrics: *MSE and R-squared score*  
- Handling Class Imbalance

## Classification:
- Precision 
	- percentage of correctness in predicted true
- Recall
	- percentage of correctness in actual true/ True Positive Rate/ Sensitity
- Specificity
	- percentage of correctness in actual false

> FPR = 1 - Specificity

> F1 Score = 2 * (Precision * Recall) / (Precision + Recall)

- Change the threshold according to the FP or FN in the classification problem  

Examples: Chemo and Corona  

## Receiver Operating Characteristics (ROC) and Area under Curve (AUC)

## Validation data -> to improve, Test Data, Train Data

## ML - Train data, Test data

- Overfit -> trained more on training data
- Underfit -> model is incapable

## Operations/Maintenance: TensorFlow extended for MLOps

Model Optimisation - Gradient Descent - Error Function vs Weights (Tunable variables)  

Model Evaluation - MSE (Mean Square Error)
Model Prediction - Linear Regression  

> Error function for Classification model is Log Loss Error  
Error function for Regression model is Mean Square Error