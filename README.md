# Node API for Animal Shelter Data

## About The Project

This is a Node.js API that scrapes animal data from various shelter websites and provides the data through a set of endpoints.
It is hosted with [Render](https://abshelterapi.onrender.com/) and is  used by [Alberta Shelter Application](https://caramcg.github.io/abshelterapp/).

## Built With

![Node.js](https://img.shields.io/badge/Node.js-20232A?style=for-the-badge&logo=nodedotjs&logoColor=#5FA04E)
![Axios](https://img.shields.io/badge/Axios-20232A?style=for-the-badge&logo=axios&logoColor=#5A29E4)
![Cheerio](https://img.shields.io/badge/Cheerio-20232A?style=for-the-badge&logo=cheerio&logoColor=#E88C1F)
![Express](https://img.shields.io/badge/Express-20232A?style=for-the-badge&logo=express&logoColor=#000000)
![Render](https://img.shields.io/badge/Render-20232A?style=for-the-badge&logo=render&logoColor=#000000)


## API Endpoints

1. /  
    * Welcome to API with routing instructions

2. /dogs  
    * **Description**: Returns all scraped data from all shelters.
    * **Method**: ``GET``
    * **Response**: JSON object containing data from all shelters.

3. Shelter-Specific Endpoints  
The following endpoints return data specific to individual shelters:  
    * /aarcs
    * /calgaryhumane
    * /pawsitive

    For all shelter-specific endpoints:  
    * **Description**: Returns data from the specified shelter's adoption page. 
    * **Method**:  ``GET``
    * **Response**: JSON object containing shelter-specific data.

## JSON Object Variables
Each JSON object returned by the API contains the following variables:  
* ``dogName``
    * **Type:** String
    * **Description:** The animals given name as displayed on the shelters adoption page. 
* ``dogURL``
    * **Type:** String
    * **Description:** A direct link to the animals adoption profile. 
* ``dogPic``
    * **Type:** String
    * **Description:** A direct link to the animals primary photo displayed on the shelters adoption page.
* ``shelterName``
    * **Type:** String
    * **Description:** The full name or abbreviation of the shelter the animal is located. 

## Example Responses

``/dogs``

```
[
    {
        "dogName": "Champ",
        "dogURL": "https://aarcs.ca/animal/123456",
        "dogPic": "https://aarcs.ca/animal/photo/123456",
        "shelterName": "aarcs"
    },
    {
        "dogName": "Cap'n Crunch",
        "dogURL": "https://calgaryhumane.ca/animal/7890",
        "dogPic": "https://calgaryhumane.ca/animal/photo/7890",
        "shelterName": "Calgary Humane"
    }
]

```

``/aarcs``

```
[
    {
        "dogName": "Champ",
        "dogURL": "https://aarcs.ca/animal/123456",
        "dogPic": "https://aarcs.ca/animal/photo/123456",
        "shelterName": "aarcs"
    }
]

```