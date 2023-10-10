import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useJoinGoal, usePublicGoals } from "@/hooks/queries/goals";
import { Goal } from "@prisma/client";
import { Route, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import featureLayoutRoute from "../feature-layout";

function GoalItem({ goal }: { goal: Goal }) {
  const joinGoal = useJoinGoal();
  const [isJoined, setIsJoined] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (joinGoal.isSuccess) {
      setIsJoined(true);

      router.navigate({
        to: "/goals/$goalId",
        params: { goalId: joinGoal.data?.data.id.toString() },
      });
    }
  }, [joinGoal.isSuccess]);

  return (
    <Card key={goal.id}>
      <CardHeader>
        <CardTitle>{goal.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <p>{goal.description}</p>

        <Button
          onClick={() => joinGoal.mutate({ goalId: goal.id })}
          aria-disabled={joinGoal.isLoading || isJoined}
          disabled={joinGoal.isLoading || isJoined}
        >
          {isJoined ? "Joined" : "Join"}
        </Button>
      </CardContent>
    </Card>
  );
}

const JoinGoals = () => {
  const goals = usePublicGoals();

  return (
    <div className="p-4 space-y-4">
      {goals.isLoading && (
        <div className="flex items-center justify-center">
          <p>Loading...</p>
        </div>
      )}

      {goals.data?.data.map((goal) => (
        <GoalItem key={goal.id} goal={goal} />
      ))}
    </div>
  );
};

const JoinGoalsRoute = new Route({
  getParentRoute: () => featureLayoutRoute,
  path: "/join-goals",
  component: JoinGoals,
});

export default JoinGoalsRoute;
