import styles from "./ATSCard.module.css";

const ATSCard = ({ title, value, color }) => {
  return (
    <div
      className={styles.card}
      style={{
        borderLeft: `6px solid ${color}`,
      }}
    >
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
};

export default ATSCard;