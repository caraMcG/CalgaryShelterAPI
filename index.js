const PORT = process.env.PORT || 8000

//initialize packages
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const cors = require('cors')

//call express
const app = express()
//set cors 
app.use(cors())

//dog profile variables
const dogProfiles = []

var dogName = ''
var dogPic = ''
var dogURL = ''
var shelterName = ''

//shelters to look through
const shelters = [
    {
        name: 'aarcs',
        address: 'https://aarcs.ca/adoptable-dogs/'
    },
    {
        name: 'calgaryhumane',
        address: 'http://ws.petango.com/webservices/adoptablesearch/wsAdoptableAnimals.aspx?species=Dog&sex=A&agegroup=All&location=&site=&onhold=A&orderby=ID&colnum=3&css=https://www.calgaryhumane.ca/wp-content/themes/blackbaud-bootstrap-calgary-humane-society/petango.css&authkey=4amspyroh0oj2b0cjmc3fi430ec5l7xmn8ckj1scncjgbl5tdp&recAmount=&detailsInPopup=Yes&featuredPet=Include&stageID='
    }
    ,
    {
        name: 'pawsitive',
        address:'https://pawsitivematch.org/adoptabledogs/'
    }
]

//home page routing 
app.get('/', (req, res) => {
    res.send('Welcome to my shelter API!! <br/> /dogs for all dogs in calgary area <br/> <br/> For specific shelters use:<br/>/aarcs<br/>/pawsitive<br/>/calgaryhumane <br/><br/>')
})

//dogs routing
app.get('/dogs',(req,res) => {
    res.json(dogProfiles)
})

// aarcs dogs only
app.get('/aarcs',(req,res) => {
    res.json(dogProfiles.filter((profile) => profile.shelterName.includes("aarcs")))
})

//paws dogs only
app.get('/pawsitive',(req,res) => {
    res.json(dogProfiles.filter((profile) => profile.shelterName.includes("pawsitive")))
})

//calgary humane dogs only 
app.get('/calgaryhumane',(req,res) => {
    res.json(dogProfiles.filter((profile) => profile.shelterName.includes("calgaryhumane")))
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
                    dogURL = 'https://www.calgaryhumane.ca/animals/animal-listings/dog-listings/?id=' + $(this).find('[class$=id]').text()
                    dogPic = $(this).find('.list-animal-photo').attr('src')
                    shelterName = 'calgaryhumane' 

                    if (dogName != ''){
                    
                        dogProfiles.push({
                            dogName,
                            dogURL,
                            dogPic,
                            shelterName
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
                    shelterName = 'aarcs'
                    
                    ///Checking for 'wags-wish' pictures and selecting correct image of dog
                    if (dogPic.includes('wags-wish-icon.png')){
                        dogPic = $(this).find('img:eq(1)').attr('src')
                    }

                    dogProfiles.push({
                        dogName,
                        dogURL,
                        dogPic,
                        shelterName
                    })
                   
                })
                dogProfiles.length = dogProfiles.length - 3
            }
            else //pawsitive
                $('td a, a.post',html).each(function() {
                    dogName = $(this).find('[class$=name]').text()
                    dogURL = $(this).attr('href')
                    dogPic = $(this).find('img').attr('src')
                    shelterName = 'pawsitive'
                    
                    dogProfiles.push({
                        dogName,
                        dogURL,
                        dogPic,
                        shelterName
                    })
                })
              
        }).catch((err) => console.log(`${shelter.name} has error`, err.response.status))
})

//Listening for any changes on port 8000
app.listen(PORT, () => console.log(`Running on PORT ${PORT}`))
