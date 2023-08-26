///////////////////////////////
// Imports
///////////////////////////////
import { initBuffers, initBuffersTexture, initBuffers2} from "./init-buffers.js";
import {drawTex,drawScene, createTexture, drawPlane, drawSceneTexture} from "./draw-scene.js";
import {tex,planePos, planeTrig,cubeLines, monochromatic,basicColours,colourScheme1,dodecahedronColours, dodecahedronPosistionOrdered,dodecahedronIndecies,dodecahedronIndeciesLinesOrdered,dodecahedronIndeciesOrdered,dodecahedronPosistion,cubeIndecies,cubePosistions} from "./constants.js"
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

const simpleVertexSource = `

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
      vColour = vertexColour;
    }
  `;

const simpleFragmentSource = `

  precision mediump float;

  varying mediump vec4 vColour;

  //Function
  void main() {
    gl_FragColor = vColour;
  }
`;

const textureVertexSource = `
  attribute vec4 vertexPosition;
  attribute vec2 texCoord;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  varying vec2 v_texcoord;

  void main() {
    // Multiply the position by the matrix.
    gl_Position = projectionMatrix * modelViewMatrix *vertexPosition;

    // Pass the texcoord to the fragment shader.
    v_texcoord = texCoord;
  }
`;

const textureFragmentSource = `
  precision mediump float;

  // Passed in from the vertex shader.
  varying vec2 v_texcoord;

  // The texture.
  uniform sampler2D u_texture;

  void main() {
    gl_FragColor = vec4(v_texcoord, 0.0, 1.0);
  }
`

const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
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

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be downloaded over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel,
  );

  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image,
    );

    // WebGL1 has different requirements for power of 2 images
    // vs. non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
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
  const blackShaderProgram = initShaderProgram(gl, simpleVertexSource, simpleFragmentSource);
  const textureProgram = initShaderProgram(gl, textureVertexSource, textureFragmentSource);
  const texProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfoTex = {
    program: texProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(texProgram, "aVertexPosition"),
      textureCoord: gl.getAttribLocation(texProgram, "aTextureCoord"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(texProgram, "uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(texProgram, "uModelViewMatrix"),
      uSampler: gl.getUniformLocation(texProgram, "uSampler"),
    },
  };

  const programInfo = {
      program : shaderProgram,
      attribLocations:{
        vertexPosition: gl.getAttribLocation(shaderProgram, "vertexPosition"),
        vertexColour: gl.getAttribLocation(shaderProgram,"vertexColour"),
      },
      uniformLocations:{
        projectionMatrix: gl.getUniformLocation(shaderProgram,"projectionMatrix"),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, "modelViewMatrix"),
      },
  };
  const programBlackInfo = {
    program : blackShaderProgram,
    attribLocations:{
      vertexPosition: gl.getAttribLocation(blackShaderProgram, "vertexPosition"),
      vertexColour: gl.getAttribLocation(blackShaderProgram,"vertexColour"),
    },
    uniformLocations:{
      projectionMatrix: gl.getUniformLocation(blackShaderProgram,"projectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(blackShaderProgram, "modelViewMatrix"),
    },
  };
  const textureProgramInfo = {
    program : textureProgram,
    attribLocations:{
      vertexPosition: gl.getAttribLocation(textureProgram, "vertexPosition"),
      texCoord: gl.getAttribLocation(textureProgram, "texCoord"),
    },
    uniformLocations:{
      projectionMatrix: gl.getUniformLocation(textureProgram,"projectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(textureProgram, "modelViewMatrix"),
      texture: gl.getUniformLocation(textureProgram,"u_texture"),
    },
  }
  const dodec = initBuffers(gl, dodecahedronPosistionOrdered, monochromatic, dodecahedronIndeciesLinesOrdered, 0);
  
  const cube = initBuffers(gl, cubePosistions, monochromatic,cubeIndecies, 1);

  const cubeLine = initBuffers(gl, cubePosistions, [0.0,0.0,0.0,1.0], cubeLines, 2);

  const plane = initBuffers2(gl, planePos, tex,planeTrig, 1);

  const texture = loadTexture(gl, "tex.png");
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  
  const doRotation = 1;
  const cubeRotation = -0.7;

  const objectDraw = {
    programInfo: programInfoTex,
    bufferInfo: plane,
    rotation: 0,
  }

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
    {
      programInfo: programBlackInfo,
      bufferInfo: cubeLine,
      rotation: cubeRotation,
    },
  ]
  const res = createTexture(gl);
  const fb = res[0];
  const tx = res[1];


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
    //drawScene(gl, objectsToDraw, rotation);
    drawSceneTexture(gl, fb, objectsToDraw,rotation);
    drawTex(gl,objectDraw,tx,0);
    //drawSceneTexture(gl, fb, tx, planeInfo, objectsToDraw, rotation);
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
