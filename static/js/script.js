///////////////////////////////
// Imports
///////////////////////////////
import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";
///////////////////////////////
// GLSL source
///////////////////////////////
const vertexSource = `
    attribute vec4 vertexPosition;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vertexPosition;
    }
  `;

const fragmentSource = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;

///////////////////////////////
// GL functions
///////////////////////////////

//Creates a shader and compiles it
function loadShader(gl, type, source){
    const shader = gl.createShader(type);
    //Send source
    gl.shaderSource(shader,source);
    //Compile
    gl.compileShader(shader);
    //See if compiled successfully

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert(`An error occured when compiling: ${gl.getShaderInfoLog(shader)}`,
        );
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

//Inits shader program
function initShaderProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    //Create shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If the creation failed, then alert:

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        alert(`unable to init shader program: ${gl.getProgramInfoLog(
            shaderProgram,
          )}`,);
        return null;
    }

    return shaderProgram;
}


///////////////////////////////
// Main function
///////////////////////////////

function main(){
    const canvas = document.querySelector("#glcanvas");
    //Init gl context
    const gl = canvas.getContext("webgl");

    //Only continue if webGl is working
    if (gl == null){
        alert("Unable to init WebGL");
        return;
    }

    //Set clear colour
    gl.clearColor(0.0,0.3,0.3,1.0);
    //Clear the colour buffer with set colour
    gl.clear(gl.COLOR_BUFFER_BIT);

    const shaderProgram = initShaderProgram(gl, vertexSource, fragmentSource);

    const programInfo = {
        program : shaderProgram,
        attribLocations:{
            vertexPosistion: gl.getAttribLocation(shaderProgram, "vertexPosition"),
        },
        uniformLocations:{
            projectionMatrix: gl.getUniformLocation(shaderProgram,"projectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "modelViewMatrix"),
        },
    };
    const buffers = initBuffers(gl);
    drawScene(gl, programInfo, buffers);
}

///////////////////////////////
// Run here
///////////////////////////////
main();
