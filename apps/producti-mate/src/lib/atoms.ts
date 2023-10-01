import { atomWithStorage } from "jotai/utils"

export const pomodoroTodyRoundsAtom = atomWithStorage<{ date: string; rounds: number }>("pomodoro-rounds", {
  date: new Date().toDateString(),
  rounds: 0,
})
