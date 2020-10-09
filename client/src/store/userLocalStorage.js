const userKey = "application_user";
const userTokenKey = "application_user_token";
const zeroCardsKey = "zero_cards_Key";
const zeroCardsFinalizedKey = "zero_cards_selection_finalized_Key";

export function getUser() {
  const data = localStorage.getItem(userKey);
  if (!data) return null;
  return JSON.parse(data);
}

export function storeUserToken(user, token) {
  const userData = {
    identity: {
      ...user,
      token
    }
  };
  localStorage.setItem(userKey, JSON.stringify(userData));
  localStorage.setItem(userTokenKey, token);
}

export function storeUserDetails(details) {
  const data = localStorage.getItem(userKey);
  if (!data) throw new Error("user is not stored yet");
  const user = JSON.parse(data);
  user.leitner = details;
  localStorage.setItem(userKey, JSON.stringify(user));
}

export function removeUserData() {
  localStorage.removeItem(userKey);
  localStorage.removeItem(userTokenKey);
}

export function getToken() {
  return localStorage.getItem(userTokenKey);
}

export const zeroCards = {
  update(list) {
    localStorage.setItem(zeroCardsKey, JSON.stringify(list));
  },
  get() {
    const data = localStorage.getItem(zeroCardsKey);
    return data
      ? {
          cards: JSON.parse(data),
          finalized: !!localStorage.getItem(zeroCardsFinalizedKey)
        }
      : {
          cards: [],
          finalized: !!localStorage.getItem(zeroCardsFinalizedKey)
        };
  },
  clear() {
    localStorage.removeItem(zeroCardsKey);
    localStorage.removeItem(zeroCardsFinalizedKey);
  },
  updateFinalized(finalized) {
    if (finalized) localStorage.setItem(zeroCardsFinalizedKey, "1");
    else localStorage.removeItem(zeroCardsFinalizedKey);
  }
};
