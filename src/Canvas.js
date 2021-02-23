import React, { useRef, useEffect } from 'react'

const Canvas = props => {
  
  const canvasRef = useRef(null)
  
  const draw = (ctx, frameCount) => {
    const img = document.getElementById("wiki_image");
    
        img.crossOrigin = 'anonymous';
        ctx.drawImage(img, 0, 0, 200, 200);
        const imageData = ctx.getImageData(0, 0, 200, 200);
        const data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i]     = data[i]/256; // red
            data[i + 1] = data[i + 1]/256; // green
            data[i + 2] = data[i + 2]/256; // blue
        }
        ctx.putImageData(imageData, 0, 0);
        
        
    
    
    
  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId
    
    //Our draw came here
    const render = () => {
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])
  

  return (

    
    <canvas ref={canvasRef} {...props}/>

  ) 
}

export default Canvas