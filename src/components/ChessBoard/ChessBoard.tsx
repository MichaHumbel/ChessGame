import { FunctionComponent, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import whitePawn from '../../assets/pieces/pawn-w.svg';
import moveAudio from '../../assets/sounds/move-self.mp3';
import { GAME_BOARD_SIZE } from '../../constants/gameBoardConstants';
import { pieces } from '../../constants/pieces';
import { PieceColorEnum } from '../../enums/piece-color.enum';
import { PieceTypeEnum } from '../../enums/piece-type.enum';
import useAudio from '../../hooks/useAudio';
import { PieceType } from '../../types/piece.type';
import Square from '../Square/Square';

interface ChessBoardProps {}

const ChessBoard: FunctionComponent<ChessBoardProps> = () => {
  const [gameState, setGameState] = useState<PieceType[]>(pieces);
  const { toggleSound, setPlaying } = useAudio(moveAudio);

  // TODO: move to helper functions
  const makeMove = (draggedPiece: PieceType, dropIndex: number) => {
    // TODO: if you play fast and an audio is still playing, it doesn't play for each move
    setPlaying(false);
    toggleSound();
    setGameState((prevGameState) =>
      // TODO: rewrite this to reduce
      // 1. replace the item at dropped index with draggedPiece
      // 2. replace the item where the draggedPiece started to an empty piece
      prevGameState.map((gameStatePiece: PieceType) => {
        // if drop square is occupied
        if (
          gameStatePiece.index === dropIndex &&
          gameStatePiece.type !== PieceTypeEnum.EMPTY
        ) {
          console.log('this square is occupied');
          // sets the captured piece as captured
          return {
            ...gameStatePiece,
            type: PieceTypeEnum.PAWN,
            color: PieceColorEnum.WHITE,
            img: whitePawn,
            isFirstMove: false,
            index: dropIndex,
          };
        }

        if (gameStatePiece.index === draggedPiece.index) {
          console.log('here');
          return { ...draggedPiece, index: dropIndex, isFirstMove: false };
        }
        return gameStatePiece;
      })
    );
  };

  useEffect(() => {
    console.log(gameState);
  }, [gameState]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="flex flex-wrap"
        style={{ width: GAME_BOARD_SIZE, height: GAME_BOARD_SIZE }}
      >
        {gameState.map((_, i) => {
          const piece = gameState.find((el) => el.index === i && !el.captured);

          return (
            <Square
              gameState={gameState}
              piece={piece}
              index={i}
              makeMove={makeMove}
              key={`square-${i}`}
            />
          );
        })}
      </div>
    </DndProvider>
  );
};

export default ChessBoard;
