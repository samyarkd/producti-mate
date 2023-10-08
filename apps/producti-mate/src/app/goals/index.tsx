import { Route } from "@tanstack/react-router";
import { useMainButton } from "@twa.js/sdk-react";
import { useEffect, useState } from "react";
import featureLayoutRoute from "../feature-layout";

import * as z from "zod";

import GoalsList from "@/components/goals/goals-table";
import { AddGoalFormSchema, GoalItem } from "@/components/goals/goals-types";
import { useAddGoal, useGoals } from "@/hooks/queries/goals";
import goalRoute from "./goal";

function Goals() {
  const mainButton = useMainButton();
  const [goals, setGoals] = useState<GoalItem[]>([]);

  const getGoals = useGoals();
  const addGoal = useAddGoal();

  // if the date in the local storage is not today, clear the list
  function setItems(items: GoalItem[]) {
    setGoals(items);
  }

  // A function to handle the submission of a new item
  async function handleAdd(data: z.infer<typeof AddGoalFormSchema>) {
    const res = await addGoal.mutateAsync(data);

    setItems([
      ...goals,
      {
        id: res.data.id,
        title: res.data.goal.title || "",
        exp: res.data.exp || 0,
        users: res.data.goal.users,
      },
    ]);
  }

  useEffect(() => {
    if (getGoals.data) {
      setItems(
        getGoals.data.data.map((goalUser) => ({
          id: goalUser.id,
          title: goalUser.goal.title || "",
          exp: goalUser.exp || 0,
          users: goalUser.goal.users,
        })),
      );
    }

    return () => {
      mainButton.disable().hide();
    };
  }, [getGoals.data]);

  return (
    <div className="app">
      <GoalsList items={goals} onAdd={handleAdd} />
    </div>
  );
}

const goalsRoute = new Route({
  getParentRoute: () => featureLayoutRoute,
  path: "/goals",
  component: Goals,
});

const GoalAndGoals = goalsRoute.addChildren([goalRoute]);

export default GoalAndGoals;
