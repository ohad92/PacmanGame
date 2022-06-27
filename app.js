let context;
let pacman = new Object();
let pacmanImage;
let board;
let boardsize=20;
let food_remain;
let numOfGhosts;
let ghosts;
let specialFood = new Object();
let hourglass = new Object();
let heart = new Object();
let poison = new Object();

let start_time;
let time_elapsed;
let interval;
let ghostsInterval;
let specialFoodInterval;
let hourglassInterval;
let heartInterval;
let poisonInetrval;

let score;

let loggedinuser;
/* users dictionary*/
let users={"k":"k"};

let up_keycode=38;
let down_keycode=40;
let left_keycode=37;
let right_keycode=39;
let audio = new Audio('pacmanmusic.mp3');

/* function to display other page */
function showPage(display){
	stopgame();
	$('#Welcome').hide();
	$('#Register').hide();
	$('#Login').hide();
	$('#AboutDialog').hide();
	$('#Game').hide();
	$('#Settings').hide();
	$('#' + display).show();
};


/* function to check password strength */
$(function(){
	$.validator.addMethod("checkPassword",function(value,element){
		let number = /([0-9])/;
		let alphabets = /([a-zA-Z])/;
		if ($('#password').val().match(number) && $('#password').val().match(alphabets)){
			return true;}
		return false;
	});
})

/* function to check that username does not contain numbers */
$(function(){
	$.validator.addMethod("checkFullName",function(value,element){
		let number = /([0-9])/;
		if ($('#fullname').val().match(number)){
			return false;}
		return true;
	});
})

/* Login function */
$(function(){
	$.validator.addMethod("LoginCheck",function(value,element){
		let UserName = $('#UserNameLogin').val();
		let password = $('#passwordLogin').val();
		if (UserName in users){
			if (password == users[UserName]){
				return true;
			}
		}
		return false;
	});
})

/* minimum time function */
$(function(){
	$.validator.addMethod("timeforgamerule",function(value,element){
		let timegame = $('#timeforgame').val();
		if (timegame < 60){
			return false;
		}
		return true;
	});
})
	

/* minimum monsters function */
$(function(){
	$.validator.addMethod("monstersamountrule",function(value,element){
		if ($('#monstersamount').val() < 1 || $('#monstersamount').val() > 4){
			return false;
		}
		return true;
	});
})

/* using jQuery to check Register Form */
$(document).ready(function() {

	  //using jQuery validation for forms
	  /* ----Register---- */
	  $("#RegisterForm").validate({
		rules:{
			UserName:{
				required:true,
			},
			password:{
				required:true,
				minlength:6,
				checkPassword:true
			},
			fullname:{
				required:true,
				checkFullName:true
			},
			email:{
				required:true,
				email:true
			},
			birthDate:"required"
		},
		messages:{
			UserName:{
					required:"Please enter user name",
				},
			password:{
					required:"Please enter password",
					minlength:"Password must be at least 6 chars",
					checkPassword:"Password must have at least 1 char and 1 digit",
				},
			fullname:{
				required:"Please enter full name",
				checkFullName:"Full name cannot contain numbers"
			},
			email:{
				required:"Please enter email",
				email:"email isn't valid"
			},
			birthDate:"Please enter birth date"
		},
			submitHandler:function(form,event){
				let UserName=$("#UserName").val();
				let password=$("#password").val();
				let fullname=$("#fullname").val();
				let email=$("#email").val();
				let birthDate=$("#birthDate").val();
				users[UserName]=password;
				form.reset();
				showPage('Welcome');
			},
			
	  });

	  $("#LoginForm").validate({
		rules:{
			UserNameLogin:{
				required:true,
			},
			passwordLogin:{
				required:true,
				LoginCheck:true
			},
		},
		messages:{
			UserNameLogin:{
					required:"Please enter user name",
				},
				passwordLogin:{
					required:"Please enter password",
					LoginCheck:"User Name or password incorrect",
				},
		},
			submitHandler:function(form,event){
				loggedinuser = document.getElementById('UserNameLogin').value;
				form.reset();
				showPage('Settings');
			}
			
	  });

	  $("#SettingsForm").validate({
		rules:{
			timeforgame:{
				timeforgamerule:true,
			},
			monstersamount:{
				monstersamountrule:true
			},
		},
		messages:{
			timeforgame:{
				timeforgamerule:"Minimum time for game is 60 Seconds!",
			},
			monstersamount:{
				monstersamountrule:"you must choose Minimum 1 monster and Maximum 4 monsters!"
			},
		},
			submitHandler:function(form,event){
				startgame();
			}
			
	  });

	  context = canvas.getContext("2d");
	  showPage('Welcome');

});

let arrow_keys_handler = function(e) {
	switch(e.keyCode){
		case 37: case 39: case 38:  case 40: // Arrow keys
		case 32: e.preventDefault(); break; // Space
		default: break; // do not block other keys
	}
};
window.addEventListener("keydown", arrow_keys_handler, false);

function setImages(){
	pacmanImageUp = new Image();
	pacmanImageUp.src = "images/pacman_up.png";

	pacmanImageDown = new Image();
	pacmanImageDown.src = "images/pacman_down.png";

	pacmanImageRight = new Image();
	pacmanImageRight.src = "images/pacman_right.png";

	pacmanImageLeft = new Image();
	pacmanImageLeft.src = "images/pacman_left.png";

	pacmanImage = pacmanImageLeft;

	yellowGhostImage = new Image();
	yellowGhostImage.src = "images/yellow_ghost.png";

	blueGhostImage = new Image();
	blueGhostImage.src = "images/blue_ghost.png";

	greenGhostImage = new Image();
	greenGhostImage.src = "images/green_ghost.png";

	redGhostImage = new Image();
	redGhostImage.src = "images/red_ghost.png";

	bgImage = new Image();
	bgImage.src = "images/whitebacground.png";

	specialFoodImage = new Image();
	specialFoodImage.src = "images/pizza.png";

	hourglassImage = new Image();
	hourglassImage.src = "images/hourglass.png";

	heartImage = new Image();
	heartImage.src = "images/heart.png";

	poisonImage = new Image();
	poisonImage.src = "images/poison.png";
	
}

function Start() {
	setImages();
	board = new Array();
	score = 0;
	start_time = new Date();
	lblGameTimer.value = document.getElementById('timeforgame').value;
	seconds = lblGameTimer.value;
	setBoard();
	setWalls();
	setFood();
	setSpecials()
	numOfGhosts = document.getElementById("monstersamount").value;
	ghosts = new Array(numOfGhosts);
	setGhosts(ghosts);

	emptycell = findRandomEmptyCell(board);
	pacman.row = emptycell[0];
	pacman.col = emptycell[1];
	pacman.lives = 5;

	keysDown = {};
	addEventListener(
		"keydown", //means a key is pressed
		function(e) {
			keysDown[e.keyCode] = true;
			// e.preventDefault();
		},
		false
	);
	addEventListener(
		"keyup", //means nothing is pressed
		function(e) {
			keysDown[e.keyCode] = false;
			// e.preventDefault();
		},
		false
	);

	time();
	interval = setInterval(UpdatePosition, 120);
	ghostsInterval = setInterval(UpdatePositionGhosts, 350);
	specialFoodInterval = setInterval(UpdatePositionSpecialFood, 200);
	hourglassInterval = setInterval(UpdatePositionHourglass, 120);
	heartInterval = setInterval(UpdatePositionHeart, 120);
	poisonInetrval = setInterval(UpdatePositionPoison, 120);
}


function setSpecials(){
	//pizza
	specialFood.row = 9;
	specialFood.col = 9;
	specialFood.show = true;
	//hourglass
	emptycell = findRandomEmptyCell(board);
	hourglass.row = emptycell[0];
	hourglass.col = emptycell[1];
	board[hourglass.row][hourglass.col] = 6;
	hourglass.show = true;
	hourglass.time = new Date();
	hourglass.eaten = 0;
	//heart
	emptycell = findRandomEmptyCell(board);
	heart.row = emptycell[0];
	heart.col = emptycell[1];
	board[heart.row][heart.col] = 7;
	heart.show = true;
	heart.time = new Date();
	//poison
	emptycell = findRandomEmptyCell(board);
	poison.row = emptycell[0];
	poison.col = emptycell[1];
	board[poison.row][poison.col] = 8;
	poison.show = true;
	poison.time = new Date();
}


function setFood(){
	let numofballs = document.getElementById("ballsamountset").value;
	let numofballs5 = Math.floor(0.6 * numofballs);
	let numofballs15 = Math.floor(0.3 * numofballs);
	let numofballs25 = numofballs - numofballs15 - numofballs5;

	let k;
	let l;
	let emptycell;
	while (numofballs5 != 0){
		emptycell = findRandomEmptyCell(board);
		k = emptycell[0];
		l = emptycell[1];
		board[k][l] = 2;
		numofballs5--;
	}
	while (numofballs15 != 0){
		emptycell = findRandomEmptyCell(board);
		k = emptycell[0];
		l = emptycell[1];
		board[k][l] = 3;
		numofballs15--;
	}
	while (numofballs25 != 0){
		emptycell = findRandomEmptyCell(board);
		k = emptycell[0];
		l = emptycell[1];
		board[k][l] = 5;
		numofballs25--;
	}
}


function setBoard(){
	for (let i = 0; i < boardsize; i++) {
		board[i] = new Array();
		for (let j = 0; j < boardsize; j++) {
			board[i][j] = 0;
		}
	}
}

function setWalls(){
	for(let a = 0; a < boardsize; a++) {
		for(let b = 0; b < boardsize; b++) {
			if(a == 0 || a == boardsize - 1 || b == 0 || b == boardsize - 1) {
				board[a][b] = 4;
			}
		}	
	}
	//first left block
	board[2][2]=4;
	board[2][3]=4;
	board[3][2]=4;
	board[3][3]=4;
	board[4][2]=4;
	board[4][3]=4;
	//second left block
	board[2][5]=4;
	board[2][6]=4;
	board[3][5]=4;
	board[3][6]=4;
	board[4][5]=4;
	board[4][6]=4;
	//first left wall
	board[1][8]=4;
	board[2][8]=4;
	//board[3][8]=4;
	board[4][8]=4;
	board[5][8]=4;
	board[6][8]=4;
	//first right block
	board[17][2]=4;
	board[16][3]=4;
	board[15][2]=4;
	board[17][3]=4;
	board[16][2]=4;
	board[15][3]=4;
	//second right block
	board[17][5]=4;
	board[16][6]=4;
	board[15][5]=4;
	board[17][6]=4;
	board[16][5]=4;
	board[15][6]=4;
	//first right wall
	board[18][8]=4;
	board[17][8]=4;
	board[15][8]=4;
	board[14][8]=4;
	board[13][8]=4;
	//top wall
	board[8][2]=4;
	board[9][2]=4;
	board[10][2]=4;
	board[11][2]=4;
	//top left "L"
	board[6][2]=4;
	board[6][3]=4;
	board[6][4]=4;
	board[7][4]=4;
	board[8][4]=4;
	//top right "L"
	board[11][4]=4;
	board[12][4]=4;
	board[13][4]=4;
	board[13][3]=4;
	board[13][2]=4;
	//top teeth
	board[6][6]=4;
	board[7][6]=4;
	board[8][6]=4;
	board[11][6]=4;
	board[12][6]=4;
	board[13][6]=4;
	board[8][7]=4;
	board[8][8]=4;
	board[11][7]=4;
	board[11][8]=4;
	//second right wall
	board[18][10]=4;
	board[17][10]=4;
	board[15][10]=4;
	board[14][10]=4;
	board[13][10]=4;
	//second left wall
	board[1][10]=4;
	board[2][10]=4;
	//board[3][10]=4;
	board[4][10]=4;
	board[5][10]=4;
	board[6][10]=4;
	//middle wall
	board[8][10]=4;
	board[9][10]=4;
	board[10][10]=4;
	board[11][10]=4;
	//top left plus
	board[7][12]=4;
	board[7][13]=4;
	board[6][13]=4;
	board[8][13]=4;
	//top right plus
	board[12][12]=4;
	board[12][13]=4;
	board[11][13]=4;
	board[13][13]=4;
	//top left "r"
	board[2][12]=4;
	board[3][12]=4;
	board[4][12]=4;
	board[2][13]=4;
	board[2][14]=4;
	//top right "r"
	board[17][12]=4;
	board[16][12]=4;
	board[15][12]=4;
	board[17][13]=4;
	board[17][14]=4;
	//third right block
	board[16][17]=4;
	board[17][16]=4;
	board[16][16]=4;
	board[17][17]=4;
	//third left block
	board[3][17]=4;
	board[2][16]=4;
	board[3][16]=4;
	board[2][17]=4;
	//left dot
	board[4][14]=4;
	//right dot
	board[15][14]=4;
	//bottom left wall
	board[5][18]=4;
	board[5][17]=4;
	//bottom right wall
	board[14][18]=4;
	board[14][17]=4;
	//bottom wall
	board[9][17]=4;
	board[10][17]=4;
	//bottom left plus
	board[7][16]=4;
	board[7][15]=4;
	board[6][15]=4;
	board[8][15]=4;
	//bottom right plus
	board[12][16]=4;
	board[12][15]=4;
	board[11][15]=4;
	board[13][15]=4;
    //side to side tunel
    board[0][9]=0
	board[19][9]=0
}

function setGhosts(ghosts){
	//first ghost
	ghosts[0] = new Object();
	ghosts[0].row = 1;
	ghosts[0].col = 1;
	//second ghost
	if (numOfGhosts >= 2){
		ghosts[1] = new Object();
		ghosts[1].row = boardsize - 2;
		ghosts[1].col = boardsize - 2;
	}
	//third ghost
	if (numOfGhosts >= 3){
		ghosts[2] = new Object();
		ghosts[2].row = 1;
		ghosts[2].col = boardsize - 2;
	}
	//fourth ghost
	if (numOfGhosts >= 4){
		ghosts[3] = new Object();
		ghosts[3].row = boardsize - 2;
		ghosts[3].col = 1;
	}
}

function findRandomEmptyCell(board) {
	let i = Math.floor(Math.random() * (boardsize - 1) + 1);
	let j = Math.floor(Math.random() * (boardsize - 1) + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * (boardsize - 1) + 1);
		j = Math.floor(Math.random() * (boardsize - 1) + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[up_keycode]) {
		return 1;
	}
	if (keysDown[down_keycode]) {
		return 2;
	}
	if (keysDown[left_keycode]) {
		return 3;
	}
	if (keysDown[right_keycode]) {
		return 4;
	}
}
function Draw() {
	canvas.width = canvas.width; //clean board
	context.drawImage(bgImage, 10, 10);
	lblScore.value = score;
	lblLives.value = pacman.lives;
	for (let i = 0; i < boardsize; i++) {
		for (let j = 0; j < boardsize; j++) {
			let center = new Object();
			center.x = i * 30+10;
			center.y = j * 30+10;
			if (board[i][j] == 1) {  //packman
				context.drawImage(pacmanImage, center.x, center.y);
			}
			else if (specialFood.row == i && specialFood.col == j && specialFood.show){ //special food
				context.drawImage(specialFoodImage, center.x, center.y);
			}
			else if (board[i][j] == 4) {   //wall
				context.beginPath();
				context.rect(center.x, center.y, 30, 30);
				context.fillStyle = "black"; //color
				context.fill();
			}
			else if (ghosts[0].row == i && ghosts[0].col == j){
				context.drawImage(yellowGhostImage, center.x, center.y);
			} 
			else if (numOfGhosts >= 2 && ghosts[1].row == i && ghosts[1].col == j){
				context.drawImage(blueGhostImage, center.x, center.y);
			} 
			else if (numOfGhosts >= 3 && ghosts[2].row == i && ghosts[2].col == j){ 
				context.drawImage(greenGhostImage, center.x, center.y);
			} 
			else if (numOfGhosts >= 4 && ghosts[3].row == i && ghosts[3].col == j){ 
				context.drawImage(redGhostImage, center.x, center.y);
			} 
			else if (board[i][j] == 2) {  //food 5 points
				context.beginPath();
				context.arc(center.x+13, center.y+13, 13, 0, 2 * Math.PI); // circle
				context.fillStyle = document.getElementById("ballcolor5").value; //color
				context.fill();
			}
			else if (board[i][j] == 3) {  //food 15 points
				context.beginPath();
				context.arc(center.x+13, center.y+13, 8, 0, 2 * Math.PI); // circle
				context.fillStyle = document.getElementById("ballcolor15").value; //color
				context.fill();
			}
			else if (board[i][j] == 5) {  //food 25 points
				context.beginPath();
				context.arc(center.x+13, center.y+13, 4, 0, 2 * Math.PI); // circle
				context.fillStyle = document.getElementById("ballcolor25").value; //color
				context.fill();
			}
			else if (board[i][j] == 6 && hourglass.show){ //hourglass
				context.drawImage(hourglassImage, center.x, center.y);
			}
			else if (board[i][j] == 7 && heart.show){ //heart
				context.drawImage(heartImage, center.x, center.y);
			}
			else if (board[i][j] == 8 && poison.show){ //poison
				context.drawImage(poisonImage, center.x, center.y);
			}
		}
	}

}

function getPossibleMoves(row, col){
	let possibleDirections = new Array();
	if (col > 0 && board[row][col - 1] != 4) {
		possibleDirections.push('up');
	}
	if (col < boardsize-1 && board[row][col + 1] != 4) {
		possibleDirections.push('down');
	}
	if (row > 0 && board[row - 1][col] != 4) {
		possibleDirections.push('left');
	}
	if (row < boardsize-1 && board[row + 1][col] != 4) {
		possibleDirections.push('right');
	}
	return possibleDirections;
}

function UpdatePosition() {
	board[pacman.row][pacman.col] = 0;
	let possibleDirections = getPossibleMoves(pacman.row,pacman.col);
	let x = GetKeyPressed();
	if (x == 1 && possibleDirections.includes('up')) {//up
		pacmanImage = pacmanImageUp;
		pacman.col--;
	}
	if (x == 2 && possibleDirections.includes('down')) {//down
		pacmanImage = pacmanImageDown;
		pacman.col++;
	}
	if (x == 3) {//left
		if (possibleDirections.includes('left')){
			pacmanImage = pacmanImageLeft;
			pacman.row--;
		}
		//tunel
		else if (pacman.row == 0 && pacman.col == 9){
			pacmanImage = pacmanImageLeft;
			pacman.row = 19;
		}
	}
	if (x == 4) {//right
		if (possibleDirections.includes('right')){
			pacmanImage = pacmanImageRight;
			pacman.row++;
		}
		//tunel
		else if (pacman.row == 19 && pacman.col == 9){
			pacmanImage = pacmanImageRight;
			pacman.row = 0;
		}
	}
	if (board[pacman.row][pacman.col] == 2) {
		score+=5;
	}
	if (board[pacman.row][pacman.col] == 3) {
		score+=15;
	}
	if (board[pacman.row][pacman.col] == 5) {
		score+=25;
	}
	if (specialFood.row == pacman.row && specialFood.col == pacman.col && specialFood.show){
		score+=50;
		specialFood.show = false;
	}

	if (hourglass.row == pacman.row && hourglass.col == pacman.col && hourglass.show){
		hourglass.eaten += 1;
		hourglass.show = false;
		hourglass.time = new Date();

	}
	if (heart.row == pacman.row && heart.col == pacman.col && heart.show){
		heart.show = false;
		heart.time = new Date();
		if (pacman.lives < 5){
			pacman.lives++;
		}
	}
	if (poison.row == pacman.row && poison.col == pacman.col && poison.show){
		poison.show = false;
		poison.time = new Date();
		pacman.lives--;
		if (pacman.lives == 0) {
			GameOver();
		}
	}
	pacmanCaught();
	board[pacman.row][pacman.col] = 1;
	Draw();
	
}

function pacmanCaught(){
	for (let i = 0; i < numOfGhosts; i++){
		if (ghosts[i].row == pacman.row && ghosts[i].col == pacman.col){
			score -= 10;
			pacman.lives--;
			if (pacman.lives == 0) {
				GameOver();
			}
			else{
				resetGhosts();
				emptycell = findRandomEmptyCell(board);
				pacman.row = emptycell[0];
				pacman.col = emptycell[1];
			}
		}
	}
	return false;
}

function GameOver(){
	stopgame();
	if (pacman.lives <= 0) {
		window.alert("Loser!");
	}
	else if (score > 100){
		window.alert("Winner!!!");
	}
	else if (score <= 100){
		window.alert("You are better than " + score + " points!");
	}
}

function resetGhosts(){
	for (let i = 0; i < numOfGhosts; i++){
		if (i == 0){
			ghosts[i].row = 1;
			ghosts[i].col = 1;
		}
		if (i == 1){
			ghosts[i].row = boardsize - 2;
			ghosts[i].col = boardsize - 2;
		}
		if (i == 2){
			ghosts[i].row = 1;
			ghosts[i].col = boardsize - 2;
		}
		if (i == 3){
			ghosts[i].row = boardsize - 2;
			ghosts[i].col = 1;
		}
	}
}

function UpdatePositionGhosts(){
	let direction;
	for (let i = 0; i < numOfGhosts; i++){
		direction = BestMoveForGhost(ghosts[i]);
		//checking direction
		if (direction == "up"){
			ghosts[i].col--;
		}
		if (direction == "down"){
			ghosts[i].col++;
		}
		if (direction == "left"){
			ghosts[i].row--;
		}
		if (direction == "right"){
			ghosts[i].row++;
		}
	}
}


function BestMoveForGhost(ghost){
	let moveUp;
	let moveDown;
	let moveLeft;
	let moveRight;
	let temp;//for calculations
	let distance = Math.abs(ghost.col - pacman.col) + Math.abs(ghost.row - pacman.row);
	// let distance = Math.sqrt(Math.pow(ghost.col - pacman.col, 2) + Math.pow(ghost.row - pacman.row, 2));
	let possibleDirectionsOfGhost = getPossibleMoves(ghost.row, ghost.col);
	
	//random direction
	let rand = Math.random();
	if (rand > 0.9){
		return possibleDirectionsOfGhost[Math.floor(Math.random() * possibleDirectionsOfGhost.length)];
	}

	let betterDirections = {};
	let i;
	for (i = 0; i < possibleDirectionsOfGhost.length; i++){
		if (possibleDirectionsOfGhost[i] == "up"){
			temp = ghost.col;
			temp--;
			moveUp = Math.abs(temp - pacman.col) + Math.abs(ghost.row - pacman.row);
			// moveUp = Math.sqrt(Math.pow(temp - pacman.col, 2) + Math.pow(ghost.row - pacman.row, 2));
			if (distance > moveUp){
				betterDirections["up"] = moveUp;
			}
		}
		if (possibleDirectionsOfGhost[i] == "down"){
			temp = ghost.col;
			temp++;
			moveDown = Math.abs(temp - pacman.col) + Math.abs(ghost.row - pacman.row); 
			// moveDown = Math.sqrt(Math.pow(temp - pacman.col, 2) + Math.pow(ghost.row - pacman.row, 2));
			if (distance > moveDown){
				betterDirections["down"] = moveDown;
			}
		}
		if (possibleDirectionsOfGhost[i] == "left"){
			temp = ghost.row;
			temp--;
			moveLeft = Math.abs(ghost.col - pacman.col) + Math.abs(temp - pacman.row);
			// moveLeft = Math.sqrt(Math.pow(ghost.col  - pacman.col, 2) + Math.pow(temp - pacman.row, 2));
			if (distance > moveLeft){
				betterDirections["left"] = moveLeft;
			} 
		}
		if (possibleDirectionsOfGhost[i] == "right"){
			temp = ghost.row;
			temp++;
			moveRight = Math.abs(ghost.col - pacman.col) + Math.abs(temp - pacman.row); 
			// moveRight = Math.sqrt(Math.pow(ghost.col  - pacman.col, 2) + Math.pow(temp - pacman.row, 2));
			if (distance > moveRight){
				betterDirections["right"] = moveRight;
			}
		}
	}

	let bestMove;
	let direction;
	//can get closer
	if (Object.keys(betterDirections).length > 0){
		direction = Object.keys(betterDirections)[Math.floor(Math.random() * Object.keys(betterDirections).length)];
		bestMove = betterDirections[direction];
		for (let key in betterDirections){
			if (bestMove > betterDirections[key]){
				bestMove = betterDirections[key]
				direction = key;
			}
		}
		return direction;
	}

	//can get closer with movement of pacman
	let possibleDirectionsOfPacman = getPossibleMoves(pacman.row, pacman.col);
	let temp2;
	for (i = 0; i < possibleDirectionsOfGhost.length; i++){
		if (possibleDirectionsOfGhost[i] == "up"){
			temp = ghost.col;
			temp--;
		}
		if (possibleDirectionsOfGhost[i] == "down"){
			temp = ghost.col;
			temp++;
		}
		if (possibleDirectionsOfGhost[i] == "left"){
			temp = ghost.row;
			temp--;
		}
		if (possibleDirectionsOfGhost[i] == "right"){
			temp = ghost.row;
			temp++;
		}
		for (let j = 0; j < possibleDirectionsOfPacman.length; j++){
			if (possibleDirectionsOfPacman[i] == "up"){
				temp2 = pacman.col;
				temp2--;
				moveUp = Math.abs(temp - temp2) + Math.abs(ghost.row - pacman.row);
				// moveUp = Math.sqrt(Math.pow(temp - temp2, 2) + Math.pow(ghost.row - pacman.row, 2));
				if (distance > moveUp){
					betterDirections["up"] = moveUp;
				}
			}
			if (possibleDirectionsOfPacman[i] == "down"){
				temp2 = pacman.col;
				temp2++;
				moveDown = Math.abs(temp - temp2) + Math.abs(ghost.row - pacman.row); 
				// moveDown = Math.sqrt(Math.pow(temp - temp2, 2) + Math.pow(ghost.row - pacman.row, 2));
				if (distance > moveDown){
					betterDirections["down"] = moveDown;
				}
			}
			if (possibleDirectionsOfPacman[i] == "left"){
				temp2 = pacman.row;
				temp2--;
				moveLeft = Math.abs(ghost.col - pacman.col) + Math.abs(temp - temp2);
				// moveLeft = Math.sqrt(Math.pow(ghost.col  - pacman.col, 2) + Math.pow(temp - temp2, 2));
				if (distance > moveLeft){
					betterDirections["left"] = moveLeft;
				} 
			}
			if (possibleDirectionsOfPacman[i] == "right"){
				temp2 = pacman.row;
				temp2++;
				moveRight = Math.abs(ghost.col - pacman.col) + Math.abs(temp - temp2); 
				// moveRight = Math.sqrt(Math.pow(ghost.col  - pacman.col, 2) + Math.pow(temp - temp2, 2));
				if (distance > moveRight){
					betterDirections["right"] = moveRight;
				}
			}
		}
	}

	if (Object.keys(betterDirections).length > 0){
		direction = Object.keys(betterDirections)[0];
		bestMove = betterDirections[direction];
		for (let key in betterDirections){
			if (bestMove > betterDirections[key]){
				bestMove = betterDirections[key]
				direction = key;
			}
		}
		return direction;
	}

	//random direction
	return possibleDirectionsOfGhost[Math.floor(Math.random() * possibleDirectionsOfGhost.length)];

}
function UpdatePositionSpecialFood(){
	if (specialFood.show){
		let possibleDirections = getPossibleMoves(specialFood.row, specialFood.col);
		let direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
		if (direction == "up"){
			specialFood.col--;
		}
		if (direction == "down"){
			specialFood.col++;
		}
		if (direction == "left"){
			specialFood.row--;
		}
		if (direction == "right"){
			specialFood.row++;
		}
	}
}


function UpdatePositionHourglass(){
	let timecheck = new Date();
	if ((timecheck.getTime() - hourglass.time.getTime()) / 1000 > 5){
		if (hourglass.show){
			board[hourglass.row][hourglass.col] = 0;
		}
		if (score < 500){
			emptycell = findRandomEmptyCell(board);
			hourglass.row = emptycell[0];
			hourglass.col = emptycell[1];
			board[hourglass.row][hourglass.col] = 6;
			hourglass.show = true;
			hourglass.time = timecheck;
		}
	}
}

function UpdatePositionHeart(){
	let timecheck = new Date();
	if ((timecheck.getTime() - heart.time.getTime()) / 1000 > 5){
		if (heart.show){
			board[heart.row][heart.col] = 0;
		}
		emptycell = findRandomEmptyCell(board);
		heart.row = emptycell[0];
		heart.col = emptycell[1];
		board[heart.row][heart.col] = 7;
		heart.show = true;
		heart.time = timecheck;
	}
}

function UpdatePositionPoison(){
	let timecheck = new Date();
	if ((timecheck.getTime() - poison.time.getTime()) / 1000 > 5){
		if (poison.show){
			board[poison.row][poison.col] = 0;
		}
		emptycell = findRandomEmptyCell(board);
		poison.row = emptycell[0];
		poison.col = emptycell[1];
		board[poison.row][poison.col] = 8;
		poison.show = true;
		poison.time = timecheck;
	}
}


// menu Toggleable Tabs
function menuToggleable(evt, Tab) {
	let i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
	  tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
	  tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(Tab).style.display = "block";
	evt.currentTarget.className += " active";
  }


  // functions for the keycode settings
  function displayKeyCode(evt,data)
  {
	var textBox;
	if (data === "up"){
		textBox = getObject('up');
		up_keycode=(evt.which) ? evt.which : event.keyCode
	}
	if (data === "down"){
		textBox = getObject('down');
		down_keycode=(evt.which) ? evt.which : event.keyCode
	}	
	if (data === "left"){
		textBox = getObject('left');
		left_keycode=(evt.which) ? evt.which : event.keyCode
	}
	if (data === "right"){
		textBox = getObject('right');
		right_keycode=(evt.which) ? evt.which : event.keyCode
	}	
	var charCode = (evt.which) ? evt.which : event.keyCode
	textBox.value = String.fromCharCode(charCode);
	if (charCode == 8) textBox.value = "backspace"; //  backspace
	if (charCode == 9) textBox.value = "tab"; //  tab
	if (charCode == 13) textBox.value = "enter"; //  enter
	if (charCode == 16) textBox.value = "shift"; //  shift
	if (charCode == 17) textBox.value = "ctrl"; //  ctrl
	if (charCode == 18) textBox.value = "alt"; //  alt
	if (charCode == 19) textBox.value = "pause/break"; //  pause/break
	if (charCode == 20) textBox.value = "caps lock"; //  caps lock
	if (charCode == 27) textBox.value = "escape"; //  escape
	if (charCode == 33) textBox.value = "page up"; // page up, to avoid displaying alternate character and confusing people	         
	if (charCode == 34) textBox.value = "page down"; // page down
	if (charCode == 35) textBox.value = "end"; // end
	if (charCode == 36) textBox.value = "home"; // home
	if (charCode == 37) textBox.value = "left arrow"; // left arrow
	if (charCode == 38) textBox.value = "up arrow"; // up arrow
	if (charCode == 39) textBox.value = "right arrow"; // right arrow
	if (charCode == 40) textBox.value = "down arrow"; // down arrow
	if (charCode == 45) textBox.value = "insert"; // insert
	if (charCode == 46) textBox.value = "delete"; // delete
	if (charCode == 91) textBox.value = "left window"; // left window
	if (charCode == 92) textBox.value = "right window"; // right window
	if (charCode == 93) textBox.value = "select key"; // select key
	if (charCode == 96) textBox.value = "numpad 0"; // numpad 0
	if (charCode == 97) textBox.value = "numpad 1"; // numpad 1
	if (charCode == 98) textBox.value = "numpad 2"; // numpad 2
	if (charCode == 99) textBox.value = "numpad 3"; // numpad 3
	if (charCode == 100) textBox.value = "numpad 4"; // numpad 4
	if (charCode == 101) textBox.value = "numpad 5"; // numpad 5
	if (charCode == 102) textBox.value = "numpad 6"; // numpad 6
	if (charCode == 103) textBox.value = "numpad 7"; // numpad 7
	if (charCode == 104) textBox.value = "numpad 8"; // numpad 8
	if (charCode == 105) textBox.value = "numpad 9"; // numpad 9
	if (charCode == 106) textBox.value = "multiply"; // multiply
	if (charCode == 107) textBox.value = "add"; // add
	if (charCode == 109) textBox.value = "subtract"; // subtract
	if (charCode == 110) textBox.value = "decimal point"; // decimal point
	if (charCode == 111) textBox.value = "divide"; // divide
	if (charCode == 112) textBox.value = "F1"; // F1
	if (charCode == 113) textBox.value = "F2"; // F2
	if (charCode == 114) textBox.value = "F3"; // F3
	if (charCode == 115) textBox.value = "F4"; // F4
	if (charCode == 116) textBox.value = "F5"; // F5
	if (charCode == 117) textBox.value = "F6"; // F6
	if (charCode == 118) textBox.value = "F7"; // F7
	if (charCode == 119) textBox.value = "F8"; // F8
	if (charCode == 120) textBox.value = "F9"; // F9
	if (charCode == 121) textBox.value = "F10"; // F10
	if (charCode == 122) textBox.value = "F11"; // F11
	if (charCode == 123) textBox.value = "F12"; // F12
	if (charCode == 144) textBox.value = "num lock"; // num lock
	if (charCode == 145) textBox.value = "scroll lock"; // scroll lock
	if (charCode == 186) textBox.value = ";"; // semi-colon
	if (charCode == 187) textBox.value = "="; // equal-sign
	if (charCode == 188) textBox.value = ","; // comma
	if (charCode == 189) textBox.value = "-"; // dash
	if (charCode == 190) textBox.value = "."; // period
	if (charCode == 191) textBox.value = "/"; // forward slash
	if (charCode == 192) textBox.value = "`"; // grave accent
	if (charCode == 219) textBox.value = "["; // open bracket
	if (charCode == 220) textBox.value = "\\"; // back slash
	if (charCode == 221) textBox.value = "]"; // close bracket
	if (charCode == 222) textBox.value = "'"; // single quote
	var lblCharCode = getObject('spnCode');
	lblCharCode.innerHTML = 'KeyCode:  ' + charCode;
	return false;
}
	function getObject(obj)
	{
		var theObj;
		if (document.all) {
			if (typeof obj=='string') {
				return document.all(obj);
			} 
			else {
			return obj.style;
			}
		}
		if (document.getElementById) {
			if (typeof obj=='string') {
				return document.getElementById(obj);
			} 	
			else {
				return obj.style;
			}
		}
	return null;
  }


  //function to show balls amount in settings menu
  function ballsamount(val) {
	document.getElementById('balls_amount').value = val;
	food_remain = document.getElementById('balls_amount').value;
}

//function for balls color:
let ballcolor5;
let ballcolor15;
let ballcolor25;
function foodcolors(val){
	if (val == "5"){
		ballcolor5 = document.getElementById('ballcolor5').value;
	}
	if (val == "15"){
		ballcolor15 = document.getElementById('ballcolor15').value;
	}
	if (val == "25"){
		ballcolor25 = document.getElementById('ballcolor25').value;
	}
}

// function for random settings
function selectrandomsettings(){
	$("#up").val("up arrow");
	$("#down").val("down arrow");
	$("#left").val("left arrow");
	$("#right").val("right arrow");
	$("#ballsamountset").val(Math.floor(Math.random() * (Math.floor(90) - Math.floor(50)) + Math.floor(50)));
	$("#balls_amount").val(Math.floor(Math.random() * (Math.floor(90) - Math.floor(50)) + Math.floor(50)));
	$("#ballcolor5").val('#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6));
	$("#ballcolor15").val('#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6));
	$("#ballcolor25").val('#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6));
	$("#timeforgame").val(Math.floor(Math.random() * (Math.floor(120) - Math.floor(60)) + Math.floor(60))); //time betweein 60-120 sec
	$("#monstersamount").val(Math.floor(Math.random()*4)+1);
}


function startgame(){
	showPage('Game');
	audio.play();
	showsettingsingame();
	Start();
}

function startnewgame(){
	stopgame();
	showPage('Settings');
}

function startmusic(){
	audio.play();
}
function stopmusic(){
	audio.pause();
}

function stopgame(){
	audio.pause();
	window.clearInterval(x);
	window.clearInterval(interval);
	window.clearInterval(ghostsInterval);
	window.clearInterval(specialFoodInterval);
	window.clearInterval(hourglassInterval);
	window.clearInterval(heartInterval);
	window.clearInterval(poisonInetrval);
}

let timer;
let x;
let now;
let seconds;
let countDownDate;

function time(){
	timer = document.getElementById('timeforgame').value;
	countDownDate = new Date(start_time.getTime() + ((timer+6) * 100));
	// Update the count down every 1 second
	x = setInterval(function() {

	// Get today's date and time
	now = new Date().getTime();
	let addedTime = hourglass.eaten * 10;
	// Find the distance between now and the count down date
	seconds = Math.floor((countDownDate - now) / 1000) + addedTime;
	// Output the result in an element with id="demo"
	lblGameTimer.value = seconds;

	// If the count down is over, write some text 
	if (seconds <= 0) {
		GameOver();
	}
	}, 1000);
}


function showsettingsingame(){
	$("#valueUP").val(document.getElementById('up').value);
	$("#valueDOWN").val(document.getElementById('down').value);
	$("#valueLEFT").val(document.getElementById('left').value);
	$("#valueRIGHT").val(document.getElementById('right').value);

	$("#valueBalls").val(document.getElementById('balls_amount').value);
	$("#valuecolor5Balls").val(document.getElementById('ballcolor5').value);
	$("#valuecolor15Balls").val(document.getElementById('ballcolor15').value);
	$("#valuecolor25Balls").val(document.getElementById('ballcolor25').value);

	$("#valueTIME").val(document.getElementById('timeforgame').value);
	$("#valueMONSTERS").val(document.getElementById('monstersamount').value);

	$("#valueUSERNAME").val(loggedinuser);

}

function AboutDialogFunction() { 
	let modal = document.getElementById("AboutDialog");
	modal.style.display = "block";
	document.getElementById("AboutDialog").showModal(); 
	window.onclick = function (event) {
		if (event.target === modal) {
			document.getElementById("AboutDialog").close(); 
			modal.style.display = "none";
		}
	};
	

} 

function AboutDialogFunction2() { 
	let modal = document.getElementById("AboutDialog");
	document.getElementById("AboutDialog").close(); 
	modal.style.display = "none";

}