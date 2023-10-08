import { atomWithStorage } from "jotai/utils";

export const pomodoroTodyRoundsAtom = atomWithStorage<{
  date: string;
  rounds: number;
}>("pomodoro-rounds", {
  date: new Date().toDateString(),
  rounds: 0,
});

export const todoListAtom = atomWithStorage<{
  date: string;
  todos: { id: number; text: string; done: boolean }[];
}>("todos-atom", {
  date: new Date().toDateString(),
  todos: [],
});

// first time user using the mini-app (used to show the user the stories)
export const isNewUserAtom = atomWithStorage("is-new-user", false);
