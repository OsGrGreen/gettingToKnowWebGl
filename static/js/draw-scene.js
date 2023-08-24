// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
import { resizeCanvasToDisplaySize } from "./canvas-fix.js";
function setPositionAttribute(gl, buffers, programInfo){
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setColourAttribute(gl, buffers, programInfo){
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colour);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColour,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColour);
}

function updateMatrices(gl, rotation, type){
    //Create perspective matrix
    const fieldOfView = (45 * Math.PI) / 180; // 45  degrees in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix =  mat4.create();
    
    mat4.translate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [-0.0, 0.0, -6.0],
      ); // amount to translate

    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        rotation*0.5, // amount to rotate in radians
        [1, 1, 1], //Right now a line not an axis
    ); // axis to rotate around (Z)
    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        rotation * 0.1, // amount to rotate in radians
        [0, 1, 0],
    ); // axis to rotate around (Y)
    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        rotation * 0.0, // amount to rotate in radians
        [1, 0, 0],
    ); // axis to rotate around (X)

    if (type == 1){ 
        mat4.scale(
            modelViewMatrix,
            modelViewMatrix,
            [0.6,0.6,0.6], //Scale cube by 0.6
        )
    }

    const uniform = {projectionMatrix: projectionMatrix, modelViewMatrix:modelViewMatrix};
    return uniform;
}

function drawObject(gl, object, rotation) {
    let programInfo = object.programInfo;
    let bufferInfo = object.bufferInfo;
    let uniform = updateMatrices(gl, rotation*object.rotation, bufferInfo.type);
  
    // Setup all the needed attributes.
    setPositionAttribute(gl, bufferInfo, programInfo);
    setColourAttribute(gl, bufferInfo, programInfo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices);

    gl.useProgram(programInfo.program);

    // Set the uniforms.
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        uniform.projectionMatrix,
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        uniform.modelViewMatrix,
    );
    {
        const vertexCount = bufferInfo.numVertices; //Borde gå att få detta automatiskt
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        if (bufferInfo.type == 0){
            gl.drawElements(gl.LINES, vertexCount, type, offset);
        }else{
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
       
    }
  }

function drawScene(gl, objects, rotation){
    let needResize = resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.102,0.094,0.082,1.0);
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    //Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    objects.forEach((object) => drawObject(gl, object, rotation));
   

}


export { drawScene, updateMatrices};