let UIController = {
    DOMString: {
        square: '.square',

        col1: '.s1, .s4, .s7',
        col2: '.s2, .s5, .s8',
        col3: '.s3, .s6, .s9',

        row1: '.s1, .s2, .s3',
        row2: '.s4, .s5, .s6',
        row3: '.s7, .s8, .s9',

        cross1: '.s1, .s5, .s9',
        cross2: '.s3, .s5, .s7',

        tour:'.tour',

        container: '.container',
        playAgain: '.play-again',
        gameOver: '.win-text',

        stats:'.stats',
        statsItems:'.stats__item',
        statsList:'.stats__list'

    },
    divElements: {
        x: `<i class="element bi bi-x-lg"></i>`,
        o: `<i class="element bi bi-circle"></i>`,
        lineRow: `<div class="line-row"></div>`,
        lineCol: `<div class="line-col"></div>`,
        lineCross1: `<div class="line-cross1"></div>`,
        lineCross2: `<div class="line-cross2"></div>`,
        gameOver: `<div class="win-text">The winner is %winner%<div class="play-again">Click to play again</div></div>` 
    },

    addPlayerMove: function(type, position){
        let squareName, square;
        
        squareName = '.s'+position;
        square = document.querySelector(squareName);

        switch(type){
            case 'x':
                square.innerHTML=this.divElements.x
                return;
            case 'o':
                square.innerHTML=this.divElements.o
                return;
            default:
                return -1        
        }
    },
    refresh: function(){
        let squares = document.querySelectorAll(this.DOMString.square)
        squares.forEach((square)=>{
            square.innerHTML=''
        });

        document.querySelector(this.DOMString.container).classList.remove('win')
        document.querySelector(this.DOMString.gameOver).remove()
    },
    writeTour: function(tour){
        let tourDisplay = document.querySelector(this.DOMString.tour);
        tourDisplay.innerHTML=`Now plays ${this.divElements[tour]}`;
    },

    drawLine: function(winPosition){
        let line, squares;

        if(winPosition.startsWith('row')) line = this.divElements.lineRow;
        else if(winPosition.startsWith('col')) line = this.divElements.lineCol;
        else if(winPosition==='cross1') line = this.divElements.lineCross1;
        else if(winPosition==='cross2') line = this.divElements.lineCross2;
        
        squares = document.querySelectorAll(this.DOMString[winPosition])

        squares.forEach((square)=>{
            square.innerHTML+=line;
        });
    },

    drawWinner: function(winner){
        if(winner==='o') winner=this.divElements.o;
        else if (winner==='x') winner=this.divElements.x;
        document.querySelector(this.DOMString.container).classList.add('win')

        document.querySelector('.win').insertAdjacentHTML('afterbegin', UIController.divElements.gameOver.replace('%winner%', winner))
    },
    addToHistory(winner){
        let list = document.querySelector(this.DOMString.statsList)
        
    }
}

var GameController = {
    tour: {
        actual: 'o',
        reverse:function(){
            if(this.actual==='o') return 'x'
            else if(this.actual==='x') return 'o'
        },
    },
    mapGame : {
        row1: ['', '', ''],
        row2: ['', '', ''],
        row3: ['', '', '']
    },
    history:{
        // game history
    },
    updateGameMap: function(number){
        if(number<=3)
            this.mapGame.row1[number-1]=this.tour.actual;
        else if(number>=4 && number<=6)
            this.mapGame.row2[number-4]=this.tour.actual;
        else
            this.mapGame.row3[number-7]=this.tour.actual;
    },
    refreshMap: function(){
        for(i=1; i<=3; i++)
            for(a=0; a<=2; a++) this.mapGame[`row${i}`][a]=''
    },
    checkMove: function(number){
        if(number<=3){
            if(this.mapGame.row1[number-1]!='') return false
            else return true;
        } else if(number>=4 && number<=6){
            if(this.mapGame.row2[number-4]!='') return false
            else return true;
        } else{
            if(this.mapGame.row3[number-7]!='') return false
            else return true;
        }
    },
    switchTour: function(){
        if(this.tour.actual=='x') this.tour.actual='o'
        else this.tour.actual='x'
    },

    // Checking if the player type won the game
    checkWin: function(){
        let map = this.mapGame;
        let fullCount = 0;
        let type, types=['o', 'x']
        let ok=0;

        for(z=0; z<=1; z++){
            fullCount=0;
            type=types[z]

            // check win in columns
            for(i=1; i<=3; i++){
                let actual = map[`row${i}`];
                if (actual[0]===type &&
                    actual[1]===type && 
                    actual[2]===type) return `row${i}`;
            }

            // check win in rows
            for(i=0; i<=2; i++){
                if(map.row1[i]===type &&
                map.row2[i]===type &&
                map.row3[i]===type){
                    return `col${i+1}`
                }
            }

            // check win in cross
            if(map.row1[0]===type &&
               map.row2[1]===type &&
               map.row3[2]===type) return 'cross1'

            // check win in cross
            if(map.row1[2]===type &&
               map.row2[1]===type &&
               map.row3[0]===type) return 'cross2'
                
            for(i=1; i<=3; i++){
                for(a=0; a<=2; a++) if(map[`row${i}`][a]!=='') fullCount++
            }
            if(fullCount>=9) return 'full'
        }
        return false;
    }
}

var Controller = {
    tour: GameController.tour,
    playerMove: function(number){

        if(GameController.checkMove(number)){
            UIController.writeTour(this.tour.reverse())
            UIController.addPlayerMove(this.tour.actual, number)
            GameController.updateGameMap(number)
            GameController.switchTour()
            this.gameOver(GameController.checkWin(this.tour.reverse()))
        }

    },

    gameOver: function(isWin){
        if(isWin==='full'){
            UIController.drawWinner('FULL MAP')
        }
        else if(isWin){
            UIController.drawLine(isWin)
            UIController.drawWinner(this.tour.reverse())

        } else{
            return false;
        }
        document.querySelector(UIController.DOMString.playAgain).addEventListener('click', this.refreshGame)
    },

    setupListeners: function(){
        for(let i=1; i<=9; i++){
            document.querySelector(`.s${i}`).addEventListener('click', ()=>{
                this.playerMove(i);
            })
        }
    },
    refreshGame: function(){
        GameController.refreshMap();
        UIController.refresh();
        console.log('ddd')
    },

    init: function(){
        let tour = GameController.tour;
        this.setupListeners();
        UIController.writeTour(tour.actual)
    },
}
Controller.init();