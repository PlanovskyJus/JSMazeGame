$(document).ready(function (){
    buildGrid();
    getButtons();
});

var maxCols = 33;
var maxRows = 33;

function buildGrid(){

    for(var i = 0; i < maxRows; i++)
    {
        for(var j = 0; j < maxCols; j++)
        {
            var div = document.createElement("div");
            div.id= "" + i + "" + j + "";
            var colString = "grid-column: " + (j + 1);
            var rowString = "grid-row: " + (i + 1);
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

var buttons = [];
var currentButton = null;

function getButtons()
{
    for(var i = 0; i < maxRows; i++)
    {
        for(var j = 0; j < maxCols; j++)
        {
            var colString = "" + i;
            var rowString = "" + j;
            var div = document.getElementById(colString + rowString);
            buttons.push(div);
        }
    }
    addButtonListeners();
}

function addButtonListeners()
{
    for(var i = 0; i < buttons.length; i++)
    {
        var buttonString = "" + buttons[i].id;
        document.getElementById(buttonString).addEventListener("click", function(){
            currentButton = buttonString;
            console.log("Button " + currentButton + " pushed");
        });
        // buttons[i].addEventListener("click", function(){
        //     console.log("buttons " + buttons[i].id);
        // })
    }
}