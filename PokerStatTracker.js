// src/PokerStatTracker.js

/**
 * Class representing a Poker Stat Tracker.
 *
 * Each game session includes:
 *  - id: string - Unique identifier for the session.
 *  - gameName: string - The name of the poker game.
 *  - buyIn: number - The buy-in amount.
 *  - cashOut: number - The cash-out amount.
 *  - stakes: string - The stakes in the form "small/big" (e.g., "1/2").
 *  - gainLoss: number - The difference (cashOut - buyIn) representing profit or loss.
 *
 * This class supports adding, updating, and deleting game sessions,
 * as well as retrieving aggregated totals.
 */
class PokerStatTracker {
  /**
   * Initializes a new instance of PokerStatTracker.
   * The tracker starts with an empty list of game sessions.
   */
  constructor() {
    /** @private {Array<Object>} Internal array of game sessions */
    this._games = [];
  }

  /**
   * Adds a new game session to the tracker.
   *
   * @param {string} gameName - The name of the poker game.
   * @param {number} buyIn - The buy-in amount.
   * @param {number} cashOut - The cash-out amount.
   * @param {string} stakes - The stakes in the form "small/big" (e.g., "1/2").
   */
  addGame(gameName, buyIn, cashOut, stakes) {
    const game = {
      id: this._generateId(),
      gameName,
      buyIn,
      cashOut,
      stakes,
      gainLoss: this._calculateGainLoss(buyIn, cashOut),
    };
    this._games.push(game);
  }

  /**
   * Updates an existing game session.
   *
   * @param {string} id - The unique identifier for the game session.
   * @param {Object} updatedData - An object containing updated fields.
   *        It may include any of: gameName, buyIn, cashOut, stakes.
   * @throws {Error} If the game session with the given id is not found.
   */
  updateGame(id, updatedData) {
    const index = this._games.findIndex(game => game.id === id);
    if (index === -1) {
      throw new Error("Game session not found");
    }
    const game = this._games[index];
    if (updatedData.gameName !== undefined) game.gameName = updatedData.gameName;
    if (updatedData.buyIn !== undefined) game.buyIn = updatedData.buyIn;
    if (updatedData.cashOut !== undefined) game.cashOut = updatedData.cashOut;
    if (updatedData.stakes !== undefined) game.stakes = updatedData.stakes;
    // Recalculate gainLoss if buyIn or cashOut change
    if (updatedData.buyIn !== undefined || updatedData.cashOut !== undefined) {
      game.gainLoss = this._calculateGainLoss(game.buyIn, game.cashOut);
    }
  }

  /**
   * Deletes a game session from the tracker.
   *
   * @param {string} id - The unique identifier for the game session to delete.
   */
  deleteGame(id) {
    this._games = this._games.filter(game => game.id !== id);
  }

  /**
   * Clears all game sessions.
   */
  clearGames() {
    this._games = [];
  }

  /**
   * Returns a shallow copy of all game sessions.
   *
   * @returns {Array<Object>} The array of game sessions.
   */
  getGames() {
    return [...this._games];
  }

  /**
   * Calculates the total gain or loss across all game sessions.
   *
   * @returns {number} The sum of gains and losses.
   */
  getTotalGainLoss() {
    return this._games.reduce((total, game) => total + game.gainLoss, 0);
  }

  /**
   * Returns the total number of games played.
   *
   * @returns {number} Total games played.
   */
  getTotalGamesPlayed() {
    return this._games.length;
  }

  /**
   * Returns the total buy-in amount across all game sessions.
   *
   * @returns {number} Total buy-in amount.
   */
  getTotalBuyIn() {
    return this._games.reduce((total, game) => total + game.buyIn, 0);
  }

  /**
   * Returns the total cash-out amount across all game sessions.
   *
   * @returns {number} Total cash-out amount.
   */
  getTotalCashOut() {
    return this._games.reduce((total, game) => total + game.cashOut, 0);
  }

  /**
   * Private helper method to calculate the gain or loss for a single game session.
   *
   * @private
   * @param {number} buyIn - The buy-in amount.
   * @param {number} cashOut - The cash-out amount.
   * @returns {number} The gain/loss (cashOut - buyIn).
   */
  _calculateGainLoss(buyIn, cashOut) {
    return cashOut - buyIn;
  }

  /**
   * Private helper method to generate a unique identifier for a game session.
   *
   * @private
   * @returns {string} A unique identifier.
   */
  _generateId() {
    // Simple random string generator for demonstration.
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}

export default PokerStatTracker;
