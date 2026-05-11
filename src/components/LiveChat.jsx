import { useEffect } from "react";

const LiveChat = () => {
  useEffect(() => {
    if (
      document.getElementById(
        "tawk-script"
      )
    )
      return;

    const user = JSON.parse(
      localStorage.getItem(
        "currentUser"
      ) || "null"
    );

    window.Tawk_API = {};
    window.Tawk_LoadStart =
      new Date();

    window.Tawk_API.onLoad =
      function () {
        if (user?.username) {
          window.Tawk_API.setAttributes(
            {
              name:
                user.username
            },
            function () {}
          );
        }
      };

    const script =
      document.createElement(
        "script"
      );

    script.id =
      "tawk-script";

    script.async = true;

    script.src =
      "https://embed.tawk.to/6a00ed7c11568a1c3474669a/1jo9pvc3g";

    script.charset =
      "UTF-8";

    script.setAttribute(
      "crossorigin",
      "*"
    );

    document.body.appendChild(
      script
    );
  }, []);

  return null;
};

export default LiveChat;