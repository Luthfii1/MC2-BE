interface AchievementsInterface {
  [key: string]: {
    category: "GOLD" | "SILVER" | "BRONZE" | "BROKE";
    quantity: number;
  };
}

export default AchievementsInterface;
