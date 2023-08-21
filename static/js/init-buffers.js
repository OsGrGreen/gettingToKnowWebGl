function initBuffers(gl){
    const posistionBuffer = initPosistionBuffer(gl);

    return{
        position:posistionBuffer,
    };
}

function initPosistionBuffer(gl){
    //Create buffer for the vertices
    const posistionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, posistionBuffer);

    // Array of positions of a square
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return posistionBuffer;
}

export { initBuffers };