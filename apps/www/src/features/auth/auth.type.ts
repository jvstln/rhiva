export type AuthStore = {
  view: "connect" | "disconnect" | null;
  setView: (view: AuthStore["view"]) => void;
};
