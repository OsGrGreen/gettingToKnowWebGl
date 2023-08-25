function initBuffers(gl, pos, colour, index, type){
    const posistionBuffer = initPosistionBuffer(gl, pos);
    let colourBuffer = null;
    if (type == 0){
        colourBuffer = initColourBufferVertex(gl, colour);
    }else if(type == 2){
        colourBuffer = initColourBufferVertex(gl, [0.0,0.0,0.0,1.0]);
    }else{
        colourBuffer = initColourBufferFace(gl, colour);
    }
    const indexBuffer = initIndexBuffer(gl, index);
    const vertices = index.length;
    return{
        position:posistionBuffer,
        colour:colourBuffer,
        indices:indexBuffer,
        numVertices: vertices,
        type:type,
    };
}



function initBuffersTexture(gl, pos, colour, index, type, texture){
    const posistionBuffer = initPosistionBuffer(gl, pos);
    let colourBuffer = null;
    if (type == 0){
        colourBuffer = initColourBufferVertex(gl, colour);
    }else if(type == 2){
        colourBuffer = initColourBufferVertex(gl, [0.0,0.0,0.0,1.0]);
    }else{
        colourBuffer = initColourBufferFace(gl, colour);
    }
    const indexBuffer = initIndexBuffer(gl, index);
    const vertices = index.length;
    let texcoordBuffer = null;
    if (texture != null){
        texcoordBuffer = initTextureBuffer(gl, texture);
    }else{
        texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    }
    return{
        position:posistionBuffer,
        colour:colourBuffer,
        texcoord: texcoordBuffer,
        indices:indexBuffer,
        numVertices: vertices,
        type:type,
    };
}

function initTextureBuffer(gl, texture){
    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Uint16Array(texture),
        gl.STATIC_DRAW,
    );
    
    return texcoordBuffer;
}

function initIndexBuffer(gl, index){
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    
  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = index;

  // Now send the element array to GL

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW,
  );

  return indexBuffer;
}

function initColourBufferVertex(gl, col){

    const faceColors = col;

    // Convert the array of colors into a table for all the vertices.

    var colours = [];

    for (var j = 0; j < faceColors.length; j++) {
        const c = faceColors[j];
        // Repeat each color five times for the five vertices of the face
        colours = colours.concat(c);
    }
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);
    
    return colorBuffer;
}

function initColourBufferFace(gl, col){
    
    const faceColors = col;

    // Convert the array of colors into a table for all the vertices.

    var colours = [];

    for (var j = 0; j < faceColors.length; j++) {
        const c = faceColors[j];
        // Repeat each color five times for the five vertices of the face
        colours = colours.concat(c, c, c);
    }
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);
    
    return colorBuffer;
}

function initPosistionBuffer(gl, pos){
    //Create buffer for the vertices
    const posistionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, posistionBuffer);

    // Array of positions of a square
    const positions = pos;

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return posistionBuffer;
}

export { initBuffers, initBuffersTexture};