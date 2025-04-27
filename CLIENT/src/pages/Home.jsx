import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next"; 

const Home = () => {
  const { user, handleLogout } = useAuth();
  const { t } = useTranslation(); 

  useEffect(() => {
    console.log(user);
  }, [user]);

  if (!user)
    return (
      <h2>
        {t("notLoggedIn")} <br /> <a href="/signup">{t("signup")}</a>
      </h2>
    );

  return (
    <div>
      <h2>
        {t("welcome")}, {user.userId}! {user.role}
      </h2>
      <a href="/dashboard">{t("dashboard")}</a>
      <br />
      <button onClick={handleLogout}>{t("logout")}</button>
    </div>
  );
};

export default Home;
