import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserInfo from "../components/UserInfo";

function UserScreen() {
  const userSelector = useSelector((state) => state.user);
  const { user, error, loading } = userSelector;
  // const user = userSelector !== null ? userSelector.user : null;
  const navigate = useNavigate();
  useEffect(() => {
    if (user == null || user === undefined) {
      navigate("/login");
    }
  }, [navigate, user]);
  return <div>{user && <UserInfo></UserInfo>}</div>;
}

export default UserScreen;
