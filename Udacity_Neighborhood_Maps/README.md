                                Author: Vyshnavi Bandi
                                Project: Neighborhood Map
                                Requirements: Python


# This folder consists of
	css folder: contains styling data for application
	js folder: contains the javascript
	templates: contains index.html
	data.py: This file will generate data from Yelp API
			  and sends the data to html via localhost JSON


# Run the project:

1. Open the terminal in the folder.
2. To install dependencies Run `pip install -r requirements.txt`, otherwise run `pip install flask` and `pip install requests`
	"term parameter value can be food,restuarants,cakes,bakery,donuts,indian,american"
	"location parameter value should be of type cityName, StateName be Abbrevation"
3. You can run the program in following two ways:
   a) Run `python data.py` (default it will show results from Sanfrancisco,CA)
   b) Run `python data.py --term="food" --location="dallas,Tx"`
4. Open the site http://localhost:5000
5. You will find few restuarants in dallas.
6. You can input the query relevant to results and it will filter the results.

# Resources:

1. The data.py code is from
	https://github.com/Yelp/yelp-fusion/tree/master/fusion/python
It will return the data relevant to user requirements.
2.https://codepen.io/prather-mcs/pen/KpjbNN?editors=0010#0
3.https://stackoverflow.com/questions/30168480/ko-utils-stringstartswith-not-working
4.https://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once/7832086#7832086
5.https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
6.Udacity discussion forums
7. Yelp Fusion API (https://www.yelp.com/developers/documentation/v3/business)