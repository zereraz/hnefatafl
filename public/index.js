window.onload = function(){
		
		//Board
        var globalState = getInitGlobalState();
        
        // chief/king is fist
        // shield are one's protecting king
        // swords are those trying to capture king
        var colorMap = {
        	"fist" : "#efc818",
        	"shield" : "#27ae60",
        	"swords" : "#e65243"
        }

        var canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d'),
            canvasW,
            canvasH;

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
        	drawGrid();
        	addPlayers();
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
        	var cubeW = w/11,
        		cubeH = h/11;
        	console.log(cubeH, cubeW)
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

       	}
}
