///////////////////////////////
// Imports
///////////////////////////////
import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";
import {monochromatic,basicColours,colourScheme1,dodecahedronColours, dodecahedronPosistionOrdered,dodecahedronIndecies,dodecahedronIndeciesLinesOrdered,dodecahedronIndeciesOrdered,dodecahedronPosistion,cubeIndecies,cubePosistions} from "./constants.js"
///////////////////////////////
// GLSL source
///////////////////////////////
const vertexSource = `

    // Variables:
    attribute vec4 vertexPosition;
    attribute vec4 vertexColour;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying mediump vec4 vColour;

    //Function
    void main() {
      vec4 worldPos = projectionMatrix * modelViewMatrix * vertexPosition;
      gl_Position = worldPos;
      //gl_Position = vertexPosition;
      vColour = vertexColour + sin(vertexPosition * modelViewMatrix)*0.3;
    }
  `;

const fragmentSource = `

  precision mediump float;
  varying mediump vec4 vColour;

  //Function
  void main() {
    //gl_FragColor = vec4(vec3(vColour),1.0);
    gl_FragColor = vColour;
  }
`;


///////////////////////////////
// Global variables
///////////////////////////////

let rotation = 0.0;
let deltaTime = 0;

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

  ///GL Stuff
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
        vertexColour: gl.getAttribLocation(shaderProgram,"vertexColour"),
      },
      uniformLocations:{
        projectionMatrix: gl.getUniformLocation(shaderProgram,"projectionMatrix"),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, "modelViewMatrix"),
      },
  };
  const dodec = initBuffers(gl, dodecahedronPosistionOrdered, monochromatic, dodecahedronIndeciesLinesOrdered, 0);
  const cube = initBuffers(gl, cubePosistions, monochromatic, cubeIndecies, 1);

  const buffers = [dodec, cube];

  const doRotation = 1;
  const cubeRotation = -0.7;

  var objectsToDraw = [
    {
      programInfo: programInfo,
      bufferInfo: dodec,
      rotation: doRotation,
    },
    {
      programInfo: programInfo,
      bufferInfo: cube,
      rotation: cubeRotation,
    },
  ]


  ///////////////////////////////
  // Render function
  ///////////////////////////////

  let then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    then = now;
    //const startTime = performance.now(); //Try to keep below 8 ms for rendering only
    drawScene(gl, objectsToDraw, rotation);
    //const endTime = performance.now();
    //const executionTime = endTime - startTime;
    //console.log(`Execution time: ${executionTime} ms`);
    rotation += deltaTime;

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

///////////////////////////////
// Run here
///////////////////////////////
main();
