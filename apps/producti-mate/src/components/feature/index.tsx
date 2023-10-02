import { Link } from "@tanstack/react-router";
import { useThemeParams } from "@twa.js/sdk-react";

interface FeatureProps {
  imgSrc: string;
  title: string;
  to: string;
}

const Feature = ({ imgSrc, title, to }: FeatureProps) => {
  const themeParams = useThemeParams();

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Link to={to}>
      <div className="flex flex-col gap-2 items-center">
        <div
          style={{
            backgroundColor: themeParams.secondaryBackgroundColor || undefined,
          }}
          className={`text-4xl min-h-25 p-3 rounded-full shadow`}
        >
          <img className="w-20" src={imgSrc} />
        </div>
        <div
          style={{
            color: themeParams.linkColor || undefined,
          }}
          className="rounded px-1"
        >
          {title}
        </div>
      </div>
    </Link>
  );
};

export default Feature;
