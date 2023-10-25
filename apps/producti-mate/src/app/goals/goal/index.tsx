import { Route, useParams } from "@tanstack/react-router"
import { useMainButton } from "@twa.js/sdk-react"
import { useEffect, useState } from "react"

import featureLayoutRoute from "@/app/feature-layout"
import GoalData from "@/components/goals/gole/goal-data"
import Leaderboard from "@/components/goals/gole/leaderboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFinishDailyGoal, useGoal } from "@/hooks/queries/goals"
import { GoalUserItem } from "@pm/types"

function Goals() {
  const mainButton = useMainButton()
  const [users, setUsers] = useState<GoalUserItem[]>([])
  const params = useParams({ from: "/feature-layout/goals/$goalId" })
  const getGoal = useGoal(parseInt(params.goalId))
  const finishDailyTask = useFinishDailyGoal()

  // if the date in the local storage is not today, clear the list
  function setItems(items: GoalUserItem[]) {
    setUsers(items)
  }

  useEffect(() => {
    if (getGoal.data) {
      setItems(
        getGoal?.data?.data?.goal.users?.map((goalUser) => ({
          id: goalUser.id,
          pfp: goalUser.user.pfp || "",
          name: goalUser.user.name || "",
          exp: goalUser.exp || 0,
        })),
      )
    }

    if (getGoal.data?.data?.lastFinish) {
      if (
        new Date(getGoal.data?.data?.lastFinish).toDateString() !==
        new Date().toDateString()
      ) {
        mainButton.setText("Finish Daily Goal For Today").enable().show()
      }
    } else {
      mainButton.setText("Finish Daily Goal For Today").enable().show()
    }

    mainButton.on("click", () => {
      if (getGoal?.data?.data?.id) {
        finishDailyTask.mutateAsync(getGoal.data?.data.id)
      }

      mainButton.disable().hide()
    })

    return () => {
      mainButton.disable().hide()
    }
  }, [getGoal.data])

  return (
    <div className="px-4 py-2 w-full">
      <Tabs className="w-full" defaultValue="leaderboard">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="leaderboard">
            Leaderboard
          </TabsTrigger>
          <TabsTrigger className="w-full" value="goal">
            Goal
          </TabsTrigger>
        </TabsList>
        <TabsContent value="leaderboard">
          <Leaderboard goal={getGoal.data?.data.goal} items={users} />
        </TabsContent>
        <TabsContent value="goal">
          <GoalData goalUser={getGoal.data?.data} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

const goalRoute = new Route({
  getParentRoute: () => featureLayoutRoute,
  path: "/goals/$goalId",
  component: Goals,
})

export default goalRoute
