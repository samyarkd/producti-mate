import { isNewUserAtom } from "@/lib/atoms";
import { useMainButton } from "@twa.js/sdk-react";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import Stories from "react-insta-stories";

const stories = [
  {
    content: () => (
      <Story
        title="Your Productivity Mate 🛩️"
        descripion="Experience a productivity revolution with our ProductiMate right on Telegram. From the Pomodoro technique to goal tracking, reminders in Telegram, and task management, we've got you covered. Take control of your time and supercharge your productivity today!"
      />
    ),
  },
  {
    content: () => (
      <Story
        title="Pomodoro Technique 🍅"
        descripion="Boost your focus and productivity using the Pomodoro technique in our app. Break tasks into intervals and see your efficiency soar."
        src="/pomodoro-technique.png"
      />
    ),
  },
  {
    content: () => (
      <Story
        title="Achieve Goals Together! 🎯"
        descripion="Stay motivated and accountable with our goal tracker. Share your goals with friends and celebrate each other's successes and compete with your friends."
        src="/goal.png"
      />
    ),
  },
  {
    content: () => (
      <Story
        title="Reminder in Telegram ⏰"
        descripion="Set Reminders in ProductiMate and get notified right on Telegram. Never miss a deadline again!"
        src="/reminder.png"
      />
    ),
  },
  {
    content: () => (
      <Story
        title="Task Management 🖊️"
        descripion="Right down your tasks and manage them with ease."
        src="/task.png"
        isLast
      />
    ),
  },
];

function Story(params: {
  title: string;
  descripion: string;
  src?: string;
  isLast?: boolean;
}) {
  const mainButton = useMainButton();
  const setIsNewUser = useSetAtom(isNewUserAtom);

  useEffect(() => {
    if (params.isLast) {
      mainButton.setText("Let's Get Started").enable().show();

      mainButton.on("click", () => {
        setIsNewUser(false);
      });
    }

    return () => {
      mainButton.disable().hide();
    };
  }, []);

  return (
    <div className="text-white w-full bg-[#004AAD] h-full p-4 flex flex-col items-center">
      <h1 className="text-3xl mt-6 font-semibold ">{params.title}</h1>
      <p className="mt-4 text-xl">{params.descripion}</p>

      {params && <img className="my-auto" width={"50%"} src={params?.src} />}
      <img src="/1.png" className="w-64 rounded-full mt-auto" />
    </div>
  );
}

export const WelcomeStories = () => {
  return <Stories width={"100%"} height={"100vh"} stories={stories} />;
};
