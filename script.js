
//Step 1: Set up the gaming enviernment (grid and score) using the width and height of the canvas for dynamic programming

//A. Create the canvas where the game will live
let canvas = document.getElementById("canvas"); //grabd the html element with ID "canvas"
let ctx = canvas.getContext('2d'); //returns something you can draw on (ctx is the object that allows you to draw)
let cWidth = canvas.width; //variable that represents the width of canvas
let cHeight = canvas.height; //variable that represents the height of the canvas 
//NOTE: the width and height of the cnavas can be changes in the html element or can be changed using add or remove (this can be changed for various "levels" of the game)

//B. Create an imaginary grid on our canvas
//snake and apple are one block wide, sanke moves to adjacent bix, apple moves to random box, 
let bSize = 10; //the size of each box will be 10 pixels
let xBoxes = cWidth/bSize; //the columns of the grid
let yBoxes = cHeight/bSize; //the rows of the grid

//C. Draw the boreder using the grid
//drawing the border needs to be a function because it has to be redrawn everytime the state of the snake and apple change
let drawBorder = () => {
  ctx.fillStyle = 'Black'//color of border
  ctx.fillRect(0, 0, cWidth, bSize)// the top border
  ctx.fillRect(0, cHeight - bSize, cWidth, bSize)// the bottom border
  ctx.fillRect(cWidth - bSize, 0, bSize,cHeight )// the right border
  ctx.fillRect(0, 0, bSize,cHeight )// the left border
}
//D. Score things
//initial score variable
let score = 0;
//drawing the score needs to be a function because it has to be redrawn everytime the state of the snake and apple change
let drawScore = () => {
  ctx.font = "18px Comic Sans MS"; //sets size and font
  ctx.fillStyle = "Blue";
  ctx.fillText('Score = ' + score,2*bSize,3*bSize); //displays score at one box away from the edge of the canvas (reference point is bottome left by default)
}

//Step 2: Create the Game over function
//The game Over function can be anything but its not a loop so we can define it seperatly here
let gameOver = () => {
  clearInterval(gameAnimate); //stops the game loop
  ctx.font = "bold 70px Courier New"; //sets size and font
  ctx.fillStyle = "Red";//color
  ctx.fillWeight = 5;
  ctx.fillText('Game Over',bSize,cHeight/2); //displays score at one box away from the edge of the canvas (reference point is bottome left by default)
}

/*Step 3: Create the object box for the boxes on the grid of the game
This is the box object - since the entire game is based on the grid that we created, each box in the grid should be an object weather it be adding to the snake or drawing the apple
each object has a column and row property (object names are capitalized)
*/

//A. box constructor (we use this when we want to create a box object)
let Box = function (row, column) {//You cannot use arrow notation 
  this.row = row, //dont forget that these nees to be commas, not semicolins!!
  this.column = column; //the last one needs to be a semicolin
}

//B. box drawing method with a color variable to change color depending on what it is (snake)
//These can have semi colins because its a function definition
Box.prototype.drawBox = function (color) { //arrow case does not work here
  let x = this.column*bSize; //number of the column * block size will adjust the location of the box9
  let y = this.row*bSize; //refer to above
  ctx.fillStyle = color; //color based on what the object is peramter for method
  ctx.fillRect(x, y, bSize, bSize);
}

//C. Draw a circle method for the apple
//We should create a circle function so it is easier to draw circles
let circle = (x, y, radius) => {
  ctx.beginPath();//puts pen down
  ctx.arc(x, y, radius, 0, Math.PI * 2, true); //false provides an outline only
  ctx.fill();//draws it and fills in in with a color 
}

//create the method
Box.prototype.drawEllipse = function (color) {//arroe notation does not work here
  let centerX = this.column*bSize + bSize/2; //number of the column * block size will adjust the location of the circle. Add bSize/2 for center.
  let centerY = this.row*bSize + bSize/2; //refer to above
  ctx.fillStyle = color; //color based on what the object is peramter for method
  circle(centerX, centerY, bSize); //true fills the circle
}

//D. Now that we have all our drawing methods we need to set up a method that checks if two things are things to be drawn on the same box (check for apple)
Box.prototype.equals = function (occupied) {
//if the row and column of the object is the same as the row and colum of another object then return true
  return this.column === occupied.column && this.row == occupied.row;
}
 
/*Step 4: CREATE THE SNAKE object (made of box objects)
-position will be an array of box objects called parts
-element 0 of this array will be the head: we use this element to see if it eats an apple or to check for game over
*/

//A: Snake constructor with 3 segments and starting positions
let Snake = function (){
  this.parts = [new Box(7,5),//head
                new Box(6, 5),//middle
                new Box(5,5)];//bottom
  this.direction ="down";//where it is going
  this.next = "down";//where it will go as a result of user input
}

//B: drawing this snake on the canvas
Snake.prototype.drawSnake = function(){
  for(let i = 0; i < this.parts.length; i++){ //for loop iterates through the parts array
    this.parts[i].drawBox("red"); //for each part in the array we have a box object that we can call it's draw method
  }
}

//C: Add a moving method that responds to user input
//moving the snake: add one box to the front and delete one box from the back 
//after the snake has moved check to see if there is a collision with the wall OR the Apple OR itself
//If apple and head is on the same box you get a point 
//if the head and butt is on the same box then game over
//if head and wall is on the same box them game over

Snake.prototype.move = function (){
  let head = this.parts[0]; //save the head element in a variable
  let newHead;//variable for new head position
  this.direction = this.next; //change the direction to the next direction
  //set the direction change algorithm
  if(this.direction === 'right'){
    newHead = new Box(head.row, head.column + 1 );//create a new head to the right (add 1 to the column)
  } else if(this.direction === 'left'){
    newHead = new Box(head.row, head.column -1);//create a new head to the left (subtract 1 to the column)
  } else if(this.direction === 'up'){
    newHead = new Box(head.row - 1, head.column);//new head above(subrtact)
  } else if (this.direction === 'down'){
    newHead = new Box(head.row + 1, head.column);//new head below (add)
  }

  //We need a method of collisions here. If we had one we can check if the head collided with the wall or itself and trigger game over
  if(this.checkCollision(newHead)){
    gameOver();//triggers our game over function
    return; //returns true of false
  } 
    this.parts.unshift(newHead); //add the newHead to our snake
  //console.log(newHead);
  //console.log(apple.position);
  //check if the new head position conflicts with with another box that is occupied(apple)
  if(newHead.equals(apple.position)){// apple has nt been made yet bit looking ahead we can create an apple object with a position property we can use
    score++; //add to the score
    apple.move(); //then move the apple. Looking ahead we can create a method in our apple object  that moves it to a random location
  }else{
    this.parts.pop(); //pop deletes butt keeping it the same size (because if moved without eating the apple)
  }
}

//D: We used a checkCollision method above so we have to define it here
//if the head is in the same location as the tail or if the head is in the same location as the wall we want it to be true
Snake.prototype.checkCollision = function (theHead){
  //set up variables for the entire top (row 0), left(column 0), right (column cWidth - bSize)and bottom(row cHeight - bSize) boundaries
  let collideLeft = (theHead.column === 0); //true if head column and 0 are the same
  let collideTop= (theHead.row === 0); //true if head row and 0 are the same
  let collideRight = (theHead.column === xBoxes-1 );//-1 b/c column/row 1 is column/row 0
  let collideBottom = (theHead.row === yBoxes-1);//see above
  
  //collision checkers
  let wallCollision = collideLeft||collideTop||collideRight||collideBottom; //this variable will be true if any collision happens; false is not
  let selfCollision = false; //start with a false self collision
  
  for(let i = 0; i < this.parts.length; i++){//go throught each part of the snake
    if(theHead.equals(this.parts[i])){//if the head and the part being checked are equal
      selfCollision = true;//flag it
    }
  }
  return wallCollision||selfCollision; //return both
}

/*//E. Setting up the Snake to move with keyboard events ( we need to move this to the end because it uses things that havent been defined)
//Create an object that translates key codes to direction names
let inputs = { //because we wrote into our snake functionality with left right up down we need to translate here with keycodes
  37: "left",
  38: "up",
  39: "right",
  40: "down"
}

//check for the event of pressing a key 
$("body").keydown(function(e){
  let newDirection = inputs[e.keyCode];//setting the new direction to the keycode which corresponds to a translation in our inputs object
  if(newDirection!== undefined){//if the key is pressed
    Snake.setDirection(newDirection);//looking ahead, we need to create a setDirection method for our snake so it can easily set the direction of the snake when a key is pressed
  }
})

*/

/*Set direction method allows us to update the snake's direction with the user input (save in the newDirection variable)
We cannot do this directly because we also have to check for illegal moves
For example: If the snake is moving to the right, it can move up or down
It cannot move left because then it will hit itself and trigger a game over. 
Making this an illegal move is what we want to do so that the user expereice is better
*/

Snake.prototype.setDirection = function (next){
//check opposing directions for illegal moves. Use return to break out of the conditional
    if(this.direction ==='right' && next === 'left'|| this.direction ==='left' && next ==='right'){
        return;
    }else if (this.direction === 'up' && next ==='down' || this.direction ==='down' && next ==='up'){
        return;
    }
  this.next = next;
  //console.log(this.direction);
}

/* NEXT STEP: CREATING THE APPLE OBJECT
The apple object is made of one box object and has a method that allows it to move to a random location on
the board after it has been eaten by the snake

TRY USING NEW CONSTURCTOR SYNTAX!!!
*/

class Apple {
    //create the consturctor here with a random box position set it to some starting value
    constructor(){
        this.position = new Box (20,20);
    }
    //put methods here using normal function name notation
    draw(){//draw method calls the circle method of the box object
    this.position.drawEllipse('Yellow');
    }
  
    move(){ //move method chooses a random row and column for our apple to appear (NT RIGHT)
      let randomColumn = Math.floor(Math.random()*(yBoxes -2)) + 1;
      let randomRow = Math.floor(Math.random()*(xBoxes -2)) + 1;
      this.position = new Box(randomRow, randomColumn);
    }
}

//create the objects here
let apple = new Apple();
let snake = new Snake();

//Animating the game: This line of code creates a game loop that calls various functions
//Game Loop (should be at the end because it uses all functions from above)
let gameAnimate = setInterval ( () => {
  ctx.clearRect(0,0, cWidth, cHeight); //clears the rectangle you created in the canvas object called ctx
  drawScore(); //draws the new current score
  snake.move();//sets the snake to motion
  snake.drawSnake();//draws the snake
  apple.draw();//draws apple in new location
  drawBorder();//drws the border for the game
  console.log(snake.parts[0]);
}, 100);

//E. Setting up the Snake to move with keyboard events ( we need to move this to the end because it uses things that havent been defined where it was orginally positioned in th sequence)
//Create an object that translates key codes to direction names
let inputs = { //because we wrote into our snake functionality with left right up down we need to translate here with keycodes
  37: "left",
  38: "up",
  39: "right",
  40: "down"
}

//check for the event of pressing a key 
$("body").keydown(function(e){
  let next = inputs[e.keyCode];//setting the new direction to the keycode which corresponds to a translation in our inputs object
  if(next!=null){//if the key is pressed
    snake.setDirection(next);//looking ahead, we need to create a setDirection method for our snake so it can easily set the direction of the snake when a key is pressed
  }else {
    return;
  }
})
