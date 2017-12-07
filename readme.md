# Using Azure Graph DB for Movie recomendation

Purpose of this Node JS code is to bulk create large volume of Vertex and edges in Azure Cosmos Graph DB.
This prpogramm utilizes publically avaialable movie rating dataset from Grouplens.org [https://grouplens.org/datasets/movielens/]
We are utilizing subset of data from " MovieLense 1M dataset".

Using this Node JS programm, you will be able to upload about 3900 movie details and about 340,000 movie ratings made by 2000 users.

## Rating File Description
All ratings are contained in the file "ratingssubset.dat" and are in the
following format:

UserID::MovieID::Rating::Timestamp

- UserIDs range between 1 and 2000 
- MovieIDs range between 1 and 3952
- Ratings are made on a 5-star scale (whole-star ratings only)
- Timestamp is represented in seconds since the epoch as returned by time(2)
- Each user has at least 20 ratings

## User File Description

User information is in the file "userssubset.dat" and is in the following
format:

UserID::Gender::Age::Occupation::Zip-code

- Gender is denoted by a "M" for male and "F" for female
- Age is chosen from the following ranges:

	*  1:  "Under 18"
	* 18:  "18-24"
	* 25:  "25-34"
	* 35:  "35-44"
	* 45:  "45-49"
	* 50:  "50-55"
	* 56:  "56+"

- Occupation is chosen from the following choices:

	*  0:  "other" or not specified
	*  1:  "academic/educator"
	*  2:  "artist"
	*  3:  "clerical/admin"
	*  4:  "college/grad student"
	*  5:  "customer service"
	*  6:  "doctor/health care"
	*  7:  "executive/managerial"
	*  8:  "farmer"
	*  9:  "homemaker"
	* 10:  "K-12 student"
	* 11:  "lawyer"
	* 12:  "programmer"
	* 13:  "retired"
	* 14:  "sales/marketing"
	* 15:  "scientist"
	* 16:  "self-employed"
	* 17:  "technician/engineer"
	* 18:  "tradesman/craftsman"
	* 19:  "unemployed"
	* 20:  "writer"

## Movie file description

Movie information is in the file "movies.dat" and is in the following
format:

MovieID::Title::Genres

- Titles are identical to titles provided by the IMDB 
- Genres are pipe-separated and are selected from the following genres:

	* Action
	* Adventure
	* Animation
	* Children's
	* Comedy
	* Crime
	* Documentary
	* Drama
	* Fantasy
	* Film-Noir
	* Horror
	* Musical
	* Mystery
	* Romance
	* Sci-Fi
	* Thriller
	* War
	* Western

## Steps to run the programm to create Graph Vertex and Edges in Azure Graph DB

As this programm will be uploading large voumne of dataset to Graph DB, it is best to run one command at a time to avoid any throtling in the server side

1. Update the Azure cosmos Graoh DB connection details in "config.js"
```
	config.endpoint = "<<Database account>>.graphs.azure.com";
	config.primaryKey ="<<>>";
	config.database ="<<database ID>>";
	config.collection="<<Collection>>";
```
2. Go to the code directory and run "npm install" to install all the node packages required
3. In Node.JS command prompt run for the following commands One-By-One

		node app.js --mode=movieset1
		node app.js --mode=movieset2
		node app.js --mode=movieset3
		node app.js --mode=movieset4

		node app.js --mode=occupation

		node --max-old-space-size=8192 app.js --mode=users

		node --max-old-space-size=8192 app.js --mode=rating1
		node --max-old-space-size=8192 app.js --mode=rating2
		node --max-old-space-size=8192 app.js --mode=rating3
		node --max-old-space-size=8192 app.js --mode=rating4

Now your Azure Graph DB should have all the necessory Graph nodes and edges created for analysis