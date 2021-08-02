import "./App.css";
import { useState, useEffect } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { getUser } from "../../utilities/users-service";
import AuthPage from "../AuthPage/AuthPage";
import NavBar from "../../components/UI/NavBar/NavBar";
import UserProfilePage from "../User/UserProfilePage/UserProfilePage";
import AddGamePage from "../Game/AddGamePage/AddGamePage";
import AllGamesPage from "../Game/AllGamesPage/AllGamesPage";
import EditGamePage from "../Game/EditGamePage/EditGamePage";
import DetailGamePage from "../Game/DetailGamePage/DetailGamePage";
import AddLogPage from "../User/AddLogPage/AddLogPage";
import * as gamesAPI from "../../utilities/games-api";
import * as logsAPI from "../../utilities/logs-api";

function App() {
  const [user, setUser] = useState(getUser());
  const [games, setGames] = useState([]);
  const [logs, setLogs] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const getGames = async () => {
      const games = await gamesAPI.getAll();
      setGames(games);
    };
    getGames();
  }, []);

  useEffect(() => {
    history.push("/");
  }, [games, history]);

  const handleAddGame = async (newGameData) => {
    const newGame = await gamesAPI.create(newGameData);
    setGames([...games, newGame]);
  };

  const handleUpdateGame = async (updatedGameData) => {
    const updatedGame = await gamesAPI.update(updatedGameData);
    const newGamesArray = games.map((g) =>
      g._id === updatedGame._id ? updatedGame : g
    );
    setGames(newGamesArray);
  };

  const handleDeleteGame = async (id) => {
    await gamesAPI.deleteOne(id);
    setGames(games.filter((game) => game._id !== id));
  };

  const handleAddLog = async (newLogData) => {
    const newLog = await logsAPI.create(newLogData);
    setLogs([...logs, newLog]);
  };

  return (
    <main className="App">
      {user ? (
        <>
          <NavBar user={user} setUser={setUser} />
          <Switch>
            <Route path="/games/new">
              <AddGamePage handleAddGame={handleAddGame} />
            </Route>
            <Route path="/games">
              <AllGamesPage games={games} handleDeleteGame={handleDeleteGame} />
            </Route>
            <Route exact path="/details">
              <DetailGamePage />
            </Route>
            <Route exact path="/edit">
              <EditGamePage handleUpdateGame={handleUpdateGame} />
            </Route>
            <Route path="/user/">
              <UserProfilePage />
            </Route>
            <Route path="/:userId/logs/newlog">
              <AddLogPage handleAddLog={handleAddLog} />
            </Route>
          </Switch>
        </>
      ) : (
        <AuthPage setUser={setUser} />
      )}
    </main>
  );
}

export default App;
