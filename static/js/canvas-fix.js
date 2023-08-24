function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    //TODO:
    // Add dpr support:https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
    const dpr = window.devicePixelRatio;
    const {width, height} = canvas.getBoundingClientRect();
    const displayWidth  = Math.round(width * dpr);
    const displayHeight = Math.round(height * dpr);
   
    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
                       canvas.height !== displayHeight;
   
    if (needResize) {
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
    
    return needResize;
}

export {resizeCanvasToDisplaySize};