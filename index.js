const PORT = 8000

//initialize packages
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

//call express
const app = express()

//dog profile variables
const dogProfiles = []
var dogName = ''
var dogPic = ''
var dogURL = ''
var count = 0

//shelters to look through
const shelters = [
    {
        name: 'aarcs',
        address: 'https://aarcs.ca/adoptable-dogs/'
    },
    {
        name: 'calgaryhumane',
        address: 'http://ws.petango.com/webservices/adoptablesearch/wsAdoptableAnimals.aspx?species=Dog&sex=A&agegroup=All&location=&site=&onhold=A&orderby=ID&colnum=3&css=https://www.calgaryhumane.ca/wp-content/themes/blackbaud-bootstrap-calgary-humane-society/petango.css&authkey=4amspyroh0oj2b0cjmc3fi430ec5l7xmn8ckj1scncjgbl5tdp&recAmount=&detailsInPopup=Yes&featuredPet=Include&stageID='
    },
    {
        name: 'pawsitive',
        address:'https://pawsitivematch.org/adoptabledogs/'
    }
]

//home page routing 
app.get('/',(req, res) => {
    res.json('Welcome to my shelter API!')
})

//looping through all shelters
shelters.forEach(shelter => {
    axios.get(shelter.address)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)
            console.log(shelter.name)
            if(shelter.name == 'calgaryhumane'){
                
                $('.list-item',html).each(function() {
                    
                    dogName = $(this).find('[class$=name]').text()
                    dogURL = $(this).find('a').attr('href')
                    dogPic = $(this).find('.list-animal-photo').attr('src')
                                            
                    if (dogName != ''){
                        const splitURL = dogURL.split("('")
                        count ++

                        dogProfiles.push({
                            dogName,
                            dogURL: 'http://ws.petango.com/webservices/adoptablesearch/' + splitURL[1],
                            dogPic,
                            count
                        })
                    }

                })
            }
            else if(shelter.name == 'aarcs'){
                $('td a, a.post',html).each(function() {
                    dogName = $(this).find('[class$=name]').text()
                    dogURL = $(this).attr('href')
                    dogPic = $(this).find('img').attr('src')
                    
                    count ++
                    
                    dogProfiles.push({
                        dogName,
                        dogURL,
                        dogPic,
                        count
                    })
                })
                dogProfiles.length = dogProfiles.length - 3
            }
            else //pawsitive
                $('td a, a.post',html).each(function() {
                    dogName = $(this).find('[class$=name]').text()
                    dogURL = $(this).attr('href')
                    dogPic = $(this).find('img').attr('src')
                    
                    count ++
                    
                    dogProfiles.push({
                        dogName,
                        dogURL,
                        dogPic,
                        count
                    })
                })

            // dogProfiles.length = dogProfiles.length - 3
            
        }).catch((err) => console.log(err))
})

app.get('/dogs',(req,res) => {
    res.json(dogProfiles)
})

//Listening for any changes on port 8000
app.listen(PORT, () => console.log(`Running on PORT ${PORT}`))