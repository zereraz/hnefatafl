window.onload = function(){
		
		//Board
        var globalState = getInitGlobalState();
        var cubeW,
            cubeH;
        
        // chief/king is fist
        // shield are one's protecting king
        // swords are those trying to capture king
        var objectMap = {
        	"fist" : {
                        color:"#efc818",
                        pos:[{x:5,y:5}]
                    },
        	"shield" : {
                        color: "#27ae60",
                        pos:[
                            {x:5, y:3},
                            {x:4, y:4}, {x:5, y:4}, {x:6, y:4},
                            {x:3, y:5},
                            {x:4, y:4}, {x:4, y:5}, {x:4, y:6},
                            {x:7, y:5},
                            {x:6, y:4}, {x:6, y:5}, {x:6, y:6},
                            {x:5, y:7},
                            {x:4, y:6}, {x:5, y:6}, {x:6, y:6}
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
        }

        var canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d'),
            canvasW,
            canvasH ;

        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', resizeCanvas, false);
        
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
            for(var key in objectMap){
                var arr = objectMap[key].pos;
                for(var pos in arr){                    
                    drawRect(arr[pos].x*cubeW + 5, arr[pos].y*cubeH + 5, cubeW - 10, cubeH - 10, objectMap[key].color);
                }
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
            addPlayers();
       	}

        // function to find the square based on x,y of click
}
