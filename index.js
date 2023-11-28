const PORT = process.env.PORT || 8000

//initialize packages
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

//call express
const app = express()

//dog profile variables
const dogProfiles = []
const chProfiles = []
const aarcsProfiles = []
const pawsProfiles = []

var dogName = ''
var dogPic = ''
var dogURL = ''

var ID = 0
var chID = 0
var pawsID = 0
var aarcsID = 0

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
app.get('/', (req, res) => {
    res.send('Welcome to my shelter API!! <br/> /dogs for all dogs in calgary area <br/> <br/> For specific shelters use:<br/>/aarcs<br/>/pawsitive<br/>/calgaryhumane <br/><br/><br/>Updated as of:  2023-11-28')
})

//dogs routing
app.get('/dogs',(req,res) => {
    res.json(dogProfiles)
})

//aarcs dogs only
app.get('/aarcs',(req,res) => {
    res.json(aarcsProfiles)
})

//paws dogs only
app.get('/pawsitive',(req,res) => {
    res.json(pawsProfiles)
})

//calgary humane dogs only 
app.get('/calgaryhumane',(req,res) => {
    res.json(chProfiles)
})


//looping through all shelters
shelters.forEach(shelter => {
    axios.get(shelter.address, {headers: {'Content-Type': 'application/json', crossdomain:true}})
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
                        ID ++
                        chID ++

                        dogProfiles.push({
                            dogName,
                            dogURL: 'http://ws.petango.com/webservices/adoptablesearch/' + splitURL[1],
                            dogPic,
                            ID
                        })
                        chProfiles.push({
                            dogName,
                            dogURL: 'http://ws.petango.com/webservices/adoptablesearch/' + splitURL[1],
                            dogPic,
                            chID
                        })
                    }

                })
            }
            else if(shelter.name == 'aarcs'){
                $('td a, a.post',html).each(function() {
                // $('td a, a.et-l',html).each(function() {
                    dogName = $(this).find('[class$=name]').text()
                    dogURL = $(this).attr('href')
                    dogPic = $(this).find('img').attr('src')
                    ID ++
                    aarcsID ++
                    
                    ///Checking for 'wags-wish' pictures and selecting correct image of dog
                    if (dogPic.includes('wags-wish-icon.png')){
                        dogPic = $(this).find('img:eq(1)').attr('src')
                    }

                    dogProfiles.push({
                        dogName,
                        dogURL,
                        dogPic,
                        ID
                    })
                    aarcsProfiles.push({
                        dogName,
                        dogURL,
                        dogPic,
                        aarcsID
                    })
                })
                dogProfiles.length = dogProfiles.length - 3
                aarcsProfiles.length = aarcsProfiles.length - 3
            }
            else //pawsitive
                $('td a, a.post',html).each(function() {
                    dogName = $(this).find('[class$=name]').text()
                    dogURL = $(this).attr('href')
                    dogPic = $(this).find('img').attr('src')
                    
                    ID ++
                    pawsID ++
                    
                    dogProfiles.push({
                        dogName,
                        dogURL,
                        dogPic,
                        ID
                    })
                    pawsProfiles.push({
                        dogName,
                        dogURL,
                        dogPic,
                        pawsID
                    })
                })

            
        }).catch((err) => console.log(`${shelter.name} has error`, err.response.status))
})

//Listening for any changes on port 8000
app.listen(PORT, () => console.log(`Running on PORT ${PORT}`))
