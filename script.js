// Document setup
    // This sets up the initial html by creating the grid, and showing or hiding elements based on what state the game is in
    $(document).ready(function (){
        buildGrid();
        $("#body-grid").hide();
        $("#upload-grid").hide();
        $("#name-grid").hide();
        $("#name-display").hide();
        $("#reset-area").hide();
        document.getElementById("upload").addEventListener("change", loadFile, false); // Add event listener to get when file is uploaded

    });
// Document setup

// Variables 
    // This is for a possibility of creating dynamic grid sizes, but currently it doesnt work
    // DO NOT CHANGE
    let maxCols = 33;
    let maxRows = 33;


    let buttons = []; // The div elements of the grid spaces
    let currentButton = null; // Most recently pressed grid space
    let startingButton = null; // The starting point of the maze as grid block
    let endingButton = null; // The ending point of the maze as grid block
    let pathComplete = false; // Wether or not the creation of the path has been finished
    let callWhenButtonPushed = null; // Helper variable for getting block click inputs
    let lastButton = null; // Most recently used grid space
    let path = []; // Array of id's of grid elements that represents the maze
    let gameInProgress = true; // Determines if the game allows you to move or not
    let username = ''; // The name of the player
    let score = 0; // The player's score

// Variables

// Helper function to setup initial maze creation
    function startCreation()
    {
        // Hide and show respective elements for user instruction
        $("#buttons").hide();
        $("#body-grid").show();
        // populate buttons array with ids of elements that would be already on display
        getButtons();
        // Begin waiting for user to input a starting position, the rest is called from within this
        getStartingPoint();
        $("#talking-point").html("Click the enter point of your maze");
    }
// Helper function to setup initial maze creation


// Setup the grid in the display
    // Create all the blocks as grid elements with unique ids and classes
        function buildGrid(){

            // Create a grid that has walls around the edge and blocks with different classes to denote different types
            // For each loop, get the position x and y and set respective inner features
            for(let posY = 0; posY < maxRows; posY++)
            {
                for(let posX = 0; posX < maxCols; posX++)
                {
                    // Create a div element
                    let div = document.createElement("div");
                    div.id= "" + posY + "-" + posX + ""; // Give the div a unique id
                    
                    // Set initial class to an inner-block, to be changed if criteria met below
                    div.setAttribute("class", "inner-block"); 
                    // Set values of all far outside blocks to a gray wall block
                    if(posY == 0 || posX == 0 || posY == maxRows - 1 || posX == maxCols - 1)
                    {
                        div.setAttribute("class", "wall-block");
                    }
                    // Set values of all blocks inside the wall by 1 to an edge block with no color change
                    if(posY == 1 && posX != 0 && posX != maxRows - 1)
                    {
                        div.setAttribute("class", "edge-block");
                    }
                    else if(posX == 1 && posY != 0 && posY != maxCols - 1)
                    {
                        div.setAttribute("class", "edge-block");
                    }
                    else if(posY == maxCols - 2 && posX != 0 && posX != maxRows - 1)
                    {
                        div.setAttribute("class", "edge-block");
                    }
                    else if(posX == maxCols - 2 && posY != 0 && posY != maxCols - 1)
                    {
                        div.setAttribute("class", "edge-block");
                    }

                    // Helper variables to create the position of the block
                    let colString = "grid-column: " + (posX + 1);
                    let rowString = "grid-row: " + (posY + 1);
                    // Apply grid position as style
                    div.setAttribute("style", colString + "; " + rowString + ";");
                    // Add it to the body to display
                    $("#body-grid").append(div);
                }
            }
        }
    // Create all the blocks as grid elements with unique ids and classes
// Setup the grid in the display

// Getting the starting and ending blocks and setup buttons

    // Setup each tile as a button with a unique id and listener
        // For each element with an id that belongs to the grid, add it to a list of buttons and add a listener to it 
        function getButtons()
        {
            // For each element id that would be an element in the grid
            for(let curY = 0; curY < maxRows; curY++)
            {
                for(let curX = 0; curX < maxCols; curX++)
                {
                    let colString = "" + curY;
                    let rowString = "" + curX;
                    let div = document.getElementById(colString + "-" + rowString);
                    // Append that element to the list of possible buttons
                    buttons.push(div);
                }
            }
            // Then call to add buttonListeners to each
            addButtonListeners();
        }

        // Give each element an event listener
        function addButtonListeners()
        {
            for(let i = 0; i < buttons.length; i++)
            {
                let buttonString = "" + buttons[i].id;
                document.getElementById(buttonString).addEventListener("click", function(){
                    currentButton = buttonString;
                    if(callWhenButtonPushed) {
                        callWhenButtonPushed(buttonString);
                        callWhenButtonPushed = null;
                    }
                    // console.log("Button " + currentButton + " pushed");
                });
            }
        }
    // Setup each tile as a button with a unique id and listener

    // Get the starting button;
        function getStartingPoint()
        {
            // console.log("getting starting point");
            if(currentButton != null)
            {
                // console.log("Got button " + currentButton);
                startingButton = currentButton;
                currentButton = null;
                lastButton = startingButton;
                path.push(lastButton);
                getEndingPoint(null);
            }
            else
            {
                // console.log("got null starting point");
                currentButton = null;
                waitForButtonStart();
            }
        }

        // Waits for the user to select a block, then uses another function to determine if it is valid
        function waitForButtonStart()
        {
            if(currentButton == null) setTimeout(function() {waitForButtonStart()}, 200);
            else return doneWaitingForStart();
        }

        // Gets called when a button is pushed in waiting state, then checks if it is valid 
        function doneWaitingForStart()
        {
            // console.log("Button pushed + " + currentButton);
            // let i = currentButton.substr(0, currentButton.indexOf("-"));
            // let j = currentButton.substr(currentButton.indexOf("-") + 1, currentButton.length);
            let div = document.getElementById(currentButton);
            if(div.className == "edge-block")
            {
                // console.log("This is valid edge block");
                // console.log("col = " + i);
                // console.log("row = " + j);
                div.style.backgroundColor = "red";
                getStartingPoint(currentButton);
            }
            else
            {
                // console.log("This is not edge");
                alert("Block must be on the edge");
                currentButton = null;
                getStartingPoint();
            }
        }
    // Get the starting button

    // Get the ending button
        // Begins waiting procedure to get a block, then validate if it is useable as the ending path block
        function getEndingPoint()
        {
            $("#talking-point").html("Click the exit point of your maze");
            // console.log("getting ending point");
            if(currentButton != null)
            {
                // console.log("Got button " + currentButton);
                endingButton = currentButton;
                currentButton = null;
                createPath();
            }
            else
            {
                // console.log("got null ending point");
                currentButton = null;
                waitForButtonEnd();
            }
        }

        // Waits for the user to select a block, then uses another function to determine if it is valid
        function waitForButtonEnd()
        {
            if(currentButton == null) setTimeout(function() {waitForButtonEnd()}, 200);
            else return doneWaitingForEnd();
        }

        // Gets called when a button is pushed in waiting state, then checks if it is valid
        function doneWaitingForEnd()
        {
            // console.log("Button pushed + " + currentButton);
            // let i = currentButton.substr(0, currentButton.indexOf("-"));
            // let j = currentButton.substr(currentButton.indexOf("-") + 1, currentButton.length);
            let div = document.getElementById(currentButton);
            if(div.className == "edge-block")
            {
                // console.log("This is valid edge block");
                // console.log("col = " + i);
                // console.log("row = " + j);
                div.style.backgroundColor = "red";
                getEndingPoint(currentButton);
            }
            else
            {
                // console.log("This is not edge");
                alert("Block must be on the edge");
                currentButton = null;
                getEndingPoint();
            }
        }
    // Get the ending button

// Getting the starting and ending blocks

// Helper function to get the button pushed
    function waitForNextButton()
    {
        return new Promise(resolve => {
            callWhenButtonPushed = resolve;
        });
    }
// Helper function to get the button pushed

// Create the complete maze path

    // Create the path from start to finish
        async function createPath()
        {
            $("#talking-point").html("Create a path from start to finish");
            // Add the first and last spot to the path.
            path.push(endingButton);

            while(!pathComplete)
            {
                // theButton is the most recently pressed grid block
                const theButton = await waitForNextButton();
                console.log("theButton " + theButton); 
                // Test if block is on the inside of the edges of the maze and isnt already a path block
                if((document.getElementById(theButton).className == "inner-block" || theButton == endingButton) && document.getElementById(theButton).className != "path-block")
                {
                    // position of the currently pressed button
                    let curY = theButton.substr(0, theButton.indexOf("-"));
                    let curX = theButton.substr(theButton.indexOf("-") + 1, theButton.length);
                    console.log("last button " + lastButton);
                    // the position of the last pressed button, or start on first runthrough 
                    let lastY = lastButton.substr(0, lastButton.indexOf("-"));
                    let lastX = lastButton.substr(lastButton.indexOf("-") + 1, lastButton.length);
                    if(isNextTo(curY, curX, lastY, lastX))
                    {
                        console.log("correct");
                        // Set blocks style to indicate it is a path-block
                        document.getElementById(theButton).style.backgroundColor = "blue";
                        document.getElementById(theButton).setAttribute("class", "path-block");
                        // Add block to path
                        path.push(theButton);
                        // Update last visited position
                        lastButton = theButton;
                        if(theButton == endingButton)
                        {
                            pathComplete = true;
                            console.log("path done");    
                            document.getElementById(theButton).style.backgroundColor = "red";                
                            // At the end here, the path is: [start, end, path to end, end]
                        }
                    }
                    else
                    {
                        alert("Invalid position, must be connected to the path");
                        console.log("wrong");
                    }
                }
                else
                {
                    alert("Path cannot go along the edge or onto itself");
                }
            }
            // User then must create paths that do not lead to the finish
            createOffshoots();
        }
    // Create the path from start to finish

    // Allow the user to create paths that do not lead to the finish
        async function createOffshoots()
        {
            $("#talking-point").html("Create paths that lead to dead ends, click the exit block to finish");
            pathComplete = false;
            console.log("starting offshoots");
            // Until the user clicks the maze exit block, try and get path offshoots
                while(!pathComplete)
                {
                    const theButton = await waitForNextButton();
                    // Validate that this is an offshoot block
                    // Offshoot blocks cannot: be a path block, be next to 2 path blocks, 
                    // Will need to loop through every block in the path to validate
                    let nextTo = 0;
                    // the position of the currently pressed button
                    let curY = theButton.substr(0, theButton.indexOf("-"));
                    let curX = theButton.substr(theButton.indexOf("-") + 1, theButton.length);
                    // the position of the ending block
                    let lastY = endingButton.substr(0, endingButton.indexOf("-"));
                    let lastX = endingButton.substr(endingButton.indexOf("-") + 1, endingButton.length);
                    // User must click the ending block to end creating offshoots
                    if(curY == lastY && curX == lastX)
                    {
                        // User has clicked the maze exit to stop maze path creation
                        console.log("ending offshoots");
                        pathComplete = true;
                        // Prompt user to download their path file
                        $("#talking-point").html("Save your maze! Refresh the page to load and play.");
                        saveCurrentLevel(path, "pathName");
                        break;
                    }
                    // Find out how many path blocks this button is next to
                        for(let a = 0; a < path.length; a++)
                        {
                            let pathBlock = path[a];
                            // the position of a currently looped path block
                            let pathY = pathBlock.substr(0, pathBlock.indexOf("-"));
                            let pathX = pathBlock.substr(pathBlock.indexOf("-") + 1, pathBlock.length);
                            console.log("pathY " + pathY);
                            console.log("pathX " + pathX);
                            // If the current block trying to be added is next to another path block, count how many
                            if(isNextTo(curY, curX, pathY, pathX))
                            {
                                nextTo += 1;
                            }
                        }
                    // Find out how many path blocks this button is next to

                    // If the block is touching no path blocks or more than 1, is it invalid for the maze
                    // NOTE: This is where youd have to disable checking validity if you wanted to draw a smily face on the screen
                    //      You would jus thave to change this to nextTo > 1, then it would accept positions that are not connected
                    if(nextTo != 1)
                    {
                        // Invalid selection for a path block
                        alert("Invalid position, must touch only one path block");
                    }
                    // Check if the block youre trying to add is already on the path
                    else if (document.getElementById(theButton).className == "path-block")
                    {
                        alert("cannot add path block to path twice");
                    }
                    else 
                    {
                        console.log("correct");
                        // Set blocks style to indicate it is a path-block
                        document.getElementById(theButton).style.backgroundColor = "blue";
                        document.getElementById(theButton).setAttribute("class", "path-block");
                        // Add block to path
                        path.push(theButton);
                    }

                }
            // Until the user clicks the maze exit block, try and get path offshoots
        }
    // Allow the user to create paths that do not lead to the finish

    // Use this to determine if the button pushed is left, right, up, or down by 1 from the previous block
        // These variable names shouldnt have to be changed because this is a helper function
        function isNextTo(i, j, k, l)
        {
            // Make sure inputs are numbers
            i = parseInt(i);
            j = parseInt(j);
            k = parseInt(k);
            l = parseInt(l);

            // Check if any of the grid elements as numbers are touching
            if(k == i + 1 && j == l)
            {
                return true;
            }
            else if(k == i - 1 && j == l)
            {
                return true;
            }
            else if(j == l - 1 && k == i)
            {
                return true;
            }
            else if(j == l + 1 && k == i)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    // Use this to determine if the button pushed is left, right, up, or down by 1 from the previous block

    // Save current path to a file
        function saveCurrentLevel(path, levelName)
        {
            let file = new Blob([path], {type: "text/plain"}); // Create an object with the contents of the path as a text file
            let a = document.createElement("a"); // Temp element to help with adding download functionality
            let url = URL.createObjectURL(file); // Create a link to download the file
            a.href = url; // apply the link to the element
            a.download = levelName; // name the file about to be downloaded
            document.body.appendChild(a); // Add element to body
            a.click(); // Activate element
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0); // Remove element from the page
        }
    // Save current path to a file

// Create the complete maze path

// Handle username input
    function loadUsername()
    {
        // Hide and show respective elements on the grid for user instruction
        $("#name-grid").show();
        $("#buttons").hide();
        $("#upload-grid").hide();
        $("#talking-point").html("Insert a username");
        let name = $("#name-input").val(); // Get the username input
        // Validate the name input is between 3 and 20 characters
        if(name.length >= 3 && name.length <= 20)
        {
            // Valid username
            console.log("valid name");
            username = name;
            // If the username is valid, proceed
            loadFile();
        }
        else
        {
            $("#talking-point").html("Insert a username between 3 and 20 characters");
        }

    }
// Handle username input

// Load previously created path
    function loadFile(event)
    {
        // Hide and show respective grid elements for user instructions
        $("#upload-grid").show();
        $("#buttons").hide();
        $("#name-grid").hide();
        $("#talking-point").html("Upload a maze to begin");
        // Reset this name input so on refresh page it asks again
        $("#name-input").val("")
        // console.log("loading files");
        let files = event.target.files; // Filelist object

        let f = files[0]; // The first and only file in the object

        let reader = new FileReader(); // Used to get the contents of the file

        // Read the contents of the file
        reader.onload = (function(theFile) {
            return function(e) {
                // Load the path from here, then create the path on the board
                
                let newPath = e.target.result.split(",");
                console.log(newPath);
                // Create the maze from provided path
                // Store location of the starting and ending buttons so they do not get lost in shuffle
                startingButton = newPath[0];
                endingButton = newPath[1];
                // Shuffle the path so displaying it does not show the path creation sequence, thus giving away the correct path
                newPath = shuffle(newPath);
                
                // Load the path into the board
                loadPath(newPath);
            };
                
        })(f);

        reader.readAsText(f);
    }

    // Shuffle path input so display looks better
    function shuffle(array) {
        var currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }
      

    // Start the layout of the given path
    async function loadPath(newPath)
    {
        // Hide and show respective elements for user instruction
        $("#body-grid").show();
        $("#upload-grid").hide();
        $("#name-display").show();
        $("#talking-point").html("Lets play! Use arrow keys to move");
        $("#username").html("User: " + username);
        // Populate the visibility of the path in a random order through the shuffled path
        for(let i = newPath.length - 1; i >= 0; i--)
        {
            document.getElementById(newPath[i]).setAttribute("class", "path-block")
            // Wait 10ms to load next color so it looks better
            await new Promise(r => setTimeout(r, 10));
            
        }
        // Setup starting and ending blocks as unique
        document.getElementById(startingButton).setAttribute("class", "start-end-block");
        document.getElementById(endingButton).setAttribute("class", "start-end-block");
        // Set path of the game to the path provided in the file
        path = newPath;
        playGame();

    }
// Load previously created path

// Game functionality
    // Get arrow key inputs
        function waitKeyPress()
        {
            return new Promise((resolve) => {
                document.addEventListener('keydown', onKeyHandler);
                function onKeyHandler(e) {
                  // Only take arrow key inputs
                  if (e.keyCode == '38' || e.keyCode == '40' || e.keyCode == '37' || e.keyCode == '39') {
                    document.removeEventListener('keydown', onKeyHandler);
                    tryMovement(e.keyCode);
                    $("#scoreboard").html("Score: " + score);
                    resolve();
                  }
                }
              });
        }
    // Get arrow key inputs

    // Test that movement goes along the path
        // User input was found, try to move to given location
            async function tryMovement(keyCode)
            {
                // console.log("trying movement");
                // console.log("cur button " + currentButton);
                // Increase the score after every attempt to move, lowest score wins
                score++;
                // Get the position of the block user wants to move to
                let posY = currentButton.substr(0, currentButton.indexOf("-"));
                let posX = currentButton.substr(currentButton.indexOf("-") + 1, currentButton.length);
                if(keyCode == '40')
                {
                    // down
                    posY++;
                }
                else if(keyCode == '38')
                {
                    // up
                    posY--;
                }
                else if(keyCode == '37')
                {
                    // left
                    posX--;
                }
                else
                {
                    // right
                    posX++;
                }

                // Create id for block user wants to move to
                let nextBlock = posY + "-" + posX;
                // console.log("nextBlock = " + nextBlock);
                // console.log("currentBlock = " + currentButton);
                // Validate that block user wants to move to is on the path
                if(isPathBlock(nextBlock))
                {
                    // console.log("it is a path block");
                    // Set user location to the next block
                    document.getElementById(currentButton).innerHTML = "";
                    document.getElementById(nextBlock).innerHTML = "♦";
                    // console.log("next block is " + nextBlock);
                    // Update current position 
                    currentButton = nextBlock;
                    // console.log("now current " + currentButton);
                    
                    // Check if the user is at the end of the maze
                    if(testEnd())
                    {
                        $("#talking-point").html("Game over, you win!");
                        gameInProgress = false;
                    }
                }
                // else wait for next arrow input
            }
        // User input was found, try to move to given location

        // Helper function to check if a given id is on the path
            function isPathBlock(block)
            {
                // Loop through the entire path and test if it matches
                for(let i = 0; i < path.length; i++)
                {
                    if(block == path[i])
                    {
                        // On first hit, return true
                        return true;
                    }
                }
                // No match was found and block isnt on the path
                return false;
            }
        // Helper function to check if a given id is on the path

    // Test that movement goes along the path

    // Main game loop, if game is in progress, wait for movement and updated position
        // Play the game
            async function playGame()
            {
                // Reset the functionality on reset, this does nothing if on first run
                // Hide and show respective elements for user instruction and guidance
                $("#reset-area").hide();
                $("#final-display").html("");
                $("#name-display").show();
                // Set game status to true and set score to zero
                gameInProgress = true;
                score = 0;
                $("#scoreboard").html("Score: " + score);

                // Set starting point with inidcator of current position
                document.getElementById(startingButton).innerHTML = "♦";
                // Set the current position of the user to the start
                currentButton = startingButton;
                // While true, wait for key press, on key press it calls for an attempt to move and checks if the game is finished
                while(gameInProgress)
                {
                    // This handles detecting input, and updating position
                    console.log("game in progress: cur button = " + currentButton);
                    await waitKeyPress();
                }
                // Show reset button and announce final score
                $("#name-display").hide()
                $("#reset-area").show();
                $("#final-display").html("Congrats " + username + " your score is " + score + " would you like to play again?");
            }
        // Play the game

        // Helper function to test if character is at the end
            function testEnd()
            {
                return currentButton == endingButton;
            }
        // Helper function to test if character is at the end
        
    // Main game loop, if game is in progress, wait for movement and updated position
// Game functionality
