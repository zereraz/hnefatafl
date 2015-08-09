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
                        initPos:[{x:5,y:5}]
                    },
        	"shield" : {
                        color: "#27ae60",
                        initPos:[]
                    },
        	"swords" : {
                        color: "#e65243",
                        initPos:[]
                    }
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

        function addPlayers(){
            for(var key in objectMap){
                var arr = objectMap[key].initPos;
                for(var pos in arr){                    
                    drawRect(arr[pos].x*cubeW, arr[pos].y*cubeH, cubeW, cubeH, objectMap[key].color);
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

       	}
}
