# Welcome to Super Tic Tac Toe!
##### -by K. Fryauff

This project is a two-player Super TicTacToe game.

## Game Board & Game Objectives

Super TicTacToe consists of 9 tictactoe boards (sub-boards) that make up the 9 spaces of a super-tictactoe board.  To win the game, a player must win the super-tictactoe board, getting a row, column, or diagonal of three won sub-boards.  To win a sub-board, a player must get a row, column, or diagonal of three of their corresponding symbols (X or O).


## Rules of Play

1. This is a two player game ('X' and 'O'), 9 sub-tictactoe boards, and one super-tictactoe board.  
2. Each player takes turns selecting a single, empty space from an active sub-boards.  To start the game, all sub-boards are active.
3. A board becomes active if and only if either the last player's move was in the same position on the sub-board as the sub-board is on the super-board, or if the corresponding sub-board to the last move is unavailable (having been previously won or drawn), in which case all other available sub-boards become active.
4. Once a sub-board is won, the entire sub-board is claimed for the victor, and that becomes that player's space on the super-board. If the sub-game is drawn (no one has won), the sub-board is considered drawn and claimed by no player on the super-board.
5. The game ends if one player has won or if the super-board is drawn. The game is won if there exists a row, column, or diagonal of claimed sub-boards for one player. The game is drawn if no active sub-boards exist.


## Running the server

1) You can launch the app from the Terminal (from inside the base project directory):

    $ node server.js







\-\-

This project was created using the Cloud9 IDE.