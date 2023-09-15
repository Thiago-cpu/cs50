import { create } from "zustand";
import { z } from "zod";
import { Maze } from "@/lib/maze";

const SearchTypeEnum = z.enum(["dfs", "bfs"]);

type TSearchType = z.infer<typeof SearchTypeEnum>;

interface MazeState {
  maze: Maze;
  searchType: TSearchType;
  setSearchType: (searchType: string) => void;
  newMaze: () => void;
}

export const useMazeStore = create<MazeState>()((set) => {
  const maze = new Maze(32);

  return {
    maze,
    searchType: "dfs",
    setSearchType: (searchType) => {
      const SearchTypeParsed = SearchTypeEnum.safeParse(searchType);
      if (SearchTypeParsed.success) {
        set(() => ({ searchType: SearchTypeParsed.data }));
      }
    },
    newMaze: () => {
      maze.generateMaze();
      set(() => ({ maze }));
    },
  };
});
