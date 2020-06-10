---
title: 'Pandas Hacks: read_clipboard()'
date: '2019-09-30'
description: 'Well, it’s not a hack, but it saves you a lot of time'
---
We’ve all been there: we’re reading an interesting piece of data on Kaggle, StackOverflow, or some obscure website on the second page of Google (yikes!), and it had enough shimmer to pique our curiosity to lure us to playing with it, because we (cool data science people) are just suckers for them sweet data insights. We ready our Jupyter notebooks, import our favorite EDA libraries, and prepare ourselves to explore our brand new data set.

But wait — we hesitate. We realize that we have to go through all the trouble of downloading the data, saving it into the right folder, and importing the data set with the right folder path (oh the woes of a data scientist)! Simply put, no one has that kind of time. Well, we do, but if we were being honest with ourselves, small hurdles like these are usually what make us decide whether we go through with something or not. Luckily, there’s pandas.read_clipboard() to help us.

### For Example

The pandas.read_clipboard() method is as simple as it sounds: it reads copy-pasted tabular data and parses it into a Data Frame. For instance, try running the method after copying the following Data Frame:

`gist:adrianmarkperea/b91dfcdad2b350850cf5dc08f6e56186#random_dataframe.py`

Voila! It was that easy. No more needless saving of random csv files in your computer. Now you can just copy your data and begin mining in a matter of seconds! What a wonderful time to be a data scientist.

### A Few More Things

Under the hood, the pandas.read_clipboard() method passes the data you have copied into the pandas.read_csv() method, which makes this method that much more powerful. This means that you don’t have to limit yourself to already-clean data. Whatever you can read through read_csv, you can read through read_clipboard. Take, for example, the following csv file from [Kaggle’s Titanic data set](https://www.kaggle.com/hesh97/titanicdataset-traincsv) with the headers removed:

```
1,0,3,"Braund, Mr. Owen Harris",male,22,1,0,A/5 21171,7.25,,S
2,1,1,"Cumings, Mrs. John Bradley (Florence Briggs Thayer)",female,38,1,0,PC 17599,71.2833,C85,C
3,1,3,"Heikkinen, Miss. Laina",female,26,0,0,STON/O2. 3101282,7.925,,S
4,1,1,"Futrelle, Mrs. Jacques Heath (Lily May Peel)",female,35,1,0,113803,53.1,C123,S
5,0,3,"Allen, Mr. William Henry",male,35,0,0,373450,8.05,,S
6,0,3,"Moran, Mr. James",male,,0,0,330877,8.4583,,Q
7,0,1,"McCarthy, Mr. Timothy J",male,54,0,0,17463,51.8625,E46,S
8,0,3,"Palsson, Master. Gosta Leonard",male,2,3,1,349909,21.075,,S
9,1,3,"Johnson, Mrs. Oscar W (Elisabeth Vilhelmina Berg)",female,27,0,2,347742,11.1333,,S
10,1,2,"Nasser, Mrs. Nicholas (Adele Achem)",female,14,1,0,237736,30.0708,,C
11,1,3,"Sandstrom, Miss. Marguerite Rut",female,4,1,1,PP 9549,16.7,G6,S
12,1,1,"Bonnell, Miss. Elizabeth",female,58,0,0,113783,26.55,C103,S
13,0,3,"Saundercock, Mr. William Henry",male,20,0,0,A/5. 2151,8.05,,S
14,0,3,"Andersson, Mr. Anders Johan",male,39,1,5,347082,31.275,,S
15,0,3,"Vestrom, Miss. Hulda Amanda Adolfina",female,14,0,0,350406,7.8542,,S
16,1,2,"Hewlett, Mrs. (Mary D Kingcome) ",female,55,0,0,248706,16,,S
17,0,3,"Rice, Master. Eugene",male,2,4,1,382652,29.125,,Q
18,1,2,"Williams, Mr. Charles Eugene",male,,0,0,244373,13,,S
19,0,3,"Vander Planke, Mrs. Julius (Emelia Maria Vandemoortele)",female,31,1,0,345763,18,,S
20,1,3,"Masselmani, Mrs. Fatima",female,,0,0,2649,7.225,,C
21,0,2,"Fynney, Mr. Joseph J",male,35,0,0,239865,26,,S
22,1,2,"Beesley, Mr. Lawrence",male,34,0,0,248698,13,D56,S
23,1,3,"McGowan, Miss. Anna ""Annie""",female,15,0,0,330923,8.0292,,Q
24,1,1,"Sloper, Mr. William Thompson",male,28,0,0,113788,35.5,A6,S
25,0,3,"Palsson, Miss. Torborg Danira",female,8,3,1,349909,21.075,,S
26,1,3,"Asplund, Mrs. Carl Oscar (Selma Augusta Emilia Johansson)",female,38,1,5,347077,31.3875,,S
27,0,3,"Emir, Mr. Farred Chehab",male,,0,0,2631,7.225,,C
28,0,1,"Fortune, Mr. Charles Alexander",male,19,3,2,19950,263,C23 C25 C27,S
```

If you copy this and run read_clipboard, you will notice that the data from the first row will be used as headers.

![First Row of Data is Used as Header](https://cdn-images-1.medium.com/max/2000/1*EpHXyHfp6qkJb2GvQiau8g.png)*First Row of Data is Used as Header*

Just like we would when using read_csv, we can pass header=None and names=col_names keyword arguments to read_clipboard in order to fix the problem and supply headers while we’re at it. After copying the csv file above, run the following code:

```python
import pandas as pd

columns = [
    'PassengerId', 'Survived', 'Pclass', 'Name',
    'Sex', 'Age', 'SibSp', 'Parch', 'Ticket', 'Fare',
    'Cabin', 'Embarked',
]
pd.read_clipboard(header=None, names=columns)
```

![That’s Better](https://cdn-images-1.medium.com/max/2190/1*iNHOu_VWN671kGZM_u4rHg.png)*That’s Better*

You can see from the image above that the first row was no longer used for the header, and our headers are now properly named. Nice.

### Final Thoughts

There is one caveat in using pd.read_clipboard() : it does not work for notebooks running on the cloud or [WSL](https://scotch.io/bar-talk/trying-the-new-wsl-2-its-fast-windows-subsystem-for-linux) (sobs in binary). So for those who are working on Jupyter notebooks remotely, I’m sorry to say that you have to stick with using read_csv for now.

Aside from that, it is a useful way to quickly get your hands on data and wrangle right away. It’s a wonderful addition to any data scientist’s arsenal.