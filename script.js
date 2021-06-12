$(document).ready(function (){
    buildGrid();
    $("#body-grid").hide();
    $("#upload-grid").hide();
    $("#name-grid").hide();
    $("#name-display").hide();
    $("#reset-area").hide();
    document.getElementById("upload").addEventListener("change", loadFile, false);

});

let maxCols = 33;
let maxRows = 33;

let buttons = [];
let currentButton = null;
let startingButton = null;
let endingButton = null;
let pathComplete = false;
let callWhenButtonPushed = null;
let lastButton = null;
let path = [];
let gameInProgress = true;
let username = '';
let score = 0;

function startCreation()
{
    $("#buttons").hide();
    $("#body-grid").show();
    getButtons();
    getStartingPoint();
    $("#talking-point").html("Click the enter point of your maze");
}


// Setup the grid in the display
    function buildGrid(){

        // Create a grid that has walls around the edge and blocks with different classes to denote different types
        for(let i = 0; i < maxRows; i++)
        {
            for(let j = 0; j < maxCols; j++)
            {
                let div = document.createElement("div");
                div.id= "" + i + "-" + j + "";
                let colString = "grid-column: " + (j + 1);
                let rowString = "grid-row: " + (i + 1);
                div.setAttribute("class", "inner-block"); 
                if(i == 0 || j == 0 || i == maxRows - 1 || j == maxCols - 1)
                {
                    div.setAttribute("class", "wall-block");
                }
                if(i == 1 && j != 0 && j != maxRows - 1)
                {
                    div.setAttribute("class", "edge-block");
                }
                else if(j == 1 && i != 0 && i != maxCols - 1)
                {
                    div.setAttribute("class", "edge-block");
                }
                else if(i == maxCols - 2 && j != 0 && j != maxRows - 1)
                {
                    div.setAttribute("class", "edge-block");
                }
                else if(j == maxCols - 2 && i != 0 && i != maxCols - 1)
                {
                    div.setAttribute("class", "edge-block");
                }
                
                div.setAttribute("style", colString + "; " + rowString + ";");
                
                $("#body-grid").append(div);
            }
        }
    }
// Setup the grid in the display

// Getting the starting and ending blocks and setup buttons

    // Setup each tile as a button with a unique id and listener
        // For each element with an id that belongs to the grid, add it to a list of buttons and add a listener to it 
        function getButtons()
        {
            for(let i = 0; i < maxRows; i++)
            {
                for(let j = 0; j < maxCols; j++)
                {
                    let colString = "" + i;
                    let rowString = "" + j;
                    let div = document.getElementById(colString + "-" + rowString);
                    buttons.push(div);
                }
            }
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

    // Getting the starting and ending buttons is not optimal but it works great
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

        function waitForButtonStart()
        {
            if(currentButton == null) setTimeout(function() {console.log("Waiting..."); waitForButtonStart()}, 200);
            else return doneWaitingForStart();
        }

        // Button was pushed, now detect if it was valid
        function doneWaitingForStart()
        {
            // console.log("Button pushed + " + currentButton);
            let i = currentButton.substr(0, currentButton.indexOf("-"));
            let j = currentButton.substr(currentButton.indexOf("-") + 1, currentButton.length);
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

        function waitForButtonEnd()
        {
            if(currentButton == null) setTimeout(function() {console.log("Waiting..."); waitForButtonEnd()}, 200);
            else return doneWaitingForEnd();
        }

        // Button was pushed, now detect if it was valid
        function doneWaitingForEnd()
        {
            // console.log("Button pushed + " + currentButton);
            let i = currentButton.substr(0, currentButton.indexOf("-"));
            let j = currentButton.substr(currentButton.indexOf("-") + 1, currentButton.length);
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
                const theButton = await waitForNextButton();
                console.log("theButton " + theButton); 
                if(document.getElementById(theButton).className == "inner-block" || theButton == endingButton)
                {
                    // i and j are the position of the currently pressed button
                    let i = theButton.substr(0, theButton.indexOf("-"));
                    let j = theButton.substr(theButton.indexOf("-") + 1, theButton.length);
                    console.log("last button " + lastButton);
                    // k and l are the position of the last pressed button, or start on first runthrough 
                    let k = lastButton.substr(0, lastButton.indexOf("-"));
                    let l = lastButton.substr(lastButton.indexOf("-") + 1, lastButton.length);
                    if(isNextTo(i, j, k, l))
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
                    alert("Path cannot go along the edge");
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
            let lastBlock = path[1];
            console.log("starting offshoots");
            while(!pathComplete)
            {
                const theButton = await waitForNextButton();
                // Validate that this is an offshoot block
                // Offshoot blocks cannot: be a path block, be next to 2 path blocks, 
                // Will need to loop through every block in the path to validate
                let nextTo = 0;
                // i and j are the position of the currently pressed button
                let i = theButton.substr(0, theButton.indexOf("-"));
                let j = theButton.substr(theButton.indexOf("-") + 1, theButton.length);
                let lastA = lastBlock.substr(0, lastBlock.indexOf("-"));
                let lastB = lastBlock.substr(lastBlock.indexOf("-") + 1, lastBlock.length);
                // User must click the ending block to end creating offshoots
                if(i == lastA && j == lastB)
                {
                    console.log("ending offshoots");
                    pathComplete = true;
                    $("#talking-point").html("Save your maze! Refresh the page to load and play.");
                    saveCurrentLevel(path, "pathName");
                    break;
                }
                // Find out how many path blocks this button is next to
                for(let a = 0; a < path.length; a++)
                {
                    let pathBlock = path[a];
                    let k = pathBlock.substr(0, pathBlock.indexOf("-"));
                    let l = pathBlock.substr(pathBlock.indexOf("-") + 1, pathBlock.length);
                    console.log("k " + k);
                    console.log("l " + l);
                    if(isNextTo(i, j, k, l))
                    {
                        nextTo += 1;
                    }
                }
                // If the block isnt next to only 1 path block, its invalid
                if(nextTo != 1)
                {
                    // Invalid selection for a path block
                    alert("Invalid position, cannot touch more than one path block");
                }
                else if (theButton.className == "path-block")
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
        }
    // Allow the user to create paths that do not lead to the finish

    // Use this to determine if the button pushed is left, right, up, or down by 1 from the previous block
        function isNextTo(i, j, k, l)
        {
            i = parseInt(i);
            j = parseInt(j);
            k = parseInt(k);
            l = parseInt(l);

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
            let file = new Blob([path], {type: "text/plain"});
            let a = document.createElement("a");
            let url = URL.createObjectURL(file);
            a.href = url;
            a.download = levelName;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    // Save current path to a file

// Create the complete maze path

// Handle username input
    function loadUsername()
    {
        $("#name-grid").show();
        $("#buttons").hide();
        $("#upload-grid").hide();
        $("#talking-point").html("Insert a username");
        let name = $("#name-input").val();
        if(name.length >= 3 && name.length <= 20)
        {
            // Valid username
            console.log("valid name");
            username = name;
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
        $("#upload-grid").show();
        $("#buttons").hide();
        $("#name-grid").hide();
        $("#talking-point").html("Upload a maze to begin");
        // Reset this name input so on refresh page it asks again
        $("#name-input").val("")
        // console.log("loading files");
        let files = event.target.files; // Filelist object

        let f = files[0];

        let reader = new FileReader();

        reader.onload = (function(theFile) {
            return function(e) {
                // Load the path from here, then create the path on the board
                
                let newPath = e.target.result.split(",");
                console.log(newPath);
                // Create the maze from provided path
                startingButton = newPath[0];
                endingButton = newPath[1];
                newPath = shuffle(newPath);
                
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
        $("#body-grid").show();
        $("#upload-grid").hide();
        $("#name-display").show();
        $("#talking-point").html("Lets play! Use arrow keys to move");
        $("#username").html("User: " + username);
        // Set the styles of path blocks to indicate type
        for(let i = newPath.length - 1; i >= 0; i--)
        {
            document.getElementById(newPath[i]).setAttribute("class", "path-block")

            await new Promise(r => setTimeout(r, 10));
            
        }
        // Setup starting and ending blocks as unique
        document.getElementById(startingButton).setAttribute("class", "start-end-block");
        document.getElementById(endingButton).setAttribute("class", "start-end-block");
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
        async function tryMovement(keyCode)
        {
            // console.log("trying movement");
            // console.log("cur button " + currentButton);
            score++;
            let i = currentButton.substr(0, currentButton.indexOf("-"));
            let j = currentButton.substr(currentButton.indexOf("-") + 1, currentButton.length);
            if(keyCode == '40')
            {
                // down
                i++;
            }
            else if(keyCode == '38')
            {
                // up
                i--;
            }
            else if(keyCode == '37')
            {
                // left
                j--;
            }
            else
            {
                // right
                j++;
            }

            let nextBlock = i + "-" + j;
            // console.log("nextBlock = " + nextBlock);
            // console.log("currentBlock = " + currentButton);
            if(isPathBlock(nextBlock))
            {
                console.log("it is a path block");
                document.getElementById(currentButton).innerHTML = "";
                document.getElementById(nextBlock).innerHTML = "♦";
                // console.log("next block is " + nextBlock);
                currentButton = nextBlock;
                // console.log("now current " + currentButton);
                
                if(testEnd())
                {
                    $("#talking-point").html("Game over, you win!");
                    gameInProgress = false;
                }
            }
            // else wait for next arrow input
        }

        function isPathBlock(block)
        {
            for(let i = 0; i < path.length; i++)
            {
                if(block == path[i])
                {
                    return true;
                }
            }
            return false;
        }
    // Test that movement goes along the path

    // Move character from block to block
        // Play the game
            async function playGame()
            {
                // Reset the functionality on reset, this does nothing if on first run
                $("#reset-area").hide();
                $("#final-display").html("");
                $("#name-display").show();
                gameInProgress = true;
                score = 0;
                $("#scoreboard").html("Score: " + score);

                // Set starting point with inidcator of current position
                document.getElementById(startingButton).innerHTML = "♦";
                currentButton = startingButton;
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

        // Test if character is at the end
            function testEnd()
            {
                return currentButton == endingButton;
            }
        // Test if character is at the end
        
    // Move character from block to block
// Game functionality
