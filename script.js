$(document).ready(function (){
    buildGrid();
    getButtons();
    getStartingPoint();

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


// Setup the grid in the display
    function buildGrid(){

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


// Setup each tile as a button with a unique id
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
// Setup each tile as a button with a unique id

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
            currentButton = null;
            getStartingPoint();
        }
    }
// Get the starting button

// Get the ending button
    function getEndingPoint()
    {
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
            currentButton = null;
            getEndingPoint();
        }
    }
// Get the ending button

function waitForNextButton()
{
    return new Promise(resolve => {
        callWhenButtonPushed = resolve;
    });
}

// Create the path from start to finish
async function createPath()
{
    while(!pathComplete)
    {
        // TODO: validate that nextButton is next to the start or last path block
        // TODO: detect when route is at the end
        const theButton = await waitForNextButton();
        console.log("theButton " + theButton); 
        if(document.getElementById(theButton).className == "inner-block")
        {
            let i = theButton.substr(0, theButton.indexOf("-"));
            let j = theButton.substr(theButton.indexOf("-") + 1, theButton.length);
            console.log("last button " + lastButton);
            let k = lastButton.substr(0, lastButton.indexOf("-"));
            let l = lastButton.substr(lastButton.indexOf("-") + 1, lastButton.length);
            if(isNextTo(i, j, k, l))
            {
                console.log("correct");
                document.getElementById(lastButton).style.backgroundColor = "blue";
                document.getElementById(lastButton).setAttribute("class", "path-block");
                lastButton = theButton;
            }
            else
            {
                console.log("wrong");
            }

        }
    }
}

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
