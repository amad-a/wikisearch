import React from 'react';
const cheerio = require('cheerio');
const axios = require('axios');

const Nyt = () => {

    const Ziti = () => {

        axios.get('https://www.bonappetit.com/recipe/soto-ayam-betawi')
            .then((res) => {
                const $ = cheerio.load(res.data);
                return $('.recipe-steps').text(); 
            }).then((res) => {console.log(res)})





    }

    return (
        <button onClick={Ziti}>ziti!</button>
    )



}

export default Nyt;