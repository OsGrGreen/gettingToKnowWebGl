import {monochromatic,basicColours,colourScheme1,dodecahedronColours, dodecahedronPosistionOrdered,dodecahedronIndecies,dodecahedronIndeciesLinesOrdered,dodecahedronIndeciesOrdered,dodecahedronPosistion,cubeIndecies,cubePosistions} from "./constants.js"

function initBuffers(gl){
    const posistionBuffer = initPosistionBuffer(gl);
    const colourBuffer = initColourBuffer(gl);
    const indexBuffer = initIndexBuffer(gl);

    return{
        position:posistionBuffer,
        colour:colourBuffer,
        indices:indexBuffer,
    };
}

function initIndexBuffer(gl){
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    
  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = dodecahedronIndeciesLinesOrdered;

  // Now send the element array to GL

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW,
  );

  return indexBuffer;
}

function initColourBuffer(gl){

    const faceColors = monochromatic;

    // Convert the array of colors into a table for all the vertices.

    var colours = [];

    for (var j = 0; j < faceColors.length; j++) {
        const c = faceColors[j];
        // Repeat each color five times for the five vertices of the face
        colours = colours.concat(c);
    }
    console.log(colours);
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);
    
    return colorBuffer;
}

function initPosistionBuffer(gl){
    //Create buffer for the vertices
    console.log(typeof dodecahedronPosistion)
    const posistionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, posistionBuffer);

    // Array of positions of a square
    const positions = dodecahedronPosistionOrdered;

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return posistionBuffer;
}

export { initBuffers };