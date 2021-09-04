var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var game_score;
var lives;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var overCanyon;
var isFound;
var clouds;
var mountains;
var collectables;
var trees_x;
var canyons;
var flagpole;
var jumpSound;
var flagSound;
var platforms;
var jumpLimit;
var onPlat;
var enemies;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jumpman.wav');
    jumpSound.setVolume(0.25);
    collectSound = loadSound('assets/bonus.wav');
    collectSound.setVolume(0.1);
    fallingManSound = loadSound('assets/falling.wav')
    fallingManSound.setVolume(0.1);
    backgroundSound = loadSound('assets/blue-bird.mp3')
    backgroundSound.setVolume(0.03);
    successSound = loadSound('assets/game-success.wav')
    successSound.setVolume(0.1);
    failureSound = loadSound('assets/game-over.wav')
    failureSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives = 3;
	startGame();
}

function draw()
{
	background(210, 210, 230); // fill the sky blue

	noStroke();
	fill(113, 159, 114);
	rect(0, floorPos_y, width, height/4); // draw some green ground

	push();
	translate(scrollPos,0);
	// Draw clouds.
	for(var i = 0; i < cloud.length; i++)
	{
		drawCloud(i)
	}
	// Draw mountains.
	for(var i = 0;i < mountains.length; i++)
	{
		drawMountain(i)
	}
	// Draw trees.
	for(var i = 0; i < trees_x.length; i++)
	{
		drawTree(i)
	}
	// Draw canyons.
	for(var i = 0; i < canyons.length; i++)
	{
		checkCanyon(i)
		drawCanyon(i)
	}
	
	// Draw collectables items.
	for(var i = 0; i < collectables.length; i++)
	{
		
		if (!(collectables[i].isFound))
		{	
			checkcollectables(i)
			drawcollectables(i)
		}
	}

	//draw platforms
	for(var i = 0; i < platforms.length; i++)
	{
		platforms[i].draw();
	}

	//draw flag
	renderFlagpole(flagpole);

	//enemies Drawing
	for(var i = 0; i < enemies.length; i++)
	{
		enemies[i].draw();
		var enemyContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
		if (enemyContact)
		{
			if (lives > 0)
			{
				lives -= 1;
				startGame();
				break;
			}
		}
	}
	
	pop();
	// Draw game character.
	drawGameChar();

	//score drawing
	stroke(20);
	strokeWeight(2);
	fill(255,255,0);
	textSize(30);
	text("Coins in your pocket: " + game_score + "$", 400 , 50)
	noStroke();

	for (var i = 0; i < lives; i++)
	{
		drawheart(i*70)
	}
	drawheart(0);

	//game over
	if (lives < 1)
	{
		fill(0);
		textSize(40);
		text("Game over, you got broke! \n Press space to continue",
		250 , 250)
        if (flagSound == 1)
        {
            failureSound.play();
            backgroundSound.stop();
            flagSound = 0;
        }
		return;
	}
	// success!
	if (flagpole.isReached && flagpole.flag_y == 457)
	{
		if(game_score == 2)
		{
			fill(0);
			textSize(40);
			text("Well done, level complete \nand you got all the coins. \nPress space to continue.",
			250,250);
			return;
		}
		else
		{
			fill(0);
			textSize(40);
			text("Well done, level complete. \nPress space to continue.",
			250,250);
			return;
		}
	}
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
	for(var i = 0; i < platforms.length; i++)
    {
        if (platforms[i].checkContact(gameChar_world_x, gameChar_y))
        {
            onPlat = true;
			console.log(onPlat);
            jumpLimit = floorPos_y - platforms[i].y;
        }
		else
		{
			onPlat = false;
		}
    }

    if (isPlummeting) //jump
    {
        gameChar_y -= 10
        if (gameChar_y <= (floorPos_y -150 - jumpLimit) && onPlat == false)
        {
            isPlummeting = false;
        }        
    }
    if (overCanyon == true) //over canyon check
    {
        isPlummeting == true
        gameChar_y += 5      
    }
    if (gameChar_y != floorPos_y || overCanyon == true) //falling state
    {
        isFalling = true;
    }
    if (gameChar_y == floorPos_y) // reseting jumplimit
    {
        jumpLimit = 0;
    }

    if((gameChar_y == floorPos_y && overCanyon == false) || onPlat == true) // standing on ground
    {
        isFalling = false;
    }

    if ((isPlummeting == false && gameChar_y < floorPos_y && isFalling == true)
        || overCanyon == true || gameChar_y > floorPos_y) //is falling
    {
        if (onPlat == false)
        {
            isPlummeting == true
            gameChar_y += 5      
        }
		else
		{
			console.log("onPlat falling")
			isFalling  = false;
		}
    }
	
	
	// check flah reached
	if (!(flagpole.isReached))
	{
		checkFlagpole();
	}

	// player diying check
	checkPlayerDie();
		
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}
// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
	for(var i = 0; i < platforms.length; i++)
	{
		if (platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
		{
			onPlat = true;
		}
	}
	if ( keyCode == 37) //turn left
	{
		isLeft = true;
	}
	else if ( keyCode == 39) //turn right
	{
		isRight = true;
	}
	else if (keyCode == 32 && (gameChar_y == floorPos_y || onPlat == true)) //jump
	{
		isPlummeting = true;
        jumpSound.play();
	}
}

function keyReleased()
{
	if ( keyCode == 37)
	{
		isLeft = false;
	}
	else if ( keyCode == 39)
	{
		isRight = false;
	}
	else if (keyCode == 32)
	{
		isPlummeting = false;
	}
}
// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar()
{
	// draw game character
	if(isLeft && isFalling)
	{
		// jumping-left code
	fill(255,204,142);
	ellipse(gameChar_x,gameChar_y-63,23);
	fill(0)
	rect(gameChar_x - 13, gameChar_y - 73, 25,5)//hat 
	rect(gameChar_x - 9, gameChar_y - 78, 17,8)
	ellipse(gameChar_x - 4,gameChar_y-63,3)// eyes
	ellipse(gameChar_x + 4,gameChar_y-63,3)
	fill(83,93,89);
	rect(gameChar_x - 7,gameChar_y - 53,15,37);
	fill(0);
	rect(gameChar_x - 9, gameChar_y-20,6,20); //leg

	rect(gameChar_x + 4, gameChar_y-20,6,20); //leg
	
	triangle( gameChar_x - 5, gameChar_y - 40, gameChar_x - 15, 
			gameChar_y - 67,gameChar_x - 5, gameChar_y - 55 ); // arm
	triangle( gameChar_x + 8, gameChar_y - 40, gameChar_x , 
		gameChar_y - 67,gameChar_x + 8, gameChar_y - 55 ); // arm
	}
	else if(isRight && isFalling)
	{
		//  jumping-right code
		fill(255,204,142);
		ellipse(gameChar_x,gameChar_y-63,23);
		fill(0)
		rect(gameChar_x - 13, gameChar_y - 73, 25,5)//hat 
		rect(gameChar_x - 9, gameChar_y - 78, 17,8)
		ellipse(gameChar_x - 4,gameChar_y-63,3)// eyes
		ellipse(gameChar_x + 4,gameChar_y-63,3)
		fill(83,93,89);
		rect(gameChar_x - 7,gameChar_y - 53,15,37);
		fill(0);
		rect(gameChar_x - 7, gameChar_y-20,6,20); //leg
		
	
		rect(gameChar_x + 4, gameChar_y-20,6,20); //leg
		
		triangle(gameChar_x - 6, gameChar_y - 40, 
				gameChar_x + 5, gameChar_y - 67,gameChar_x - 7, 
				gameChar_y - 53 ); // arm
		triangle( gameChar_x + 8, gameChar_y - 40, 
				gameChar_x + 20 , gameChar_y - 67,
				gameChar_x + 8, gameChar_y - 55 ); // arm
	}
	else if(isLeft)
	{
		// walking left code
		fill(255,204,142);
		ellipse(gameChar_x,gameChar_y-53,23);
		fill(0)
		rect(gameChar_x - 13, gameChar_y - 65, 25,5)//hat 
		rect(gameChar_x - 9, gameChar_y - 70, 17,8)
		ellipse(gameChar_x - 4,gameChar_y-56,3)// eyes
		ellipse(gameChar_x + 4,gameChar_y-56,3)
		fill(83,93,89);
		rect(gameChar_x - 7,gameChar_y - 43,15,37);
		fill(0);
		rect(gameChar_x - 9, gameChar_y-10,6,15); //leg
		rect(gameChar_x - 12, gameChar_y,7,5); // foot
	
		rect(gameChar_x + 4, gameChar_y-10,6,15); //leg
		rect(gameChar_x + 1, gameChar_y,7,5); // foot
		
		triangle(gameChar_x - 5, gameChar_y - 30, 
				gameChar_x - 15, gameChar_y - 13,
				gameChar_x - 5, gameChar_y - 45 ); // arm
		rect(gameChar_x - 16, gameChar_y - 18, 4,4) // hand
		triangle( gameChar_x + 8, gameChar_y - 30,
				gameChar_x , gameChar_y - 13,
				gameChar_x + 8, gameChar_y - 45 ); // arm
		rect(gameChar_x - 2, gameChar_y - 17, 4,4) // hand
	}
	else if(isRight)
	{
		// walking right code
		fill(255,204,142);
		ellipse(gameChar_x,gameChar_y-53,23);
		fill(0)
		rect(gameChar_x - 13, gameChar_y - 65, 25,5)//hat 
		rect(gameChar_x - 9, gameChar_y - 70, 17,8)
		ellipse(gameChar_x - 4,gameChar_y-56,3)// eyes
		ellipse(gameChar_x + 4,gameChar_y-56,3) 
		fill(83,93,89);
		rect(gameChar_x - 7,gameChar_y - 43,15,37);
		fill(0);
		rect(gameChar_x - 7, gameChar_y-10,6,15); //leg
		rect(gameChar_x - 6, gameChar_y,7,5); // foot
	
		rect(gameChar_x + 4, gameChar_y-10,6,15); //leg
		rect(gameChar_x + 7, gameChar_y,7,5); // foot
		
		triangle(gameChar_x - 6, gameChar_y - 30,
				gameChar_x + 5, gameChar_y - 13,
				gameChar_x - 7, gameChar_y - 43 ); // arm
		rect(gameChar_x + 1, gameChar_y - 18, 4,4) // hand
		triangle(gameChar_x + 8, gameChar_y - 30,
				gameChar_x + 20 , gameChar_y - 13,
				gameChar_x + 8, gameChar_y - 45 ); // arm
		rect(gameChar_x + 17, gameChar_y - 18, 4,4) // hand
	}
	else if(isFalling || isPlummeting)
	{
		// jumping facing forwards code
		fill(255,204,142);
		ellipse(gameChar_x,gameChar_y-63,23);
		fill(83,93,89);
		rect(gameChar_x - 7,gameChar_y - 53,15,37);
		fill(0)
		rect(gameChar_x - 13, gameChar_y - 73, 25,5)//hat 
		rect(gameChar_x - 9, gameChar_y - 78, 17,8)
		ellipse(gameChar_x - 4,gameChar_y-63,3)// eyes
		ellipse(gameChar_x + 4,gameChar_y-63,3)
		fill(0);
		rect(gameChar_x - 7, gameChar_y-20,6,19); //leg
		
	
		rect(gameChar_x + 2, gameChar_y-20,6,19);
		
		
		triangle( gameChar_x - 5, gameChar_y - 40,
				gameChar_x - 25, gameChar_y - 55,
				gameChar_x - 5, gameChar_y - 48 );
		rect(gameChar_x - 25, gameChar_y - 55, 5,5)
		triangle( gameChar_x + 5, gameChar_y - 40,
				gameChar_x + 25, gameChar_y - 55,gameChar_x + 5,
				gameChar_y - 48 );
		rect(gameChar_x + 20, gameChar_y - 55, 5,5)

	}
	else
	{
		// add your standing front facing code
		fill(255,204,142);
		ellipse(gameChar_x,gameChar_y-53,23); // head
		fill(0)
		rect(gameChar_x - 13, gameChar_y - 65, 25,5)//hat 
		rect(gameChar_x - 9, gameChar_y - 70, 17,8)
		ellipse(gameChar_x - 4,gameChar_y-56,3)// eyes
		ellipse(gameChar_x + 4,gameChar_y-56,3)
		fill(83,93,89);
		rect(gameChar_x - 7,gameChar_y - 43,15,37);
		fill(0);
		rect(gameChar_x - 7, gameChar_y-10,6,15); //leg
		rect(gameChar_x - 10, gameChar_y,7,5); // foot

		rect(gameChar_x + 2, gameChar_y-10,6,15);
		rect(gameChar_x + 4, gameChar_y,7,5);
		
		triangle(gameChar_x - 5, gameChar_y - 30, 
				gameChar_x - 15, gameChar_y - 13,
				gameChar_x - 5, gameChar_y - 45 );
		rect(gameChar_x - 16, gameChar_y - 18, 5,5)
		triangle(gameChar_x + 5, gameChar_y - 30, 
				gameChar_x + 15, gameChar_y - 13,
				gameChar_x + 5, gameChar_y - 45 );
		rect(gameChar_x + 12, gameChar_y - 18, 5,5);
	}
}
// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawCloud(t_cloud)
{
	fill(255);
	ellipse(cloud[t_cloud].x_pos,
			cloud[t_cloud].y_pos + 10 - cloud[t_cloud].sizeDistanceY,
			cloud[t_cloud].sizeEllipse + 30);
	ellipse(cloud[t_cloud].x_pos - 40 + cloud[t_cloud].sizeDistanceX,
			cloud[t_cloud].y_pos + 20 - cloud[t_cloud].sizeDistanceY,
			cloud[t_cloud].sizeEllipse - 2);
	ellipse(cloud[t_cloud].x_pos + 50 - cloud[t_cloud].sizeDistanceX,
			cloud[t_cloud].y_pos + 20 - cloud[t_cloud].sizeDistanceY,
			cloud[t_cloud].sizeEllipse - 2);
	ellipse(cloud[t_cloud].x_pos + 50 - cloud[t_cloud].sizeDistanceX,
			cloud[t_cloud].y_pos - 20 + cloud[t_cloud].sizeDistanceY,
			cloud[t_cloud].sizeEllipse + 15);
	ellipse(cloud[t_cloud].x_pos + 90 - cloud[t_cloud].sizeDistanceX,
			cloud[t_cloud].y_pos - 9 +  - cloud[t_cloud].sizeDistanceY,
			cloud[t_cloud].sizeEllipse + 15);
}

// Function to draw mountains objects.
function drawMountain(t_mountain)
{
	//mountain shape
	fill(169,169,169);
	triangle(mountains[t_mountain].x_pos - 250,(mountains[t_mountain].y_pos + 282),
			mountains[t_mountain].x_pos + 60  * mountains[t_mountain].vector,
			mountains[t_mountain].y_pos - 80  * mountains[t_mountain].vector,
			mountains[t_mountain].x_pos + 200  * mountains[t_mountain].vector,
			mountains[t_mountain].y_pos + 282);
	fill(192,192,192);
	triangle(mountains[t_mountain].x_pos + 60  * mountains[t_mountain].vector
			,mountains[t_mountain].y_pos - 80  * mountains[t_mountain].vector,
			mountains[t_mountain].x_pos + 200  * mountains[t_mountain].vector,
			mountains[t_mountain].y_pos + 282, 
			mountains[t_mountain].x_pos + 298  * mountains[t_mountain].vector,
			mountains[t_mountain].y_pos + 282);
	//snow
	
	if (mountains[t_mountain].vector == 1)
	{
		fill(255);
		beginShape();
		vertex	(mountains[t_mountain].x_pos + 60,
				mountains[t_mountain].y_pos - 80);
		vertex	(mountains[t_mountain].x_pos - 4, 
				mountains[t_mountain].y_pos - 5);
		vertex(mountains[t_mountain].x_pos - 40, 
				mountains[t_mountain].y_pos + 85);
		vertex(mountains[t_mountain].x_pos + 30, 
				mountains[t_mountain].y_pos + 15);
		vertex(mountains[t_mountain].x_pos + 67, 
			mountains[t_mountain].y_pos + 80);
		vertex(mountains[t_mountain].x_pos + 75,
				mountains[t_mountain].y_pos - 5);
		vertex(mountains[t_mountain].x_pos + 118, 
			mountains[t_mountain].y_pos + 70);
		vertex(mountains[t_mountain].x_pos + 110, 
				mountains[t_mountain].y_pos + 25);
		vertex(mountains[t_mountain].x_pos + 158, 
				mountains[t_mountain].y_pos + 70);
		endShape(CLOSE);
		fill(169,169,169);	
	}
}

// Function to draw trees objects.
function drawTree(t_tree)
{
	fill(120,100,40);
	rect(trees_x[t_tree],treePos_y + 98,65,85);

	//some leafs
	fill(0,155,0); 
	ellipse(trees_x[t_tree] - 6,treePos_y + 40,70);
	ellipse(trees_x[t_tree] + 82,treePos_y + 40,75);
	ellipse(trees_x[t_tree] + 33,treePos_y + 27,95);

	//branches
	fill(120,100,40);
	triangle(trees_x[t_tree],treePos_y + 98,
			trees_x[t_tree] + 21,treePos_y + 98,
			trees_x[t_tree] - 6,treePos_y + 25);
	triangle(trees_x[t_tree] + 21,treePos_y + 98,
			trees_x[t_tree] + 64,treePos_y + 98,
			trees_x[t_tree] + 82,treePos_y + 5);	

	//leafs
	fill(0,155,0); 
	ellipse(trees_x[t_tree] - 6,treePos_y + 15,70);
	ellipse(trees_x[t_tree] + 82,treePos_y + 15,75);
	ellipse(trees_x[t_tree] + 33,treePos_y + 2,95);
	ellipse(trees_x[t_tree] + 33,treePos_y + 2,95);
	ellipse(trees_x[t_tree] + 33,treePos_y + 2,95);
	ellipse(trees_x[t_tree] + 76,treePos_y -7,76);
	ellipse(trees_x[t_tree],treePos_y -3,76);			
}

function drawheart(y_pos)
{
	fill(255,0,0);
	ellipse(40, 300 - y_pos, 33);
	ellipse(43, 315 - y_pos, 20);
	ellipse(39, 310 - y_pos, 20);
	ellipse(47, 321 - y_pos, 17);
	ellipse(48, 324 - y_pos, 14);
	
	ellipse(65, 300 - y_pos, 33);
	ellipse(62, 315 - y_pos, 20);
	ellipse(66, 310 - y_pos, 20);
	ellipse(58, 321 - y_pos, 17);
	ellipse(57, 324 - y_pos, 14);
	triangle(32,310 - y_pos, 51, 340 - y_pos, 77, 310 - y_pos)
}
// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
	fill(210 , 210, 230)
	rect(canyons[t_canyon].x_pos, floorPos_y,
		(canyons[t_canyon].x_pos +220 
		+ canyons[t_canyon].width) - canyons[t_canyon].x_pos,height/4)
	// canyon shape
	fill(120,100,40);
	beginShape();
	vertex(canyons[t_canyon].x_pos +170 + canyons[t_canyon].width, 600);
	vertex(canyons[t_canyon].x_pos +190 + canyons[t_canyon].width, 440);
	vertex(canyons[t_canyon].x_pos +220 + canyons[t_canyon].width,430);
	vertex(canyons[t_canyon].x_pos +234 + canyons[t_canyon].width,445);
	vertex(canyons[t_canyon].x_pos +358 + canyons[t_canyon].width, 677);
	endShape();

	beginShape();
	vertex(canyons[t_canyon].x_pos - 90, 600);
	vertex(canyons[t_canyon].x_pos - 30, 440);
	vertex(canyons[t_canyon].x_pos,430);
	vertex(canyons[t_canyon].x_pos + 20,445);
	vertex(canyons[t_canyon].x_pos + 40, 677);
	endShape();
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
	if (gameChar_world_x >= canyons[t_canyon].x_pos 
		&& gameChar_world_x <= canyons[t_canyon].x_pos + 180 + canyons[t_canyon].width 
		&& gameChar_y == floorPos_y) // canyon detection
    {
        overCanyon = true;
        fallingManSound.play();
    }
}

// draw the flagpole
function renderFlagpole()
{
	if (flagpole.isReached == true)
	{
		if (flagpole.flag_y >= floorPos_y + 30)
		{
			flagpole.flag_y -= 5;
		}
	}
	stroke(20);
	fill(0);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 164)
	noStroke();
	fill(255,255,0);
	rect(flagpole.x_pos,flagpole.flag_y - 194, 50,30);
	noFill();
	stroke(20);
	strokeWeight(2);
	noFill();
	beginShape();
	vertex(flagpole.x_pos + 17, flagpole.flag_y - 185);
	vertex(flagpole.x_pos + 34, flagpole.flag_y - 185);
	vertex(flagpole.x_pos + 17,flagpole.flag_y - 173);
	vertex(flagpole.x_pos + 34, flagpole.flag_y - 173);
	endShape();
	line(flagpole.x_pos + 22,flagpole.flag_y - 170,
		flagpole.x_pos + 22,flagpole.flag_y - 189);
	line(flagpole.x_pos + 31,flagpole.flag_y - 170,
		flagpole.x_pos + 31,flagpole.flag_y - 189);
	noStroke();
}

// check if flagpole is reached
function checkFlagpole()
{
	var d = abs(gameChar_world_x - flagpole.x_pos);
	if (d < 10)
	{
		flagpole.isReached = true;
        backgroundSound.stop();
        successSound.play();
	}
}
// ----------------------------------
// collectables items render and check functions
// ----------------------------------

// Function to draw collectables objects.
function drawcollectables(t_collectables)
{
		stroke(100);
		strokeWeight(4);
		fill(255,255,0);
		ellipse(collectables[t_collectables].x_pos,
				collectables[t_collectables].y_pos,
				collectables[t_collectables].size + 35);
		strokeWeight(2);
		noFill();
		beginShape();
		vertex(collectables[t_collectables].x_pos - 9, 
				collectables[t_collectables].y_pos - 8);
		vertex(collectables[t_collectables].x_pos + 8, 
				collectables[t_collectables].y_pos - 8);
		vertex(collectables[t_collectables].x_pos - 9,
				collectables[t_collectables].y_pos + 7);
		vertex(collectables[t_collectables].x_pos + 8, 
				collectables[t_collectables].y_pos + 7);
		endShape();
		line(collectables[t_collectables].x_pos - 3,
			collectables[t_collectables].y_pos - 10,
			collectables[t_collectables].x_pos - 3,
			collectables[t_collectables].y_pos + 9);
		line(collectables[t_collectables].x_pos + 3,
			collectables[t_collectables].y_pos - 10,
			collectables[t_collectables].x_pos + 3,
			collectables[t_collectables].y_pos + 9);
		noStroke();
}

// Function to check character has collected an item.
function checkcollectables(t_collectables)
{
	if (dist(gameChar_world_x,gameChar_y,
		collectables[t_collectables].x_pos, 
		collectables[t_collectables].y_pos) <= 30)
    {
        collectables[t_collectables].isFound = true;
		game_score++;
        collectSound.play();
    }
}

function checkPlayerDie()
{
	var bellowPlayground = false;

	if (gameChar_y > height)
	{
		bellowPlayground = true;	
	}
	if (bellowPlayground == true)
	{
		lives -= 1;
		if (lives > 0)
		{
            backgroundSound.stop();
			startGame();
		}
		console.log(lives)
	}
}

//plateform constructor function
function makePlateforms(x, y, length)
{
	var p = {
		x: x,
		y: y,
		length: length,

		draw: function(){
			fill(25, 25, 112);
			rect(this.x , this.y, this.length, 25, 15);
		},
		checkContact: function (gc_x, gc_y){
			if(gc_x > this.x && gc_x < this.x + this.length)
			{
				var d = this.y - gc_y;
				if (d >= 0 && d < 3)
				{
					return true;
				}

				
			}
			return false;
		}
	}
	return p;
}

//enemies constructor function
function Enemy(x, y, range)
{
	this.x = x;
	this.y = y;
	this.range = range;

	this.curentX = x;
	this.inc = 1;

	this.update = function()
	{
		this.curentX += this.inc;

		if (this.curentX >= this.x + this.range)
		{
			this.inc = -1;
		}
		else if (this.curentX < this.x)
		{
			this.inc = 1;
		}
		this.emit = new Emitter(this.curentX + 8, this.y - 58, 0, -1, 5, color(255,  69, 0, 100))
		this.emit.startEmitter(40, 30);
	}
	

	this.draw = function()
	{
		this.update();
		fill(50, 50, 50);
		ellipse(this.curentX, this.y, 60, 60);
		fill(80, 80, 80);
		ellipse(this.curentX + 10, this.y, 20, 40);
		fill(50, 50, 50);
		beginShape();
		vertex(this.curentX - 10, this.y - 20);
		vertex(this.curentX - 10, this.y - 40);
		vertex(this.curentX + 10, this.y - 40);
		vertex(this.curentX + 10, this.y - 20);
		endShape();
		strokeWeight(2);
		fill(255 ,215, 0);
		beginShape();
		vertex(this.curentX - 5, this.y - 40);
		vertex(this.curentX - 3, this.y - 43);
		vertex(this.curentX - 2, this.y - 45);
		vertex(this.curentX + 1, this.y - 50);
		vertex(this.curentX + 11, this.y - 50);
		vertex(this.curentX + 8, this.y - 45);
		vertex(this.curentX + 7, this.y - 43);
		vertex(this.curentX + 5, this.y - 40);
		endShape();
		this.emit.updateParticles();

	}

	this.checkContact = function(gc_x, gc_y)
	{
		var d = dist(gc_x, gc_y, this.curentX, this.y)
		if (d < 40)
		{
			return true;
		}
		return false;
	}

}

function Particle(x, y, xSpeed, ySpeed, size, colour)
{
	this.x = x;
	this.y = y;
	this.xSpeed = xSpeed;
	this.ySpeed = ySpeed;
	this.size = size;
	this.colour = colour;
	this.age = 0;

	this.drawParticle = function()
	{
		noStroke();
		fill(this.colour);
		ellipse(this.x, this.y, this.size);
	}

	this.updateParticle = function()
	{
		this.x += this.xSpeed;
		this.y += this.ySpeed;
		this.age++;
	}
}

function Emitter(x, y, xSpeed, ySpeed, size, colour)
{
	this.x = x;
	this.y = y;
	this.xSpeed = xSpeed;
	this.ySpeed = ySpeed;
	this.size = size;
	this.colour = colour;
	this.startParticle = 0;
	this.lifetime = 0;

	this.particles = [];

	this.addParticle = function()
	{
		var p = new Particle(random(this.x - 10, this.x + 10), 
		random(this.y - 10, this.y + 10), 
		random(this.xSpeed - 1, this.xSpeed + 1), 
		random(this.ySpeed - 1, this.ySpeed + 1),
		random(this.size - 4, this.size + 4), 
		this.colour);
		return p;
	}

	this.startEmitter = function(startParticle, lifetime)
	{
		this.startParticle = startParticle;
		this.lifetime = lifetime;

		for (var i = 0; i < startParticle; i++)
		{
			this.particles.push(this.addParticle());
		}
	}


	this.updateParticles = function()
	{
		var deadParticles = 0;
		for (var i = this.particles.length -1; i >= 0; i--)
		{
			this.particles[i].drawParticle();
			this.particles[i].updateParticle();
			if (this.particles[i].age > random(10, this.lifetime))
			{
				this.particles.splice(i, 1);
				deadParticles++;
			}
		}
		if (deadParticles > 0)
		{
			for (var i = 0; i < deadParticles; i++)
			{
				this.particles.push(this.addParticle());
			}
		}
	}

}


// game start setup function
function startGame()
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	treePos_y = floorPos_y - 183
	game_score = 0;
    backgroundSound.play();
    flagSound = 1;
	jumpLimit = 120;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	overCanyon = false;
	onPlat = false;
	
	// Initialise arrays of scenery objects.
	canyons = 		[{x_pos: -900,width: 100},
					{x_pos: 258,width: -100},
					{x_pos: 1400,width: -70},
					{x_pos: 3100,width: 150}];
	cloud = 		[{x_pos: 100,y_pos: 90,sizeEllipse: 60,sizeDistanceX: 0,sizeDistanceY: 0},
					{x_pos: 400,y_pos: 130,sizeEllipse: 45,sizeDistanceX: 10,sizeDistanceY: 0},
					{x_pos: 800,y_pos: 90,sizeEllipse: 60,sizeDistanceX: 0,sizeDistanceY: 0},
					{x_pos: 900,y_pos: 90,sizeEllipse: 60,sizeDistanceX: 0,sizeDistanceY: 0},
					{x_pos: 1380,y_pos: 65,sizeEllipse: 45,sizeDistanceX: 20,sizeDistanceY: 0},
					{x_pos: 1500,y_pos: 65,sizeEllipse: 60,sizeDistanceX: 0,sizeDistanceY: 0}]
	trees_x = 		[100,-300,1800,1200];
	mountains = 	[{x_pos: 900, y_pos: 150, vector : 1.5},{x_pos: 830, y_pos: 150, vector : 1},
					{x_pos: 2700, y_pos: 150, vector : 0.8},{x_pos: 2550, y_pos: 150, vector : 1},
					{x_pos: 2300, y_pos: 150, vector : 1.2},
					{x_pos: -240, y_pos: 150, vector : 1},{x_pos: -130, y_pos: 150, vector : 1.3}]
	collectables = 	[{x_pos: 310,y_pos: 504,size: 5,isFound: false},
					{x_pos: 700,y_pos: 404,size: 30,isFound: false},
					{x_pos: 1010, y_pos: 404, size: 10, isFound: false},
					{x_pos: 2500, y_pos: 304, size: 10, isFound: false},
					{x_pos: 3290, y_pos: 304, size: 10, isFound: false},
					{x_pos: -500, y_pos: 404, size: 10, isFound: false}]
	flagpole = 		{x_pos: 3600, isReached: false, flag_y: floorPos_y + 165};
	platforms =		[];
	enemies =		[];
	
	platforms.push(new makePlateforms(3250, floorPos_y - 40, 100));
	enemies.push(new Enemy(-400, floorPos_y - 30, 500))
	enemies.push(new Enemy(2370, floorPos_y - 30, 50))
	enemies.push(new Enemy(2580, floorPos_y - 30, 50))

	//platforms.push(makePlateforms(600, floorPos_y - 300, 80))
	
}