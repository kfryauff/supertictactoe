// Setup Constants
var DEFAULT_DIM = 3,
    EMPTY = 0,
    IN_PLAY = 0,
    DRAW = 3;

var app = angular.module('superttt', []);

app.factory('SubBoard', [function() {
    var dim = DEFAULT_DIM;
    
    var subBoard = function(newDim) {
        dim = newDim || dim;
        this.num_moves = 0;
        
        // 3x3 board
        this.winner = 0;
        this.board = [];
        this.active = true;
        
        for(var i = 0; i < dim; i++) {
            this.board[i] = [];
            for(var j = 0; j < dim; j++) {
                this.board[i][j] = 0;
            }
        }
    };
    
    subBoard.prototype.getState = function() {
        if(this.winner === 1) return 'win_one';
        if(this.winner === 2) return 'win_two';
        if(this.winner === 3) return 'draw';
        if(this.active) return 'active';
        return 'inactive';
    }
    
    subBoard.prototype.checkWin = function(x, y) {
        var i; var player = this.board[x][y];
        if(player !== DRAW) {
            // check horizontal & vertical
            var winx = 0, winy = 0;
            for(i=0; i < dim; i++) {
                if(this.board[x][i] === player) { winx++; }
                if(this.board[i][y] === player) { winy++; }
            }
            if(winx >= dim || winy >= dim) { this.winner = player; }
            
            // check diagonal
            if(this.winner === 0 && (x+y) % 2 === 0) {
                winx = 0, winy = 0;
                for(i = 0; i < dim; i++) {
                    var iprime = dim - i - 1;
                    if(this.board[i][iprime] === player) { winy++; }
                    if(this.board[i][i] === player) { winx++; }
                }
                if(winx >= dim || winy >= dim) { this.winner = player; }
            }
        }
        // check Draw
        if(this.winner === 0 && this.num_moves >= dim * dim) {
            this.winner = DRAW;
            console.log("DRAW!");
        }
        
        // update active board
        if(this.winner !== 0) {
            this.active = false;
        }
        
        return this.winner;
    }
    
    subBoard.prototype.turn = function(x, y, player) {
        if(this.winner !== 0 || this.active === false || this.board[x][y] !== 0) { // not empty
            console.log("noTurn, 1:", this.winner !== 0, "2:", this.active === false, "3:", this.board[x][y] !== 0, ' value: x=', x, 'y=', y, 'val=', this.board[x][y]);
            return -1;
        }
        
        this.board[x][y] = player;
        this.num_moves++;
        return(this.checkWin(x, y));
    }
    
    return subBoard;
}]);

app.controller('MainCtrl', ['$scope', 'SubBoard', function($scope, SubBoard) {
    // Board = 2D array of SubBoards
    // player --> toggled on play action
    $scope.gameBoard = new SubBoard();
    $scope.board = [];
    $scope.player = 1; // toggle players from 1, 2
    
    // Setup
    var dim = DEFAULT_DIM;
    for(var i=0; i< dim; i++) {
        $scope.board[i] = [];
        for (var j=0; j < dim; j++) {
            $scope.board[i][j] = new SubBoard();
        }
    }
    console.log('board: ', $scope.board);
    
    
    // Helpers:
    $scope.updateGameStatus = function() {
        switch ($scope.gameBoard.winner) {
            case 1:
                return 'Player 1 Wins';
            case 2:
                return 'Player 2 Wins';
            case 3:
                return 'DRAW!';
            default:
                return '';
        }
    }
    
    $scope.getMarker = function(player) {
        if(player === 1) {
            return 'X';
        } else if(player === 2) {
            return 'O';
        } else {
            return '';
        }
    }
    
    $scope.setAllBoardsActive = function(active) {
        for(var i = 0; i < dim; i++) {
            for(var j = 0; j < dim; j++) {
                if($scope.board[i][j].winner === 0) {
                    console.log('setting board[', i, '][', j, '] to ', active);
                    $scope.board[i][j].active = active;
                }
            }
        }
    }
    
    $scope.setActiveBoards = function(nextBoardX, nextBoardY) {
        // states:
        //  all boards active (start of game, if nextBoardX,Y is Draw, Won, or Lost)
        //  single board active (iff nextBoardX,Y is an active game);
        var nextBoard = $scope.board[nextBoardX][nextBoardY];
        if(nextBoard.winner === IN_PLAY) {
            $scope.setAllBoardsActive(false);
            nextBoard.active = true;
            console.log('setting active: ', nextBoard);
        } else {
            $scope.setAllBoardsActive(true);
            console.log('setting active: all boards');
        }
    }
    
    // Actions:
    $scope.playerTurn = function(boardx, boardy, x, y) {
        if($scope.gameBoard.winner !== 0) {
            $scope.gameBoard.active = false;
            console.log('INACTIVE GAME, GAME ENDED');
        }
        var tryBoard = $scope.board[boardx][boardy];
        var status = tryBoard.turn(x, y, $scope.player);
        var player = $scope.player;
        
        // err on status
        if (status === -1) {
            console.log('STATE ERROR');
            return;
        }
        
        // zero --> normal game play
        // player# --> won board
        if (status !== IN_PLAY) {
            console.log('Game End, status=', status);
            var gameEnd = $scope.gameBoard.turn(boardx, boardy, status);
            if (gameEnd > IN_PLAY) {
                // stop game, player has won
                console.log('game winner: ', gameEnd);
                $scope.setAllBoardsActive(false);
                return;
            }
        }
        
        $scope.player = (player % 2) + 1;
        $scope.setActiveBoards(x, y);
    }
    
}]);

app.controller('Ctrl', ['$scope', '$http', function($scope, $http) {
    $scope.title = "Countries Selector";
    $scope.countries = [];
    
    $scope.removeCountry = function(name) {
      var i;
      for(i=0; i<$scope.countries.length; i++) {
        if($scope.countries[i].name === name) {
          $scope.countries[i].selected = false;
          return;
        }
      }
    }
    
    $http({
      method: "GET",
      url: "https://restcountries.eu/rest/v1/all"
    }).then(function(response) {
      var i;
      for(i = 0; i < response.data.length; i++) {
        $scope.countries[i] =
          {name: response.data[i].name,
           selected: false};
      }
    });
}]);