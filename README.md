QBEAWA
==========

Quality based editing and assessment of Wikipedia articles. 

This repo includes two tools:

1. The Ranking Tool which enables users to rank Wikipedia articles based on Qulity Metrics
2. The Quality Assisted Editor which enables users to check the Quality of an article with low expenditure

## The Ranking Tool

![](https://github.com/bethloe/QBEAWA/blob/master/screenshot.PNG)

### Install

1. Clone it https://github.com/bethloe/RankingViz.git
2. Install xampp and start Apache + MySQL
3. Copy everything from the master branch unless the ArticleEditor folder to ../htdocs/<New Folder>
4. Open chrome and go to localhost/phpmyadmin and import the database from ../htdocs/<New Folder>/wikidata.sql 
5. Open chrome and go to localhost/<New Folder>/UI_test1.php


## The Quality Assisted Editor
![](https://github.com/bethloe/QBEAWA/blob/master/ArticleEditor/screenshot.PNG)

### Install

1. Clone it https://github.com/bethloe/RankingViz.git
2. Install xampp and start Apache 
3. Copy the ArticleEditor folder to ../htdocs
4. Open chrome and go to localhost/ArticleEditor/index.php

##See also
http://bethloe.github.io/QBEAWA

## License

The MIT License (MIT)
[OSI Approved License]
The MIT License (MIT)

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
