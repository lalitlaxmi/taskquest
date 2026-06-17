import { useEffect, useState } from "react";

export default function FocusTimer() {

  const [seconds, setSeconds] = useState(1500);

  const [running, setRunning] = useState(false);

  useEffect(() => {

    let interval;

    if (running && seconds > 0) {

      interval = setInterval(() => {

        setSeconds((prev) => prev - 1);

      }, 1000);

    }

    return () => clearInterval(interval);

  }, [running, seconds]);

  const minutes = Math.floor(seconds / 60);

  const secs = seconds % 60;

  return (

    <div className="card">

      <p className="text-green-400 text-xs uppercase mb-2">

        Focus Session

      </p>

      <h2 className="text-4xl font-bold text-white">

        {String(minutes).padStart(2, "0")}:

        {String(secs).padStart(2, "0")}

      </h2>

      <div className="flex gap-3 mt-5">

        <button

          onClick={() => setRunning(true)}

          className="btn-primary"

        >

          Start

        </button>

        <button

          onClick={() => setRunning(false)}

          className="btn-ghost"

        >

          Pause

        </button>

        <button

          onClick={() => {

            setRunning(false);

            setSeconds(1500);

          }}

          className="btn-danger"

        >

          Reset

        </button>

      </div>

    </div>

  );
}