import styles from "./ResumeCard.module.css";

const ResumeCard = ({
  name,
  score,
  date,
}) => {
  return (
    <div className={styles.card}>

      <h3>{name}</h3>

      <p>ATS Score : {score}%</p>

      <small>{date}</small>

    </div>
  );
};

export default ResumeCard;