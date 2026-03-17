Affiliations:

Dr. ALAMELU M
Head of the Department
Information Technology
Kumaraguru College of Technology
Athipalayam Rd, Chinnavedampatti, Coimbatore, Tamil Nadu 641049
alamelu.m.it@kct.ac.in

Madhan Mohan S
Department of Information Technology
Kumaraguru College of Technology
Athipalayam Rd, Chinnavedampatti, Coimbatore, Tamil Nadu 641049
madhan.19it@kct.ac.in


Karishma E
Department of Information Technology
Kumaraguru College of Technology
Athipalayam Rd, Chinnavedampatti, Coimbatore, Tamil Nadu 641049
karishma.19it@kct.ac.in

Shankar M
Department of Information Technology
Kumaraguru College of Technology
Athipalayam Rd, Chinnavedampatti, Coimbatore, Tamil Nadu 641049
shankar.19it@kct.ac.in


Dataset:
The XSS payloads dataset used in the experiment contains malicious and benign payloads. It contains XSS payload along with the output class labelled as malicious and benign scripts. The dataset for the experiment consists of around 43,000 instances of malicious and benign code. Malicious payload is around 15000 instances, and benign payload is around 28000 instances.

Materials and Methods:
The XSS payloads and their respective labels were gathered from a data source, and feature engineering activities were carried out to extract additional features based on the semantical and syntactical significance of cross-site scripting attacks. Based on the generated dataset, six machine learning algorithms (as shown in *figure 1*) are deployed for cross validation. Comparitive study is done based on the scoring.

Experimental results:

_Table 1_ demonstrates an investigation on the performance of classifiers based on accuracy, precision, recall and f1 score since if the output of the algorithm is only examined using a particular measure, then the evaluation will only be partially complete. 

The model built using Logistic Regression produced the best outcome, as determined by the measures used. The dependent variable in logistic regression is a binary variable with data labeled as 1 (malicious) or 0 (benign). In other words, P(Y=1) is predicted by the logistic regression model as a function of X by choosing a cutoff value and classifying inputs with probability greater than the cutoff as malicious, below the cutoff as benign. The effectiveness of this methodology for identifying malicious code is 96.85%. 

k-Nearest Neighbor performed like Logistic Regression with the accuracy of 96.59% in detecting malicious code. The class (malicious/benign) that an instance is assigned to based on the majority vote of its k nearest neighbours is determined by it's neighbours (k is a typically small positive integer).  The existence of noisy or irrelevant features, or if the feature scales are inconsistent with their relevance, can significantly reduce the accuracy of the k-NN method.
