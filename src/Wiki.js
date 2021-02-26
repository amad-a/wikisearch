import React, { useState , useRef, useEffect} from 'react';
import Nyt from './Nyt';
import Form from './Form';
import Canvas from './Canvas';
const fetch = require("node-fetch");


const Wiki = () => {

  const [image, setImage] = useState("https://upload.wikimedia.org/wikipedia/commons/1/10/Tursiops_truncatus_01.jpg");
  const [title, setTitle] = useState("Dolphin");
  const [width, setWidth] = useState(350);
  const [height, setHeight] = useState(250);



  
  




  const Search = async (e) => {

    e.preventDefault();
    const searchTerm = e.target.elements.searchTerm.value;
    
    if (!searchTerm) {
      setTitle("check 1");
      return;
    }

    const url_search = `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${searchTerm}&format=json`;

    const search_response = await fetch(url_search);
    
    const search_json = await search_response.json();
    if (search_json[3].length === 0){
      setTitle("check 2");
      return;

    }
    
    
    const term = search_json[3][0];
    const backup_term = search_json[3][1];



    const pageURL = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageimages&format=json&piprop=original&titles=${term.substr(30,)}`;
    const pageURL2 = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageimages&format=json&piprop=original&titles=${backup_term.substr(30,)}`;
    const page_url_response = await fetch(pageURL)
    const backup_response = await fetch(pageURL2)
    const final = await page_url_response.json();
    const backupfinal = await backup_response.json();
    console.log(final)
    console.log(backupfinal)
    


      

    if (Object.entries(final.query.pages)[0][1].original) {
      console.log(Object.entries(final.query.pages)[0][1].original.source);
      console.log(Object.entries(final.query.pages)[0][1].original);
      console.log(Object.entries(final.query.pages)[0][1].original.width);
      console.log(Object.entries(final.query.pages)[0][1].original.height);
      setImage(Object.entries(final.query.pages)[0][1].original.source);
      setTitle(search_json[1][0]);

      const w = Object.entries(final.query.pages)[0][1].original.width;
      const h = Object.entries(final.query.pages)[0][1].original.height;
    

      setWidth(350);
      setHeight(Math.floor((350/w)*h));
    }

    else if (Object.entries(backupfinal.query.pages)[0][1].original) {
      
      setImage(Object.entries(backupfinal.query.pages)[0][1].original.source);
      setTitle(search_json[1][0]);

      console.log(Object.entries(backupfinal.query.pages)[0][1].original.source);
      console.log(Object.entries(backupfinal.query.pages)[0][1].original);
      console.log(Object.entries(backupfinal.query.pages)[0][1].original.width);
      console.log(Object.entries(backupfinal.query.pages)[0][1].original.height);

      const w = Object.entries(backupfinal.query.pages)[0][1].original.width;
      const h = Object.entries(backupfinal.query.pages)[0][1].original.height;

      setWidth(350);
      setHeight(Math.floor((350/w)*h));

    }


    else {
      setTitle("check 3");
      setImage("");
      //console.log(Object.entries(final.query));
    }

  }  

  
  return (
    <div>
      <div className="Box">
        <h3>Wiki Dither</h3>
        <p>search something on wikipedia (the free encyclopedia) and see 
          its page image dithered using the <a href = "https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering">Floyd-Steinberg Dithering Algorithm</a>.
         <br/>more dithering algorithms to come :) </p>
        <Form Search={Search}/>
        &nbsp;
        <Canvas id="wiki_dither" src={image} w={width} h={height} />
        <p className="caption">{title} dithered</p>
        <Nyt />

        
        </div>




    </div>
  )

}

export default Wiki;

