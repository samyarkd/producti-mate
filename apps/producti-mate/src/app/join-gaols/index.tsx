import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useJoinGoal, usePublicGoals } from "@/hooks/queries/goals";
import { Route } from "@tanstack/react-router";
import featureLayoutRoute from "../feature-layout";

const JoinGoals = () => {
  const goals = usePublicGoals();
  const joinGoal = useJoinGoal();

  return (
    <div className="p-4">
      {goals.data?.data.map((goal) => (
        <Card key={goal.id}>
          <CardHeader>
            <CardTitle>{goal.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <p>{goal.description}</p>

            <Button
              onClick={() => joinGoal.mutate({ goalId: goal.id })}
              aria-disabled={joinGoal.isLoading}
              disabled={joinGoal.isLoading}
            >
              Join
            </Button>
          </CardContent>
        </Card>
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
