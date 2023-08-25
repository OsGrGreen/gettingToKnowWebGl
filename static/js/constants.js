const planePos = [
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
];

const planeTrig = [
  0,
  1,
  2,
  0,
  2,
  3,
];

const tex = [
  0, 0,
  0, 1,
  1, 0,
  0, 1,
  1, 1,
  1, 0,

  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1,

  0, 0,
  0, 1,
  1, 0,
  0, 1,
  1, 1,
  1, 0,

  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1,

  0, 0,
  0, 1,
  1, 0,
  0, 1,
  1, 1,
  1, 0,

  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1,

];

const cubePosistions = [
    // Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
  
    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
  
    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
  
    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
  
    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
  
    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
  ];
  
  const colors = [
    1.0,
    1.0,
    1.0,
    1.0, // white
    1.0,
    0.0,
    0.0,
    1.0, // red
    0.0,
    1.0,
    0.0,
    1.0, // green
    0.0,
    0.0,
    1.0,
    1.0, // blue
    0.0,
    0.0,
    1.0,
    1.0, // blue
    0.0,
    0.0,
    1.0,
    1.0, // blue
    0.0,
    0.0,
    1.0,
    1.0, // blue
    0.0,
    0.0,
    1.0,
    1.0, // blue
    0.0,
    0.0,
    1.0,
    1.0, // blue
    0.0,
    0.0,
    1.0,
    1.0, // blue
    0.0,
    0.0,
    1.0,
    1.0, // blue
    0.0,
    0.0,
    1.0,
    1.0, // blue
  ];
  
  const cubeIndecies = [
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // back
    8,
    9,
    10,
    8,
    10,
    11, // top
    12,
    13,
    14,
    12,
    14,
    15, // bottom
    16,
    17,
    18,
    16,
    18,
    19, // right
    20,
    21,
    22,
    20,
    22,
    23, // left
  ];

  const cubeLines = [
    0, 1, 1, 2, 2 ,3, 3, 0, 0, 4, 4, 5, 5 ,3, 5, 6, 6, 2, 6 ,7, 7, 1, 7, 4,
  ]

  const cubeColours = [
    [0.89, 0.259, 0.204, 1.0], // Front face: white
    [1.0, 0.498, 0.314, 1.0], // Back face: red
    [0.886, 0.345, 0.133, 1.0], // Top face: green
    [1.0, 0.4, 0.0, 1.0], // Bottom face: blue
    [0.929, 0.569, 0.129, 1.0], // Right face: yellow
    [1.0, 0.749, 0.0, 1.0], // Left face: purple
  ];
  
  const dodecahedronPosistion = [
      0.0, 0.618, 1.618, 
      0.0, -0.618, 1.618, 
      0.0, -0.618, -1.618,
      0.0, 0.618, -1.618, 
      1.618, 0.0, 0.618, 
      -1.618, 0.0, 0.618,
      -1.618, 0.0, -0.618,
      1.618, 0.0, -0.618,
      0.618, 1.618, 0.0,
      -0.618, 1.618, 0.0,
      -0.618, -1.618, 0.0,
      0.618, -1.618, 0.0, 
      1.0, 1.0, 1.0, 
      -1.0, 1.0, 1.0, 
      -1.0, -1.0, 1.0, 
      1.0, -1.0, 1.0, 
      1.0, -1.0, -1.0, 
      1.0, 1.0, -1.0, 
      -1.0, 1.0, -1.0, 
      -1.0, -1.0, -1.0,
  ];
  const dodecahedronIndecies = [
    //Face 1
    0, 1, 15, 0, 15, 4, 0, 4, 12,
    //Face 2
    0, 12, 8, 0, 8, 9, 0, 9, 13,
    //Face 3
    0, 13, 5, 0, 5, 14, 0, 14, 1,
    //Face 4
    1, 14, 10, 1, 10, 11, 1, 11, 15,
    //Face 5
    2, 3, 17, 2, 17, 7, 2, 7, 16,
    //Face 6
    2, 16, 11, 2, 11, 10, 2, 10, 19,
    //Face 7
    2, 19, 6, 2, 6, 18, 2, 18, 3,
    //Face 8
    18, 9, 8, 18, 8, 17, 18, 17, 3,
    //Face 9
    15, 11, 16, 15, 16, 7, 15, 7, 4,
    //Face 10
    4, 7, 17, 4, 17, 8, 4, 8, 12,
    //Face 11
    13, 9, 18, 13, 18, 6, 13, 6, 5,
    //Face 12
    5, 6, 19, 5, 19, 10, 5, 10, 14,
  ];
  
  const dodecahedronPosistionOrdered = [
    0.0, 0.618, 1.618, //0
    0.0, -0.618, 1.618, //1
    1.0, -1.0, 1.0, //2
    1.618, 0.0, 0.618, //3
    1.0, 1.0, 1.0, //4 
    0.618, 1.618, 0.0,//5 
    -0.618, 1.618, 0.0,//6
    -1.0, 1.0, 1.0,//7
    -1.618, 0.0, 0.618,//8 
    -1.0, -1.0, 1.0,//9 
    -0.618, -1.618, 0.0,//10
    0.618, -1.618, 0.0, //11
    1.0, -1.0, -1.0, //12 
    1.618, 0.0, -0.618, //13
    1.0, 1.0, -1.0, //14 
    -1.0, -1.0, -1.0,//15 
    -1.618, 0.0, -0.618, //16  -1.618, 0.0, -0.618,
    0.0, -0.618, -1.618, //17  
    0.0, 0.618, -1.618, //180.0, 0.618, -1.618,
    -1.0, 1.0, -1.0, //19 
  ];
  const dodecahedronIndeciesLinesOrdered = [
    //Face 1
    0 , 1,  1,  2, 2, 3,  3,  4, 4, 0,
    //Face 2
    0, 4, 4, 5, 5, 6, 6, 7, 7, 0,
    //Face 3
    0, 7, 7, 8, 8, 9, 9, 1, 1 , 0,
    //Face 4
    1, 9, 9, 10, 10 ,11, 11, 2, 2, 1,
    //Face 5
    2, 11, 11, 12, 12, 13, 13, 3, 3, 2,
    //Face 6
    3, 13, 13, 14, 14, 5, 5, 4, 4, 3,
    //Face 7
    9, 10, 10, 15, 15, 16, 16, 8, 8, 9,
    //Face 8
    10, 15, 15,  17, 17, 12, 12, 11, 11, 10,
    //Face 9
    17, 18, 18,  14, 14, 13, 13, 12, 12, 17,
    //Face 10
    18, 19, 19, 16, 16, 15, 15, 17, 17, 18,
    //Face 11
    5, 6, 6, 19, 19, 18, 18, 14, 14, 5,
  ];
  
  const dodecahedronIndeciesOrdered = [
    //Face 1
    0, 1, 2, 0, 2, 3, 0, 3, 4,
    //Face 2
    0, 4, 5, 0, 5, 6, 0, 6, 7,
    //Face 3
    0, 7, 8, 0, 8, 9, 0, 9, 1,
    //Face 4
    1, 9, 10, 1, 10, 11, 1, 11, 2,
    //Face 5
    2, 11, 12, 2, 12, 13, 2, 13, 3,
    //Face 6
    3, 13, 14, 3, 14, 5, 3, 5, 4,
    //Face 7
    9, 10, 15, 9, 15, 16, 9, 16, 8,
    //Face 8
    10, 15, 17, 10, 17, 12, 10, 12, 11,
    //Face 9
    17, 18, 14, 17, 14, 13, 17, 13, 12,
    //Face 10
    18, 19, 16, 18, 16, 15, 18, 15, 17,
    //Face 11
    5, 6, 19, 5, 19, 18, 5, 18, 14,
    7, 8, 16, 7, 16, 19, 7, 19, 6,
  ];
  
  const dodecahedronColours = [
    [0.8862745098039215, 0.48627450980392156, 0.48627450980392156, 1.0], // Face 1; 
    [0.6588235294117647, 0.39215686274509803, 0.39215686274509803, 1.0], // Face 2; 
    [0.42745098039215684, 0.29411764705882354, 0.29411764705882354, 1.0], // Face 3; 
    [0.3137254901960784, 0.24705882352941178, 0.24705882352941178, 1.0], // Face 4; 
    [0.2, 0.2, 0.2, 1.0], // Face 5; 
    [0.23529411764705882, 0.3058823529411765, 0.29411764705882354, 1.0], // Face 6; 
    [0.27450980392156865, 0.4117647058823529, 0.39215686274509803, 1.0], // Face 7; 
    [0.34901960784313724, 0.6196078431372549, 0.5803921568627451, 1.0], // Face 8; 
    [0.4235294117647059, 0.8313725490196079, 0.7725490196078432, 1.0], // Face 9; 
    [0.0, 0.0, 0.0, 1.0], // Face 10; 
    [0.0, 0.0, 0.0, 1.0], // Face 11; 
    [0.0, 0.0, 0.0, 1.0], // Face 12; 
  ];
  
  const basicColours = [
    [1.0, 0.0, 0.0, 1.0],
    [0.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, 1.0, 1.0],
    [0.0, 1.0, 1.0, 1.0],
    [1.0, 0.0, 1.0, 1.0],
    [1.0, 1.0, 0.0, 1.0],
    [1.0, 0.5, 0.0, 1.0],
    [0.5, 0.0, 0.5, 1.0],
    [0.0, 0.5, 0.5, 1.0],
    [1.0, 0.6, 0.8, 1.0],
    [0.7, 1.0, 0.0, 1.0],
    [0.3, 0.0, 1.0, 1.0],
    [1.0, 0.8, 0.6, 1.0],
    [0.6, 1.0, 0.8, 1.0],
    [0.8, 0.6, 1.0, 1.0],
    [1.0, 0.3, 0.2, 1.0],
    [0.0, 1.0, 0.8, 1.0],
    [0.5, 0.0, 0.0, 1.0],
    [1.0, 0.8, 0.0, 1.0],
    [0.4, 0.2, 0.6, 1.0],
  ];
  
  const colourScheme1 = [
    [0.0, 0.2, 0.4, 1.0],
    [0.4, 0.6, 0.5, 1.0],
    [0.6, 0.5, 0.4, 1.0],
    [0.8, 0.7, 0.4, 1.0],
    [0.3, 0.4, 0.2, 1.0],
    [0.6, 0.3, 0.4, 1.0],
    [0.4, 0.1, 0.2, 1.0],
    [1.0, 0.9, 0.8, 1.0],
    [0.8, 0.7, 0.9, 1.0],
    [0.9, 0.5, 0.4, 1.0],
    [0.3, 0.4, 0.2, 1.0],
    [0.8, 0.4, 0.3, 1.0],
    [0.5, 0.7, 0.6, 1.0],
    [1.0, 0.7, 0.6, 1.0],
    [0.4, 0.4, 0.5, 1.0],
    [0.4, 0.2, 0.3, 1.0],
    [0.8, 0.7, 0.5, 1.0],
    [0.1, 0.1, 0.2, 1.0],
    [1.0, 0.8, 0.9, 1.0],
    [0.1, 0.3, 0.5, 1.0],
  ];
  
  const monochromatic = [
    [0.8, 0.4, 0.0, 1.0],
    [0.6, 0.3, 0.0, 1.0],
    [0.7, 0.2, 0.0, 1.0],
    [0.7, 0.3, 0.1, 1.0],
    [0.8, 0.3, 0.0, 1.0],
    [0.9, 0.4, 0.0, 1.0],
    [0.9, 0.5, 0.0, 1.0],
    [1.0, 0.5, 0.0, 1.0],
    [1.0, 0.6, 0.3, 1.0],
    [1.0, 0.7, 0.4, 1.0],
    [1.0, 0.5, 0.5, 1.0],
    [1.0, 0.4, 0.4, 1.0],
    [1.0, 0.3, 0.2, 1.0],
    [1.0, 0.4, 0.3, 1.0],
    [1.0, 0.7, 0.6, 1.0],
    [0.75, 0.35, 0.0, 1.0],
    [0.85, 0.45, 0.0, 1.0],
    [0.95, 0.55, 0.1, 1.0],
    [1.0, 0.65, 0.2, 1.0],
    [1.0, 0.75, 0.3, 1.0],
  ];

  export {tex, planePos, planeTrig, cubeLines, monochromatic,basicColours,colourScheme1,dodecahedronColours, dodecahedronPosistionOrdered,dodecahedronIndecies,dodecahedronIndeciesLinesOrdered,dodecahedronIndeciesOrdered,dodecahedronPosistion,cubeIndecies,cubePosistions}