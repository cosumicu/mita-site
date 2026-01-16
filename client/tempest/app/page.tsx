import Properties from "./components/properties/Properties";
import { Alert } from "antd";
import Marquee from "react-fast-marquee";
import SearchSection from "./components/search/SearchSection";

export default function Home() {
  return (
    <div className="ui-container space-y-4">
      {/* <div>
        <Alert
          banner
          message={
            <Marquee gradient={false}>
              <div style={{ display: "inline" }}>
                Note: SMTP service free trial expired—some features won’t work.
                Ready-to-use accounts available on my{" "}
                <a
                  href="https://github.com/Cosumicu/mita-site"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub repo
                </a>
                .
              </div>
            </Marquee>
          }
        />
      </div> */}

      <div>
        <Properties />
      </div>
    </div>
  );
}
