import { useContext } from "react";
import { UserContext } from "~/contexts/user-context";
import BackupWizard from "~/components/backup-wizard";
import Login from "~/components/login";

export default function Index() {
  const { user } = useContext(UserContext);
  return (
    <div>
      {!user?.accessToken && <Login />}
      {user?.accessToken && <BackupWizard />}
    </div>
  );
}
