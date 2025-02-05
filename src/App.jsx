// src/components/StatsPage.jsx
import React, { useState, useEffect } from 'react';
import PokerStatTracker from '../PokerStatTracker';

const LOCAL_STORAGE_KEY = 'pokerGames';

const StatsPage = () => {
  // Initialize the tracker instance
  const [tracker] = useState(new PokerStatTracker());
  const [games, setGames] = useState([]);
  
  // Form state for basic game data
  const [formData, setFormData] = useState({
    gameName: '',
    buyIn: '',
    cashOut: '',
    stakes: ''
  });

  // Load games from localStorage on initial mount
  useEffect(() => {
    const savedGames = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedGames) {
      try {
        const parsedGames = JSON.parse(savedGames);
        // Directly set the tracker instance's _games array
        tracker.clearGames();
        parsedGames.forEach(game => {
          // Re-add each game so that our tracker internal methods are used
          tracker.addGame(game.gameName, game.buyIn, game.cashOut, game.stakes);
        });
        setGames(tracker.getGames());
      } catch (error) {
        console.error("Failed to load saved games:", error);
      }
    }
  }, [tracker]);

  // Save games to localStorage whenever games state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tracker.getGames()));
  }, [games, tracker]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add a new game and update state
  const handleAddGame = (e) => {
    e.preventDefault();
    const { gameName, buyIn, cashOut, stakes } = formData;
    tracker.addGame(gameName, parseFloat(buyIn), parseFloat(cashOut), stakes);
    setGames(tracker.getGames());
    setFormData({
      gameName: '',
      buyIn: '',
      cashOut: '',
      stakes: ''
    });
  };

  // Clear all games (New Session)
  const handleClearData = () => {
    tracker.clearGames();
    setGames(tracker.getGames());
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Poker Stat Tracker</h2>

      {/* New Session Button */}
      <div className="mb-4">
        <button onClick={handleClearData} className="btn btn-warning">
          New Session (Clear Data)
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAddGame} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="gameName"
            value={formData.gameName}
            onChange={handleChange}
            placeholder="Game Name"
            className="input input-bordered w-full"
            required
          />
          <input
            type="number"
            name="buyIn"
            value={formData.buyIn}
            onChange={handleChange}
            placeholder="Buy In"
            className="input input-bordered w-full"
            required
          />
          <input
            type="number"
            name="cashOut"
            value={formData.cashOut}
            onChange={handleChange}
            placeholder="Cash Out"
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            name="stakes"
            value={formData.stakes}
            onChange={handleChange}
            placeholder="Stakes (e.g., 1/2)"
            className="input input-bordered w-full"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Add Game
        </button>
      </form>

      {/* Games Table */}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Game Name</th>
            <th>Buy In</th>
            <th>Cash Out</th>
            <th>Stakes</th>
            <th>Gain/Loss</th>
          </tr>
        </thead>
        <tbody>
          {games.map(game => (
            <tr key={game.id}>
              <td>{game.gameName}</td>
              <td>${game.buyIn.toFixed(2)}</td>
              <td>${game.cashOut.toFixed(2)}</td>
              <td>{game.stakes}</td>
              <td className={game.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                ${game.gainLoss.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="4" className="text-right">Total Gain/Loss:</th>
            <th className={tracker.getTotalGainLoss() >= 0 ? 'text-green-500' : 'text-red-500'}>
              ${tracker.getTotalGainLoss().toFixed(2)}
            </th>
          </tr>
          <tr>
            <th colSpan="4" className="text-right">Total Games Played:</th>
            <th>{tracker.getTotalGamesPlayed()}</th>
          </tr>
          <tr>
            <th colSpan="4" className="text-right">Total Buy In:</th>
            <th>${tracker.getTotalBuyIn().toFixed(2)}</th>
          </tr>
          <tr>
            <th colSpan="4" className="text-right">Total Cash Out:</th>
            <th>${tracker.getTotalCashOut().toFixed(2)}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default StatsPage;
