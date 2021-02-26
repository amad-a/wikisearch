import React, { useRef, useEffect } from 'react'

const Canvas = props => {

    function palette(color) {
        var c = parseInt(((color.r + color.g + color.b) / 3) > 128 ? 255 : 0);
        return { r: c, g: c, b: c, a: 255 };
      }
      
      // get difference
      function calculateQuantError(o, n) {
        var oc = parseInt((o.r + o.g + o.b) / 3),
            nc = parseInt((n.r + n.g + n.b) / 3);
        return { r: oc - nc, g: oc - nc, b: oc - nc, a: 255 };
      }

    const canvasRef = useRef(null)
  
    const draw = (ctx, cvs) => {
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = props.src;
    
    
    //console.log(cvs);
    
        const w = 350;
        const h = (props.h); 

        const test = ctx.width;
        //console.log(`size: ${test} `);
        img.crossOrigin = 'anonymous';
        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const len = data.length;
     
        // loop through all pixels and apply dither
        for(var i = 0; i < len; i+=4) {
        
        // get RGBA for the current pixel
        var oldColor = {
            r: data[i+0],
            g: data[i+1],
            b: data[i+2],
            a: data[i+3]
        };
        
        // convert RGBA to palette color
        var newColor = palette(oldColor);
        
        // apply the new color
        data[i+0] = newColor.r;
        data[i+1] = newColor.g;
        data[i+2] = newColor.b;
        data[i+3] = newColor.a;
        
        // calculate color difference
        var qe = calculateQuantError(oldColor, newColor);
    
        // apply differences to surrounding pixels.
        // the try..catch statements just ignores
        // edge cases. it's a codepen, not a lib :)
        try {
            data[i+0+4] += 7/16 * qe.r;
            data[i+1+4] += 7/16 * qe.g;
            data[i+2+4] += 7/16 * qe.b;
            data[i+3+4] += 7/16 * qe.a;
        } catch(e) {}
        try {
            data[i+0-4+w*4] += 3/16 * qe.r;
            data[i+1-4+w*4] += 3/16 * qe.g;
            data[i+2-4+w*4] += 3/16 * qe.b;
            data[i+3-4+w*4] += 3/16 * qe.a;
        } catch(e) {}
        try {
            data[i+0+w*4] += 5/16 * qe.r;
            data[i+1+w*4] += 5/16 * qe.g;
            data[i+2+w*4] += 5/16 * qe.b;
            data[i+3+w*4] += 5/16 * qe.a;
        } catch(e) {}
        try {
            data[i+0+4+w*4] += 1/16 * qe.r;
            data[i+1+4+w*4] += 1/16 * qe.g;
            data[i+2+4+w*4] += 1/16 * qe.b;
            data[i+3+4+w*4] += 1/16 * qe.a;
        } catch(e) {}
        }
        // put the data back
        ctx.putImageData(imageData, 0, 0);
        
  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let animationFrameId
    
    //Our draw came here
    const render = () => {
      draw(context, canvas)
      animationFrameId = window.requestAnimationFrame(render)
    }

    render()
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return (
    <canvas width={props.w} height={props.h} ref={canvasRef} {...props}/>
  ) 
}

export default Canvas