// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
import { resizeCanvasToDisplaySize } from "./canvas-fix.js";


//TODO:
/*

- [ ] Clean up a little bit of the messy code
- [ ] Make it so any object can have a texture and a colour
- [ ] Clean up the pipeline
- [ ] Add outline shader instead of gl_lines for rendering outline of square
- [ ] Add dithering
 

*/

const targetTextureWidth = 512; //256
const targetTextureHeight = 512; //188

function createTexture(gl){
    // create to render to


    const targetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);

    {
        // define size and format of level 0
        const level = 0;
        const internalFormat = gl.RGBA;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        const data = null;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                      targetTextureWidth, targetTextureHeight, border,
                      format, type, data);
       
        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


        // Create and bind the framebuffer
        const fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

        // attach the texture as the first color attachment
        const attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, level);

        // Creating and attaching a depth renderbuffer
        const depthRenderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, targetTextureWidth, targetTextureHeight);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderbuffer);
        
        /*
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, attachmentPointDepth, gl.TEXTURE_2D, depthTexture, 0);
        */
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return [fb,targetTexture];
      }
}
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
    if (buffers.colour == null){
        return;
    }
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

// tell webgl how to pull out the texture coordinates from buffer
function setTextureAttribute(gl, buffers, programInfo) {
    const num = 2; // every coordinate composed of 2 values
    const type = gl.FLOAT; // the data in the buffer is 32-bit float
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set to the next
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      num,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
  }

function updateMatrices(gl, rotation, type){
    //Create perspective matrix
    const fieldOfView = (45 * Math.PI) / 180; // 45  degrees in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100;
    const projectionMatrix = mat4.create();
    //mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    
    mat4.ortho(projectionMatrix,-5.5,5.5,-3.0,3.0,zNear,zFar) //Left to bottom should be 1.5 scaled
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix =  mat4.create();
    
    mat4.translate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [0.0, 0.0, -6.0],
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

    if (type == 1 || type == 2){ 
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
        if (bufferInfo.type == 0 || bufferInfo.type == 2){
            gl.drawElements(gl.LINES, vertexCount, type, offset);
        }else{
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
       
    }
}

function drawScene(gl, objects, rotation){
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
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

function drawPlane(gl, plane, tx){
    gl.useProgram(plane.programInfo.program);
    // render to the canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // render the cube with the texture we just rendered to
    let needResize = resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.3,0.094,0.082,1.0);
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    //Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindTexture(gl.TEXTURE_2D, tx);
    //gl.uniform1i(textureProgramInfo.uniformLocations.texture, 0); // Use texture unit 0
    setTextureAttribute(gl, plane.bufferInfo, plane.programInfo);
    gl.uniform1i(plane.programInfo.uniformLocations.texture, 0);

    drawObject(gl,plane,0);
    //console.log(gl.getError());
}

function drawSceneTexture(gl, fb, objects, rotation){

    // render to our targetTexture by binding the framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0,0, targetTextureWidth, targetTextureHeight);

    gl.clearColor(0.2,0.094,0.5,1.0);
    gl.clearDepth(1.0); // Clear everything

    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.enable(gl.CULL_FACE);
    
    // Clear the attachment(s).
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    objects.forEach((object) => drawObject(gl, object, rotation));
}

function drawTex(gl, object, texture, rotation){
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    let needResize = resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    let programInfo = object.programInfo;
    let buffers = object.bufferInfo;
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  
    // Clear the canvas before we start drawing on it.
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
  
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
  
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.ortho(projectionMatrix,-5.5,5.5,-3.0,3.0,zNear,zFar) //Left to bottom should be 1.5 scaled
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix =  mat4.create();
    
    mat4.translate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [0.0, 0.0, -6.0],
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
  
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    setPositionAttribute(gl, buffers, programInfo);
  
    setTextureAttribute(gl, buffers, programInfo);
  
    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  
    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);
  
    // Set the shader uniforms
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
    );
  
    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);
  
    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
  
    {
      const vertexCount = buffers.numVertices;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}


export {drawTex, drawScene, createTexture, drawPlane, drawSceneTexture};