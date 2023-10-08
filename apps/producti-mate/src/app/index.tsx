import Feature from "@/components/feature";
import Item from "@/components/item";
import { rootRoute } from "@/components/router";
import { Route } from "@tanstack/react-router";

const Index = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 pt-2 gap-y-4 items-center justify-center">
        <Item>
          <Feature
            to="/pomodoro"
            imgSrc="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Objects/Hourglass%20Done.webp"
            title="Pomodoro"
          />
        </Item>
        <Item>
          <Feature
            to="/todo"
            imgSrc="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Objects/Memo.webp"
            title="To-Do list"
          />
        </Item>
        <Item>
          <Feature
            to="/reminder"
            imgSrc="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Objects/Tear%20Off%20Calendar.webp"
            title="Reminder"
          />
        </Item>
        <Item>
          <Feature
            to="/goals"
            imgSrc="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Travel%20and%20Places/Rocket.webp"
            title="Goals"
          />
        </Item>
      </div>
    </div>
  );
};

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Index,
});

export default indexRoute;
