import { Divider } from "@/components/divider"
import { pomodoroTodyRoundsAtom } from "@/lib/atoms"
import { Route } from "@tanstack/react-router"
import { useHapticFeedback, useMainButton, useThemeParams } from "@twa.js/sdk-react"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import featureLayoutRoute from "../feature-layout"

const Pomodoro = () => {
  const [eachPodomoro, setEachPodomoro] = useState(25)
  const [minutes, setMinutes] = useState(eachPodomoro)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const habticFeedback = useHapticFeedback()
  const mainButton = useMainButton()
  const themeParams = useThemeParams()
  const [pomodoroTodyRounds, setPomodoroTodyRounds] = useAtom(pomodoroTodyRoundsAtom)

  useEffect(() => {
    habticFeedback.impactOccurred('soft')

    mainButton.on("click", () => {
      if (isRunning) {
        resetTimer()
      } else {
        toggleTimer()
      }
    })
    if (isRunning) {
      mainButton.setText("Reset").setBackgroundColor("#dc2626").enable().show()
    } else {
      mainButton.setText("Start").setBackgroundColor(themeParams?.buttonColor || "#15803d").enable().show()
    }

    return () => {
      mainButton.disable().hide()
    }
  }, [isRunning])


  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval)
            // increase the rounds if the date in the atom was the same as todays date
            if (pomodoroTodyRounds.date === new Date().toDateString()) {
              setPomodoroTodyRounds({
                date: new Date().toDateString(),
                rounds: pomodoroTodyRounds.rounds + 1
              })
            } else {
              setPomodoroTodyRounds({
                date: new Date().toDateString(),
                rounds: 1
              })
            }

            // You can add a sound notification or other actions here when the timer is complete.


            habticFeedback.notificationOccurred('success')
            habticFeedback.impactOccurred("medium")

          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        } else {
          setSeconds(seconds - 1)
        }
      }, 1000)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isRunning, minutes, seconds])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setMinutes(eachPodomoro)
    setSeconds(0)
  }

  return (
    <div className="flex pt-6 w-full gap-16 flex-col items-stretch justify-center">
      <h1 className="text-8xl self-center">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </h1>
      {
        isRunning &&
        <button style={{
          background: themeParams?.secondaryBackgroundColor || "gray",
          borderColor: themeParams?.hintColor || "gray",
        }} className="px-6 py-1 h-28 w-2/3 self-center border border-solid font-semibold antialiased rounded-xl" onClick={toggleTimer}>Pause</button>

      }

      {/* show rounds */}
      <div className="flex flex-col gap-4 items-center justify-center">
        <Divider />
        <span style={{
          color: themeParams?.hintColor || "gray"
        }} className="text-xl">Todays Finished Rounds</span>
        <h1 className="text-4xl ml-2">{pomodoroTodyRounds.rounds}</h1>
      </div>
    </div>
  )
}

const pomodoroRoute = new Route({
  component: Pomodoro,
  path: "/pomodoro",
  getParentRoute: () => featureLayoutRoute
})


export default pomodoroRoute
