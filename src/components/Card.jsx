/* eslint-disable react/prop-types */
import "../styles/Card.css";
export default function Card(props) {
  return (
    <>
      <div className="card" onClick={props.onClick}>
        <img src={props.img} alt={`Face picture of ${props.name}`} />
        <div className="servant">{props.name}</div>
      </div>
    </>
  );
}
