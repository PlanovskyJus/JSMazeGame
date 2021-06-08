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

// Get the path from start to end
async function createPath()
{
    getNextButton();
    while(!pathComplete)
    {
        await getNextButton();
    }
    

}

function getNextButton()
{
    if(currentButton != null)
    {
        let r = currentButton;
        currentButton = null;
        console.log("R " + r);
        return r;
    }
    else
    {
        currentButton = null;
        waitForNextButton();
    }
}

function waitForNextButton()
{
    if(currentButton == null) setTimeout(function() {waitForNextButton();});
    else return doneWaitingNextButton();
}

function doneWaitingNextButton()
{
    let i = currentButton.substr(0, currentButton.indexOf("-"));
    let j = currentButton.substr(currentButton.indexOf("-") + 1, currentButton.length);
    let div = document.getElementById(currentButton);
    if(div.className != "wall-block")
    {
        console.log("This is not a wall block");
        console.log("col = " + i);
        console.log("row = " + j);
        div.style.backgroundColor = "blue";
        getNextButton(currentButton);
    }
    else
    {
        console.log("This is wall");
        currentButton = null;
        getNextButton();
    }
}

function isConnectedPath()
{

}