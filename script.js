$(document).ready(function (){
    buildGrid();
    getButtons();
});

let maxCols = 33;
let maxRows = 33;

function buildGrid(){

    for(let i = 0; i < maxRows; i++)
    {
        for(let j = 0; j < maxCols; j++)
        {
            let div = document.createElement("div");
            div.id= "" + i + "" + j + "";
            let colString = "grid-column: " + (j + 1);
            let rowString = "grid-row: " + (i + 1);
            div.setAttribute("class", "inner-block"); 
            if(i == 0 || j == 0 || i == maxRows - 1 || j == maxCols - 1)
            {
                div.setAttribute("class", "wall-block");
            }
            div.setAttribute("style", colString + "; " + rowString + ";");
            
            $("#body-grid").append(div);
        }
    }
}

let buttons = [];
let currentButton = null;

function getButtons()
{
    for(let i = 0; i < maxRows; i++)
    {
        for(let j = 0; j < maxCols; j++)
        {
            let colString = "" + i;
            let rowString = "" + j;
            let div = document.getElementById(colString + rowString);
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
            console.log("Button " + currentButton + " pushed");
        });
        // buttons[i].addEventListener("click", function(){
        //     console.log("buttons " + buttons[i].id);
        // })
    }
}