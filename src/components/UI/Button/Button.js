import "./Button.scss";

const Button = ({ children, command }) => {
  return <button onClick={command} className="button">{children}</button>;
};

export default Button;
