import { RiNotification3Line } from "react-icons/ri";

export default function NotificationBell() {

  return (

    <button

      className="relative p-2 rounded-lg

      hover:bg-white/5 transition"

    >

      <RiNotification3Line

        className="text-2xl text-white"

      />

      <span

        className="absolute

        top-0

        right-0

        w-2

        h-2

        rounded-full

        bg-red-500"

      />

    </button>

  );
}