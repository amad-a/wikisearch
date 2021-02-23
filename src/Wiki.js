import React, { useState , useRef, useEffect} from 'react';
import Nyt from './Nyt';
import Form from './Form';
import Canvas from './Canvas';
const fetch = require("node-fetch");


const Wiki = () => {

  const [image, setImage] = useState("https://upload.wikimedia.org/wikipedia/commons/1/10/Tursiops_truncatus_01.jpg");
  const [title, setTitle] = useState("Dolphin");

  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx.fill()
  }

  const Filter = () => {

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var img = document.getElementById("wiki_image");
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (var i = 0; i < data.length; i += 8) {
        var avg = (data[i] + data[i] + data[i]) / 12;
        data[i] = avg; // red
        data[i] = avg; // green
        data[i] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);

  }


  const Search = async (e) => {

    e.preventDefault();
    const searchTerm = e.target.elements.searchTerm.value;
    
    if (!searchTerm) {
      setTitle("no image found :(");
      return;
    }

    const url_search = `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${searchTerm}&format=json`;

    const search_response = await fetch(url_search);
    
    const search_json = await search_response.json();
    console.log(search_json);
    const term = search_json[3][0];
    const pageURL = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageimages&format=json&piprop=original&titles=${term.substr(30,)}`;
    const page_url_response = await fetch(pageURL)
    const final = await page_url_response.json();
    
    if (Object.entries(final.query.pages)[0][1].original) {
      console.log(Object.entries(final.query.pages)[0][1].original.source);
      setImage(Object.entries(final.query.pages)[0][1].original.source);
      setTitle(search_json[1][0]);
    }
    else {
      setTitle("no image found :(");
      setImage("");
      console.log(Object.entries(final.query.pages));
    }

  }  

  
  return (
    <div>
      <div className="Box">
        <h3>wiki search</h3>
        <p>search something on wikipedia (the free encyclopedia) and see 
          its page image below. still buggy so some requests will not show!
        </p>
        <Form Search={Search}/>
        &nbsp;
        <img id="wiki_image" src={image} width="300px"/>
        <p className="caption">{title}</p>
        </div>

      <div className="Box">
        <p>hello</p>
        <Canvas width="300px" />
      </div>



    </div>
  )

}

export default Wiki;

