var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var nuvem, nuvemImg, grupoNuvens;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6, grupoObstaculos;
var PLAY = 1, END = 0;
var gameState = PLAY;
var gameOverImg, restartImg;
var Game, Rest;
var jump, die, checkpoint;

var score = 0;


function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  nuvemImg = loadImage("cloud.png");

  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage ("restart.png");

  jump = loadSound ("jump.mp3");
  die = loadSound ("die.mp3");
  checkpoint = loadSound ("checkpoint.mp3");
}

function setup() {

  createCanvas(windowWidth,windowHeight);
  

  grupoObstaculos = createGroup();
  grupoNuvens = createGroup();

  //crie um sprite de trex
  trex = createSprite(50,height-40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("bateu",trex_collided);
  trex.scale = 0.5;
  
  //crie sprite ground (solo)
  ground = createSprite(width/2,height-30,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  //crie um solo invisível
  invisibleGround = createSprite(width/2,height-10,width,2);
  invisibleGround.visible = false;
  
  //gerar números aleatórios
  var rand =  Math.round(random(1,100))
  console.log(rand)
  trex.debug = true;
  trex.setCollider("circle",0,0,50);
  //trex.setCollider("rectangle",0,0,200,trex.height);
 Game = createSprite(width/2,height/2-50);
 Game.addImage(gameOverImg);
 Game.scale = 1.2
 

 Rest = createSprite(width/2,height/2);
 Rest.addImage(restartImg);
 Rest.scale = 0.5;

}

function draw() {
  //definir cor do plano de fundo
  background(180);
  


  //console.log(trex.y)
  
  text("PONTUAÇÃO: "+score,width-180,20); 
 
  
  
  if(gameState == PLAY){
    ground.velocityX = -(4 + 1.5*score/100);
    Game.visible = false;
    Rest.visible = false;
    score = score+round(frameCount/90)
  // pulando o trex ao pressionar a tecla de espaço
    if(keyDown("space")&& trex.y >= height-100 || touches.length > 0) {
    trex.velocityY = -10;
    jump.play();
    touches = []
    }
    trex.velocityY = trex.velocityY + 1
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if(grupoObstaculos.isTouching(trex)){
      // trex.velocityY = -10;
      // trex.velocityY += 1
      die.play();
      gameState = END;
      
      
    }

    if(score > 0 && score% 300 == 0){
      checkpoint.play();
    }
    criarNuvens();
    criarObstaculos();



  }else if(gameState == END){
    ground.velocityX = 0;
    grupoObstaculos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);
    trex.changeAnimation("bateu", trex_collided);
    trex.velocityY = 0;
    grupoObstaculos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);
    Game.visible = true;
    Rest.visible = true;
    if(mousePressedOver(Rest)){
      reset();
    }


  }

 
  
  trex.collide(invisibleGround);
  

  

  drawSprites();
}

//função para gerar as nuvens
function criarNuvens(){
 //escreva seu código aqui
  if(frameCount%70 == 0){
    nuvem = createSprite(width+20,height-300,40,10);
    nuvem.velocityX = -3;
    nuvem.addImage(nuvemImg);
    nuvem.scale = 0.7
    nuvem.y = random(200,400);
    nuvem.lifetime = 600;
    trex.depth = nuvem.depth+1

    grupoNuvens.add(nuvem);
  }
 
}

function criarObstaculos(){
  if(frameCount%70 == 0){
    var obstaculo = createSprite(width+20,height-45,50,40);
    obstaculo.velocityX = -(4 + 1.5 * score/100);
    var rand = round(random(1,6));
    switch(rand){
      case 1: obstaculo.addImage(obstaculo1);
      break;

      case 2: obstaculo.addImage(obstaculo2);
      break;

      case 3: obstaculo.addImage(obstaculo3);
      break;

      case 4: obstaculo.addImage(obstaculo4);
      break;

      case 5: obstaculo.addImage(obstaculo5);
      break;

      case 6: obstaculo.addImage(obstaculo6);
      break;

      default: break;

    }

    obstaculo.scale = 0.6;
    obstaculo.lifetime = 600;

    grupoObstaculos.add(obstaculo);
  }
}

function reset(){
  gameState = PLAY;
  score = 0;
  grupoObstaculos.destroyEach();
  grupoNuvens.destroyEach();
  trex.changeAnimation("running", trex_running);

}
