import { useEffect, useState } from "react";

import { getProfile } from "../services/authService";

function UserBadge() {
  const [name, setName] = useState("");

  useEffect(() => {
    let active = true;

    getProfile()
      .then((user) => {
        if (active) setName(user.name);
      })
      .catch(() => {
        active = false;
      });

    return () => {
      active = false;
    };
  }, []);

  if (!name) return null;

  return (
    <div className="user-badge">
      <span className="user-badge-avatar" aria-hidden="true">
        👤
      </span>

      <span className="user-badge-name">{name}</span>
    </div>
  );
}

export default UserBadge;