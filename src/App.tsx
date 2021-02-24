import React, { useEffect } from "react";
import styles from "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";
import Feed from "./components/Feed";
import Auth from "./components/Auth";

const App: React.FC = () => {
  // userStateを取得し代入
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    // userが変化したら毎回呼び出される
    // 変更されたuser情報をauthUserに格納
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    // unSubをcleanUpで実行
    return () => {
      unSub();
    };
  }, [dispatch]);

  return (
    <React.Fragment>
      {/* user存在 → Feed いない → Auth */}
      {user.uid ? (
        <div className={styles.app}>
          <Feed />
        </div>
      ) : (
        <Auth />
      )}
    </React.Fragment>
  );
};

export default App;
