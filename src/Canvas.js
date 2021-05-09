import React, { useRef, useEffect } from 'react'

const Canvas = props => {

    const canvasRef = useRef(null)
    
    const draw = (ctx) => {

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = props.src;
      const w = props.w;
      const h = props.h; 
      img.crossOrigin = 'anonymous';
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const len = data.length;

      const palette = (color) => {
        if (props.option === 'color'){
          let color_r = Math.floor((color.r / 32)) << 6;
          let color_g = Math.floor((color.g / 32)) << 6;
          let color_b = Math.floor((color.b / 32)) << 6;
          return { r: color_r, g: color_g, b: color_b, a: 255 };
        } else {
          let c = parseInt(((color.r + color.g + color.b) / 3) > 128 ? 255 : 0);
          return { r: c, g: c, b: c, a: 255 }; 
        }
      }
            
      const calculateQuantError = (o, n) => {
          let oc = parseInt((o.r + o.g + o.b) / 3),
              nc = parseInt((n.r + n.g + n.b) / 3);
          return { r: oc - nc, g: oc - nc, b: oc - nc, a: 255 };
      }
      
      for(let i = 0; i < len; i+=4) {
          let oldColor = {
                  r: data[i+0],
                  g: data[i+1],
                  b: data[i+2],
                  a: data[i+3]
          };
          let newColor = palette(oldColor);
          data[i+0] = newColor.r;
          data[i+1] = newColor.g;
          data[i+2] = newColor.b;
          data[i+3] = newColor.a;
          let qe = calculateQuantError(oldColor, newColor);

          try {
              data[i+0+4] += 7/16 * qe.r;
              data[i+1+4] += 7/16 * qe.g;
              data[i+2+4] += 7/16 * qe.b;
              data[i+3+4] += 7/16 * qe.a;
          } catch(e) {console.log(e)}
          try {
              data[i+0-4+w*4] += 3/16 * qe.r;
              data[i+1-4+w*4] += 3/16 * qe.g;
              data[i+2-4+w*4] += 3/16 * qe.b;
              data[i+3-4+w*4] += 3/16 * qe.a;
          } catch(e) {console.log(e)}
          try {
              data[i+0+w*4] += 5/16 * qe.r;
              data[i+1+w*4] += 5/16 * qe.g;
              data[i+2+w*4] += 5/16 * qe.b;
              data[i+3+w*4] += 5/16 * qe.a;
          } catch(e) {console.log(e)}
          try {
              data[i+0+4+w*4] += 1/16 * qe.r;
              data[i+1+4+w*4] += 1/16 * qe.g;
              data[i+2+4+w*4] += 1/16 * qe.b;
              data[i+3+4+w*4] += 1/16 * qe.a;
          } catch(e) {console.log(e)}
          }
          ctx.putImageData(imageData, 0, 0);  
    }
  
  useEffect(() => {
    let timeout = 2000;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;
    const cancel = () => {
      window.cancelAnimationFrame(animationFrameId)
    }
    const render = () => {
      draw(context)
      animationFrameId = window.requestAnimationFrame(render)
      //console.log("frame: " + animationFrameId)
      setTimeout(cancel, timeout)
    }
    render()
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return (
    <canvas id="ditherCanvas" width={props.w} height={props.h} ref={canvasRef} {...props}/>
  ) 
}

export default Canvas