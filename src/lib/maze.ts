type TCords = {
  x: number;
  y: number;
};

const randomNumberBetween = (a: number, b: number) =>
  Math.floor(Math.random() * (b - a)) + a;

export class Maze {
  board: Cell[][] = [];
  size: number;

  constructor(size = 32) {
    this.size = size;

    this.generateMaze();
  }

  resetBoard() {
    this.board = [];
    for (let y = 0; y < this.size; y++) {
      const newRow = [];
      for (let x = 0; x < this.size; x++) {
        newRow.push(
          new Cell(this, {
            x,
            y,
          }),
        );
      }
      this.board.push(newRow);
    }
  }

  generateMaze() {
    this.resetBoard();
    const entryCell = this.board[randomNumberBetween(0, 32)]?.[0];
    if (!entryCell) return;
    entryCell.setType("entry");
    entryCell.visit();

    const stack = [entryCell];

    while (stack.length > 0) {
      const currentCell = stack.pop();
      if (!currentCell?.hasUnvisitedNeighbours()) continue;

      stack.push(currentCell);
      const unvisitedNeighbour = currentCell.randomUnvisitedNeighbour();
      if (!unvisitedNeighbour) continue;
      const shouldMove = currentCell.whereToMove(unvisitedNeighbour);
      currentCell.canMove.push(shouldMove);
      const unvisitedShouldMove = unvisitedNeighbour.whereToMove(currentCell);
      unvisitedNeighbour.canMove.push(unvisitedShouldMove);
      unvisitedNeighbour.visit();
      stack.push(unvisitedNeighbour);
    }
    const y = randomNumberBetween(
      entryCell.cords.y > 15 ? 0 : 15,
      entryCell.cords.y > 15 ? 15 : 32,
    );
    const x = randomNumberBetween(15, 32);
    const exitCell = this.board[y]?.[x];
    exitCell?.setType("exit");
  }
}

export class Cell {
  /*
  value:
  0 -> nothing
  1 -> path
  2 -> entry
  3 -> exit
  */
  public value: number;
  static types = {
    normal: "normal",
    entry: "entry",
    exit: "exit",
  } as const;
  public type: keyof typeof Cell.types = Cell.types.normal;

  private visited: boolean;
  readonly cords: TCords;
  private maze: Maze;
  public canMove: ("up" | "down" | "right" | "left")[] = [];

  constructor(maze: Maze, cords: TCords, value = 0) {
    this.value = value;
    this.visited = false;
    this.cords = cords;
    this.maze = maze;
  }

  private getNeighbours() {
    const neighbours: Cell[] = [];

    const topNeighbour = this.maze.board[this.cords.y - 1]?.[this.cords.x];
    if (topNeighbour) {
      neighbours.push(topNeighbour);
    }
    const bottomNeighbour = this.maze.board[this.cords.y + 1]?.[this.cords.x];
    if (bottomNeighbour) {
      neighbours.push(bottomNeighbour);
    }
    const leftNeighbour = this.maze.board[this.cords.y]?.[this.cords.x - 1];
    if (leftNeighbour) {
      neighbours.push(leftNeighbour);
    }
    const rightneighbour = this.maze.board[this.cords.y]?.[this.cords.x + 1];
    if (rightneighbour) {
      neighbours.push(rightneighbour);
    }

    return neighbours;
  }

  setValue(v: number) {
    this.value = v;
  }

  setType(newType: keyof typeof Cell.types) {
    this.type = newType;
  }

  visit() {
    this.visited = true;
  }

  wasVisited() {
    return this.visited;
  }

  hasUnvisitedNeighbours() {
    // console.log(this.cords);
    const neighbours = this.getNeighbours();
    return neighbours.some((neighbour) => !neighbour.wasVisited());
  }

  randomUnvisitedNeighbour() {
    const neighbours = this.getNeighbours();
    const unvisitedNeighbours = neighbours.filter(
      (neighbour) => !neighbour.wasVisited(),
    );

    return unvisitedNeighbours[
      Math.floor(Math.random() * unvisitedNeighbours.length)
    ];
  }

  whereToMove(cell: Cell): "up" | "down" | "right" | "left" {
    if (cell.cords.x > this.cords.x) {
      return "right";
    }
    if (cell.cords.x < this.cords.x) {
      return "left";
    }
    if (cell.cords.y > this.cords.y) {
      return "down";
    }
    if (cell.cords.y < this.cords.y) {
      return "up";
    }
    throw new Error("nowhere");
  }
}
