#Calgary Shelter API

Node.js project. Utilizes axios, cheerio and express packages. 
Hosted here: https://abshelterapi.onrender.com/

As of 2022-06-13 API currently builds listings from 3 shelters in the Calgary area.

#Endpoints

/
welcome to API with routing instructions

/dogs 
lists all of the below:
- aarcs
- calgaryhumane
- pawsitive

/aarcs
/pawsitive
/calgaryhumane


#Returned Variables
- dogName: String value of the dogs name
- dogURL: String value of the URL to the specific adoptable dogs page
- dogPic: String value of the URL to the specific dogs image
- ID: int value, placement of the dog in the returned list

