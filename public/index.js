window.onload = function(){
		//globals
		//Board
        var globalState = getInitGlobalState();
        var cubeW,
            cubeH;
        var selectedSquare = null,
            moveToSquare = null,
            selectedColor = "#4e4e56";

        // chief/king is fist
        // shield are one's protecting king
        // swords are those trying to capture king
        var objectMap = {
        	"fist" : {
                        color:"#efc818",
                        pos:[{x:5, y:5}]
                    },
        	"shield" : {
                        color: "#27ae60",
                        pos:[
                            {x:5, y:3},
                            {x:4, y:4}, {x:5, y:4}, {x:6, y:4},
                            {x:3, y:5},
                            {x:4, y:5}, {x:4, y:6},
                            {x:7, y:5},
                            {x:6, y:5}, {x:6, y:6},
                            {x:5, y:7},
                            {x:5, y:6}
                        ]
                    },
        	"swords" : {
                        color: "#e65243",
                        pos:[
                            {x:1, y:5},
                            {x:0, y:3},{x:0, y:4},{x:0, y:5},{x:0, y:6},{x:0, y:7},
                            {x:5, y:1},
                            {x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},
                            {x:9, y:5},
                            {x:10, y:3},{x:10, y:4},{x:10, y:5},{x:10, y:6},{x:10, y:7},
                            {x:5, y:9},
                            {x:3, y:10},{x:4, y:10},{x:5, y:10},{x:6, y:10},{x:7, y:10}
                        ]
                    }
        };

        var specialSquares = {
                color: "#c0d5db",
                pos:[
                    {x:5, y:5},
                    {x:0, y:0},{x:0, y:10},{x:10, y:0},{x:10, y:10}
                ]
        }

        var canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d'),
            canvasW,
            canvasH ;

        
        function resizeCanvas() {
            canvasW = window.innerHeight;
            canvasH = window.innerHeight;
            canvas.width = canvasW;
            canvas.height = canvasH;
            render(); 
        }
        resizeCanvas();
        
        function render() {
            clearRect();
            setupBoard();
        }

        function clearRect(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        function addPlayers(){
            if(selectedSquare){
                drawRect(selectedSquare.x*cubeW, selectedSquare.y*cubeH, cubeW, cubeH, selectedColor);
            }
            for(var key in objectMap){
                var arr = objectMap[key].pos;
                for(var pos in arr){                    
                    drawRect(arr[pos].x*cubeW + 5, arr[pos].y*cubeH + 5, cubeW - 10, cubeH - 10, objectMap[key].color);
                }
            }
        }

        function drawBoard(){
            var board = specialSquares.pos;
            for(var pos in board){
                drawRect(board[pos].x*cubeW + 5, board[pos].y*cubeH + 5, cubeW - 10, cubeH - 10, specialSquares.color);
            }
        }

        function drawRect(x, y, w, h, c){
            ctx.fillStyle = c;
            ctx.fillRect(x, y, w, h);
        }
        
        function getInitGlobalState(){
        	var globalState = [];
        	for(var i = 0; i < 11; i++){
        		globalState.push([]);
        		for(var j = 0 ; j < 11; j++){
        			globalState[i].push(0);
        		}
        	}
        	return globalState;
        }

        function drawGrid(){
        	var h = canvas.height,
        	 	w = canvas.width;
        	cubeW = w/11;
        	cubeH = h/11;
        	for(var i = 1; i < 11; i++){
        		drawLine(cubeW*i, 0, cubeW*i, h);
        		drawLine(0, cubeH*i, w, cubeH*i);
        	}
        }

        function drawLine(x1,y1, x2,y2){
        	ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
        }

       	function setupBoard(){
            drawGrid();
            drawBoard();
            addPlayers();
       	}


        // bad code, refactor please!
        function getPosition(event){
            var pos = {};
            pos.x = (event.x || event.clientX) - canvas.offsetLeft;
            pos.y = (event.y || event.clientY) - canvas.offsetTop;
            if(!selectedSquare){
                if(selectedSquare = posToSquare(pos)){
                    render();
                    // square belongs to a piece
                    
                }else{
                    // do nothing, empty square                    
                    selectedSquare = null;
                }
            }else{
                // move that square
                if(moveToSquare = posToSquarePos(pos)){
                    if(!posToSquare(pos) && isValidMove(selectedSquare, moveToSquare)){
                        findAndReplace(selectedSquare, moveToSquare);
                        render();
                        selectedSquare = null;
                    }else{
                        selectedSquare = null;
                    }
                }else{

                }
                selectedSquare = null;
                render();
            }            
        }

        function isValidMove(selected, moveTo){
            //also check if nothing is in path
            if(selected.x === moveTo.x || selected.y === moveTo.y){
                if(!posInSpecialSquare(moveTo) || isKing(selected))
                    return nothingBetween(selected, moveTo);
            }else{
                return false;
            }
        }

        function isKing(square){
            var king = objectMap.fist.pos[0];
            return square.x === king.x && square.y === king.y;
        }

        function nothingBetween(selected, moveTo){
            //moving horizontally
            var from,
                to;
            if(selected.x - moveTo.x!==0){
                if(selected.x > moveTo.x){
                    to = selected.x;
                    from = moveTo.x;
                }else{
                    to = moveTo.x;
                    from = selected.x;
                }
                for (var i = from+1; i < to; i++) {
                    if(find(i, selected.y)){
                        return false;
                    }
                };
            }else{
                //moving vertically
                if(selected.y > moveTo.y){
                    to = selected.y;
                    from = moveTo.y;
                }else{
                    to = moveTo.y;
                    from = selected.y;
                }
                for (var i = from+1; i < to; i++) {
                    if(find(selected.x, i)){
                        return false;
                    }
                };

            }
            return true;
        }

        // need to figure this out
        function posInSpecialSquare(square){
            for(var i in specialSquares.pos){
                if(specialSquares.pos[i].x === square.x && specialSquares.pos[i].y === square.y){
                    return true;
                }
            }
            return false;
        }
        
        //use the find function here
        function findAndReplace(square, newSquare){
            for(var key in objectMap){
                var arr = objectMap[key].pos;
                for(var pos in arr){
                    if(arr[pos].x === square.x && arr[pos].y === square.y){
                        arr[pos] = newSquare;
                    }
                }
            }     
        }

        function find(x, y){
            for(var key in objectMap){
                var arr = objectMap[key].pos;
                for(var pos in arr){
                    if(arr[pos].x === x && arr[pos].y === y){
                        return true;//return pos
                    }
                }
            }
            return false;
        }        

        function posToSquare(clickPos){
              for(var key in objectMap){
                var arr = objectMap[key].pos;
                for(var pos in arr){
                    if(arr[pos].x*cubeW <= clickPos.x && (arr[pos].x+1)*cubeW > clickPos.x && arr[pos].y*cubeH < clickPos.y && (arr[pos].y+1)*cubeH > clickPos.y){
                        return arr[pos];
                    }
                }
            }
            return null;
        }

        function posToSquarePos(clickPos){
            for(var i = 0; i < 11; i++){
                for(var j = 0; j < 11; j++){
                    if(i*cubeW <= clickPos.x && (i+1)*cubeW > clickPos.x && j*cubeH < clickPos.y && (j+1)*cubeH > clickPos.y ){
                        return {x:i, y:j}
                    }
                }
            }
            return null;
        }

        function addEvents(){

            canvas.addEventListener("click", getPosition, false);
            // resize the canvas to fill browser window dynamically
            window.addEventListener('resize', resizeCanvas, false);
        }

        addEvents();
        // function to find the square based on x,y of click
        // highlight allowed moves with #c3fd53
}

