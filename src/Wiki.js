import React, { useState , useRef, useEffect} from 'react';
import Form from './Form';
import Canvas from './Canvas';
const fetch = require("node-fetch");


const Wiki = () => {

  const [image, setImage] = useState("https://upload.wikimedia.org/wikipedia/commons/1/10/Tursiops_truncatus_01.jpg");
  const [title, setTitle] = useState("Dolphin dithered");
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(210);

   
  const Search = async (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.searchTerm.value;
    if (!searchTerm){
      return;
    };
    const uriTerm = encodeURIComponent(searchTerm)
    const url_search = `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${uriTerm}&format=json`;
    const response = await fetch(url_search);
    const parsed = await response.json();
    const pageTitle = parsed[1][0];
    const encodedTitle = encodeURIComponent(parsed[1][0]);
    const template = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&formatversion=2&prop=pageimages%7Cpageterms&titles=${encodedTitle}&pilimit=3&piprop=original&pilicense=any&wbptterms=description&redirects=`
    const image_response = await fetch(template);
    const image_parsed = await image_response.json();
  
    if (image_parsed.query.pages[0].hasOwnProperty('original')){
        console.log(image_parsed.query.pages[0]);
        const w = image_parsed.query.pages[0].original.width;
        const h = image_parsed.query.pages[0].original.height;
        setImage(image_parsed.query.pages[0].original.source);
        setWidth(300);
        setHeight(Math.floor((300/w)*h));
        setTitle(image_parsed.query.pages[0].title + " dithered");
    }
    else {
      setTitle('image not found!');
      return;
    };
  }; 

  return (
    <div className="container">
      <div className="Box">
        <h3>WikiDither</h3>
        <p>search something on Wikipedia (the free encyclopedia) and see 
        its page image dithered using the 
        <a href="https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering">
        Floyd-Steinberg Dithering Algorithm</a>.</p>
        <Form Search={Search}/>
        &nbsp;
        <Canvas className="dithered-image" id="wiki_dither" src={image} w={width} h={height} />
        <p className="caption">{title}</p>
      </div>
    </div>
  )
}

export default Wiki;

