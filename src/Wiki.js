import React, { useState , useRef, useEffect} from 'react';
import Form from './Form';
import Canvas from './Canvas';
const fetch = require("node-fetch");


const Wiki = () => {

  const [image, setImage] = useState("https://upload.wikimedia.org/wikipedia/commons/1/10/Tursiops_truncatus_01.jpg");
  const [title, setTitle] = useState("Dolphin dithered");
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(210);
  const [option, setOption] = useState("color")

   
  const Search = async (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.searchTerm.value;
    const type = e.nativeEvent.submitter.name;
    console.log('type: ' + type)
    if (!searchTerm){
      return;
    };
    const uriTerm = encodeURIComponent(searchTerm)
    const url_search = `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${uriTerm}&format=json`;
    const response = await fetch(url_search);
    const parsed = await response.json();
    const pageTitle = parsed[1][0];
    const encodedTitle = encodeURIComponent(parsed[1][0]);
    const templateSmall = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&formatversion=2&prop=pageimages&piprop=thumbnail&pithumbsize=600&titles=${encodedTitle}`;
    const templateLarge = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&formatversion=2&prop=pageimages%7Cpageterms&titles=${encodedTitle}&pilimit=3&piprop=original&pilicense=any&wbptterms=description&redirects=`;
    
    const imageResponseSmall = await fetch(templateSmall);
    const imageParsedSmall = await imageResponseSmall.json();
    const imageResponseLarge = await fetch(templateLarge);
    const imageParsedLarge = await imageResponseLarge.json();
  
    if (imageParsedSmall.query.pages[0].hasOwnProperty('thumbnail')){
        console.log("thumbnail found: " + imageParsedSmall.query.pages[0]);
        const w = imageParsedSmall.query.pages[0].thumbnail.width;
        const h = imageParsedSmall.query.pages[0].thumbnail.height;
        setImage(imageParsedSmall.query.pages[0].thumbnail.source);
        setWidth(300);
        setHeight(Math.floor((300/w)*h));
        setTitle(imageParsedSmall.query.pages[0].title + " dithered");
        setOption(type)
    } else if (imageParsedLarge.query.pages[0].hasOwnProperty('original')) {
        console.log("original used: " + imageParsedLarge.query.pages[0]);
        const w = imageParsedLarge.query.pages[0].original.width;
        const h = imageParsedLarge.query.pages[0].original.height;
        setImage(imageParsedLarge.query.pages[0].original.source);
        setWidth(300);
        setHeight(Math.floor((300/w)*h));
        setTitle(imageParsedLarge.query.pages[0].title + " dithered");
        setOption(type)
    } else {
      setTitle('image not found!');
      return;
    };
  }; 

  const download = () => {
    let download = document.getElementById("download");
    let image = document.getElementById("wiki_dither")
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
  }

  return (
    <div className="container">
      <div className="Box">
        <h3>WikiDither</h3>
        <p>search something on Wikipedia (the free encyclopedia) and see 
        its page image dithered using the <a href="https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering">
        Floyd-Steinberg Dithering Algorithm</a>.</p>
        <Form Search={Search}/>
        &nbsp;
        <Canvas className="dithered-image" id="wiki_dither" src={image} w={width} h={height} option={option}/>
        <div className="caption-grid">
          <p className="caption">{title}</p>
          <a className="download-container" id="download" download="dithered_image.png">
            <button type="button" className="download-button" onClick={() => download()}>Download ↴</button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Wiki;

